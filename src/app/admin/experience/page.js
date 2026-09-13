"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX, FiArrowUp, FiArrowDown, FiImage, FiUpload } from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import { upsertExperience, deleteExperience } from "@/app/actions/experienceActions";
import { uploadEvidenceImage } from "@/app/actions/uploadEvidence";

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    evidence_url: "",
    order_index: 0,
  });

  // 1. Ambil data experiences
  useEffect(() => {
    async function fetchExperiences() {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("order_index", { ascending: true });
      
      if (data) setExperiences(data);
      setLoading(false);
    }
    fetchExperiences();
  }, []);

  // 2. Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Handle upload file
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const fileFormData = new FormData();
    fileFormData.append("file", file);

    const result = await uploadEvidenceImage(fileFormData);
    
    if (result.success) {
      setFormData({ ...formData, evidence_url: result.url });
      setMessage(result.message);
    } else {
      setMessage(result.message);
    }
    
    setUploading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const clearEvidence = () => {
    setFormData({ ...formData, evidence_url: "" });
  };

  // 4. Handle submit
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const formPayload = new FormData();
    if (editingId) formPayload.append("id", editingId);
    formPayload.append("title", formData.title);
    formPayload.append("category", formData.category);
    formPayload.append("description", formData.description);
    formPayload.append("evidence_url", formData.evidence_url);
    formPayload.append("order_index", formData.order_index);

    const result = await upsertExperience(formPayload);
    setMessage(result.message);
    setSaving(false);

    if (result.success) {
      resetForm();
      const { data } = await supabase.from("experiences").select("*").order("order_index", { ascending: true });
      if (data) setExperiences(data);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  // 5. Handle edit
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      category: item.category || "",
      description: item.description || "",
      evidence_url: item.evidence_url || "",
      order_index: item.order_index || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 6. Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus experience ini?")) return;
    
    const result = await deleteExperience(id);
    setMessage(result.message);
    if (result.success) {
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // 7. Pindahkan urutan
  const moveExperience = (index, direction) => {
    const newExperiences = [...experiences];
    const newIndex = index + direction;
    
    if (newIndex < 0 || newIndex >= newExperiences.length) return;
    
    [newExperiences[index], newExperiences[newIndex]] = [newExperiences[newIndex], newExperiences[index]];
    
    newExperiences.forEach((item, idx) => {
      item.order_index = idx;
    });
    
    setExperiences(newExperiences);
  };

  // 8. Reset form
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      category: "",
      description: "",
      evidence_url: "",
      order_index: experiences.length,
    });
  };

  if (loading) return <main className="admin-loading">Memuat data...</main>;

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <div className="admin-section-heading" style={{ marginBottom: "32px" }}>
          <span>Kelola Experience</span>
          <small>Tambah, edit, atau hapus pengalaman</small>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded text-sm font-medium ${
            message.includes("berhasil") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* FORM INPUT */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 mb-8 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? "Edit Experience" : "Tambah Experience Baru"}
            </h3>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1">
                <FiX /> Batal
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Judul *</label>
            <input 
              name="title" value={formData.title} onChange={handleChange} required
              className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="Contoh: Pengembang Sistem Poin Akademik Kampus"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Jenis Kegiatan *</label>
            <input 
              name="category" value={formData.category} onChange={handleChange} required
              className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="Contoh: Web Development, Internet Marketing, Praktik Kerja Lapangan"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Deskripsi *</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange} required rows="3"
              className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Deskripsikan pengalaman ini..."
            />
          </div>

          {/* Upload File Evidence */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Foto Bukti Kegiatan</label>
            
            {/* Preview Foto */}
            {formData.evidence_url && (
              <div className="relative w-full max-w-xs mb-3 rounded-lg overflow-hidden border-2 border-gray-300">
                <img 
                  src={formData.evidence_url} 
                  alt="Preview Evidence" 
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={clearEvidence}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Hapus foto"
                >
                  <FiX size={14} />
                </button>
              </div>
            )}

            {/* Input File Upload */}
            <label className="flex-1 cursor-pointer block">
              <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <FiUpload className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {uploading ? "Mengupload..." : "Pilih file foto (JPG, PNG, WebP)"}
                </span>
              </div>
              <input 
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Maksimal 5MB. File akan otomatis tersimpan di bucket <strong>"my-portofolio-pic"</strong>.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Urutan Tampil</label>
            <input 
              type="number" name="order_index" value={formData.order_index} onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="0"
            />
            <p className="text-xs text-gray-400 mt-1">Angka lebih kecil muncul lebih atas</p>
          </div>

          <button 
            type="submit" disabled={saving || uploading}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Menyimpan..." : <><FiSave /> {editingId ? "Perbarui" : "Simpan"}</>}
          </button>
        </form>

        {/* DAFTAR EXPERIENCES */}
        <div className="admin-section-heading" style={{ marginBottom: "16px" }}>
          <span>Daftar Experiences</span>
          <small>{experiences.length} item</small>
        </div>

        <div className="space-y-3">
          {experiences.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Belum ada experience yang ditambahkan.</p>
          ) : (
            experiences.map((item, index) => (
              <div key={item.id} className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                {/* Nomor & Tombol Pindah */}
                <div className="flex flex-col gap-1 pt-2">
                  <button onClick={() => moveExperience(index, -1)} disabled={index === 0} className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30">
                    <FiArrowUp />
                  </button>
                  <span className="text-xs font-bold text-gray-600 text-center">{index + 1}</span>
                  <button onClick={() => moveExperience(index, 1)} disabled={index === experiences.length - 1} className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30">
                    <FiArrowDown />
                  </button>
                </div>

                {/* Preview Gambar */}
                {item.evidence_url ? (
                  <img src={item.evidence_url} alt={item.title} className="w-24 h-24 object-cover rounded border border-gray-200" />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                    <FiImage size={24} />
                  </div>
                )}

                {/* Konten */}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
                  <p className="text-sm font-semibold text-blue-600 mb-2">{item.category}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                </div>

                {/* Tombol Aksi */}
                <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                  <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Hapus">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}