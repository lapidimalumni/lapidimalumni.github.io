import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { TurnstileWidget } from '../components/features/TurnstileWidget'
import { submitContactForm } from '../lib/api'

export function Home() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [contactError, setContactError] = useState('')
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const submissionCount = useRef(0)

  const stats = [
    {
      value: '18',
      labelKey: 'home.stats.years' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      value: '150+',
      labelKey: 'home.stats.alumni' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ]

  const values = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      titleKey: 'home.values.excellence' as const,
      descKey: 'home.values.excellence.desc' as const,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      titleKey: 'home.values.connection' as const,
      descKey: 'home.values.connection.desc' as const,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      titleKey: 'home.values.innovation' as const,
      descKey: 'home.values.innovation.desc' as const,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      titleKey: 'home.values.mentorship' as const,
      descKey: 'home.values.mentorship.desc' as const,
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (showCaptcha && !turnstileToken) {
      setContactError(t('home.contact.captchaRequired'))
      setContactStatus('error')
      return
    }

    setContactStatus('sending')
    setContactError('')

    const result = await submitContactForm({
      ...formData,
      turnstile_token: turnstileToken || undefined,
    })

    if (result.error) {
      setContactStatus('error')
      setContactError(result.error)
      return
    }

    if (result.data?.captcha_required) {
      setShowCaptcha(true)
      setContactStatus('idle')
      return
    }

    submissionCount.current += 1
    if (submissionCount.current >= 2) {
      setShowCaptcha(true)
    }

    setContactStatus('success')
    setFormData({ name: '', email: '', message: '' })
    setTurnstileToken(null)
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?w=1920&h=1080&fit=crop"
            alt="Technion Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/80"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
              {t('home.hero.badge')}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {t('home.hero.title1')}{' '}
              <span className="text-amber-400 font-serif italic">{t('home.hero.title2')}</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
              {t('home.hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {t('home.hero.cta')}
                <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/30 px-8 py-4 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                {t('home.hero.login')}
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-8 max-w-md">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-amber-400 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/60 tracking-wider">
                  {t(stat.labelKey)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-8 h-12 border-2 border-amber-400/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-amber-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop"
                alt="Alumni networking"
                className="rounded-xl shadow-2xl w-full"
              />
            </div>

            <div>
              <span className="text-amber-600 font-semibold tracking-wider text-sm uppercase">
                {t('home.mission.label')}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mt-4 mb-6 leading-tight">
                {t('home.mission.title1')}<br />{t('home.mission.title2')}
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                {t('home.mission.text')}
              </p>

              <div className="grid grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 flex-shrink-0">
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{t(value.titleKey)}</h3>
                      <p className="text-sm text-slate-500">{t(value.descKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-semibold tracking-wider text-sm uppercase">
              {t('home.contact.label')}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mt-4 mb-4">
              {t('home.contact.title')}
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              {t('home.contact.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Contact Info */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">{t('home.contact.info')}</h3>

              <div className="space-y-6">
                <a href="mailto:lapidim.alumni@gmail.com" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{t('home.contact.email')}</div>
                    <div className="text-slate-500 group-hover:text-amber-600 transition-colors">lapidim.alumni@gmail.com</div>
                  </div>
                </a>

                <a href="https://www.linkedin.com/company/lapidim-program-alumni/" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{t('home.contact.linkedin')}</div>
                    <div className="text-slate-500 group-hover:text-amber-600 transition-colors">{t('home.contact.linkedinGroup')}</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">{t('home.contact.form')}</h3>

              {contactStatus === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-emerald-800 mb-1">{t('home.contact.success')}</h4>
                  <p className="text-sm text-emerald-600">{t('home.contact.success.text')}</p>
                  <button
                    onClick={() => setContactStatus('idle')}
                    className="mt-4 text-sm text-emerald-700 underline hover:no-underline"
                  >
                    {t('home.contact.sendAnother')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
                      {t('home.contact.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('home.contact.namePlaceholder')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-900 mb-2">
                      {t('login.email')}
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('home.contact.emailPlaceholder')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-900 mb-2">
                      {t('home.contact.message')}
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t('home.contact.messagePlaceholder')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                      required
                    ></textarea>
                  </div>

                  {showCaptcha && (
                    <TurnstileWidget onVerify={setTurnstileToken} />
                  )}

                  {contactStatus === 'error' && contactError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600">{contactError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={contactStatus === 'sending'}
                    className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-60"
                  >
                    {contactStatus === 'sending' ? t('common.loading') : t('home.contact.send')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
