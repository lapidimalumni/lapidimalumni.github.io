import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Spotlight } from './pages/Spotlight'
import { Login } from './pages/Login'
import { Members } from './pages/Members'
import { CertificateVerify } from './pages/CertificateVerify'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/spotlight" element={<Spotlight />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/members" element={<Members />} />
        <Route path="/verify/:certId" element={<CertificateVerify />} />
      </Routes>
    </Layout>
  )
}

export default App
