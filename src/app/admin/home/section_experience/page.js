"use client";

import { useState, useEffect } from "react";
import { FiCheck, FiX, FiSave, FiArrowLeft, FiArrowUp, FiArrowDown } from "react-icons/fi";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminHomeExperienceSection() {
  const [allExperiences, setAllExperiences] = useState([]);
  const [homepageExperiences, setHomepageExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // 1. Ambil semua experiences saat halaman dimuat
  useEffect(() => {
    async function fetchExperiences() {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("order_index", { ascending: true });
      
      if (data) {
        setAllExperiences(data);
        // Filter yang sudah di-set untuk homepage
        const homepage = data
          .filter(s => s.show_on_homepage)
          .sort((a, b) => (a.homepage_order || 0) - (b.homepage_order || 0));
        setHomepageExperiences(homepage);
      }
      setLoading(false);
    }
    fetchExperiences();
  }, []);

  // 2. Toggle homepage status
  const toggleHomepage = (experience) => {
    const isAlreadyOnHomepage = homepageExperiences.find(e => e.id === experience.id);
    
    if (isAlreadyOnHomepage) {
      // Hapus dari homepage
      setHomepageExperiences(prev => prev.filter(e => e.id !== experience.id));
    } else {
      // Tambah ke homepage (maksimal 3)
      if (homepageExperiences.length >= 3) {
        setMessage("️ Maksimal hanya 3 experiences yang bisa ditampilkan di homepage!");
        setTimeout(() => setMessage(""), 3000);
        return;
      }
      setHomepageExperiences(prev => [...prev, { ...experience, homepage_order: prev.length }]);
    }
  };

  // 3. Pindahkan urutan homepage
  const moveHomepage = (index, direction) => {
    const newHomepage = [...homepageExperiences];
    const newIndex = index + direction;
    
    if (newIndex < 0 || newIndex >= newHomepage.length) return;
    
    // Swap
    [newHomepage[index], newHomepage[newIndex]] = [newHomepage[newIndex], newHomepage[index]];
    
    // Update order
    newHomepage.forEach((item, idx) => {
      item.homepage_order = idx;
    });
    
    setHomepageExperiences(newHomepage);
  };

  // 4. Simpan perubahan ke database
  async function handleSave() {
    setSaving(true);
    setMessage("");

    // Update semua experiences
    const updates = allExperiences.map(exp => {
      const isOnHomepage = homepageExperiences.find(he => he.id === exp.id);
      return {
        id: exp.id,
        show_on_homepage: !!isOnHomepage,
        homepage_order: isOnHomepage ? isOnHomepage.homepage_order : null,
      };
    });

    // Update satu per satu
    for (const update of updates) {
      const { error } = await supabase
        .from("experiences")
        .update({ 
          show_on_homepage: update.show_on_homepage,
          homepage_order: update.homepage_order 
        })
        .eq("id", update.id);
      
      if (error) {
        setMessage("❌ Error: " + error.message);
        setSaving(false);
        return;
      }
    }

    setMessage("✅ Berhasil! Experiences homepage diperbarui.");
    setSaving(false);
    
    // Refresh data
    const { data } = await supabase.from("experiences").select("*").order("order_index", { ascending: true });
    if (data) {
      setAllExperiences(data);
      setHomepageExperiences(data.filter(e => e.show_on_homepage).sort((a, b) => (a.homepage_order || 0) - (b.homepage_order || 0)));
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
            <span>Experience Homepage</span>
            <small>Pilih 3 experiences terbaik</small>
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
            <strong>Info:</strong> Pilih maksimal <strong>3 experiences</strong> yang akan ditampilkan di bagian Experience Section pada homepage. 
            Urutkan sesuai prioritas yang ingin ditampilkan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* KOLOM KIRI: Semua Experiences */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              Semua Experiences
              <span className="text-sm font-normal text-gray-500">({allExperiences.length})</span>
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {allExperiences.map((exp) => {
                const isOnHomepage = homepageExperiences.find(e => e.id === exp.id);
                return (
                  <div 
                    key={exp.id}
                    className={`flex items-start gap-3 p-3 border rounded-lg transition-all ${
                      isOnHomepage 
                        ? "bg-green-50 border-green-300 opacity-60" 
                        : "bg-white border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {/* Preview Gambar Kecil */}
                    {exp.evidence_url ? (
                      <img src={exp.evidence_url} alt={exp.title} className="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                        <span className="text-xs">No img</span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm truncate">{exp.title}</h4>
                      <p className="text-xs text-blue-600 font-semibold">{exp.category}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{exp.description}</p>
                    </div>

                    <button
                      onClick={() => toggleHomepage(exp)}
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
              })}
            </div>
          </div>

          {/* KOLOM KANAN: Homepage Experiences */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              Experiences di Homepage
              <span className="text-sm font-normal text-gray-500">({homepageExperiences.length}/3)</span>
            </h3>
            
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px]">
              {homepageExperiences.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <p>Belum ada experiences yang dipilih</p>
                  <p className="text-sm mt-2">Klik tombol ✓ di sebelah kiri untuk menambahkan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {homepageExperiences.map((exp, index) => (
                    <div 
                      key={exp.id}
                      className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                    >
                      {/* Nomor Urut & Tombol Pindah */}
                      <div className="flex flex-col gap-1 pt-1">
                        <button
                          onClick={() => moveHomepage(index, -1)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"
                        >
                          <FiArrowUp />
                        </button>
                        <span className="text-xs font-bold text-gray-600 text-center">{index + 1}</span>
                        <button
                          onClick={() => moveHomepage(index, 1)}
                          disabled={index === homepageExperiences.length - 1}
                          className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"
                        >
                          <FiArrowDown />
                        </button>
                      </div>

                      {/* Preview Gambar */}
                      {exp.evidence_url ? (
                        <img src={exp.evidence_url} alt={exp.title} className="w-16 h-16 object-cover rounded border border-gray-200" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                          <span className="text-xs">No img</span>
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm truncate">{exp.title}</h4>
                        <p className="text-xs text-blue-600 font-semibold">{exp.category}</p>
                      </div>

                      {/* Hapus dari Homepage */}
                      <button
                        onClick={() => toggleHomepage(exp)}
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
              disabled={saving || homepageExperiences.length === 0}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Menyimpan..." : <><FiSave /> Simpan Perubahan</>}
            </button>

            {homepageExperiences.length === 0 && (
              <p className="text-xs text-red-500 mt-2 text-center">
                * Pilih minimal 1 experience untuk ditampilkan di homepage
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}