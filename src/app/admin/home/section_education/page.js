"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

export default function AdminHomeEducationSection() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  // State untuk form
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    description: "",
    start_year: new Date().getFullYear(),
    end_year: "",
    end_label: "",
    accent_color: "yellow",
    order_index: 0,
  });

  // 1. Ambil data education saat halaman dimuat
  useEffect(() => {
    async function fetchEducation() {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("order_index", { ascending: true });
      
      if (data) setEducation(data);
      setLoading(false);
    }
    fetchEducation();
  }, []);

  // 2. Handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Handle checkbox "Masih berlangsung"
  const handleStillStudying = (e) => {
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        end_year: "",
        end_label: "Sekarang",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        end_year: new Date().getFullYear(),
        end_label: "",
      }));
    }
  };

  // 4. Handle submit form (Tambah / Edit)
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const dataToSave = {
      institution: formData.institution,
      degree: formData.degree || null,
      description: formData.description || null,
      start_year: parseInt(formData.start_year),
      end_year: formData.end_year ? parseInt(formData.end_year) : null,
      end_label: formData.end_label || null,
      accent_color: formData.accent_color,
      order_index: parseInt(formData.order_index),
    };

    let error;
    if (editingId) {
      // UPDATE
      const { error: updateError } = await supabase
        .from("education")
        .update(dataToSave)
        .eq("id", editingId);
      error = updateError;
    } else {
      // INSERT
      const { error: insertError } = await supabase
        .from("education")
        .insert(dataToSave);
      error = insertError;
    }

    if (error) {
      setMessage(" Error: " + error.message);
      setSaving(false);
      return;
    }

    setMessage(editingId ? "✅ Pendidikan berhasil diperbarui!" : "✅ Pendidikan berhasil ditambahkan!");
    setSaving(false);
    resetForm();
    
    // Refresh data
    const { data } = await supabase.from("education").select("*").order("order_index", { ascending: true });
    if (data) setEducation(data);
    
    setTimeout(() => setMessage(""), 3000);
  }

  // 5. Handle klik tombol Edit
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      institution: item.institution,
      degree: item.degree || "",
      description: item.description || "",
      start_year: item.start_year,
      end_year: item.end_year || "",
      end_label: item.end_label || "",
      accent_color: item.accent_color || "yellow",
      order_index: item.order_index || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 6. Handle klik tombol Hapus
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data pendidikan ini?")) return;
    
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) {
      setMessage(" Error: " + error.message);
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setMessage("✅ Pendidikan berhasil dihapus!");
    setEducation((prev) => prev.filter((e) => e.id !== id));
    setTimeout(() => setMessage(""), 3000);
  };

  // 7. Pindahkan urutan
  const moveEducation = (index, direction) => {
    const newEducation = [...education];
    const newIndex = index + direction;
    
    if (newIndex < 0 || newIndex >= newEducation.length) return;
    
    // Swap
    [newEducation[index], newEducation[newIndex]] = [newEducation[newIndex], newEducation[index]];
    
    // Update order_index
    newEducation.forEach((item, idx) => {
      item.order_index = idx;
    });
    
    setEducation(newEducation);
  };

  // 8. Reset form ke kondisi awal
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      institution: "",
      degree: "",
      description: "",
      start_year: new Date().getFullYear(),
      end_year: "",
      end_label: "",
      accent_color: "yellow",
      order_index: education.length,
    });
  };

  if (loading) return <main className="admin-loading">Memuat data...</main>;

  const isStillStudying = !formData.end_year && formData.end_label;

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <div className="admin-section-heading" style={{ marginBottom: "32px" }}>
          <span>Kelola Pendidikan</span>
          <small>Tambah, edit, atau hapus riwayat pendidikan</small>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded text-sm font-medium ${
            message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* FORM INPUT */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 mb-8 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? "Edit Pendidikan" : "Tambah Pendidikan Baru"}
            </h3>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1">
                <FiX /> Batal
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Nama Institusi *
              </label>
              <input 
                name="institution" 
                value={formData.institution} 
                onChange={handleChange} 
                required
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                placeholder="Contoh: STIKOM PGRI Banyuwangi"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Gelar / Jurusan
              </label>
              <input 
                name="degree" 
                value={formData.degree} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                placeholder="Contoh: D3 Manajemen Informatika"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Tahun Mulai *
                </label>
                <input 
                  type="number" 
                  name="start_year" 
                  value={formData.start_year} 
                  onChange={handleChange} 
                  required
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Tahun Selesai
                </label>
                <input 
                  type="number" 
                  name="end_year" 
                  value={formData.end_year} 
                  onChange={handleChange}
                  disabled={isStillStudying}
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:opacity-50"
                  placeholder={isStillStudying ? "Sekarang" : new Date().getFullYear().toString()}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isStillStudying}
                  onChange={handleStillStudying}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Masih berlangsung / Saat ini</span>
              </label>
              <p className="text-xs text-gray-400 mt-1 ml-6">
                Centang jika masih menempuh pendidikan di institusi ini
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Deskripsi
              </label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="2"
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none resize-none"
                placeholder="Deskripsi singkat tentang pendidikan ini..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Warna Icon
              </label>
              <select 
                name="accent_color" 
                value={formData.accent_color} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="yellow">Kuning (Yellow)</option>
                <option value="green">Hijau (Green)</option>
                <option value="blue">Biru (Blue)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Urutan Tampil
              </label>
              <input 
                type="number" 
                name="order_index" 
                value={formData.order_index} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                placeholder="0"
              />
              <p className="text-xs text-gray-400 mt-1">Angka lebih kecil muncul lebih atas</p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Menyimpan..." : <><FiSave /> {editingId ? "Perbarui" : "Simpan"}</>}
          </button>
        </form>

        {/* DAFTAR EDUCATION */}
        <div className="admin-section-heading" style={{ marginBottom: "16px" }}>
          <span>Riwayat Pendidikan</span>
          <small>{education.length} item</small>
        </div>

        <div className="space-y-3">
          {education.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Belum ada data pendidikan.</p>
          ) : (
            education.map((item, index) => (
              <div 
                key={item.id} 
                className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                {/* Nomor Urut & Tombol Pindah */}
                <div className="flex flex-col gap-1 pt-2">
                  <button
                    onClick={() => moveEducation(index, -1)}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"
                  >
                    <FiArrowUp />
                  </button>
                  <span className="text-xs font-bold text-gray-600 text-center">{index + 1}</span>
                  <button
                    onClick={() => moveEducation(index, 1)}
                    disabled={index === education.length - 1}
                    className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"
                  >
                    <FiArrowDown />
                  </button>
                </div>

                {/* Icon Warna */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.accent_color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                  item.accent_color === 'green' ? 'bg-green-100 text-green-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  🎓
                </div>

                {/* Konten */}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{item.institution}</h4>
                  {item.degree && <p className="text-sm text-gray-600">{item.degree}</p>}
                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    {item.start_year} - {item.end_label || item.end_year}
                  </p>
                  {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                </div>

                {/* Tombol Aksi */}
                <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                  <button 
                    onClick={() => handleEdit(item)} 
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Hapus"
                  >
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