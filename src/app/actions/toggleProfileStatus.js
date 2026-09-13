"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function toggleProfileStatus() {
  try {
    // 1. Cek profil yang ada
    const { data: profile } = await supabaseAdmin
      .from("profile")
      .select("id, status")
      .limit(1)
      .maybeSingle();

    // 2. Jika belum ada profil sama sekali, buat baru dengan status available
    if (!profile) {
      const { error: insertError } = await supabaseAdmin
        .from("profile")
        .insert({ status: "available" });
      if (insertError) throw insertError;
      
      revalidatePath("/");
      return { success: true, newStatus: "available" };
    }

    // 3. Toggle status (available <-> unavailable)
    const newStatus = profile.status === "available" ? "unavailable" : "available";

    const { error } = await supabaseAdmin
      .from("profile")
      .update({ status: newStatus })
      .eq("id", profile.id);

    if (error) throw error;

    // 4. Refresh cache halaman home agar perubahan langsung terlihat
    revalidatePath("/");
    
    return { success: true, newStatus };
  } catch (error) {
    console.error("Toggle Status Error:", error);
    return { success: false, message: error.message };
  }
}