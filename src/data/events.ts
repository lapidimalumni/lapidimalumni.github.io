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
    title: 'Annual Alumni Gathering 2026',
    titleHe: 'מפגש בוגרים שנתי 2026',
    description: 'Join us for our biggest event of the year! Network with fellow alumni, hear inspiring talks from industry leaders, and celebrate our community.',
    descriptionHe: 'הצטרפו אלינו לאירוע הגדול ביותר שלנו בשנה! נטוורקינג עם בוגרים אחרים, הרצאות מעוררות השראה ממנהיגי תעשייה וחגיגת הקהילה שלנו.',
    date: '2026-03-15',
    time: '18:00',
    location: 'Technion Churchill Auditorium',
    locationHe: 'אודיטוריום צ\'רצ\'יל, טכניון',
    type: 'upcoming',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    registrationLink: 'https://www.linkedin.com/events/7420587270832930817?viewAsMember=true',
  },
  {
    id: '2',
    title: 'Tech Leadership Workshop',
    titleHe: 'סדנת מנהיגות טכנולוגית',
    description: 'An interactive workshop on transitioning from IC to management roles, led by Lapidim alumni who made the switch.',
    descriptionHe: 'סדנה אינטראקטיבית על מעבר מתפקידי מומחה לתפקידי ניהול, בהנחיית בוגרי לפידים שעשו את המעבר.',
    date: '2025-11-20',
    time: '17:00',
    location: 'Google Campus Tel Aviv',
    locationHe: 'קמפוס גוגל תל אביב',
    type: 'past',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Startup Founders Panel',
    titleHe: 'פאנל מייסדי סטארטאפים',
    description: 'Hear from Lapidim alumni who founded successful startups about their journey from idea to scale.',
    descriptionHe: 'שמעו מבוגרי לפידים שהקימו סטארטאפים מצליחים על המסע שלהם מרעיון לגדילה.',
    date: '2025-09-10',
    time: '19:00',
    location: 'WeWork Sarona',
    locationHe: 'WeWork שרונה',
    type: 'past',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'Summer Networking BBQ',
    titleHe: 'BBQ נטוורקינג קיץ',
    description: 'A casual summer meetup with great food, drinks, and company. Bring your family!',
    descriptionHe: 'מפגש קיץ לא פורמלי עם אוכל מעולה, שתייה וחברה נהדרת. הביאו את המשפחה!',
    date: '2025-07-25',
    time: '18:30',
    location: 'Technion Faculty Club',
    locationHe: 'מועדון הסגל, טכניון',
    type: 'past',
    image: 'https://images.unsplash.com/photo-1529543544277-740ef2a4dea4?w=800&h=400&fit=crop',
  },
]
