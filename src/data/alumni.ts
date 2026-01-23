export interface Alumni {
  id: string
  name: string
  nameHe: string
  cohortYear: number
  photo: string
  company: string
  role: string
  roleHe: string
  achievement: string
  achievementHe: string
  featured: boolean
  linkedIn?: string
}

export const alumni: Alumni[] = [
  {
    id: '1',
    name: 'Yevgeny Dibrov',
    nameHe: 'יבגני דיברוב',
    cohortYear: 2012,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    company: 'Armis Security',
    role: 'Co-Founder & CEO',
    roleHe: 'מייסד-שותף ומנכ"ל',
    achievement: 'Founded Armis, a leading IoT security company valued at over $3B, protecting enterprise assets worldwide.',
    achievementHe: 'הקים את Armis, חברת אבטחת IoT מובילה בשווי מעל 3 מיליארד דולר, המגנה על נכסים ארגוניים ברחבי העולם.',
    featured: true,
    linkedIn: 'https://linkedin.com/in/yevgenydibrov',
  },
  {
    id: '2',
    name: 'Maya Goldstein',
    nameHe: 'מאיה גולדשטיין',
    cohortYear: 2015,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    company: 'Google',
    role: 'Senior Software Engineer',
    roleHe: 'מהנדסת תוכנה בכירה',
    achievement: 'Leading the development of AI-powered accessibility features reaching millions of users.',
    achievementHe: 'מובילה את פיתוח תכונות נגישות מבוססות AI המגיעות למיליוני משתמשים.',
    featured: true,
    linkedIn: 'https://linkedin.com/in/mayagoldstein',
  },
  {
    id: '3',
    name: 'Oren Tal',
    nameHe: 'אורן טל',
    cohortYear: 2014,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    company: 'Microsoft',
    role: 'Principal Program Manager',
    roleHe: 'מנהל תוכנית ראשי',
    achievement: 'Driving Azure cloud infrastructure innovations used by Fortune 500 companies.',
    achievementHe: 'מוביל חידושים בתשתיות הענן של Azure בשימוש חברות Fortune 500.',
    featured: true,
  },
  {
    id: '4',
    name: 'Tal Barkan',
    nameHe: 'טל ברקן',
    cohortYear: 2017,
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    company: 'Wix',
    role: 'Tech Lead',
    roleHe: 'מובילת טכנולוגיה',
    achievement: 'Architected the new editor platform serving 200M+ websites.',
    achievementHe: 'תכננה את פלטפורמת העורך החדשה המשרתת מעל 200 מיליון אתרים.',
    featured: false,
  },
  {
    id: '5',
    name: 'Amit Rosen',
    nameHe: 'עמית רוזן',
    cohortYear: 2016,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    company: 'Intel',
    role: 'AI Research Scientist',
    roleHe: 'חוקר בינה מלאכותית',
    achievement: 'Published groundbreaking research in neural network optimization.',
    achievementHe: 'פרסם מחקר פורץ דרך באופטימיזציה של רשתות נוירונים.',
    featured: false,
  },
]
