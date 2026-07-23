import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { AdminLoginForm } from '@/components/admin/login-form'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Sign in',
  description: 'Sign in to the Purasynth order dashboard.',
  path: '/admin/login',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

/**
 * The missing-environment case is handled one level up in `admin/layout.tsx`,
 * so by the time this renders the dashboard is known to be configured.
 */
export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect('/admin')
  }

  return (
    <div className="flex justify-center py-6">
      <AdminLoginForm />
    </div>
  )
}
