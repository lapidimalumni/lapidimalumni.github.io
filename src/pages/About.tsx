import { useLanguage } from '../hooks/useLanguage'

export function About() {
  const { t, language } = useLanguage()

  const benefits = [
    t('about.benefits.tuition'),
    t('about.benefits.stipend'),
    t('about.benefits.workspace'),
    t('about.benefits.mentoring'),
    t('about.benefits.exposure'),
    t('about.benefits.events'),
  ]

  const selectionCriteria = [
    { titleKey: 'about.selection.academic' as const, descKey: 'about.selection.academic.desc' as const },
    { titleKey: 'about.selection.leadership' as const, descKey: 'about.selection.leadership.desc' as const },
    { titleKey: 'about.selection.interpersonal' as const, descKey: 'about.selection.interpersonal.desc' as const },
    { titleKey: 'about.selection.entrepreneurial' as const, descKey: 'about.selection.entrepreneurial.desc' as const },
  ]

  const alumniMission = [
    {
      titleKey: 'about.network.foster' as const,
      descKey: 'about.network.foster.desc' as const,
    },
    {
      titleKey: 'about.network.support' as const,
      descKey: 'about.network.support.desc' as const,
    },
    {
      titleKey: 'about.network.give' as const,
      descKey: 'about.network.give.desc' as const,
    },
    {
      titleKey: 'about.network.celebrate' as const,
      descKey: 'about.network.celebrate.desc' as const,
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-slate-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            {t('about.badge')}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 max-w-3xl">
            {t('about.title')}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* What is Lapidim Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Content */}
            <div>
              {/* Icon */}
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>

              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                {t('about.what.title')}
              </h2>

              <p className="text-slate-600 mb-4 leading-relaxed">
                {t('about.what.p1')}
              </p>

              <p className="text-slate-600 mb-8 leading-relaxed">
                {t('about.what.p2')}
              </p>

              {/* Benefits List */}
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Card - Selection Criteria */}
            <div className="bg-amber-50 rounded-2xl p-8">
              {/* Icon */}
              <div className="text-amber-600 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>

              <h3 className="text-2xl font-serif text-slate-900 mb-4">
                {t('about.selection.title')}
              </h3>

              <p className="text-slate-600 mb-6">
                {t('about.selection.subtitle')}
              </p>

              <ul className="space-y-4">
                {selectionCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <div className="font-semibold text-slate-900">{t(criteria.titleKey)}</div>
                      <div className="text-sm text-slate-500">{t(criteria.descKey)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Network Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-semibold tracking-wider text-sm uppercase">
              {t('about.network.label')}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mt-4 mb-4">
              {t('about.network.title')}
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              {t('about.network.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {alumniMission.map((item, index) => (
              <div key={index} className="bg-stone-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-amber-400 mb-4">
                  <span className="text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{t(item.titleKey)}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-white mb-6">
            {t('about.cta')}
          </h2>
          <a
            href={language === 'he' ? 'https://lapidim.cs.technion.ac.il/he/' : 'https://lapidim.cs.technion.ac.il/'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
          >
            {t('about.cta.button')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  )
}
