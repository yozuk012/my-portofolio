"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX } from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import { upsertSkill, deleteSkill } from "@/app/actions/skillActions";

// 1. DAFTAR OPSI WARNA (Startup/Tech Inspired)
// Hardcode di sini agar mudah diatur, tapi yang disimpan ke DB hanya string 'value'-nya.
const colorOptions = [
  { value: "blue", label: "Biru (Classic/Trust)", bg: "bg-blue-500", text: "text-blue-600", border: "border-blue-200", lightBg: "bg-blue-50" },
  { value: "indigo", label: "Indigo (Modern Tech/SaaS)", bg: "bg-indigo-500", text: "text-indigo-600", border: "border-indigo-200", lightBg: "bg-indigo-50" },
  { value: "purple", label: "Ungu (Creative/AI/Web3)", bg: "bg-purple-500", text: "text-purple-600", border: "border-purple-200", lightBg: "bg-purple-50" },
  { value: "red", label: "Merah (Energetic/Passion)", bg: "bg-red-500", text: "text-red-600", border: "border-red-200", lightBg: "bg-red-50" },
  { value: "orange", label: "Oranye (Innovation/Friendly)", bg: "bg-orange-500", text: "text-orange-600", border: "border-orange-200", lightBg: "bg-orange-50" },
  { value: "green", label: "Hijau (Growth/Success)", bg: "bg-green-500", text: "text-green-600", border: "border-green-200", lightBg: "bg-green-50" },
  { value: "teal", label: "Teal/Cyan (Fresh/Modern)", bg: "bg-teal-500", text: "text-teal-600", border: "border-teal-200", lightBg: "bg-teal-50" },
  { value: "slate", label: "Abu-abu/Slate (Neutral/Pro)", bg: "bg-slate-500", text: "text-slate-600", border: "border-slate-200", lightBg: "bg-slate-50" },
];

// Helper untuk mencari config warna berdasarkan value
const getColorConfig = (colorValue) => colorOptions.find(c => c.value === colorValue) || colorOptions[0];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  // State untuk form
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: 8,
    accent_color: "indigo", // Default diubah ke indigo agar lebih modern
    order_index: 0,
  });

  // 1. Ambil data skills saat halaman dimuat
  useEffect(() => {
    async function fetchSkills() {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("order_index", { ascending: true });
      
      if (data) setSkills(data);
      setLoading(false);
    }
    fetchSkills();
  }, []);

  // 2. Handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Handle submit form (Tambah / Edit)
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const formPayload = new FormData();
    if (editingId) formPayload.append("id", editingId);
    formPayload.append("name", formData.name);
    formPayload.append("description", formData.description);
    formPayload.append("level", formData.level);
    formPayload.append("accent_color", formData.accent_color);
    formPayload.append("order_index", formData.order_index);

    const result = await upsertSkill(formPayload);
    setMessage(result.message);
    setSaving(false);

    if (result.success) {
      resetForm();
      // Refresh data lokal
      const { data } = await supabase.from("skills").select("*").order("order_index", { ascending: true });
      if (data) setSkills(data);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  // 4. Handle klik tombol Edit
  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      description: skill.description || "",
      level: skill.level || 5,
      accent_color: skill.accent_color || "indigo",
      order_index: skill.order_index || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 5. Handle klik tombol Hapus
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus skill ini?")) return;
    
    const result = await deleteSkill(id);
    setMessage(result.message);
    if (result.success) {
      setSkills((prev) => prev.filter((s) => s.id !== id));
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // 6. Reset form ke kondisi awal
  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", level: 8, accent_color: "indigo", order_index: 0 });
  };

  if (loading) return <main className="admin-loading">Memuat data skills...</main>;

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <div className="admin-section-heading" style={{ marginBottom: "32px" }}>
          <span>Kelola Skills</span>
          <small>Tambah, edit, atau hapus keahlian</small>
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
              {editingId ? "Edit Skill" : "Tambah Skill Baru"}
            </h3>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1">
                <FiX /> Batal
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nama Skill *</label>
              <input 
                name="name" value={formData.name} onChange={handleChange} required
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                placeholder="Contoh: Figma, Next.js, React"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Level Keahlian (1-10) *</label>
              <input 
                type="number" name="level" min="1" max="10" value={formData.level} onChange={handleChange} required
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Deskripsi Detail</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange} rows="3"
              className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Jelaskan secara singkat bagaimana Anda menggunakan skill ini..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Warna Aksen</label>
              <select 
                name="accent_color" value={formData.accent_color} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none bg-white"
              >
                {/* 2. RENDER OPSI WARNA SECARA DINAMIS DARI ARRAY */}
                {colorOptions.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Menentukan warna border & elemen visual di halaman detail.</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Urutan Tampil (Order)</label>
              <input 
                type="number" name="order_index" value={formData.order_index} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                placeholder="0"
              />
              <p className="text-xs text-gray-400 mt-1">Angka lebih kecil akan muncul lebih dulu.</p>
            </div>
          </div>

          <button 
            type="submit" disabled={saving}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Menyimpan..." : <><FiSave /> {editingId ? "Perbarui Skill" : "Simpan Skill"}</>}
          </button>
        </form>

        {/* DAFTAR SKILLS */}
        <div className="admin-section-heading" style={{ marginBottom: "16px" }}>
          <span>Daftar Skills Terdaftar</span>
          <small>{skills.length} item</small>
        </div>

        <div className="space-y-3">
          {skills.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Belum ada skill yang ditambahkan.</p>
          ) : (
            skills.map((skill) => {
              // 3. AMBIL CONFIG WARNA SECARA DINAMIS UNTUK PREVIEW
              const colorConfig = getColorConfig(skill.accent_color);
              
              return (
                <div key={skill.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Indikator Warna Dinamis */}
                    <div className={`w-3 h-12 rounded-full ${colorConfig.bg}`} />
                    
                    <div>
                      <h4 className="font-bold text-gray-800">{skill.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{skill.description || "Tidak ada deskripsi"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center hidden sm:block">
                      <span className="block text-xs text-gray-400 uppercase">Level</span>
                      <span className="font-bold text-gray-700">{skill.level}/10</span>
                    </div>
                    <div className="text-center hidden sm:block">
                      <span className="block text-xs text-gray-400 uppercase">Urutan</span>
                      <span className="font-bold text-gray-700">{skill.order_index}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                      <button 
                        onClick={() => handleEdit(skill)} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => handleDelete(skill.id)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Hapus"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}