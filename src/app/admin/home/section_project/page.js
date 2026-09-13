"use client";

import { useState, useEffect } from "react";
import { FiCheck, FiX, FiSave, FiArrowLeft, FiArrowUp, FiArrowDown, FiImage } from "react-icons/fi";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminHomeProjectsSection() {
  const [allProjects, setAllProjects] = useState([]);
  const [homepageProjects, setHomepageProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // 1. Ambil semua projects saat halaman dimuat
  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("order_index", { ascending: true });
      
      if (data) {
        setAllProjects(data);
        // Filter yang sudah di-set untuk homepage
        const homepage = data
          .filter(p => p.is_featured)
          .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        setHomepageProjects(homepage);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  // 2. Toggle homepage status
  const toggleHomepage = (project) => {
    const isAlreadyOnHomepage = homepageProjects.find(p => p.id === project.id);
    
    if (isAlreadyOnHomepage) {
      // Hapus dari homepage
      setHomepageProjects(prev => prev.filter(p => p.id !== project.id));
    } else {
      // Tambah ke homepage (maksimal 3 untuk layout grid yang rapi)
      if (homepageProjects.length >= 3) {
        setMessage("⚠️ Maksimal hanya 3 projects yang bisa ditampilkan di homepage!");
        setTimeout(() => setMessage(""), 3000);
        return;
      }
      setHomepageProjects(prev => [...prev, project]);
    }
  };

  // 3. Pindahkan urutan homepage
  const moveHomepage = async (index, direction) => {
    const newHomepage = [...homepageProjects];
    const newIndex = index + direction;
    
    if (newIndex < 0 || newIndex >= newHomepage.length) return;
    
    // Swap
    [newHomepage[index], newHomepage[newIndex]] = [newHomepage[newIndex], newHomepage[index]];
    
    setHomepageProjects(newHomepage);
    
    // Update order_index di database
    setSaving(true);
    for (let i = 0; i < newHomepage.length; i++) {
      await supabase
        .from("projects")
        .update({ order_index: i })
        .eq("id", newHomepage[i].id);
    }
    setSaving(false);
  };

  // 4. Simpan perubahan ke database
  async function handleSave() {
    setSaving(true);
    setMessage("");

    // Reset semua featured
    for (const project of allProjects) {
      await supabase
        .from("projects")
        .update({ is_featured: false })
        .eq("id", project.id);
    }

    // Set featured untuk yang dipilih
    for (let i = 0; i < homepageProjects.length; i++) {
      await supabase
        .from("projects")
        .update({ 
          is_featured: true,
          order_index: i 
        })
        .eq("id", homepageProjects[i].id);
    }

    setMessage("✅ Berhasil! Projects homepage diperbarui.");
    setSaving(false);
    
    // Refresh data
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("order_index", { ascending: true });
    
    if (data) {
      setAllProjects(data);
      setHomepageProjects(data.filter(p => p.is_featured));
    }
    
    setTimeout(() => setMessage(""), 3000);
  }

  if (loading) return <main className="admin-loading">Memuat data...</main>;

  return (
    <main className="admin-page">
      <div className="admin-shell">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/home" className="p-2 hover:bg-gray-100 rounded transition-colors">
            <FiArrowLeft />
          </Link>
          <div className="admin-section-heading flex-1">
            <span>Projects Homepage</span>
            <small>Pilih 3 projects terbaik</small>
          </div>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded text-sm font-medium ${
            message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Info:</strong> Pilih maksimal <strong>3 projects</strong> yang akan ditampilkan di bagian Project Showcase pada homepage. 
            Projects harus dalam status "Published" agar bisa dipilih.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* KOLOM KIRI: Semua Projects */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              Semua Projects (Published)
              <span className="text-sm font-normal text-gray-500">({allProjects.length})</span>
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {allProjects.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Belum ada project yang published. <Link href="/admin/projects" className="text-blue-600 hover:underline">Tambah project</Link>
                </p>
              ) : (
                allProjects.map((project) => {
                  const isOnHomepage = homepageProjects.find(p => p.id === project.id);
                  return (
                    <div 
                      key={project.id}
                      className={`flex items-start gap-3 p-3 border rounded-lg transition-all ${
                        isOnHomepage 
                          ? "bg-green-50 border-green-300 opacity-60" 
                          : "bg-white border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {/* Preview Thumbnail */}
                      {project.thumbnail_url ? (
                        <img src={project.thumbnail_url} alt={project.title} className="w-20 h-16 object-cover rounded border border-gray-200 flex-shrink-0" />
                      ) : (
                        <div className="w-20 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                          <FiImage size={20} />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm truncate">{project.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{project.description}</p>
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {project.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => toggleHomepage(project)}
                        disabled={!!isOnHomepage}
                        className={`p-2 rounded transition-colors flex-shrink-0 ${
                          isOnHomepage
                            ? "text-green-600 bg-green-100 cursor-default"
                            : "text-blue-600 hover:bg-blue-50"
                        }`}
                        title={isOnHomepage ? "Sudah dipilih" : "Tampilkan di homepage"}
                      >
                        {isOnHomepage ? <FiCheck /> : <FiX />}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* KOLOM KANAN: Homepage Projects */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              Projects di Homepage
              <span className="text-sm font-normal text-gray-500">({homepageProjects.length}/3)</span>
            </h3>
            
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px]">
              {homepageProjects.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <p>Belum ada projects yang dipilih</p>
                  <p className="text-sm mt-2">Klik tombol ✓ di sebelah kiri untuk menambahkan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {homepageProjects.map((project, index) => (
                    <div 
                      key={project.id}
                      className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                    >
                      {/* Nomor Urut & Tombol Pindah */}
                      <div className="flex flex-col gap-1 pt-1">
                        <button
                          onClick={() => moveHomepage(index, -1)}
                          disabled={index === 0 || saving}
                          className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"
                        >
                          <FiArrowUp />
                        </button>
                        <span className="text-xs font-bold text-gray-600 text-center">{index + 1}</span>
                        <button
                          onClick={() => moveHomepage(index, 1)}
                          disabled={index === homepageProjects.length - 1 || saving}
                          className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"
                        >
                          <FiArrowDown />
                        </button>
                      </div>

                      {/* Thumbnail */}
                      {project.thumbnail_url ? (
                        <img src={project.thumbnail_url} alt={project.title} className="w-20 h-16 object-cover rounded border border-gray-200" />
                      ) : (
                        <div className="w-20 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                          <FiImage size={20} />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm truncate">{project.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{project.description}</p>
                      </div>

                      {/* Hapus dari Homepage */}
                      <button
                        onClick={() => toggleHomepage(project)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                        title="Hapus dari homepage"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tombol Simpan */}
            <button
              onClick={handleSave}
              disabled={saving || homepageProjects.length === 0}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Menyimpan..." : <><FiSave /> Simpan Perubahan</>}
            </button>

            {homepageProjects.length === 0 && (
              <p className="text-xs text-red-500 mt-2 text-center">
                * Pilih minimal 1 project untuk ditampilkan di homepage
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}