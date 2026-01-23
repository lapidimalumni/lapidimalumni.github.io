export interface MockUser {
  id: string
  email: string
  name: string
  nameHe: string
  cohortYear: number
  certId: string
  certIssueDate: string
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'test@lapidim.technion.ac.il',
    name: 'Yael Cohen',
    nameHe: 'יעל כהן',
    cohortYear: 2018,
    certId: 'LAPD-2018-2023-0001',
    certIssueDate: '2023-06-15',
  },
  {
    id: '2',
    email: 'alumni@example.com',
    name: 'David Levi',
    nameHe: 'דוד לוי',
    cohortYear: 2020,
    certId: 'LAPD-2020-2024-0042',
    certIssueDate: '2024-06-20',
  },
  {
    id: '3',
    email: 'demo@lapidim.org',
    name: 'Noa Shapira',
    nameHe: 'נועה שפירא',
    cohortYear: 2019,
    certId: 'LAPD-2019-2023-0015',
    certIssueDate: '2023-06-15',
  },
]
