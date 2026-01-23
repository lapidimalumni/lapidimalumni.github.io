import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { verifyCertificate, formatCertificateDate } from '../utils/certificate'

export function CertificateVerify() {
  const { certId } = useParams<{ certId: string }>()
  const { language } = useLanguage()

  const certificate = certId ? verifyCertificate(certId) : null

  if (!certificate) {
    return (
      <div>
        {/* Hero Section */}
        <section className="bg-slate-900 pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-8">
              Verification Failed
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 max-w-3xl">
              Invalid Certificate
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
              The certificate ID provided could not be verified in our system.
            </p>
          </div>
        </section>

        <section className="py-20 bg-stone-50">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif text-slate-900 mb-4">Certificate Not Found</h2>
              <p className="text-slate-500 mb-8">
                This certificate ID is not registered in our alumni database. Please check the ID and try again.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const holderName = language === 'he' ? certificate.holderNameHe : certificate.holderName
  const formattedDate = formatCertificateDate(certificate.issueDate, language)

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-slate-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Verified Certificate
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 max-w-3xl">
            Certificate Verification
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            This certificate has been verified as authentic and issued by the Lapidim Excellence Program.
          </p>
        </div>
      </section>

      {/* Certificate Details */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-center">
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif text-white mb-2">
                Lapidim Excellence Program
              </h2>
              <p className="text-white/60 text-sm">
                Certificate of Completion
              </p>
            </div>

            {/* Details */}
            <div className="p-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-slate-500">Certificate Holder</span>
                  <span className="font-semibold text-slate-900 text-lg">{holderName}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-slate-500">Cohort Year</span>
                  <span className="font-semibold text-slate-900">{certificate.cohortYear}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-slate-500">Issue Date</span>
                  <span className="font-semibold text-slate-900">{formattedDate}</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-slate-500">Certificate ID</span>
                  <span className="font-mono text-sm text-slate-700 bg-slate-100 px-3 py-1 rounded">
                    {certificate.certId}
                  </span>
                </div>
              </div>

              {/* Verification Badge */}
              <div className="mt-8 p-4 bg-emerald-50 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-emerald-800">Authenticity Verified</div>
                  <p className="text-sm text-emerald-600">
                    This certificate is valid and issued by Technion's Lapidim Program.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">L</span>
                  </div>
                  <span className="font-semibold text-slate-900">Lapidim Alumni Network</span>
                </div>
                <p className="text-xs text-slate-500">
                  Technion – Israel Institute of Technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
