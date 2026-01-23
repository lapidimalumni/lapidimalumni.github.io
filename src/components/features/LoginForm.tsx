import { useState, FormEvent } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useLanguage()
  const { checkEmail, login } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [foundUser, setFoundUser] = useState<{ name: string; token: string } | null>(null)

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
      onSuccess()
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
            required
          />
        </div>

        <Button type="submit" variant="primary" className="w-full">
          {t('login.submit')}
        </Button>
      </form>

      {status === 'success' && foundUser && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm mb-3">{t('login.success')}</p>
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <p className="text-sm text-gray-600 mb-2">{t('login.demo')}</p>
            <button
              onClick={handleDemoLogin}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              {t('login.demo.link')} {foundUser.name}
            </button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{t('login.error')}</p>
        </div>
      )}

      <div className="text-center text-sm text-gray-500">
        <p>Demo accounts:</p>
        <ul className="mt-1 space-y-1">
          <li>test@lapidim.technion.ac.il</li>
          <li>alumni@example.com</li>
        </ul>
      </div>
    </div>
  )
}
