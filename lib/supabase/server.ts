import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server Component / Route Handler client
export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}
