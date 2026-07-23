import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { KeyRound, ShieldAlert } from 'lucide-react'

import { Container } from '@/components/ui/container'
import { isAdminConfigured } from '@/lib/admin-auth'

/**
 * Shell for the order dashboard.
 *
 * The environment check lives here rather than on each page so there is one
 * door, not two. When the secrets are missing the layout renders the setup
 * notice and never renders `children`, which means neither the dashboard nor
 * the sign-in form is reachable — a half-configured deployment locks, it does
 * not fall open.
 */

export const metadata: Metadata = {
  title: 'Orders',
  robots: { index: false, follow: false, nocache: true },
}

export const dynamic = 'force-dynamic'

/** Mirrors MIN_PASSWORD_LENGTH in `lib/admin-auth.ts`. */
const MIN_PASSWORD_LENGTH = 12

interface EnvCheck {
  readonly name: string
  readonly hint: string
  readonly required: boolean
  readonly satisfied: boolean
}

/** Reports which variables are present. Never reports what they contain. */
function envChecks(): readonly EnvCheck[] {
  const password = process.env.ADMIN_PASSWORD?.trim() ?? ''
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() ?? ''
  const supabaseUrl = process.env.SUPABASE_URL?.trim() ?? ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? ''

  return [
    {
      name: 'ADMIN_PASSWORD',
      hint: `At least ${MIN_PASSWORD_LENGTH} characters. It is the only sign-in.`,
      required: true,
      satisfied: password.length >= MIN_PASSWORD_LENGTH,
    },
    {
      name: 'ADMIN_SESSION_SECRET',
      hint: 'Optional. A long random string. Left unset, the cookie signing key is derived from the password instead.',
      required: false,
      satisfied: secret.length >= 16,
    },
    {
      name: 'SUPABASE_URL',
      hint: 'Project URL from the Supabase dashboard.',
      required: true,
      satisfied: supabaseUrl.length > 0,
    },
    {
      name: 'SUPABASE_SERVICE_ROLE_KEY',
      hint: 'Service role key. Never prefix it with NEXT_PUBLIC_.',
      required: true,
      satisfied: serviceRoleKey.length > 0,
    },
  ]
}

/**
 * Write the specifics to the server log, where only the operator sees them.
 * Anyone at all can load /admin on a misconfigured deploy, and a page that
 * names the exact variables hands a stranger a map of the deployment.
 */
function logMissingConfiguration(): void {
  const missing = envChecks()
    .filter((check) => check.required && !check.satisfied)
    .map((check) => `${check.name}: ${check.hint}`)

  if (missing.length === 0) return

  console.error(
    `[purasynth] /admin is locked: required configuration is missing.\n  ${missing.join(
      '\n  '
    )}`
  )
}

function SetupNotice() {
  logMissingConfiguration()

  return (
    <div className="mx-auto w-full max-w-2xl rounded-lg border-2 border-ink bg-paper p-6 shadow-soft sm:p-8">
      <span className="inline-flex items-center gap-2 rounded-full bg-coral-soft px-4 py-1.5 font-mono text-[0.7rem] font-bold tracking-[0.18em] text-coral-deep uppercase">
        <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
        Not configured
      </span>

      <h1 className="mt-4 text-3xl">The dashboard is locked</h1>

      <p className="mt-3 text-base leading-relaxed text-slate">
        This dashboard is not configured yet on this deployment. Nothing under{' '}
        <code>/admin</code> will render, not even the sign-in form, until it is.
      </p>

      <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-slate">
        <KeyRound className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        If this is your shop: the README lists the environment variables the
        dashboard needs, and the server log for this page names the ones that
        are still missing. Setting them and redeploying unlocks it.
      </p>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  readonly children: ReactNode
}) {
  return (
    <div className="min-h-[70vh] bg-cream py-12 sm:py-16">
      <Container size="wide">
        {isAdminConfigured() ? children : <SetupNotice />}
      </Container>
    </div>
  )
}
