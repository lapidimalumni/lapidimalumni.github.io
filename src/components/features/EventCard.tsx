import { useLanguage } from '../../hooks/useLanguage'
import { Card, CardContent, CardFooter } from '../ui/Card'
import { Button } from '../ui/Button'
import { Event } from '../../data/events'

interface EventCardProps {
  event: Event
  showRegistration?: boolean
}

export function EventCard({ event, showRegistration = false }: EventCardProps) {
  const { language, t } = useLanguage()

  const title = language === 'he' ? event.titleHe : event.title
  const description = language === 'he' ? event.descriptionHe : event.description
  const location = language === 'he' ? event.locationHe : event.location

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const isPast = event.type === 'past'

  return (
    <Card hover className={isPast ? 'opacity-75' : ''}>
      <img
        className="h-48 w-full object-cover"
        src={event.image}
        alt={title}
      />
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          {isPast ? (
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {t('members.events.past')}
            </span>
          ) : (
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
              Upcoming
            </span>
          )}
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{location}</span>
          </div>
        </div>
      </CardContent>

      {showRegistration && !isPast && event.registrationLink && (
        <CardFooter>
          <Button variant="primary" size="sm" className="w-full">
            {t('members.events.register')}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
