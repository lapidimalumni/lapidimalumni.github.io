export interface Event {
  id: string
  title: string
  titleHe: string
  description: string
  descriptionHe: string
  date: string
  time: string
  location: string
  locationHe: string
  type: 'upcoming' | 'past'
  image: string
  registrationLink?: string
}

export const events: Event[] = [
  {
    id: '1',
    title: 'First Lapidim Alumni Conference',
    titleHe: 'כנס בוגרי לפידים הראשון',
    description: 'Join us for the first Lapidim Program alumni conference, at the Taub Building, Technion.',
    descriptionHe: 'הצטרפו אלינו לכנס הראשון של בוגרי תוכנית לפידים, בבניין טאוב בטכניון.',
    date: '2026-10-29',
    time: '18:00 - 21:00',
    location: 'Taub Building, Technion',
    locationHe: 'בניין טאוב, טכניון',
    type: 'upcoming',
    image: '/images/events/alumni-gathering-2026.jpg',
    registrationLink: '#',
  },
]
