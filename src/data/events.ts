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
    title: 'Alumni Gathering 2026',
    titleHe: 'מפגש בוגרים 2026',
    description: 'Join us for the first Lapidim Program Alumni meetup.',
    descriptionHe: 'הצטרפו אלינו למפגש הראשון של בוגרי תוכנית לפידים.',
    date: '2026-06-01',
    time: '18:00 - 21:00',
    location: 'Taub Building, Technion',
    locationHe: 'בניין טאוב, טכניון',
    type: 'upcoming',
    image: '/images/events/alumni-gathering-2026.jpg',
    registrationLink: '#',
  },
]
