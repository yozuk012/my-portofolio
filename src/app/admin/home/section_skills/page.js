"use client";

import { useState, useEffect } from "react";
import { FiCheck, FiX, FiSave, FiArrowLeft, FiArrowUp, FiArrowDown } from "react-icons/fi";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminHomeSkillsSection() {
  const [allSkills, setAllSkills] = useState([]);
  const [marqueeSkills, setMarqueeSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // 1. Ambil semua skills saat halaman dimuat
  useEffect(() => {
    async function fetchSkills() {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("order_index", { ascending: true });
      
      if (data) {
        setAllSkills(data);
        // Filter yang sudah di-set untuk marquee
        const marquee = data
          .filter(s => s.show_in_marquee)
          .sort((a, b) => (a.marquee_order || 0) - (b.marquee_order || 0));
        setMarqueeSkills(marquee);
      }
      setLoading(false);
    }
    fetchSkills();
  }, []);

  // 2. Toggle marquee status
  const toggleMarquee = (skill) => {
    const isAlreadyInMarquee = marqueeSkills.find(s => s.id === skill.id);
    
    if (isAlreadyInMarquee) {
      // Hapus dari marquee
      setMarqueeSkills(prev => prev.filter(s => s.id !== skill.id));
    } else {
      // Tambah ke marquee
      setMarqueeSkills(prev => [...prev, { ...skill, marquee_order: prev.length }]);
    }
  };

  // 3. Pindahkan urutan marquee
  const moveMarquee = (index, direction) => {
    const newMarquee = [...marqueeSkills];
    const newIndex = index + direction;
    
    if (newIndex < 0 || newIndex >= newMarquee.length) return;
    
    // Swap
    [newMarquee[index], newMarquee[newIndex]] = [newMarquee[newIndex], newMarquee[index]];
    
    // Update order
    newMarquee.forEach((skill, idx) => {
      skill.marquee_order = idx;
    });
    
    setMarqueeSkills(newMarquee);
  };

  // 4. Simpan perubahan ke database
  async function handleSave() {
    setSaving(true);
    setMessage("");

    // Update semua skills
    const updates = allSkills.map(skill => {
      const isInMarquee = marqueeSkills.find(ms => ms.id === skill.id);
      return {
        id: skill.id,
        show_in_marquee: !!isInMarquee,
        marquee_order: isInMarquee ? isInMarquee.marquee_order : null,
      };
    });

    // Update satu per satu
    for (const update of updates) {
      const { error } = await supabase
        .from("skills")
        .update({ 
          show_in_marquee: update.show_in_marquee,
          marquee_order: update.marquee_order 
        })
        .eq("id", update.id);
      
      if (error) {
        setMessage(" Error: " + error.message);
        setSaving(false);
        return;
      }
    }

    setMessage("✅ Berhasil! Skills marquee diperbarui.");
    setSaving(false);
    
    // Refresh data
    const { data } = await supabase.from("skills").select("*").order("order_index", { ascending: true });
    if (data) {
      setAllSkills(data);
      setMarqueeSkills(data.filter(s => s.show_in_marquee).sort((a, b) => (a.marquee_order || 0) - (b.marquee_order || 0)));
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
            <span>Skills Marquee</span>
            <small>Atur running text homepage</small>
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
            <strong>Info:</strong> Pilih skills yang akan ditampilkan di <strong>Skills Section (marquee/running text)</strong> pada homepage. 
            Anda bisa memilih 7, 10, atau berapa saja skills yang ingin ditampilkan. Atur urutannya sesuai keinginan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* KOLOM KIRI: Semua Skills */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              Semua Skills
              <span className="text-sm font-normal text-gray-500">({allSkills.length})</span>
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {allSkills.map((skill) => {
                const isInMarquee = marqueeSkills.find(s => s.id === skill.id);
                return (
                  <div 
                    key={skill.id}
                    className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                      isInMarquee 
                        ? "bg-green-50 border-green-300 opacity-60" 
                        : "bg-white border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{skill.name}</h4>
                      <p className="text-xs text-gray-500">Level: {skill.level}/10</p>
                    </div>
                    <button
                      onClick={() => toggleMarquee(skill)}
                      disabled={!!isInMarquee}
                      className={`p-2 rounded transition-colors ${
                        isInMarquee
                          ? "text-green-600 bg-green-100 cursor-default"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                      title={isInMarquee ? "Sudah dipilih" : "Tampilkan di marquee"}
                    >
                      {isInMarquee ? <FiCheck /> : <FiX />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* KOLOM KANAN: Marquee Skills */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              Skills di Marquee
              <span className="text-sm font-normal text-gray-500">({marqueeSkills.length})</span>
            </h3>
            
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px]">
              {marqueeSkills.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <p>Belum ada skills yang dipilih</p>
                  <p className="text-sm mt-2">Klik tombol ✓ di sebelah kiri untuk menambahkan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {marqueeSkills.map((skill, index) => (
                    <div 
                      key={skill.id}
                      className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                    >
                      {/* Tombol Pindah Urutan */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveMarquee(index, -1)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"
                        >
                          <FiArrowUp />
                        </button>
                        <span className="text-xs font-bold text-gray-600 text-center">{index + 1}</span>
                        <button
                          onClick={() => moveMarquee(index, 1)}
                          disabled={index === marqueeSkills.length - 1}
                          className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"
                        >
                          <FiArrowDown />
                        </button>
                      </div>

                      {/* Skill Info */}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{skill.name}</h4>
                        <p className="text-xs text-gray-500">Level: {skill.level}/10</p>
                      </div>

                      {/* Hapus dari Marquee */}
                      <button
                        onClick={() => toggleMarquee(skill)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Hapus dari marquee"
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
              disabled={saving || marqueeSkills.length === 0}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Menyimpan..." : <><FiSave /> Simpan Perubahan</>}
            </button>

            {marqueeSkills.length === 0 && (
              <p className="text-xs text-red-500 mt-2 text-center">
                * Pilih minimal 1 skill untuk ditampilkan di marquee
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}