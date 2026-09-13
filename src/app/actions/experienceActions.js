"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function upsertExperience(formData) {
  try {
    const id = formData.get("id") || null;
    const title = formData.get("title");
    const category = formData.get("category");
    const description = formData.get("description");
    const evidence_url = formData.get("evidence_url") || null;
    const order_index = parseInt(formData.get("order_index"), 10) || 0;

    const dataToSave = {
      type: "project",
      title,
      category,
      description,
      evidence_url,
      order_index,
    };

    let error;
    if (id) {
      const { error: updateError } = await supabaseAdmin
        .from("experiences")
        .update(dataToSave)
        .eq("id", id);
      error = updateError;
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("experiences")
        .insert(dataToSave);
      error = insertError;
    }

    if (error) {
      console.error("Database error:", error);
      throw new Error(error.message);
    }

    revalidatePath("/admin/experience");
    revalidatePath("/experience");
    revalidatePath("/");
    
    return { success: true, message: id ? "Experience berhasil diperbarui!" : "Experience berhasil ditambahkan!" };
  } catch (error) {
    console.error("Upsert Experience Error:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteExperience(id) {
  try {
    const { error } = await supabaseAdmin.from("experiences").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/experience");
    revalidatePath("/experience");
    revalidatePath("/");
    
    return { success: true, message: "Experience berhasil dihapus!" };
  } catch (error) {
    console.error("Delete Experience Error:", error);
    return { success: false, message: error.message };
  }
}