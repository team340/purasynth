import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client.
 *
 * The `orders` table has RLS enabled with no policies, so the anon and
 * publishable keys can read and write nothing at all. Every query goes
 * through the service role key, which bypasses RLS — which is exactly why
 * this module is `server-only` and the key must never carry a NEXT_PUBLIC_
 * prefix. Customer names, addresses and phone numbers never reach the browser.
 */

let cached: SupabaseClient | null = null

export class SupabaseNotConfiguredError extends Error {
  constructor(missing: string) {
    super(`Supabase is not configured: ${missing} is missing.`)
    this.name = 'SupabaseNotConfiguredError'
  }
}

export function getSupabase(): SupabaseClient {
  if (cached) return cached

  const url = process.env.SUPABASE_URL?.trim()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!url) throw new SupabaseNotConfiguredError('SUPABASE_URL')
  if (!serviceRoleKey) {
    throw new SupabaseNotConfiguredError('SUPABASE_SERVICE_ROLE_KEY')
  }

  cached = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  return cached
}

/** True when both env vars are present, without throwing. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  )
}
