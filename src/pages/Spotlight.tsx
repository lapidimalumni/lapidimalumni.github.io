import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

export function Spotlight() {
  const { t } = useLanguage()

  // Placeholder for future alumni profiles
  const featuredAlumni: {
    id: string
    name: string
    classYear: number
    role: string
    company: string
    achievement: string
    description: string
    photo: string
    linkedin: string
  }[] = []

  const moreAlumni: {
    id: string
    name: string
    role: string
    company: string
    achievement: string
    photo: string
  }[] = []

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-slate-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            {t('spotlight.badge')}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 max-w-3xl">
            {t('spotlight.title')}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            {t('spotlight.subtitle')}
          </p>
        </div>
      </section>

      {/* CTA Section - Submit Your Story */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-600 mb-6">
            {t('spotlight.cta')}
          </p>
          <Link
            to="#"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {t('spotlight.submit')}
          </Link>
        </div>
      </section>

      {/* Featured Alumni Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-amber-600 font-semibold tracking-wider text-sm uppercase">
              {t('spotlight.featured.label')}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mt-4 mb-4">
              {t('spotlight.featured.title')}
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              {t('spotlight.featured.subtitle')}
            </p>
          </div>

          {/* Featured Alumni Cards - Empty state with placeholder */}
          {featuredAlumni.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAlumni.map((alumni) => (
                <div key={alumni.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-stone-100">
                  {/* Image with overlay */}
                  <div className="relative h-72">
                    <img
                      src={alumni.photo}
                      alt={alumni.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="text-amber-400 text-sm font-medium mb-1">
                        {t('spotlight.classOf')} {alumni.classYear}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {alumni.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="text-slate-900 font-medium">{alumni.role}</span>
                      <span className="text-slate-400"> @ </span>
                      <span className="text-amber-600 font-medium">{alumni.company}</span>
                    </div>

                    <p className="text-amber-600 font-medium mb-3">
                      {alumni.achievement}
                    </p>

                    <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                      {alumni.description}
                    </p>

                    <a
                      href={alumni.linkedin}
                      className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      {t('spotlight.viewLinkedIn')}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Placeholder Card */}
              <div className="bg-stone-50 rounded-xl overflow-hidden border-2 border-dashed border-stone-200">
                <div className="relative h-72 bg-stone-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-sm text-stone-500">Your story here</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-4 bg-stone-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-stone-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-stone-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-stone-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* More Success Stories Section */}
      {moreAlumni.length > 0 && (
        <section className="py-16 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-serif text-slate-900 text-center mb-10">
              {t('spotlight.more')}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {moreAlumni.map((alumni) => (
                <div
                  key={alumni.id}
                  className="flex items-center gap-4 bg-white rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <img
                    src={alumni.photo}
                    alt={alumni.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{alumni.name}</h3>
                    <p className="text-sm text-slate-500 truncate">
                      {alumni.role} <span className="text-amber-600">@ {alumni.company}</span>
                    </p>
                    <p className="text-xs text-amber-600 mt-1 truncate">{alumni.achievement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
