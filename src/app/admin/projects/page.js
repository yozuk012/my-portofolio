"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX, FiArrowUp, FiArrowDown, FiImage, FiUpload, FiLink } from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import { upsertProject, deleteProject } from "@/app/actions/projectActions";
import { uploadProjectImage } from "@/app/actions/uploadProjectImage";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "done",
    color: "blue",
    thumbnail_url: "",
    demo_url: "",
    tags: [""],
    order_index: 0,
    is_featured: false,
    is_published: true,
  });

  // 1. Ambil data projects
  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true });
      
      if (data) setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  // 2. Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 3. Handle upload file
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const fileFormData = new FormData();
    fileFormData.append("file", file);

    const result = await uploadProjectImage(fileFormData);
    
    if (result.success) {
      setFormData({ ...formData, thumbnail_url: result.url });
      setMessage(result.message);
    } else {
      setMessage(result.message);
    }
    
    setUploading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const clearThumbnail = () => {
    setFormData({ ...formData, thumbnail_url: "" });
  };

  // 4. Handle tags dinamis
  const addTag = () => {
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  };

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const updateTag = (index, value) => {
    setFormData((prev) => {
      const newTags = [...prev.tags];
      newTags[index] = value;
      return { ...prev, tags: newTags };
    });
  };

  // 5. Handle submit
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const formPayload = new FormData();
    if (editingId) formPayload.append("id", editingId);
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("status", formData.status);
    formPayload.append("color", formData.color);
    formPayload.append("thumbnail_url", formData.thumbnail_url);
    formPayload.append("demo_url", formData.demo_url);
    formPayload.append("order_index", formData.order_index);
    formPayload.append("is_featured", formData.is_featured.toString());
    formPayload.append("is_published", formData.is_published.toString());

    formData.tags.forEach((tag) => {
      if (tag.trim() !== "") formPayload.append("tags[]", tag);
    });

    const result = await upsertProject(formPayload);
    setMessage(result.message);
    setSaving(false);

    if (result.success) {
      resetForm();
      const { data } = await supabase.from("projects").select("*").order("order_index", { ascending: true });
      if (data) setProjects(data);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  // 6. Handle edit
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      status: item.status || "done",
      color: item.color || "blue",
      thumbnail_url: item.thumbnail_url || "",
      demo_url: item.demo_url || "",
      tags: Array.isArray(item.tags) && item.tags.length > 0 ? item.tags : [""],
      order_index: item.order_index || 0,
      is_featured: item.is_featured || false,
      is_published: item.is_published !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 7. Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus project ini?")) return;
    
    const result = await deleteProject(id);
    setMessage(result.message);
    if (result.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // 8. Pindahkan urutan
  const moveProject = (index, direction) => {
    const newProjects = [...projects];
    const newIndex = index + direction;
    
    if (newIndex < 0 || newIndex >= newProjects.length) return;
    
    [newProjects[index], newProjects[newIndex]] = [newProjects[newIndex], newProjects[index]];
    
    newProjects.forEach((item, idx) => {
      item.order_index = idx;
    });
    
    setProjects(newProjects);
  };

  // 9. Reset form
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      status: "done",
      color: "blue",
      thumbnail_url: "",
      demo_url: "",
      tags: [""],
      order_index: projects.length,
      is_featured: false,
      is_published: true,
    });
  };

  if (loading) return <main className="admin-loading">Memuat data...</main>;

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <div className="admin-section-heading" style={{ marginBottom: "32px" }}>
          <span>Kelola Projects</span>
          <small>Tambah, edit, atau hapus project portfolio</small>
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
              {editingId ? "Edit Project" : "Tambah Project Baru"}
            </h3>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1">
                <FiX /> Batal
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Judul Project *</label>
              <input 
                name="title" value={formData.title} onChange={handleChange} required
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                placeholder="Contoh: Sistem Poin Akademik"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Deskripsi</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} rows="3"
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none resize-none"
                placeholder="Deskripsikan project ini..."
              />
            </div>

            {/* Upload Thumbnail */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Foto Project</label>
              
              {formData.thumbnail_url && (
                <div className="relative w-full max-w-md mb-3 rounded-lg overflow-hidden border-2 border-gray-300">
                  <img 
                    src={formData.thumbnail_url} 
                    alt="Preview Thumbnail" 
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearThumbnail}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Hapus foto"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}

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
                Maksimal 5MB. File akan otomatis tersimpan di bucket <strong>"my-portofolio-pic/projects"</strong>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Status *</label>
              <select 
                name="status" value={formData.status} onChange={handleChange} required
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="done">Done (Selesai)</option>
                <option value="progress">In Progress (Berjalan)</option>
                <option value="inactive">Inactive (Tidak Aktif)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Warna Visual *</label>
              <select 
                name="color" value={formData.color} onChange={handleChange} required
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="blue">Biru (Blue)</option>
                <option value="red">Merah (Red)</option>
                <option value="green">Hijau (Green)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Link Demo Project</label>
              <div className="relative">
                <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="demo_url" value={formData.demo_url} onChange={handleChange}
                  className="w-full p-2 pl-10 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                  placeholder="https://github.com/... atau https://demo-website.com"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Bisa berupa link GitHub atau link demo langsung
              </p>
            </div>

            {/* Tags Dinamis */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Tags (Tech Stack / Kategori)</label>
                <button type="button" onClick={addTag} className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                  <FiPlus /> Tambah Tag
                </button>
              </div>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      value={tag} 
                      onChange={(e) => updateTag(index, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                      placeholder={`Tag ${index + 1} (cth: Next.js, Web App, Database)`}
                    />
                    {formData.tags.length > 1 && (
                      <button type="button" onClick={() => removeTag(index)} className="p-2 text-red-600 hover:bg-red-50 rounded border border-gray-300">
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Bisa berisi tech stack, kategori project, atau hal lain yang berkaitan
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Urutan Tampil</label>
              <input 
                type="number" name="order_index" value={formData.order_index} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Featured (Tampil di homepage)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Published (Tampil di publik)</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" disabled={saving || uploading}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Menyimpan..." : <><FiSave /> {editingId ? "Perbarui" : "Simpan"}</>}
          </button>
        </form>

        {/* DAFTAR PROJECTS */}
        <div className="admin-section-heading" style={{ marginBottom: "16px" }}>
          <span>Daftar Projects</span>
          <small>{projects.length} item</small>
        </div>

        <div className="space-y-3">
          {projects.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Belum ada project yang ditambahkan.</p>
          ) : (
            projects.map((item, index) => (
              <div key={item.id} className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                {/* Nomor & Tombol Pindah */}
                <div className="flex flex-col gap-1 pt-2">
                  <button onClick={() => moveProject(index, -1)} disabled={index === 0} className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30">
                    <FiArrowUp />
                  </button>
                  <span className="text-xs font-bold text-gray-600 text-center">{index + 1}</span>
                  <button onClick={() => moveProject(index, 1)} disabled={index === projects.length - 1} className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30">
                    <FiArrowDown />
                  </button>
                </div>

                {/* Thumbnail */}
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.title} className="w-32 h-24 object-cover rounded border border-gray-200" />
                ) : (
                  <div className="w-32 h-24 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                    <FiImage size={24} />
                  </div>
                )}

                {/* Konten */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      item.status === 'done' ? 'bg-green-100 text-green-700' :
                      item.status === 'progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                    {item.is_featured && (
                      <span className="text-xs font-bold px-2 py-1 rounded bg-purple-100 text-purple-700">
                        Featured
                      </span>
                    )}
                    {!item.is_published && (
                      <span className="text-xs font-bold px-2 py-1 rounded bg-red-100 text-red-700">
                        Draft
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">{item.description}</p>
                  {item.demo_url && (
                    <a href={item.demo_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-2">
                      <FiLink /> Lihat Demo
                    </a>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {item.tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200">{tag}</span>
                      ))}
                    </div>
                  )}
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