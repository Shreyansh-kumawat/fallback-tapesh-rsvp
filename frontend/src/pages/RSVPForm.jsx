import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase.js'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import './RSVPForm.css'
import countryList from 'react-select-country-list'
import CustomDatePicker from '../components/CustomDatePicker'
import logoHD from '../assets/imgs/logoHD--1.png'
import INDIA_DISTRICTS from '../data/indiaDistricts'

function getFlagEmoji(countryCode) {
  if (!countryCode) return ''
  const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const ALL_COUNTRIES = countryList().getData().map(c => ({ ...c, flag: getFlagEmoji(c.value) }))

const STEPS = [
  { label: 'Guest Detail',    icon: '👤' },
  { label: 'No. of Guests',   icon: '👥' },
  { label: 'From & To',       icon: '✈️' },
  { label: 'Allergy',         icon: '🌿' },
  { label: 'Anything Else',   icon: '💬' },
  { label: 'Review',          icon: '✅' },
]
const TOTAL = STEPS.length

const emptyAdult = () => ({ name: '', phone: '' })
const emptyChild = () => ({ name: '', age: '' })

const MAPS_LINK = 'https://maps.app.goo.gl/6EnhNqNissXUDHJ59'

function useSvgPlayPause(svgRef) {
  const timerRef = useRef(null)

  const play = useCallback(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.classList.remove('rf-bg-svg--paused')
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      svg.classList.add('rf-bg-svg--paused')
    }, 1000)
  }, [svgRef])

  useEffect(() => {
    const svg = svgRef.current
    if (svg) svg.classList.add('rf-bg-svg--paused')
    const events = ['click', 'keydown', 'input', 'change', 'scroll', 'touchstart']
    events.forEach(ev => document.addEventListener(ev, play, { passive: true }))
    return () => {
      events.forEach(ev => document.removeEventListener(ev, play))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [play, svgRef])
}

function BgSvg({ svgRef }) {
  return (
    <svg
      ref={svgRef}
      className="rf-bg-svg rf-bg-svg--paused"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 700 400"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <style>{`
        #rBg3_tr {animation: rBg3_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg3_tr__tr { 0% {transform: translate(1485.265524px,923.716668px) rotate(107.849898deg)} 100% {transform: translate(1485.265524px,923.716668px) rotate(252.130785deg)}}
        #rBg4_tr {animation: rBg4_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg4_tr__tr { 0% {transform: translate(1106.552084px,11.479169px) rotate(-104.755169deg)} 100% {transform: translate(1106.552084px,11.479169px) rotate(-194.755169deg)}}
        #rBg5_tr {animation: rBg5_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg5_tr__tr { 0% {transform: translate(77.951956px,316.57267px) rotate(179.858074deg)} 100% {transform: translate(77.951956px,316.57267px) rotate(107.849898deg)}}
        #rBg6_to {animation: rBg6_to__to 12000ms linear infinite normal forwards}
        @keyframes rBg6_to__to { 0% {offset-distance: 0%} 50% {offset-distance: 49.378847%} 100% {offset-distance: 100%}}
        #rBg7_to {animation: rBg7_to__to 12000ms linear infinite normal forwards}
        @keyframes rBg7_to__to { 0% {transform: translate(1625.977098px,922.267927px)} 33.333333% {transform: translate(1567.951321px,818.908093px)} 66.666667% {transform: translate(1427.428392px,987.533986px)} 100% {transform: translate(1625.977098px,922.267927px)}}
        #rBg8_to {animation: rBg8_to__to 12000ms linear infinite normal forwards}
        @keyframes rBg8_to__to { 0% {offset-distance: 0%} 50% {offset-distance: 50.699739%} 100% {offset-distance: 100%}}
        #rBg9_tr {animation: rBg9_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg9_tr__tr { 0% {transform: translate(1332.072109px,696.229369px) rotate(179.858074deg)} 100% {transform: translate(1332.072109px,696.229369px) rotate(323.892738deg)}}
        #rBg10_tr {animation: rBg10_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg10_tr__tr { 0% {transform: translate(820.871069px,284.144659px) rotate(179.858074deg)} 100% {transform: translate(820.871069px,284.144659px) rotate(-35.842484deg)}}
        #rBg11_tr {animation: rBg11_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg11_tr__tr { 0% {transform: translate(762.743219px,965.073357px) rotate(0deg)} 100% {transform: translate(762.743219px,965.073357px) rotate(360deg)}}
        #rBg12_tr {animation: rBg12_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg12_tr__tr { 0% {transform: translate(1474.519794px,224.809739px) rotate(390.798193deg)} 100% {transform: translate(1474.519794px,224.809739px) rotate(30.798193deg)}}
        .rf-bg-svg--paused #rBg3_tr,
        .rf-bg-svg--paused #rBg4_tr,
        .rf-bg-svg--paused #rBg5_tr,
        .rf-bg-svg--paused #rBg6_to,
        .rf-bg-svg--paused #rBg7_to,
        .rf-bg-svg--paused #rBg8_to,
        .rf-bg-svg--paused #rBg9_tr,
        .rf-bg-svg--paused #rBg10_tr,
        .rf-bg-svg--paused #rBg11_tr,
        .rf-bg-svg--paused #rBg12_tr {
          animation-play-state: paused;
        }
      `}</style>
      <g transform="matrix(.388384 0 0 0.388384 0.446734-9.821674)">
        <g id="rBg3_tr" transform="translate(1485.265524,923.716668) rotate(107.849898)">
          <polygon points="0,-187.908605 178.711703,-58.066952 110.449907,152.021255 -110.449907,152.021255 -178.711703,-58.066952 0,-187.908605" transform="scale(3.947276,3.947276) translate(0,0)" fill="#e3f1fb" strokeWidth="0"/>
        </g>
        <g id="rBg4_tr" transform="translate(1106.552084,11.479169) rotate(-104.755169)">
          <rect width="274.170362" height="274.170362" rx="0" ry="0" transform="scale(2.383871,2.383871) translate(-137.085181,-137.085181)" fill="#e9f3f8" strokeWidth="0"/>
        </g>
        <g id="rBg5_tr" transform="translate(77.951956,316.57267) rotate(179.858074)">
          <polygon points="0,-187.908605 178.711703,-58.066952 110.449907,152.021255 -110.449907,152.021255 -178.711703,-58.066952 0,-187.908605" transform="scale(3.253384,3.253384) translate(0,0)" fill="#def6f6" strokeWidth="0"/>
        </g>
        <g id="rBg6_to" style={{offsetPath:"path('M182.879698,901.477028C182.879698,819.603496,543.979817,653.846134,593.96611,782.977375C643.952403,912.108616,182.879698,986.922985,182.879698,901.477028')", offsetRotate:'0deg'}}>
          <ellipse rx="289.447928" ry="289.447928" transform="scale(0.232635,0.232635) translate(0,0)" fill="#bee1fa" strokeWidth="0"/>
        </g>
        <g id="rBg7_to" transform="translate(1625.977098,922.267927)">
          <ellipse rx="289.447928" ry="289.447928" transform="scale(0.080091,0.080091) translate(0,0)" fill="#c5e4e4" strokeWidth="0"/>
        </g>
        <g id="rBg8_to" style={{offsetPath:"path('M1220.487918,290.262889C1110.853792,377.293206,903.033468,181.544933,1184.090696,96.285342C1465.147924,11.025751,1334.309017,201.397504,1220.487918,290.262888')", offsetRotate:'0deg'}}>
          <ellipse rx="289.447928" ry="289.447928" transform="scale(0.107632,0.107632) translate(0,0)" fill="#a3d6d5" strokeWidth="0"/>
        </g>
        <g id="rBg9_tr" transform="translate(1332.072109,696.229369) rotate(179.858074)">
          <polygon points="0,-187.908605 178.711703,-58.066952 110.449907,152.021255 -110.449907,152.021255 -178.711703,-58.066952 0,-187.908605" transform="scale(1.200094,1.200094) translate(0,0)" fill="#bee1fa" strokeWidth="0"/>
        </g>
        <g id="rBg10_tr" transform="translate(820.871069,284.144659) rotate(179.858074)">
          <polygon points="0,-187.908605 178.711703,-58.066952 110.449907,152.021255 -110.449907,152.021255 -178.711703,-58.066952 0,-187.908605" transform="scale(0.6936,0.6936) translate(0,0)" fill="#c9e7ec" strokeWidth="0"/>
        </g>
        <g id="rBg11_tr" transform="translate(762.743219,965.073357) rotate(0)">
          <path d="M0,0v277.977304L234.170207,138.840986L0,0Z" transform="scale(1.31015,1.31015) translate(-128.822737,-138.988652)" fill="#d3e9f6" strokeWidth="3.6"/>
        </g>
        <g id="rBg12_tr" transform="translate(1474.519794,224.809739) rotate(390.798193)">
          <path d="M0,0v277.977304L234.170207,138.840986L0,0Z" transform="scale(0.512094,0.512094) translate(-128.822737,-138.988652)" fill="#bacedc" strokeWidth="3.6"/>
        </g>
      </g>
    </svg>
  )
}

const IconPlane = () => (
  <svg className="rf-travel-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.81 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    <path d="M14.05 2a9 9 0 0 1 8 7.94"/>
    <path d="M14.05 6A5 5 0 0 1 18 10"/>
  </svg>
)
const IconHotel = () => (
  <svg className="rf-travel-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconCal = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconMail = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IconMap = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

function SearchSelect({ label, placeholder, items, value, onChange, dropHeight = 260, showFlags = false }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const wrapRef = useRef(null)

  const filtered = useMemo(() => {
    const low = q.trim().toLowerCase()
    return low ? items.filter(i => i.label.toLowerCase().includes(low)) : items
  }, [items, q])

  useEffect(() => {
    const handler = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="rf-field rf-csel-wrap" ref={wrapRef}>
      {label && <label>{label}</label>}
      <button type="button" className={`rf-csel-btn${open ? ' open' : ''}`} onClick={() => setOpen(p => !p)}>
        <span className={`rf-csel-value-wrap${!value ? ' placeholder' : ''}`}>
          {value ? (<>{showFlags && value.flag && <span className="rf-csel-flag">{value.flag}</span>}<span>{value.label}</span></>) : placeholder}
        </span>
        <span className={`rf-csel-chevron${open ? ' open' : ''}`}>&#9662;</span>
      </button>
      {open && (
        <div className="rf-csel-drop" style={{ maxHeight: dropHeight + 'px' }}>
          <input className="rf-csel-search" placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} autoFocus />
          <div className="rf-csel-list" style={{ maxHeight: (dropHeight - 46) + 'px' }}>
            {filtered.length === 0
              ? <div className="rf-csel-empty">No results found</div>
              : filtered.map(item => (
                <button key={item.value} type="button" className={`rf-csel-opt${value && value.value === item.value ? ' sel' : ''}`}
                  onClick={() => { onChange(item); setOpen(false); setQ('') }}>
                  {showFlags && item.flag && <span className="rf-csel-opt-flag">{item.flag}</span>}
                  {item.label}
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}

export default function RSVPForm() {
  const navigate = useNavigate()
  const [cur, setCur] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [stepDir, setStepDir] = useState('forward')

  const svgRef = useRef(null)
  useSvgPlayPause(svgRef)

  const [form, setForm] = useState({
    name: '', age: '', phone: '', email: '',
    adults: [], children: [],
    country: null, city: null,
    departureDate: '', arrivalDate: '',
    allergy: '', notes: '',
  })

  const up = (key, val) => setForm(p => ({ ...p, [key]: val }))

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [cur])

  const validate = step => {
    if (step === 1) {
      if (!form.name.trim()) return 'Please enter your full name.'
      if (!form.age || Number(form.age) < 1 || Number(form.age) > 120) return 'Please enter a valid age (between 1 and 120).'
      if (!form.phone || !isValidPhoneNumber(form.phone)) return 'Please enter a valid phone number.'
    }
    if (step === 3) {
      if (!form.country) return 'Please select the country you are travelling from.'
      if (!form.city) return 'Please select your arrival city in India.'
      if (!form.departureDate) return 'Please select your departure date.'
      if (!form.arrivalDate) return 'Please select your arrival date in India.'
    }
    return ''
  }

  const go = n => {
    if (n > cur) {
      const err = validate(cur)
      if (err) { toast.error(err); return }
      setStepDir('forward')
    } else {
      setStepDir('back')
    }
    setCur(n)
  }

  const submitRSVP = async () => {
    setSubmitting(true)
    try {
      const companions = [
        ...form.adults.filter(a => a.name.trim()).map(a => ({ name: a.name.trim(), phone: a.phone.trim() || null, type: 'adult' })),
        ...form.children.filter(c => c.name.trim()).map(c => ({ name: c.name.trim(), age: c.age || null, type: 'child' })),
      ]
      const meta = {
        age: form.age,
        country: form.country ? { label: form.country.label, value: form.country.value } : null,
        city: form.city ? { label: form.city.label, value: form.city.value, state: form.city.state } : null,
        departureDate: form.departureDate || null,
        arrivalDate: form.arrivalDate || null,
        allergy: form.allergy || null,
        notes: form.notes || null,
      }
      const payload = {
        guest_name: form.name.trim(),
        guest_phone: form.phone,
        guest_email: form.email.trim() || null,
        is_attending: true,
        companions,
        meta,
      }
      const { error } = await supabase.from('rsvp_submissions').insert([payload])
      if (error) { console.error('Supabase error:', error); throw error }
      toast.success('RSVP submitted successfully!')
      navigate('/thankyou', { state: { name: form.name.trim(), attending: true } })
    } catch (e) {
      console.error('Submit error:', e)
      toast.error(e?.message || 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const progress = `${(cur / TOTAL) * 100}%`
  const isJaipur = form.city?.isRajasthan === true
  const fitVh = cur <= 3

  return (
    <div className="rsvp-page">

      <BgSvg svgRef={svgRef} />

      <nav className="rf-topnav">
        <div className="rf-nav-logo">
          <span className="rf-nav-ornament">✦</span>
          <span className="rf-nav-center">Margarita &amp; Nitin</span>
          <span className="rf-nav-ornament">✦</span>
        </div>
        <div className="rf-nav-step-badge">
          <span className="rf-nav-step-cur">{cur}</span>
          <span className="rf-nav-step-sep">/</span>
          <span className="rf-nav-step-tot">{TOTAL}</span>
        </div>
      </nav>

      <div className="rf-progress-wrap">
        <div className="rf-steps-strip">
          {STEPS.map((step, i) => {
            const s = i + 1
            const cls = s === cur ? 'active' : s < cur ? 'done' : ''
            return (
              <div className={`rf-si ${cls}`} key={s}>
                <div className="rf-si-dot">
                  {s < cur ? <IconCheck /> : <span className="rf-si-num">{s}</span>}
                </div>
                <div className="rf-si-lbl">{step.label}</div>
              </div>
            )
          })}
        </div>
        <div className="rf-prog-track"><div className="rf-prog-fill" style={{ width: progress }} /></div>
      </div>

      <div className={`rf-page-wrap${fitVh ? ' rf-page-wrap--fit' : ''}`}>
        <div className={fitVh ? 'rf-card-col--fit' : ''}>
          <div className={`rf-form-card${fitVh ? ' rf-form-card--fit' : ''} rf-step-enter rf-step-enter--${stepDir}`}>

            {/* STEP 1 */}
            {cur === 1 && (
              <>
                <div className="rf-form-card-head rf-form-card-head--compact">
                  <div className="rf-step-num">
                    <span className="rf-step-icon">👤</span>
                    Step 1 of {TOTAL}
                  </div>
                  <h2 className="rf-step-title rf-step-title--sm">Guest Detail</h2>
                  <p className="rf-step-desc rf-step-desc--sm">Share your basic details to confirm attendance.</p>
                </div>
                <div className="rf-form-card-body rf-form-card-body--fit rf-form-card-body--scroll">

                  <div className="rf-field-group-box">
                    <div className="rf-field-group-label">Personal Info</div>
                    <div className="rf-field rf-field--compact">
                      <label>Full Name *</label>
                      <input value={form.name} onChange={e => up('name', e.target.value)} placeholder="e.g. Rahul Sharma" />
                    </div>
                    <div className="rf-field-row">
                      <div className="rf-field rf-field--compact">
                        <label>Age *</label>
                        <input type="number" value={form.age} onChange={e => up('age', e.target.value)} placeholder="28" min="1" max="120" inputMode="numeric" />
                      </div>
                      <div className="rf-field rf-field--compact">
                        <label>Phone Number *</label>
                        <div className="rf-phone-wrap">
                          <PhoneInput international defaultCountry="IN" value={form.phone} onChange={v => up('phone', v || '')} placeholder="Enter phone number" />
                        </div>
                        <p className="rf-field-hint">Select your country flag for the correct code</p>
                      </div>
                    </div>
                  </div>

                  <div className="rf-field-group-box">
                    <div className="rf-field-group-label">Contact</div>
                    <div className="rf-field rf-field--compact">
                      <label>Email Address <span className="rf-optional">(optional)</span></label>
                      <input type="email" value={form.email} onChange={e => up('email', e.target.value)} placeholder="you@example.com" />
                    </div>
                  </div>

                </div>
                <div className="rf-nav-btns">
                  <div />
                  <button className="rf-btn-next" onClick={() => go(2)}>
                    Continue <IconArrowRight />
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {cur === 2 && (
              <>
                <div className="rf-form-card-head rf-form-card-head--compact">
                  <div className="rf-step-num">
                    <span className="rf-step-icon">👥</span>
                    Step 2 of {TOTAL}
                  </div>
                  <h2 className="rf-step-title rf-step-title--sm">Number of Guests</h2>
                  <p className="rf-step-desc rf-step-desc--sm">Add adults and children travelling with you.</p>
                </div>
                <div className="rf-form-card-body rf-form-card-body--fit rf-form-card-body--scroll">

                  <div className="rf-guests-group rf-guests-group--compact">
                    <div className="rf-sec-header">
                      <span className="rf-sec-label">Adults</span>
                      {form.adults.length > 0 && <span className="rf-sec-count">{form.adults.length} added</span>}
                    </div>
                    {form.adults.length === 0 && (
                      <div className="rf-empty-hint">No adults added &mdash; click below to add</div>
                    )}
                    {form.adults.map((a, idx) => (
                      <div className="rf-pax-card rf-pax-card--compact" key={`adult-${idx}`}>
                        <div className="rf-pax-title">
                          <span className="rf-pax-badge">{idx + 1}</span>
                          Adult {idx + 1}
                          <button className="rf-pax-rm" onClick={() => up('adults', form.adults.filter((_, i) => i !== idx))}>&#215;</button>
                        </div>
                        <div className="rf-field-row" style={{ gap: '0.35rem', marginTop: '0.3rem' }}>
                          <div className="rf-field rf-field--compact">
                            <label>Name *</label>
                            <input value={a.name} onChange={e => up('adults', form.adults.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))} placeholder="Full name" />
                          </div>
                          <div className="rf-field rf-field--compact">
                            <label>Phone <span className="rf-optional">(optional)</span></label>
                            <input type="tel" value={a.phone} maxLength={20} onChange={e => up('adults', form.adults.map((x, i) => i === idx ? { ...x, phone: e.target.value } : x))} placeholder="Phone number" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="rf-add-btn" disabled={form.adults.length >= 10} onClick={() => up('adults', [...form.adults, emptyAdult()])}>+ Add Adult</button>
                  </div>

                  <div className="rf-guests-group rf-guests-group--compact">
                    <div className="rf-sec-header">
                      <span className="rf-sec-label">Children</span>
                      {form.children.length > 0 && <span className="rf-sec-count">{form.children.length} added</span>}
                    </div>
                    {form.children.length === 0 && (
                      <div className="rf-empty-hint">No children added &mdash; click below to add</div>
                    )}
                    {form.children.map((c, idx) => (
                      <div className="rf-pax-card rf-pax-card--compact" key={`child-${idx}`}>
                        <div className="rf-pax-title">
                          <span className="rf-pax-badge" style={{ background: '#7a9e5c' }}>{idx + 1}</span>
                          Child {idx + 1}
                          <button className="rf-pax-rm" onClick={() => up('children', form.children.filter((_, i) => i !== idx))}>&#215;</button>
                        </div>
                        <div className="rf-field-row" style={{ gap: '0.35rem', marginTop: '0.3rem' }}>
                          <div className="rf-field rf-field--compact">
                            <label>Name *</label>
                            <input value={c.name} onChange={e => up('children', form.children.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))} placeholder="Child name" />
                          </div>
                          <div className="rf-field rf-field--compact">
                            <label>Age <span className="rf-optional">(optional)</span></label>
                            <input type="number" value={c.age} min="0" max="17" onChange={e => up('children', form.children.map((x, i) => i === idx ? { ...x, age: e.target.value } : x))} placeholder="e.g. 7" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="rf-add-btn" disabled={form.children.length >= 10} onClick={() => up('children', [...form.children, emptyChild()])}>+ Add Child</button>
                  </div>

                </div>
                <div className="rf-nav-btns">
                  <button className="rf-btn-back" onClick={() => go(1)}>Back</button>
                  <button className="rf-btn-next" onClick={() => go(3)}>Continue <IconArrowRight /></button>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {cur === 3 && (
              <>
                <div className="rf-form-card-head rf-form-card-head--compact">
                  <div className="rf-step-num">
                    <span className="rf-step-icon">✈️</span>
                    Step 3 of {TOTAL}
                  </div>
                  <h2 className="rf-step-title rf-step-title--sm">From &amp; To</h2>
                  <p className="rf-step-desc rf-step-desc--sm">Where are you travelling from and landing in India?</p>
                </div>
                <div className="rf-form-card-body rf-form-card-body--fit rf-form-card-body--scroll">

                  <div className="rf-travel-grid">
                    <div className="rf-travel-card rf-travel-from">
                      <div className="rf-travel-card-label"><IconPlane /><span>Travel From</span></div>
                      <SearchSelect label="Country *" placeholder="Select country..." items={ALL_COUNTRIES} value={form.country} onChange={v => up('country', v)} dropHeight={200} showFlags={true} />
                      <CustomDatePicker label="Departure Date *" value={form.departureDate} onChange={v => up('departureDate', v)} placeholder="Select departure date..." />
                    </div>

                    <div className="rf-travel-divider">
                      <div className="rf-travel-divider-line" />
                      <div className="rf-travel-divider-dot">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                          <path d="M3 8h10M9 4l4 4-4 4"/>
                        </svg>
                      </div>
                      <div className="rf-travel-divider-line" />
                    </div>

                    <div className="rf-travel-card rf-travel-to">
                      <div className="rf-travel-card-label"><IconHotel /><span>Travel To</span></div>
                      <SearchSelect label="Arrival City in India *" placeholder="Type city or district..." items={INDIA_DISTRICTS} value={form.city} onChange={v => up('city', v)} dropHeight={200} />
                      <CustomDatePicker label="Arrival Date *" value={form.arrivalDate} onChange={v => up('arrivalDate', v)} placeholder="Select arrival date..." />
                    </div>
                  </div>

                  {form.city && (
                    <div className={`rf-transport-box ${isJaipur ? 'green' : 'yellow'}`}>
                      <div className="rf-tb-icon">{isJaipur ? '🚗' : '🗺️'}</div>
                      <div>
                        {isJaipur ? (
                          <><strong>Complimentary cab from Jaipur — you&apos;re all set!</strong><br />
                          A free cab is available for guests travelling from Jaipur. We will coordinate your pickup and share all details closer to the date.</>
                        ) : (
                          <><strong>Travelling from outside Jaipur?</strong><br />
                          You are arriving in <strong>{form.city.district}, {form.city.state}</strong>. Please note that our complimentary cab service is available <strong>from Jaipur only</strong>. However, we would love to help you plan your journey to Jaipur from anywhere in India — reach out to us at <a href="mailto:contact@bride-groom.com" style={{color:'inherit',textDecoration:'underline'}}>contact@bride-groom.com</a> and we will sort it out together!</>
                        )}
                      </div>
                    </div>
                  )}

                </div>
                <div className="rf-nav-btns">
                  <button className="rf-btn-back" onClick={() => go(2)}>Back</button>
                  <button className="rf-btn-next" onClick={() => go(4)}>Continue <IconArrowRight /></button>
                </div>
              </>
            )}

            {/* STEP 4 */}
            {cur === 4 && (
              <>
                <div className="rf-form-card-head">
                  <div className="rf-step-num">
                    <span className="rf-step-icon">🌿</span>
                    Step 4 of {TOTAL}
                  </div>
                  <h2 className="rf-step-title">Food &amp; Allergies</h2>
                  <p className="rf-step-desc">Please let us know about any dietary requirements or food allergies, so we can make sure you are well taken care of.</p>
                </div>
                <div className="rf-form-card-body">
                  <div className="rf-field">
                    <label>Allergies / Dietary Restrictions</label>
                    <textarea rows="5" value={form.allergy} onChange={e => up('allergy', e.target.value)}
                      placeholder={"e.g. I am vegetarian, I have a nut allergy, gluten-free required...\nWrite None if you have no restrictions."} />
                  </div>
                </div>
                <div className="rf-nav-btns">
                  <button className="rf-btn-back" onClick={() => go(3)}>Back</button>
                  <button className="rf-btn-next" onClick={() => go(5)}>Continue <IconArrowRight /></button>
                </div>
              </>
            )}

            {/* STEP 5 */}
            {cur === 5 && (
              <>
                <div className="rf-form-card-head">
                  <div className="rf-step-num">
                    <span className="rf-step-icon">💬</span>
                    Step 5 of {TOTAL}
                  </div>
                  <h2 className="rf-step-title">Anything Else?</h2>
                  <p className="rf-step-desc">Any questions, special requests, or a message for the couple &mdash; we would love to hear it!</p>
                </div>
                <div className="rf-form-card-body">
                  <div className="rf-field">
                    <label>Message <span className="rf-optional">(optional)</span></label>
                    <textarea rows="6" value={form.notes} onChange={e => up('notes', e.target.value)} placeholder="Write anything you would like us to know..." />
                  </div>
                </div>
                <div className="rf-nav-btns">
                  <button className="rf-btn-back" onClick={() => go(4)}>Back</button>
                  <button className="rf-btn-next" onClick={() => go(6)}>Review <IconArrowRight /></button>
                </div>
              </>
            )}

            {/* STEP 6 */}
            {cur === 6 && (
              <>
                <div className="rf-form-card-head">
                  <div className="rf-step-num">
                    <span className="rf-step-icon">✅</span>
                    Step 6 of {TOTAL}
                  </div>
                  <h2 className="rf-step-title">Review &amp; Confirm</h2>
                  <p className="rf-step-desc">Please review your details before confirming your RSVP.</p>
                </div>
                <div className="rf-form-card-body">

                  <div className="rf-rev-block">
                    <div className="rf-rev-head">
                      <span className="rf-rev-head-title">👤 Guest Detail</span>
                      <button className="rf-rev-edit" onClick={() => go(1)}>✏️ Edit</button>
                    </div>
                    <div className="rf-rev-row"><span className="rf-rk">Name</span><span className="rf-rv">{form.name}</span></div>
                    <div className="rf-rev-row"><span className="rf-rk">Age</span><span className="rf-rv">{form.age}</span></div>
                    <div className="rf-rev-row"><span className="rf-rk">Phone</span><span className="rf-rv">{form.phone}</span></div>
                    {form.email && <div className="rf-rev-row"><span className="rf-rk">Email</span><span className="rf-rv">{form.email}</span></div>}
                  </div>

                  <div className="rf-rev-block">
                    <div className="rf-rev-head">
                      <span className="rf-rev-head-title">👥 Guests ({form.adults.length + form.children.length})</span>
                      <button className="rf-rev-edit" onClick={() => go(2)}>✏️ Edit</button>
                    </div>
                    {form.adults.length === 0 && form.children.length === 0
                      ? <div className="rf-rev-row"><span className="rf-rk">-</span><span className="rf-rv">Travelling alone</span></div>
                      : <>
                          {form.adults.map((a, i) => (
                            <div className="rf-rev-row" key={`ra-${i}`}>
                              <span className="rf-rk">Adult {i + 1}</span>
                              <span className="rf-rv">{a.name}{a.phone ? ` · ${a.phone}` : ''}</span>
                            </div>
                          ))}
                          {form.children.map((c, i) => (
                            <div className="rf-rev-row" key={`rc-${i}`}>
                              <span className="rf-rk">Child {i + 1}</span>
                              <span className="rf-rv">{c.name}{c.age ? ` · Age ${c.age}` : ''}</span>
                            </div>
                          ))}
                        </>
                    }
                  </div>

                  <div className="rf-rev-block">
                    <div className="rf-rev-head">
                      <span className="rf-rev-head-title">✈️ From &amp; To</span>
                      <button className="rf-rev-edit" onClick={() => go(3)}>✏️ Edit</button>
                    </div>
                    <div className="rf-rev-row">
                      <span className="rf-rk">From</span>
                      <span className="rf-rv">
                        {form.country ? <>{form.country.flag && <span style={{ marginRight: '0.4rem' }}>{form.country.flag}</span>}{form.country.label}</> : '-'}
                      </span>
                    </div>
                    <div className="rf-rev-row"><span className="rf-rk">Departure</span><span className="rf-rv">{form.departureDate || '-'}</span></div>
                    <div className="rf-rev-row"><span className="rf-rk">Arrival City</span><span className="rf-rv">{form.city ? form.city.label : '-'}</span></div>
                    <div className="rf-rev-row"><span className="rf-rk">Arrival Date</span><span className="rf-rv">{form.arrivalDate || '-'}</span></div>
                    {form.city && (
                      <div className={`rf-rev-transport-note ${isJaipur ? 'green' : 'yellow'}`}>
                        {isJaipur
                          ? 'Complimentary cab from Jaipur included — we will share pickup details closer to the date.'
                          : `Arriving in ${form.city.district}, ${form.city.state} — complimentary cab is from Jaipur only. We are happy to help you plan your journey to Jaipur!`
                        }
                      </div>
                    )}
                  </div>

                  <div className="rf-rev-block">
                    <div className="rf-rev-head">
                      <span className="rf-rev-head-title">🌿 Food &amp; Allergies</span>
                      <button className="rf-rev-edit" onClick={() => go(4)}>✏️ Edit</button>
                    </div>
                    <div className="rf-rev-row"><span className="rf-rk">Details</span><span className="rf-rv">{form.allergy || 'None'}</span></div>
                  </div>

                  {form.notes && (
                    <div className="rf-rev-block">
                      <div className="rf-rev-head">
                        <span className="rf-rev-head-title">💬 Anything Else</span>
                        <button className="rf-rev-edit" onClick={() => go(5)}>✏️ Edit</button>
                      </div>
                      <div className="rf-rev-row"><span className="rf-rk">Message</span><span className="rf-rv">{form.notes}</span></div>
                    </div>
                  )}

                </div>
                <div className="rf-nav-btns">
                  <button className="rf-btn-back" onClick={() => go(5)}>Back</button>
                  <button className="rf-btn-submit" disabled={submitting} onClick={submitRSVP}>
                    {submitting ? <span className="rf-spinner" /> : <><IconCheck /> Confirm RSVP</>}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>

        <aside className="rf-sidebar">
          <div className="rf-sb-card">
            <div className="rf-sb-img-wrap">
              <img className="rf-sb-img" src={logoHD} alt="Nitin and Margarita Wedding" style={{ objectFit: 'cover', objectPosition: 'center' }} />
              <div className="rf-sb-img-overlay" />
            </div>
            <div className="rf-sb-body">
              <div className="rf-sb-ornament">❧</div>
              <div className="rf-sb-name">Margarita &amp; Nitin</div>
              <div className="rf-sb-sub">Wedding Celebration</div>

              <div className="rf-sb-rows">
                <div className="rf-sb-row">
                  <span className="rf-sb-row-icon"><IconCal /></span>
                  <span>25 – 26 November 2026</span>
                </div>
                <div className="rf-sb-row">
                  <span className="rf-sb-row-icon"><IconPin /></span>
                  <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="rf-sb-map-link">
                    Samode Bagh, Jaipur
                  </a>
                </div>
                <div className="rf-sb-row">
                  <span className="rf-sb-row-icon"><IconClock /></span>
                  <span>RSVP by 31 Oct 2026</span>
                </div>
              </div>

              <div className="rf-sb-sep" />

              <div className="rf-sb-maps-btn-wrap">
                <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="rf-sb-maps-btn">
                  <IconMap />
                  View on Google Maps
                </a>
              </div>

              <div className="rf-sb-sep" />

              <div className="rf-sb-contact">
                <span className="rf-sb-contact-icon"><IconMail /></span>
                Questions? <a href="mailto:contact@bride-groom.com">contact@bride-groom.com</a>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}
