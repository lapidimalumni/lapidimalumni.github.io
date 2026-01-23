import { mockUsers, MockUser } from '../data/mockUsers'

export interface CertificateData {
  certId: string
  holderName: string
  holderNameHe: string
  cohortYear: number
  issueDate: string
  isValid: boolean
}

export function verifyCertificate(certId: string): CertificateData | null {
  const user = mockUsers.find(u => u.certId === certId)

  if (!user) {
    return null
  }

  return {
    certId: user.certId,
    holderName: user.name,
    holderNameHe: user.nameHe,
    cohortYear: user.cohortYear,
    issueDate: user.certIssueDate,
    isValid: true,
  }
}

export function generateLinkedInCertUrl(user: MockUser, domain: string): string {
  const issueDate = new Date(user.certIssueDate)
  // Get base path from Vite config (set during build)
  const basePath = import.meta.env.BASE_URL || '/'
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: 'Lapidim Excellence Program Alumni',
    organizationName: 'Lapidim Alumni - Technion',
    certId: user.certId,
    certUrl: `https://${domain}${basePath}#/verify/${user.certId}`,
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
