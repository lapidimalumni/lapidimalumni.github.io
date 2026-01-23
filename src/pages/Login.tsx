import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'

export function Login() {
  const { isAuthenticated, loginWithToken, checkEmail, login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [foundUser, setFoundUser] = useState<{ name: string; token: string } | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      const success = loginWithToken(token)
      if (success) {
        navigate('/members', { replace: true })
      }
    }
  }, [searchParams, loginWithToken, navigate])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/members', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const user = checkEmail(email)
    if (user) {
      setStatus('success')
      setFoundUser({
        name: user.name,
        token: btoa(user.email),
      })
    } else {
      setStatus('error')
      setFoundUser(null)
    }
  }

  const handleDemoLogin = () => {
    if (foundUser) {
      login(atob(foundUser.token))
      navigate('/members')
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-slate-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            {t('login.badge')}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 max-w-3xl">
            {t('login.title')}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            {t('login.subtitle')}
          </p>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            {/* Icon */}
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
                    setStatus('idle')
                  }}
                  placeholder={t('login.email.placeholder')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                {t('login.submit')}
              </button>
            </form>

            {/* Success State */}
            {status === 'success' && foundUser && (
              <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-700 mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{t('login.success')}</span>
                </div>
                <p className="text-sm text-emerald-600 mb-4">
                  {t('login.success.check')}
                </p>
                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                  <p className="text-xs text-slate-500 mb-2">{t('login.demo')}</p>
                  <button
                    onClick={handleDemoLogin}
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {t('login.demo.loginAs')} {foundUser.name}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{t('login.error')}</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  {t('login.error.text')}
                </p>
              </div>
            )}

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-slate-400 text-center mb-3">{t('login.demoAccounts')}</p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setEmail('test@lapidim.technion.ac.il')}
                  className="text-xs text-slate-500 hover:text-amber-600 transition-colors"
                >
                  test@lapidim.technion.ac.il
                </button>
                <button
                  type="button"
                  onClick={() => setEmail('alumni@example.com')}
                  className="text-xs text-slate-500 hover:text-amber-600 transition-colors"
                >
                  alumni@example.com
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
