import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase env vars")
}

// Server-side Supabase client with service role key
// (full storage access, only use in server actions)
export const supabase = createClient(supabaseUrl, supabaseServiceKey)
