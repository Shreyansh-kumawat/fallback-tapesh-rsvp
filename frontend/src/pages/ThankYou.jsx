import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import bgImg from '../assets/imgs/bigbg-22.png'
import logoImg from '../assets/imgs/logoHD--1.png'
import qrImg from '../assets/imgs/qr.png'
import './ThankYou.css'

const MAPS_LINK = 'https://maps.app.goo.gl/6EnhNqNissXUDHJ59'

export default function ThankYou() {
  const location = useLocation()
  const navigate = useNavigate()
  const { name, attending } = location.state || {}

  useEffect(() => {
    if (!name) navigate('/', { replace: true })
  }, [name, navigate])

  if (!name) return null

  return (
    <div className="ty-page" style={{ backgroundImage: `url(${bgImg})` }}>

      {/* Overlay */}
      <div className="ty-overlay" />

      {/* Floating gold particles */}
      <div className="ty-particles">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="ty-particle"
            style={{
              width:  Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left:   `${Math.random() * 100}%`,
              top:    `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0, 0.5, 0], y: [0, -60, -120] }}
            transition={{
              duration: Math.random() * 6 + 5,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Main card */}
      <div className="ty-wrap">

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <img src={logoImg} alt="Nitin and Margarita" className="ty-logo" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="ty-heading"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {attending ? 'Thank You!' : "We'll Miss You!"}
        </motion.h1>

        {/* Ornament divider */}
        <div className="ty-divider">
          <span className="ty-divider-line" />
          <span className="ty-divider-gem">✦</span>
          <span className="ty-divider-line" />
        </div>

        {/* Message box */}
        <motion.div
          className="ty-msg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {attending ? (
            <>
              <p className="ty-msg-primary">
                <strong>{name}</strong>, your RSVP has been received! 🎉
              </p>
              <p className="ty-msg-secondary">
                We are delighted that you will be joining us on this special day. A warm welcome awaits you! 🌸
              </p>
            </>
          ) : (
            <>
              <p className="ty-msg-primary">
                <strong>{name}</strong>, we have received your response.
              </p>
              <p className="ty-msg-secondary">
                Your love and blessings mean the world to us. You will be truly missed. 🙏
              </p>
            </>
          )}
        </motion.div>

        {/* Attending-only block */}
        {attending && (
          <motion.div
            className="ty-details"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            {/* Date & Venue */}
            <div className="ty-meta">
              <div className="ty-meta-item">
                <span className="ty-meta-label">Date</span>
                <span className="ty-meta-value">25–26 Nov 2026</span>
              </div>
              <div className="ty-meta-sep" />
              <div className="ty-meta-item">
                <span className="ty-meta-label">Venue</span>
                <span className="ty-meta-value">Samode Bagh, Jaipur</span>
              </div>
            </div>

            {/* Maps link */}
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="ty-maps-link">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Samode Bagh, Jaipur — View on Maps
            </a>

            {/* QR Code */}
            <motion.div
              className="ty-qr"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="ty-qr-label">Scan to locate venue</span>
              <div className="ty-qr-frame">
                <img src={qrImg} alt="Venue QR Code" className="ty-qr-img" />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.p
          className="ty-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
        >
          Nitin &amp; Margarita &nbsp;✦&nbsp; 2026
        </motion.p>

      </div>
    </div>
  )
}
