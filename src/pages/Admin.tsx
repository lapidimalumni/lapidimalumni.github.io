import { useState, useEffect, FormEvent } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useAuth } from '../hooks/useAuth'
import { adminAction } from '../lib/api'
import { User } from '../types/user'

const SESSION_KEY = 'session_token'

interface AlumniWithMeta extends User {
  last_login_at: string | null
  email_updates: boolean
}

export function Admin() {
  const { language, t } = useLanguage()
  const { user } = useAuth()
  const [alumni, setAlumni] = useState<AlumniWithMeta[]>([])
  const [stats, setStats] = useState<{ total: number; admins: number; ever_logged_in: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'stats'>('list')
  const [removeStatus, setRemoveStatus] = useState<string | null>(null)

  // Add alumni form state
  const [addForm, setAddForm] = useState({
    email: '',
    full_name_en: '',
    full_name_he: '',
    cohort_start: new Date().getFullYear(),
    role: 'alumni' as 'admin' | 'alumni',
    linkedin_url: '',
  })
  const [addStatus, setAddStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [addError, setAddError] = useState('')

  const sessionToken = localStorage.getItem(SESSION_KEY) || ''

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const [alumniResult, statsResult] = await Promise.all([
      adminAction(sessionToken, 'list-alumni'),
      adminAction(sessionToken, 'stats'),
    ])
    if (alumniResult.data) {
      setAlumni((alumniResult.data as { alumni: AlumniWithMeta[] }).alumni || [])
    }
    if (statsResult.data) {
      setStats(statsResult.data as { total: number; admins: number; ever_logged_in: number })
    }
    setIsLoading(false)
  }

  const handleAddAlumni = async (e: FormEvent) => {
    e.preventDefault()
    setAddStatus('saving')
    setAddError('')

    const result = await adminAction(sessionToken, 'add-alumni', {
      alumni: {
        ...addForm,
        linkedin_url: addForm.linkedin_url || null,
      },
    })

    if (result.error) {
      setAddStatus('error')
      setAddError(result.error)
      return
    }

    setAddStatus('success')
    setAddForm({
      email: '',
      full_name_en: '',
      full_name_he: '',
      cohort_start: new Date().getFullYear(),
      role: 'alumni',
      linkedin_url: '',
    })
    loadData()
  }

  const handleRemoveAlumni = async (email: string) => {
    if (!confirm(t('admin.removeConfirm'))) return

    setRemoveStatus(null)
    const result = await adminAction(sessionToken, 'remove-alumni', { email })
    if (result.error) {
      setRemoveStatus(result.error)
      return
    }
    setRemoveStatus(t('admin.removeSuccess'))
    loadData()
  }

  const formatLastLogin = (dateString: string | null) => {
    if (!dateString) return t('admin.table.never')
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-slate-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            {t('admin.badge')}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 max-w-3xl">
            {t('admin.title')}
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            {t('admin.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {(['list', 'add', 'stats'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t(`admin.tab.${tab}`)}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <p className="text-slate-500">{t('common.loading')}</p>
            </div>
          ) : (
            <>
              {/* Alumni List */}
              {activeTab === 'list' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {removeStatus && (
                    <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-200">
                      <p className="text-sm text-emerald-700">{removeStatus}</p>
                    </div>
                  )}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b">
                        <tr>
                          <th className="text-start px-4 py-3 font-medium text-slate-600">{t('admin.table.name')}</th>
                          <th className="text-start px-4 py-3 font-medium text-slate-600">{t('admin.table.email')}</th>
                          <th className="text-start px-4 py-3 font-medium text-slate-600">{t('admin.table.cohort')}</th>
                          <th className="text-start px-4 py-3 font-medium text-slate-600">{t('admin.table.certId')}</th>
                          <th className="text-start px-4 py-3 font-medium text-slate-600">{t('admin.table.role')}</th>
                          <th className="text-start px-4 py-3 font-medium text-slate-600">{t('admin.table.lastLogin')}</th>
                          <th className="text-start px-4 py-3 font-medium text-slate-600">{t('admin.table.emailUpdates')}</th>
                          <th className="text-start px-4 py-3 font-medium text-slate-600">{t('admin.table.actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {alumni.map(a => (
                          <tr key={a.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-900">{a.full_name_en}</td>
                            <td className="px-4 py-3 text-slate-500">{a.email}</td>
                            <td className="px-4 py-3 text-slate-500">{a.cohort_start}</td>
                            <td className="px-4 py-3 font-mono text-xs text-slate-500">{a.certificate_id}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                a.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {a.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500 text-xs">{formatLastLogin(a.last_login_at)}</td>
                            <td className="px-4 py-3 text-center">
                              {a.email_updates ? (
                                <span className="inline-flex w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full items-center justify-center">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </span>
                              ) : (
                                <span className="inline-flex w-5 h-5 bg-slate-100 text-slate-400 rounded-full items-center justify-center">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleRemoveAlumni(a.email)}
                                className="text-xs text-red-500 hover:text-red-700 font-medium"
                              >
                                {t('admin.removeAlumni')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {alumni.length === 0 && (
                    <div className="p-8 text-center text-slate-500">{t('admin.noAlumni')}</div>
                  )}
                </div>
              )}

              {/* Add Alumni */}
              {activeTab === 'add' && (
                <div className="bg-white rounded-xl p-8 shadow-sm max-w-2xl">
                  <h2 className="text-xl font-serif text-slate-900 mb-6">{t('admin.addAlumni')}</h2>

                  {addStatus === 'success' && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <p className="text-sm text-emerald-700 font-medium">{t('admin.addSuccess')}</p>
                    </div>
                  )}

                  {addStatus === 'error' && addError && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-600">{addError}</p>
                    </div>
                  )}

                  <form onSubmit={handleAddAlumni} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1">{t('admin.form.nameEn')}</label>
                        <input
                          type="text"
                          value={addForm.full_name_en}
                          onChange={e => setAddForm({ ...addForm, full_name_en: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1">{t('admin.form.nameHe')}</label>
                        <input
                          type="text"
                          value={addForm.full_name_he}
                          onChange={e => setAddForm({ ...addForm, full_name_he: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                          dir="rtl"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-1">{t('login.email')}</label>
                      <input
                        type="email"
                        value={addForm.email}
                        onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-1">{t('admin.form.cohortYear')}</label>
                      <input
                        type="number"
                        value={addForm.cohort_start}
                        onChange={e => setAddForm({ ...addForm, cohort_start: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                        min={2000}
                        max={2099}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-1">{t('admin.form.linkedin')}</label>
                      <input
                        type="url"
                        value={addForm.linkedin_url}
                        onChange={e => setAddForm({ ...addForm, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-1">{t('admin.form.role')}</label>
                      <select
                        value={addForm.role}
                        onChange={e => setAddForm({ ...addForm, role: e.target.value as 'admin' | 'alumni' })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                      >
                        <option value="alumni">Alumni</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={addStatus === 'saving'}
                      className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors text-sm disabled:opacity-60"
                    >
                      {addStatus === 'saving' ? t('common.loading') : t('admin.form.submit')}
                    </button>
                  </form>
                </div>
              )}

              {/* Stats */}
              {activeTab === 'stats' && stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stats.total}</div>
                    <div className="text-sm text-slate-500">{t('admin.stats.totalAlumni')}</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stats.admins}</div>
                    <div className="text-sm text-slate-500">{t('admin.stats.admins')}</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stats.ever_logged_in}</div>
                    <div className="text-sm text-slate-500">{t('admin.stats.everLoggedIn')}</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl font-bold text-slate-900 mb-1">{user?.full_name_en}</div>
                    <div className="text-sm text-slate-500">{t('admin.stats.loggedInAs')}</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
