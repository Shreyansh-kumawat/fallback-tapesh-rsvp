import { Routes, Route, Navigate } from 'react-router-dom'
import RSVPForm from './pages/RSVPForm.jsx'
import ThankYou from './pages/ThankYou.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RSVPForm />} />
      <Route path="/thankyou" element={<ThankYou />} />
      <Route path="/admin" element={<Admin />} />
      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}



