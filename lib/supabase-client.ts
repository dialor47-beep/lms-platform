import { createBrowserClient } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

/**
 * Get a singleton instance of the Supabase browser client
 * This prevents multiple GoTrueClient instances from being created
 */
export function getSupabaseBrowserClient() {
    if (!supabaseClient) {
        supabaseClient = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    }
    return supabaseClient
}
