import { User } from '../types/user'
import { verifyCertificateApi } from '../lib/api'

export interface CertificateData {
  certId: string
  holderName: string
  holderNameHe: string
  cohortStart: number
  cohortEnd: number
  issueDate: string
  isValid: boolean
}

export async function verifyCertificate(certId: string): Promise<CertificateData | null> {
  const result = await verifyCertificateApi(certId)

  if (result.error || !result.data) {
    return null
  }

  const d = result.data
  return {
    certId: d.certificate_id,
    holderName: d.full_name_en,
    holderNameHe: d.full_name_he,
    cohortStart: d.cohort_start,
    cohortEnd: d.cohort_end,
    issueDate: d.created_at,
    isValid: true,
  }
}

export function generateLinkedInCertUrl(user: User, domain: string): string {
  const issueDate = new Date(user.created_at)
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: 'Lapidim Excellence Program Alumni',
    organizationName: 'Lapidim Program Alumni',
    certId: user.certificate_id,
    certUrl: `https://${domain}/verify/${user.certificate_id}`,
    issueMonth: String(issueDate.getMonth() + 1),
    issueYear: String(issueDate.getFullYear()),
  })

  return `https://www.linkedin.com/profile/add?${params.toString()}`
}

export function formatCertificateDate(dateString: string, language: 'en' | 'he'): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
