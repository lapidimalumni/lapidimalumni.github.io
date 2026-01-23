import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'

export function Spotlight() {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()

  const featuredAlumni = [
    {
      id: '1',
      name: 'Alex Johnson',
      classYear: 2012,
      role: 'CEO & Co-founder',
      company: 'TechStartup',
      achievement: 'Built a leading enterprise software company',
      description: 'Leading vision and strategy for enterprise software solutions. Previously held senior roles at major tech companies before founding their own venture.',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
      linkedin: '#',
    },
    {
      id: '2',
      name: 'Sarah Miller',
      classYear: 2014,
      role: 'CTO & Co-founder',
      company: 'CloudTech',
      achievement: 'Architected industry-leading cloud platform',
      description: 'Guides the technology vision behind the company\'s cloud infrastructure. Previously Tech Lead at a major tech company.',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop',
      linkedin: '#',
    },
    {
      id: '3',
      name: 'David Chen',
      classYear: 2016,
      role: 'Founder & CEO',
      company: 'AI Ventures',
      achievement: 'Raised $50M Series B for AI startup',
      description: 'Pioneering the use of AI in healthcare. The startup has partnerships with major healthcare providers across Europe and the US.',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop',
      linkedin: '#',
    },
  ]

  const moreAlumni = [
    {
      id: '4',
      name: 'Rachel Green',
      role: 'Co-founder & CTO',
      company: 'SecureTech',
      achievement: 'Acquired by major tech company for $200M',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    },
    {
      id: '5',
      name: 'Michael Ross',
      role: 'VP Engineering',
      company: 'FinTech Pro',
      achievement: 'Leading engineering at unicorn fintech startup',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    },
    {
      id: '6',
      name: 'Emma Wilson',
      role: 'Founder',
      company: 'AutoDrive Labs',
      achievement: 'Pioneering autonomous vehicle technology',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    },
  ]

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

      {/* Featured Alumni Section */}
      <section className="py-20 bg-stone-50">
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

          {/* Featured Alumni Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAlumni.map((alumni) => (
              <div key={alumni.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
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
        </div>
      </section>

      {/* More Success Stories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif text-slate-900 text-center mb-10">
            {t('spotlight.more')}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {moreAlumni.map((alumni) => (
              <div
                key={alumni.id}
                className="flex items-center gap-4 bg-stone-50 rounded-xl p-4 hover:shadow-md transition-shadow"
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

      {/* CTA Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-600 mb-6">
            {t('spotlight.cta')}
          </p>
          <Link
            to={isAuthenticated ? '/members' : '/login'}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {t('spotlight.submit')}
          </Link>
        </div>
      </section>
    </div>
  )
}
