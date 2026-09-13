"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function upsertSkill(formData) {
  try {
    const id = formData.get("id") || null;
    const name = formData.get("name");
    const description = formData.get("description");
    const level = parseInt(formData.get("level"), 10) || 5;
    const accent_color = formData.get("accent_color") || "blue";
    const order_index = parseInt(formData.get("order_index"), 10) || 0;

    const dataToSave = { name, description, level, accent_color, order_index };

    let error;
    if (id) {
      // UPDATE jika ada ID
      const { error: updateError } = await supabaseAdmin
        .from("skills")
        .update(dataToSave)
        .eq("id", id);
      error = updateError;
    } else {
      // INSERT jika tidak ada ID (data baru)
      const { error: insertError } = await supabaseAdmin
        .from("skills")
        .insert(dataToSave);
      error = insertError;
    }

    if (error) throw new Error(error.message);

    // Refresh halaman admin dan halaman publik skills
    revalidatePath("/admin/skills");
    revalidatePath("/skills");
    
    return { success: true, message: id ? "Skill berhasil diperbarui!" : "Skill berhasil ditambahkan!" };
  } catch (error) {
    console.error("Upsert Skill Error:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteSkill(id) {
  try {
    const { error } = await supabaseAdmin.from("skills").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/skills");
    revalidatePath("/skills");
    
    return { success: true, message: "Skill berhasil dihapus!" };
  } catch (error) {
    console.error("Delete Skill Error:", error);
    return { success: false, message: error.message };
  }
}