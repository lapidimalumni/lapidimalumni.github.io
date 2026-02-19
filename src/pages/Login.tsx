import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'

export function Login() {
  const { isAuthenticated, isLoading, sendMagicLink, verifyToken } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'verifying' | 'error' | 'expired'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (token && !isLoading) {
      setStatus('verifying')
      verifyToken(token).then(result => {
        if (result.error) {
          setStatus('expired')
          setErrorMessage(result.error)
        } else {
          navigate('/members', { replace: true })
        }
      })
    }
  }, [searchParams, isLoading, verifyToken, navigate])

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/members', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    const result = await sendMagicLink(email)
    if (result.error) {
      setStatus('error')
      setErrorMessage(result.error)
    } else {
      setStatus('sent')
    }
  }

  if (status === 'verifying') {
    return (
      <div>
        <section className="bg-slate-900 pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {t('login.verifying')}
            </h1>
            <p className="text-lg text-white/70">{t('common.loading')}</p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-slate-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            {t('login.badge')}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 max-w-3xl">
            {t('login.title')}
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            {t('login.subtitle')}
          </p>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-amber-400 font-bold text-2xl">L</span>
            </div>

            <h2 className="text-2xl font-serif text-slate-900 text-center mb-2">
              {t('login.welcome')}
            </h2>
            <p className="text-slate-500 text-center mb-8">
              {t('login.instruction')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                  {t('login.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status !== 'idle' && status !== 'sending') setStatus('idle')
                  }}
                  placeholder={t('login.email.placeholder')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                  required
                  disabled={status === 'sending'}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending' || status === 'sent'}
                className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60"
              >
                {status === 'sending' ? t('common.loading') : t('login.submit')}
              </button>
            </form>

            {/* Sent State — always show generic message */}
            {status === 'sent' && (
              <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-700 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{t('login.magicLinkSent')}</span>
                </div>
                <p className="text-sm text-emerald-600">
                  {t('login.magicLinkSent.check')}
                </p>
              </div>
            )}

            {/* Expired Link State */}
            {status === 'expired' && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{t('login.linkExpired')}</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  {t('login.linkExpired.text')}
                </p>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{t('common.error')}</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
