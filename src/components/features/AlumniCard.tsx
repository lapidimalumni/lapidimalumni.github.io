import { useLanguage } from '../../hooks/useLanguage'
import { Card, CardContent } from '../ui/Card'
import { Alumni } from '../../data/alumni'

interface AlumniCardProps {
  alumni: Alumni
  featured?: boolean
}

export function AlumniCard({ alumni, featured = false }: AlumniCardProps) {
  const { language, t } = useLanguage()

  const name = language === 'he' ? alumni.nameHe : alumni.name
  const role = language === 'he' ? alumni.roleHe : alumni.role
  const achievement = language === 'he' ? alumni.achievementHe : alumni.achievement

  if (featured) {
    return (
      <Card className="md:flex" hover>
        <div className="md:flex-shrink-0">
          <img
            className="h-48 w-full object-cover md:h-full md:w-48"
            src={alumni.photo}
            alt={name}
          />
        </div>
        <CardContent className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{name}</h3>
              <p className="text-primary-600 font-medium">{role}</p>
              <p className="text-sm text-gray-500">{alumni.company}</p>
            </div>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
              {t('spotlight.cohort')} {alumni.cohortYear}
            </span>
          </div>
          <p className="text-gray-600 mt-4">{achievement}</p>
          {alumni.linkedIn && (
            <a
              href={alumni.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </a>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card hover>
      <img
        className="h-48 w-full object-cover"
        src={alumni.photo}
        alt={name}
      />
      <CardContent>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-primary-600">{role}</p>
            <p className="text-xs text-gray-500">{alumni.company}</p>
          </div>
          <span className="text-xs text-gray-400">
            {alumni.cohortYear}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-3 line-clamp-3">{achievement}</p>
      </CardContent>
    </Card>
  )
}
