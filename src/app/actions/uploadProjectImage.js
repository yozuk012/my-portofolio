"use server";

import { supabaseAdmin } from "@/lib/supabase";

export async function uploadProjectImage(formData) {
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

    // Generate nama file unik
    const fileExt = file.name.split(".").pop();
    const fileName = `project-${Date.now()}.${fileExt}`;

    // Upload ke bucket "my-portofolio-pic" di folder projects/
    const { data, error } = await supabaseAdmin.storage
      .from("my-portofolio-pic")
      .upload(`projects/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw new Error(error.message);

    // Dapatkan public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("my-portofolio-pic")
      .getPublicUrl(`projects/${fileName}`);

    return { 
      success: true, 
      message: "Upload berhasil!", 
      url: publicUrl 
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: error.message };
  }
}