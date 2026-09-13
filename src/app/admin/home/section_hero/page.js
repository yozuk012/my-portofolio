"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import { updateProfileAction } from "@/app/actions/updateProfile";
import { uploadProfileImage } from "@/app/actions/uploadImage";

export default function AdminHomePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    id: "",
    full_name: "",
    role: "",
    bio: "",
    avatar_url: "", 
    skills: [""], 
    socials: [{ platform: "Instagram", url: "" }, { platform: "WhatsApp", url: "" }],
  });

  // State baru untuk menangani file sebelum diupload
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase.from("profile").select("*").limit(1).maybeSingle();
      if (data) {
        const parsedSkills = Array.isArray(data.skills) 
          ? data.skills.slice(0, 3) 
          : (typeof data.skills === 'string' ? data.skills.split(',').map(s => s.trim()).slice(0, 3) : [""]);

        const parsedSocials = Array.isArray(data.social_links) && data.social_links.length > 0 
          ? data.social_links 
          : [{ platform: "Instagram", url: "" }, { platform: "WhatsApp", url: "" }];

        setFormData({
          id: data.id || "",
          full_name: data.full_name || "",
          role: data.role || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "",
          skills: parsedSkills,
          socials: parsedSocials,
        });
        setPreviewUrl(data.avatar_url || ""); // Set preview awal
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  // --- HANDLERS DINAMIS SKILLS & SOCIALS (Tetap sama) ---
  const addSkill = () => { if (formData.skills.length < 3) setFormData({ ...formData, skills: [...formData.skills, ""] }); };
  const removeSkill = (index) => { setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) }); };
  const updateSkill = (index, value) => { const newSkills = [...formData.skills]; newSkills[index] = value; setFormData({ ...formData, skills: newSkills }); };

  const addSocial = () => { setFormData({ ...formData, socials: [...formData.socials, { platform: "", url: "" }] }); };
  const removeSocial = (index) => { setFormData({ ...formData, socials: formData.socials.filter((_, i) => i !== index) }); };
  const updateSocial = (index, field, value) => { const newSocials = [...formData.socials]; newSocials[index][field] = value; setFormData({ ...formData, socials: newSocials }); };

  // --- HANDLER PILIH FILE (HANYA PREVIEW LOKAL, BELUM UPLOAD) ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setMessage("Format file harus JPG, PNG, atau WebP");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Ukuran file maksimal 5MB");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Buat preview instan dari file lokal
    setMessage("");
  };

  const clearAvatar = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData({ ...formData, avatar_url: "" });
  };

  // --- HANDLE SUBMIT (UPLOAD & SIMPAN DISINI) ---
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    let finalAvatarUrl = formData.avatar_url;

    // 1. Jika ada file baru yang dipilih, upload SEKARANG
    if (selectedFile) {
      setUploading(true);
      const fileFormData = new FormData();
      fileFormData.append("file", selectedFile);

      const uploadResult = await uploadProfileImage(fileFormData);
      setUploading(false);

      if (!uploadResult.success) {
        setMessage("Gagal upload: " + uploadResult.message);
        setSaving(false);
        return; // Stop proses jika upload gagal
      }
      finalAvatarUrl = uploadResult.url;
    }

    // 2. Siapkan payload untuk update profile
    const formPayload = new FormData();
    formPayload.append("id", formData.id);
    formPayload.append("full_name", formData.full_name);
    formPayload.append("role", formData.role);
    formPayload.append("bio", formData.bio);
    formPayload.append("avatar_url", finalAvatarUrl);

    formData.skills.slice(0, 3).forEach((skill) => {
      if (skill.trim() !== "") formPayload.append("skills[]", skill);
    });

    formData.socials.forEach((social) => {
      if (social.platform.trim() !== "" && social.url.trim() !== "") {
        formPayload.append("social_platform[]", social.platform);
        formPayload.append("social_url[]", social.url);
      }
    });

    // 3. Simpan ke database (Server Action akan otomatis menghapus file lama dari storage)
    const result = await updateProfileAction(formPayload);
    
    setMessage(result.message);
    setSaving(false);
    
    if (result.success) {
      setSelectedFile(null); // Reset state file
      
      // Refresh data agar state frontend sinkron dengan database
      const { data } = await supabase.from("profile").select("*").limit(1).maybeSingle();
      if (data) {
        setFormData(prev => ({ ...prev, avatar_url: data.avatar_url || "" }));
        setPreviewUrl(data.avatar_url || "");
      }
      
      setTimeout(() => setMessage(""), 3000);
    }
  }

  if (loading) return <div className="admin-loading">Memuat data...</div>;

  return (
    <div className="admin-shell">
      <h1 className="text-2xl font-bold mb-6">Edit Halaman Home (Hero Section)</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes("berhasil") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-bold mb-2">Nama Lengkap</label>
          <input name="full_name" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full p-2 border border-gray-300 rounded" placeholder="Contoh: Achmad Aldino" required />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Role / Pekerjaan</label>
          <input name="role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full p-2 border border-gray-300 rounded" placeholder="Contoh: Web Developer" required />
        </div>

        {/* Upload Foto Profil */}
        <div>
          <label className="block text-sm font-bold mb-2">Foto Profil</label>
          {previewUrl && (
            <div className="relative w-32 h-32 mb-3 rounded-lg overflow-hidden border-2 border-gray-300">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={clearAvatar} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors" title="Hapus foto">
                <FiX size={14} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <FiUpload className="text-gray-400" />
                <span className="text-sm text-gray-600">{uploading ? "Mengupload..." : "Pilih file foto (JPG, PNG, WebP)"}</span>
              </div>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/jpg" onChange={handleFileChange} disabled={uploading || saving} className="hidden" />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">Maksimal 5MB. File akan diupload saat Anda mengklik "Simpan Perubahan".</p>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Bio / Intro</label>
          <textarea name="bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full p-2 border border-gray-300 rounded h-32" placeholder="Deskripsikan diri Anda secara singkat..." required />
        </div>

        {/* Skills Dinamis */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold">Skills Utama (Maksimal 3)</label>
            {formData.skills.length < 3 && (
              <button type="button" onClick={addSkill} className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                <FiPlus /> Tambah
              </button>
            )}
          </div>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input name="skills[]" value={skill} onChange={(e) => updateSkill(index, e.target.value)} className="w-full p-2 border border-gray-300 rounded" placeholder={`Skill ${index + 1}`} required />
              {formData.skills.length > 1 && (
                <button type="button" onClick={() => removeSkill(index)} className="p-2 text-red-600 hover:bg-red-50 rounded border border-gray-300 transition-colors" title="Hapus">
                  <FiTrash2 />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Media Sosial Dinamis */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold">Media Sosial</label>
            <button type="button" onClick={addSocial} className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
              <FiPlus /> Tambah
            </button>
          </div>
          {formData.socials.map((social, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <div className="flex-1 space-y-2">
                <input name="social_platform[]" value={social.platform} onChange={(e) => updateSocial(index, "platform", e.target.value)} className="w-full p-2 border border-gray-300 rounded" placeholder="Nama Platform (cth: Instagram)" required />
                <input name="social_url[]" value={social.url} onChange={(e) => updateSocial(index, "url", e.target.value)} className="w-full p-2 border border-gray-300 rounded" placeholder="Link URL Lengkap" required />
              </div>
              <button type="button" onClick={() => removeSocial(index)} className="p-2 text-red-600 hover:bg-red-50 rounded border border-gray-300 transition-colors self-start mt-1" title="Hapus">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving || uploading} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors w-full sm:w-auto">
          {(saving || uploading) ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}