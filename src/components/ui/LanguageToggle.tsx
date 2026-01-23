import { useLanguage } from '../../hooks/useLanguage'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
      aria-label={language === 'en' ? 'Switch to Hebrew' : 'החלף לאנגלית'}
    >
      <span className={language === 'en' ? 'text-amber-400 font-bold' : 'text-white/60'}>
        EN
      </span>
      <span className="text-white/30">|</span>
      <span className={language === 'he' ? 'text-amber-400 font-bold' : 'text-white/60'}>
        עב
      </span>
    </button>
  )
}
