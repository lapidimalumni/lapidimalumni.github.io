export interface User {
  id: string
  email: string
  full_name_en: string
  full_name_he: string
  cohort_start: number
  cohort_end: number
  role: 'admin' | 'alumni'
  certificate_id: string
  linkedin_url: string | null
  created_at: string
  last_login_at: string | null
  email_updates: boolean
}
