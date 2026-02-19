import { supabase } from './supabase'
import { User } from '../types/user'

export interface CommunityLinks {
  whatsapp: string
  facebook: string
}

interface ApiResponse<T = unknown> {
  data?: T
  error?: string
}

async function invoke<T>(functionName: string, body: Record<string, unknown>): Promise<ApiResponse<T>> {
  const { data, error } = await supabase.functions.invoke(functionName, { body })
  if (error) {
    return { error: error.message || 'An error occurred' }
  }
  return data as ApiResponse<T>
}

export async function sendMagicLink(email: string): Promise<ApiResponse> {
  return invoke('send-magic-link', { email })
}

export async function verifyMagicLink(token: string): Promise<ApiResponse<{ session_token: string; user: User; community_links: CommunityLinks }>> {
  return invoke('verify-magic-link', { token })
}

export async function getSession(sessionToken: string): Promise<ApiResponse<{ user: User; community_links: CommunityLinks }>> {
  return invoke('get-session', { session_token: sessionToken })
}

export async function logoutSession(sessionToken: string): Promise<ApiResponse> {
  return invoke('logout', { session_token: sessionToken })
}

export async function submitContactForm(data: {
  name: string
  email: string
  message: string
  turnstile_token?: string
}): Promise<ApiResponse<{ captcha_required?: boolean }>> {
  return invoke('contact-form', data)
}

export async function verifyCertificateApi(certId: string): Promise<ApiResponse<{
  full_name_en: string
  full_name_he: string
  cohort_start: number
  cohort_end: number
  certificate_id: string
  created_at: string
}>> {
  return invoke('verify-certificate', { cert_id: certId })
}

export async function toggleEmailUpdates(sessionToken: string, emailUpdates: boolean): Promise<ApiResponse> {
  return invoke('get-session', { session_token: sessionToken, action: 'toggle-email-updates', email_updates: emailUpdates })
}

export async function adminAction(
  sessionToken: string,
  action: string,
  payload?: Record<string, unknown>
): Promise<ApiResponse<unknown>> {
  return invoke('admin', { session_token: sessionToken, action, ...payload })
}
