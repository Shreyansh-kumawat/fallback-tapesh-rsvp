import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useRef, useCallback } from 'react'
import logoImg from '../assets/imgs/logoHD--1.png'
import qrImg   from '../assets/imgs/qr.png'
import './ThankYou.css'

const MAPS_LINK = 'https://maps.app.goo.gl/6EnhNqNissXUDHJ59'

/* ── Same animated SVG background as RSVPForm ────────── */
function useSvgPlayPause(svgRef) {
  const timerRef = useRef(null)
  const play = useCallback(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.unpauseAnimations()
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => svg.pauseAnimations(), 1000)
  }, [svgRef])

  useEffect(() => {
    const svg = svgRef.current
    if (svg) svg.pauseAnimations()
    const events = ['click', 'keydown', 'input', 'change', 'scroll', 'touchstart']
    events.forEach(ev => document.addEventListener(ev, play, { passive: true }))
    return () => {
      events.forEach(ev => document.removeEventListener(ev, play))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [play, svgRef])
}

/* ── Warm-toned SVG background — matches RSVPForm palette ── */
function BgSvg({ svgRef }) {
  return (
    <svg
      ref={svgRef}
      className="ty-bg-svg"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 700 400"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="tyBgGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8c57a" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#f5e8cc" stopOpacity="0.10"/>
        </linearGradient>
        <linearGradient id="tyBgGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8a09a" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#faeae9" stopOpacity="0.08"/>
        </linearGradient>
        <linearGradient id="tyBgGrad3" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8c5ac" stopOpacity="0.16"/>
          <stop offset="100%" stopColor="#edf4ee" stopOpacity="0.06"/>
        </linearGradient>
      </defs>
      <style>{`
        #tyBg3_tr {animation: tyBg3_tr__tr 14000ms linear infinite normal forwards}
        @keyframes tyBg3_tr__tr { 0% {transform: translate(1485.265524px,923.716668px) rotate(107.849898deg)} 100% {transform: translate(1485.265524px,923.716668px) rotate(252.130785deg)}}
        #tyBg4_tr {animation: tyBg4_tr__tr 14000ms linear infinite normal forwards}
        @keyframes tyBg4_tr__tr { 0% {transform: translate(1106.552084px,11.479169px) rotate(-104.755169deg)} 100% {transform: translate(1106.552084px,11.479169px) rotate(-194.755169deg)}}
        #tyBg5_tr {animation: tyBg5_tr__tr 14000ms linear infinite normal forwards}
        @keyframes tyBg5_tr__tr { 0% {transform: translate(77.951956px,316.57267px) rotate(179.858074deg)} 100% {transform: translate(77.951956px,316.57267px) rotate(107.849898deg)}}
        #tyBg6_to {animation: tyBg6_to__to 14000ms linear infinite normal forwards}
        @keyframes tyBg6_to__to { 0% {offset-distance: 0%} 50% {offset-distance: 49.378847%} 100% {offset-distance: 100%}}
        #tyBg7_to {animation: tyBg7_to__to 14000ms linear infinite normal forwards}
        @keyframes tyBg7_to__to { 0% {transform: translate(1625.977098px,922.267927px)} 33.333333% {transform: translate(1567.951321px,818.908093px)} 66.666667% {transform: translate(1427.428392px,987.533986px)} 100% {transform: translate(1625.977098px,922.267927px)}}
        #tyBg8_to {animation: tyBg8_to__to 14000ms linear infinite normal forwards}
        @keyframes tyBg8_to__to { 0% {offset-distance: 0%} 50% {offset-distance: 50.699739%} 100% {offset-distance: 100%}}
        #tyBg9_tr {animation: tyBg9_tr__tr 14000ms linear infinite normal forwards}
        @keyframes tyBg9_tr__tr { 0% {transform: translate(1332.072109px,696.229369px) rotate(179.858074deg)} 100% {transform: translate(1332.072109px,696.229369px) rotate(323.892738deg)}}
        #tyBg10_tr {animation: tyBg10_tr__tr 14000ms linear infinite normal forwards}
        @keyframes tyBg10_tr__tr { 0% {transform: translate(820.871069px,284.144659px) rotate(179.858074deg)} 100% {transform: translate(820.871069px,284.144659px) rotate(-35.842484deg)}}
        #tyBg11_tr {animation: tyBg11_tr__tr 14000ms linear infinite normal forwards}
        @keyframes tyBg11_tr__tr { 0% {transform: translate(762.743219px,965.073357px) rotate(0deg)} 100% {transform: translate(762.743219px,965.073357px) rotate(360deg)}}
        #tyBg12_tr {animation: tyBg12_tr__tr 14000ms linear infinite normal forwards}
        @keyframes tyBg12_tr__tr { 0% {transform: translate(1474.519794px,224.809739px) rotate(390.798193deg)} 100% {transform: translate(1474.519794px,224.809739px) rotate(30.798193deg)}}
      `}</style>
      <g transform="matrix(.388384 0 0 0.388384 0.446734-9.821674)">
        {/* gold pentagon */}
        <g id="tyBg3_tr" transform="translate(1485.265524,923.716668) rotate(107.849898)">
          <polygon points="0,-187.908605 178.711703,-58.066952 110.449907,152.021255 -110.449907,152.021255 -178.711703,-58.066952 0,-187.908605"
            transform="scale(3.947276,3.947276) translate(0,0)" fill="url(#tyBgGrad1)" strokeWidth="0"/>
        </g>
        {/* rose rect */}
        <g id="tyBg4_tr" transform="translate(1106.552084,11.479169) rotate(-104.755169)">
          <rect width="274.170362" height="274.170362" rx="0" ry="0"
            transform="scale(2.383871,2.383871) translate(-137.085181,-137.085181)" fill="url(#tyBgGrad2)" strokeWidth="0"/>
        </g>
        {/* sage pentagon */}
        <g id="tyBg5_tr" transform="translate(77.951956,316.57267) rotate(179.858074)">
          <polygon points="0,-187.908605 178.711703,-58.066952 110.449907,152.021255 -110.449907,152.021255 -178.711703,-58.066952 0,-187.908605"
            transform="scale(3.253384,3.253384) translate(0,0)" fill="url(#tyBgGrad3)" strokeWidth="0"/>
        </g>
        {/* gold ellipse path */}
        <g id="tyBg6_to" style={{offsetPath:"path('M182.879698,901.477028C182.879698,819.603496,543.979817,653.846134,593.96611,782.977375C643.952403,912.108616,182.879698,986.922985,182.879698,901.477028')", offsetRotate:'0deg'}}>
          <ellipse rx="289.447928" ry="289.447928" transform="scale(0.232635,0.232635) translate(0,0)" fill="#e8c57a" fillOpacity="0.18" strokeWidth="0"/>
        </g>
        {/* rose ellipse */}
        <g id="tyBg7_to" transform="translate(1625.977098,922.267927)">
          <ellipse rx="289.447928" ry="289.447928" transform="scale(0.080091,0.080091) translate(0,0)" fill="#e8a09a" fillOpacity="0.22" strokeWidth="0"/>
        </g>
        {/* sage ellipse path */}
        <g id="tyBg8_to" style={{offsetPath:"path('M1220.487918,290.262889C1110.853792,377.293206,903.033468,181.544933,1184.090696,96.285342C1465.147924,11.025751,1334.309017,201.397504,1220.487918,290.262888')", offsetRotate:'0deg'}}>
          <ellipse rx="289.447928" ry="289.447928" transform="scale(0.107632,0.107632) translate(0,0)" fill="#a8c5ac" fillOpacity="0.20" strokeWidth="0"/>
        </g>
        {/* gold pentagon small */}
        <g id="tyBg9_tr" transform="translate(1332.072109,696.229369) rotate(179.858074)">
          <polygon points="0,-187.908605 178.711703,-58.066952 110.449907,152.021255 -110.449907,152.021255 -178.711703,-58.066952 0,-187.908605"
            transform="scale(1.200094,1.200094) translate(0,0)" fill="#e8c57a" fillOpacity="0.14" strokeWidth="0"/>
        </g>
        {/* rose pentagon xs */}
        <g id="tyBg10_tr" transform="translate(820.871069,284.144659) rotate(179.858074)">
          <polygon points="0,-187.908605 178.711703,-58.066952 110.449907,152.021255 -110.449907,152.021255 -178.711703,-58.066952 0,-187.908605"
            transform="scale(0.6936,0.6936) translate(0,0)" fill="#e8a09a" fillOpacity="0.12" strokeWidth="0"/>
        </g>
        {/* sage triangle */}
        <g id="tyBg11_tr" transform="translate(762.743219,965.073357) rotate(0)">
          <path d="M0,0v277.977304L234.170207,138.840986L0,0Z"
            transform="scale(1.31015,1.31015) translate(-128.822737,-138.988652)" fill="#a8c5ac" fillOpacity="0.13" strokeWidth="0"/>
        </g>
        {/* gold triangle xs */}
        <g id="tyBg12_tr" transform="translate(1474.519794,224.809739) rotate(390.798193)">
          <path d="M0,0v277.977304L234.170207,138.840986L0,0Z"
            transform="scale(0.512094,0.512094) translate(-128.822737,-138.988652)" fill="#e8c57a" fillOpacity="0.15" strokeWidth="0"/>
        </g>
      </g>
    </svg>
  )
}

export default function ThankYou() {
  const location = useLocation()
  const navigate = useNavigate()
  const { name, attending } = location.state || {}
  const svgRef = useRef(null)
  useSvgPlayPause(svgRef)

  useEffect(() => {
    if (!name) navigate('/', { replace: true })
  }, [name, navigate])

  if (!name) return null

  return (
    <div className="ty-page">

      {/* ── Animated SVG background ── */}
      <BgSvg svgRef={svgRef} />

      {/* ── Overlay ── */}
      <div className="ty-overlay" />

      {/* ── Floating gold particles ── */}
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
            animate={{ opacity: [0, 0.6, 0], y: [0, -60, -120] }}
            transition={{
              duration: Math.random() * 6 + 5,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="ty-wrap">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
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
          transition={{ delay: 0.35 }}
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
            transition={{ delay: 0.5 }}
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
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 }}
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
          transition={{ delay: 0.8 }}
        >
          Nitin &amp; Margarita &nbsp;✦&nbsp; 2026
        </motion.p>

      </div>
    </div>
  )
}
