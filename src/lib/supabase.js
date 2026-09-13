import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validasi dasar agar tidak silent fail
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.')
}

// 1. Client untuk browser (public) - AMAN untuk di-import di komponen "use client"
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 2. Client untuk server-side (dengan service role key)
// Hanya diinisialisasi jika key tersedia (mencegah crash di browser)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Helper functions (tetap sama)
export async function getProfile() {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .maybeSingle()
    
    if (error) return null
    return data
  } catch (error) {
    return null
  }
}

export async function getProjects(limit = null, featured = false) {
  try {
    let query = supabase.from('projects').select('*').eq('is_published', true).order('created_at', { ascending: false })
    if (featured) query = query.eq('is_featured', true)
    if (limit) query = query.limit(limit)

    const { data, error } = await query
    if (error) return []
    return data || []
  } catch (error) {
    return []
  }
}

export async function getExperiences(type = null) {
  try {
    let query = supabase.from('experiences').select('*').order('start_date', { ascending: false })
    if (type) query = query.eq('type', type)

    const { data, error } = await query
    if (error) return []
    return data || []
  } catch (error) {
    return []
  }
}