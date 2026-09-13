"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData) {
  try {
    let targetId = formData.get("id");
    
    if (!targetId || targetId === "") {
      const { data: existingProfile } = await supabaseAdmin
        .from("profile")
        .select("id")
        .limit(1)
        .maybeSingle();
      targetId = existingProfile?.id;
    }

    const skillsArray = formData.getAll("skills[]")
      .filter((s) => s.trim() !== "")
      .slice(0, 3); 

    const platforms = formData.getAll("social_platform[]");
    const urls = formData.getAll("social_url[]");
    
    const socialsArray = platforms
      .map((platform, index) => ({
        platform: platform.trim(),
        url: urls[index].trim(),
      }))
      .filter((s) => s.platform !== "" && s.url !== "");

    // Tambahkan role kembali di sini
    const dataToSave = {
      full_name: formData.get("full_name"),
      role: formData.get("role"), // <-- DIKEMBALIKAN
      bio: formData.get("bio"),
      avatar_url: formData.get("avatar_url"),
      skills: skillsArray,
      social_links: socialsArray,
    };

    let error;

    if (targetId) {
      const { error: updateError } = await supabaseAdmin
        .from("profile")
        .update(dataToSave)
        .eq("id", targetId);
      error = updateError;
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("profile")
        .insert(dataToSave);
      error = insertError;
    }

    if (error) throw new Error(error.message);

    revalidatePath("/");
    
    return { success: true, message: "Profil berhasil disimpan!" };
  } catch (error) {
    console.error("Update Profile Error:", error);
    return { success: false, message: error.message };
  }
}