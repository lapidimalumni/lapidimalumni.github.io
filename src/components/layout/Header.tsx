import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { LanguageToggle } from '../ui/LanguageToggle'

export function Header() {
  const { t } = useLanguage()
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    ...(isAuthenticated ? [{ path: '/spotlight', label: t('nav.spotlight') }] : []),
  ]

  const isActive = (path: string) => location.pathname === path
  const isHomePage = location.pathname === '/'

  const headerBg = isHomePage && !isScrolled
    ? 'bg-transparent'
    : 'bg-slate-900/95 backdrop-blur-sm shadow-lg'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/lapidim-logo.jpeg"
              alt="Lapidim Logo"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <span className="font-semibold text-xl text-white">
              Lapidim Program Alumni
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-amber-400'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/members"
                className={`text-sm font-medium transition-colors ${
                  isActive('/members')
                    ? 'text-amber-400'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {t('nav.members')}
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <LanguageToggle />

            {/* Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="hidden md:block text-sm font-medium text-white/80 hover:text-white"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden md:block text-sm font-medium text-white bg-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('nav.login')}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-amber-400'
                      : 'text-white/80'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/members"
                    className="text-sm font-medium text-white/80"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.members')}
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-sm font-medium text-white/80 text-start"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-medium text-amber-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
