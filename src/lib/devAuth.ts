import { User } from '../types/user'
import { CommunityLinks } from './api'

/**
 * Local-only auth bypass, so the members and admin areas can be worked on
 * without going through the magic-link email round trip.
 *
 * Two locks, both of which must hold:
 *   1. VITE_DEV_FAKE_AUTH=true — set in .env.local, never in CI
 *   2. the page is served from localhost — a build that somehow carried the
 *      flag still refuses to bypass anything on a real domain
 */
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]', '::1']

export const devAuthEnabled =
  import.meta.env.VITE_DEV_FAKE_AUTH === 'true' &&
  typeof window !== 'undefined' &&
  LOCAL_HOSTS.includes(window.location.hostname)

// Set VITE_DEV_FAKE_ROLE=admin to also reach /admin.
const role: User['role'] = import.meta.env.VITE_DEV_FAKE_ROLE === 'admin' ? 'admin' : 'alumni'

export const devUser: User = {
  id: 'dev-00000000-0000-0000-0000-000000000000',
  email: 'dev@localhost',
  full_name_en: 'Dev User',
  full_name_he: 'משתמש פיתוח',
  cohort_start: 2020,
  cohort_end: 2023,
  role,
  certificate_id: 'DEV-0000',
  linkedin_url: null,
  created_at: '2020-10-01T00:00:00.000Z',
  last_login_at: '2026-08-26T00:00:00.000Z',
  email_updates: true,
}

export const devCommunityLinks: CommunityLinks = {
  whatsapp: 'https://example.com/dev-whatsapp',
  facebook: 'https://example.com/dev-facebook',
}
