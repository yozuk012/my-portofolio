"use server";

import { supabaseAdmin } from "@/lib/supabase";

export async function uploadProfileImage(formData) {
  try {
    const file = formData.get("file");
    
    if (!file) {
      return { success: false, message: "Tidak ada file yang dipilih" };
    }

    // Validasi tipe file
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, message: "Format file harus JPG, PNG, atau WebP" };
    }

    // Validasi ukuran file (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, message: "Ukuran file maksimal 5MB" };
    }

    // PERBAIKAN UTAMA: Paksa gunakan nama file DAN ekstensi yang TETAP
    // Kita ubah semua menjadi .jpg agar konsisten dan bisa saling menimpa (upsert)
    const fixedFileName = `profile-avatar.jpg`; 

    // Upload ke Supabase Storage bucket "my-portofolio-pic"
    const { data, error } = await supabaseAdmin.storage
      .from("my-portofolio-pic")
      .upload(fixedFileName, file, {
        cacheControl: "3600",
        upsert: true, // Menimpa file 'profile-avatar.jpg' yang sudah ada
        contentType: file.type // Penting: beri tahu browser tipe asli filenya agar tetap bisa dibaca
      });

    if (error) throw new Error(error.message);

    // Dapatkan public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("my-portofolio-pic")
      .getPublicUrl(fixedFileName);

    return { 
      success: true, 
      message: "Upload berhasil! Foto profil diperbarui.", 
      url: publicUrl 
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: error.message };
  }
}