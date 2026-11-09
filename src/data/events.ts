export interface Event {
  id: string
  published: boolean
  recapLink?: string
  title: string
  titleHe: string
  description: string
  descriptionHe: string
  date: string
  time: string
  location: string
  locationHe: string
  image: string
  registrationLink?: string
}

/** Row shape returned by the get-session / admin edge functions. */
export interface EventRow {
  id: string
  title: string
  title_he: string
  description: string
  description_he: string
  event_date: string
  time_text: string
  location: string
  location_he: string
  image: string
  registration_link: string | null
  recap_link: string | null
  published: boolean
}

export function eventFromRow(r: EventRow): Event {
  return {
    id: r.id,
    title: r.title,
    titleHe: r.title_he,
    description: r.description,
    descriptionHe: r.description_he,
    date: r.event_date,
    time: r.time_text,
    location: r.location,
    locationHe: r.location_he,
    image: r.image,
    registrationLink: r.registration_link || undefined,
    recapLink: r.recap_link || undefined,
    published: r.published,
  }
}

/** Today as YYYY-MM-DD in the browser's local time. */
function today(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** An event is upcoming until its date has passed; no manual flipping needed. */
export function isPastEvent(e: Pick<Event, 'date'>): boolean {
  return e.date < today()
}

/** Static copy used only by the local dev-auth bypass (no backend to ask). */
export const devEvents: Event[] = [
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
    published: true,
    image: '/images/events/alumni-gathering-2026.jpg',
    registrationLink: 'https://docs.google.com/forms/d/e/1FAIpQLScPNvzFYVmivM_XkH9T-LFarxrmgXh6Y-Su9vggYaEnVotc8Q/viewform',
  },
]
