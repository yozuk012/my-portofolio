"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function upsertProject(formData) {
  try {
    const id = formData.get("id") || null;
    const title = formData.get("title");
    const description = formData.get("description") || null;
    const status = formData.get("status") || "done";
    const color = formData.get("color") || "blue";
    const thumbnail_url = formData.get("thumbnail_url") || null;
    const demo_url = formData.get("demo_url") || null;
    const order_index = parseInt(formData.get("order_index"), 10) || 0;
    const is_featured = formData.get("is_featured") === "true";
    const is_published = formData.get("is_published") === "true";

    // Handle tags (array dari FormData)
    const tags = formData.getAll("tags[]").filter((t) => t.trim() !== "");

    const dataToSave = {
      title,
      description,
      status,
      color,
      thumbnail_url,
      demo_url,
      tags,
      order_index,
      is_featured,
      is_published,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (id) {
      const { error: updateError } = await supabaseAdmin
        .from("projects")
        .update(dataToSave)
        .eq("id", id);
      error = updateError;
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("projects")
        .insert(dataToSave);
      error = insertError;
    }

    if (error) {
      console.error("Database error:", error);
      throw new Error(error.message);
    }

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    
    return { success: true, message: id ? "Project berhasil diperbarui!" : "Project berhasil ditambahkan!" };
  } catch (error) {
    console.error("Upsert Project Error:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteProject(id) {
  try {
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    
    return { success: true, message: "Project berhasil dihapus!" };
  } catch (error) {
    console.error("Delete Project Error:", error);
    return { success: false, message: error.message };
  }
}