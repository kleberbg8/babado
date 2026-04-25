import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton browser client for use in Client Components
export const createClient = () => createBrowserClient(url, key)
