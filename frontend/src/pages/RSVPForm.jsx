import { useMemo, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase.js'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'libphonenumber-js'
import 'react-phone-number-input/style.css'
import './RSVPForm.css'
import CustomDatePicker from '../components/CustomDatePicker.jsx'

const STEPS = ['guest','companions','travel','meals','stay','confirm']
const TOTAL = STEPS.length

const emptyAdult = () => ({ name: '', phone: '' })
const emptyChild = () => ({ name: '', age: '' })

const MAPS_LINK = 'https://maps.app.goo.gl/6EnhNqNissXUDHJ59'

function BgSvg() {
  return (
    <svg
      className="rf-bg-svg"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 700 400"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rBgGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b8e0e8" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#d4eef2" stopOpacity="0.3"/>
        </linearGradient>
        <linearGradient id="rBgGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c5dde0" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#daeef1" stopOpacity="0.25"/>
        </linearGradient>
        <linearGradient id="rBgGrad3" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8d4db" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#cce6ea" stopOpacity="0.2"/>
        </linearGradient>
      </defs>
      <style>{`
        #rBg3_tr {animation: rBg3_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg3_tr__tr { 0% {transform: translate(1485.265524px,923.716668px) rotate(107.849898deg)} 100% {transform: translate(1485.265524px,923.716668px) rotate(252.130785deg)}}
        #rBg4_tr {animation: rBg4_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg4_tr__tr { 0% {transform: translate(1106.552084px,11.479169px) rotate(-104.755169deg)} 100% {transform: translate(1106.552084px,11.479169px) rotate(-194.755169deg)}}
        #rBg5_tr {animation: rBg5_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg5_tr__tr { 0% {transform: translate(77.951956px,316.57267px) rotate(179.858074deg)} 100% {transform: translate(77.951956px,316.57267px) rotate(107.849898deg)}}
        #rBg7_to {animation: rBg7_to__to 12000ms linear infinite normal forwards}
        @keyframes rBg7_to__to { 0% {transform: translate(1625.977098px,922.267927px)} 33.333333% {transform: translate(1567.951321px,818.908093px)} 66.666667% {transform: translate(1427.428392px,987.533986px)} 100% {transform: translate(1625.977098px,922.267927px)}}
        #rBg9_tr {animation: rBg9_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg9_tr__tr { 0% {transform: translate(1332.072109px,696.229369px) rotate(179.858074deg)} 100% {transform: translate(1332.072109px,696.229369px) rotate(323.892738deg)}}
        #rBg10_tr {animation: rBg10_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg10_tr__tr { 0% {transform: translate(820.871069px,284.144659px) rotate(179.858074deg)} 100% {transform: translate(820.871069px,284.144659px) rotate(-35.842484deg)}}
        #rBg11_tr {animation: rBg11_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg11_tr__tr { 0% {transform: translate(762.743219px,965.073357px) rotate(0deg)} 100% {transform: translate(762.743219px,965.073357px) rotate(360deg)}}
        #rBg12_tr {animation: rBg12_tr__tr 12000ms linear infinite normal forwards}
        @keyframes rBg12_tr__tr { 0% {transform: translate(1474.519794px,224.809739px) rotate(390.798193deg)} 100% {transform: translate(1474.519794px,224.809739px) rotate(30.798193deg)}}
      `}</style>
      <g id="rBg3_tr" transform="translate(1485.265524px,923.716668px) rotate(107.849898deg)">
        <polygon points="-120,0 -60,-104 60,-104 120,0 60,104 -60,104" fill="url(#rBgGrad1)" transform="translate(-1485,-924)"/>
      </g>
      <g id="rBg4_tr" transform="translate(1106.552084px,11.479169px) rotate(-104.755169deg)">
        <polygon points="-80,0 -40,-69 40,-69 80,0 40,69 -40,69" fill="url(#rBgGrad2)" transform="translate(-1107,-11)"/>
      </g>
      <g id="rBg5_tr" transform="translate(77.951956px,316.57267px) rotate(179.858074deg)">
        <polygon points="-60,0 -30,-52 30,-52 60,0 30,52 -30,52" fill="url(#rBgGrad3)" transform="translate(-78,-317)"/>
      </g>
      <g id="rBg7_to" transform="translate(1625.977098px,922.267927px)">
        <circle r="90" fill="url(#rBgGrad1)" transform="translate(-1626,-922)"/>
      </g>
      <g id="rBg9_tr" transform="translate(1332.072109px,696.229369px) rotate(179.858074deg)">
        <circle r="45" fill="url(#rBgGrad2)" transform="translate(-1332,-696)"/>
      </g>
      <g id="rBg10_tr" transform="translate(820.871069px,284.144659px) rotate(179.858074deg)">
        <rect x="-55" y="-55" width="110" height="110" fill="url(#rBgGrad3)" transform="translate(-821,-284)"/>
      </g>
      <g id="rBg11_tr" transform="translate(762.743219px,965.073357px) rotate(0deg)">
        <circle r="130" fill="url(#rBgGrad1)" transform="translate(-763,-965)"/>
      </g>
      <g id="rBg12_tr" transform="translate(1474.519794px,224.809739px) rotate(390.798193deg)">
        <polygon points="0,-70 70,0 0,70 -70,0" fill="url(#rBgGrad2)" transform="translate(-1475,-225)"/>
      </g>
    </svg>
  )
}

/* ── tiny helpers ───────────────────────────────── */
const MEAL_OPTIONS = [
  { value: 'veg',    label: 'Vegetarian' },
  { value: 'nonveg', label: 'Non-Vegetarian' },
  { value: 'jain',   label: 'Jain' },
  { value: 'vegan',  label: 'Vegan' },
]
const COUNTRY_OPTIONS = [
  { code: '+91',  flag: '🇮🇳', name: 'India' },
  { code: '+1',   flag: '🇺🇸', name: 'USA' },
  { code: '+44',  flag: '🇬🇧', name: 'UK' },
  { code: '+61',  flag: '🇦🇺', name: 'Australia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+65',  flag: '🇸🇬', name: 'Singapore' },
  { code: '+1',   flag: '🇨🇦', name: 'Canada' },
]

function CountryCodeSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [sel, setSel] = useState(COUNTRY_OPTIONS[0])
  return (
    <div className={`rf-cc-wrap${open ? ' open' : ''}`} tabIndex={0}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false) }}>
      <button type="button" className="rf-cc-trigger" onClick={() => setOpen(p => !p)}>
        <span>{sel.flag}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 4l4 4 4-4"/>
        </svg>
      </button>
      {open && createPortal(
        <div className="rf-cc-dropdown">
          {COUNTRY_OPTIONS.map((c, i) => (
            <button key={i} type="button" className={`rf-cc-option${sel.code === c.code && sel.flag === c.flag ? ' selected' : ''}`}
              onClick={() => { setSel(c); onChange(c.code); setOpen(false) }}>
              <span>{c.flag}</span> <span>{c.name}</span> <span className="rf-cc-code">{c.code}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

/* ── Step components ────────────────────────────── */
function StepGuest({ form, setForm, errors }) {
  const [cc, setCc] = useState('+91')
  const rawPhone = form.phone.startsWith(cc) ? form.phone.slice(cc.length).trim() : form.phone

  return (
    <div className="rf-section-group">
      <div className="rf-section">
        <h3 className="rf-section-title"><span className="rf-section-bar"/>Personal Info</h3>
        <div className="rf-field">
          <label className="rf-label" htmlFor="gName">Full Name <span className="rf-req">*</span></label>
          <input id="gName" className={`rf-input${errors.name ? ' error' : ''}`} placeholder="e.g. Rahul Sharma"
            value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} autoComplete="name"/>
          {errors.name && <span className="rf-err">{errors.name}</span>}
        </div>
        <div className="rf-field-row">
          <div className="rf-field">
            <label className="rf-label" htmlFor="gAge">Age <span className="rf-req">*</span></label>
            <input id="gAge" type="number" min="1" max="120" className={`rf-input${errors.age ? ' error' : ''}`}
              placeholder="28" value={form.age}
              onChange={e => setForm(p => ({ ...p, age: e.target.value }))}/>
            {errors.age && <span className="rf-err">{errors.age}</span>}
          </div>
          <div className="rf-field">
            <label className="rf-label" htmlFor="gPhone">Phone Number <span className="rf-req">*</span></label>
            <div className="rf-phone-row">
              <CountryCodeSelect value={cc} onChange={v => { setCc(v); setForm(p => ({ ...p, phone: v + ' ' + rawPhone })) }}/>
              <input id="gPhone" type="tel" className={`rf-input rf-phone-input${errors.phone ? ' error' : ''}`}
                placeholder={cc === '+91' ? '98765 43210' : '555 1234'}
                value={rawPhone}
                onChange={e => setForm(p => ({ ...p, phone: cc + ' ' + e.target.value }))}/>
            </div>
            <span className="rf-phone-hint">— Select your country flag for the correct code</span>
            {errors.phone && <span className="rf-err">{errors.phone}</span>}
          </div>
        </div>
      </div>

      <div className="rf-section">
        <h3 className="rf-section-title"><span className="rf-section-bar"/>Contact</h3>
        <div className="rf-field">
          <label className="rf-label" htmlFor="gEmail">Email Address <span className="rf-opt">(optional)</span></label>
          <input id="gEmail" type="email" className={`rf-input${errors.email ? ' error' : ''}`}
            placeholder="you@example.com" value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))} autoComplete="email"/>
          {errors.email && <span className="rf-err">{errors.email}</span>}
        </div>
      </div>
    </div>
  )
}

function StepCompanions({ form, setForm }) {
  const adults   = form.companions.filter(c => c.type === 'adult')
  const children = form.companions.filter(c => c.type === 'child')

  const addAdult  = () => setForm(p => ({ ...p, companions: [...p.companions, { ...emptyAdult(), type: 'adult' }] }))
  const addChild  = () => setForm(p => ({ ...p, companions: [...p.companions, { ...emptyChild(), type: 'child' }] }))
  const removeComp = idx => setForm(p => ({ ...p, companions: p.companions.filter((_, i) => i !== idx) }))
  const updateComp = (idx, key, val) =>
    setForm(p => ({ ...p, companions: p.companions.map((c, i) => i === idx ? { ...c, [key]: val } : c) }))

  return (
    <div className="rf-section-group">
      <div className="rf-section">
        <div className="rf-sec-header">
          <h3 className="rf-section-title" style={{ marginBottom: 0 }}><span className="rf-section-bar"/>Adults</h3>
          <button type="button" className="rf-add-btn" onClick={addAdult}>+ Add Adult</button>
        </div>
        {adults.length === 0 && <p className="rf-empty-hint">No additional adults added.</p>}
        {form.companions.map((c, idx) => c.type !== 'adult' ? null : (
          <div key={idx} className="rf-comp-card">
            <div className="rf-comp-row">
              <div className="rf-field" style={{ flex: 2 }}>
                <label className="rf-label">Name</label>
                <input className="rf-input" placeholder="Full name" value={c.name}
                  onChange={e => updateComp(idx, 'name', e.target.value)}/>
              </div>
              <div className="rf-field" style={{ flex: 1.4 }}>
                <label className="rf-label">Phone</label>
                <input className="rf-input" placeholder="+91 …" value={c.phone}
                  onChange={e => updateComp(idx, 'phone', e.target.value)}/>
              </div>
              <button type="button" className="rf-remove-btn" onClick={() => removeComp(idx)} aria-label="Remove">✕</button>
            </div>
          </div>
        ))}
      </div>

      <div className="rf-section">
        <div className="rf-sec-header">
          <h3 className="rf-section-title" style={{ marginBottom: 0 }}><span className="rf-section-bar"/>Children</h3>
          <button type="button" className="rf-add-btn" onClick={addChild}>+ Add Child</button>
        </div>
        {children.length === 0 && <p className="rf-empty-hint">No children added.</p>}
        {form.companions.map((c, idx) => c.type !== 'child' ? null : (
          <div key={idx} className="rf-comp-card">
            <div className="rf-comp-row">
              <div className="rf-field" style={{ flex: 2 }}>
                <label className="rf-label">Name</label>
                <input className="rf-input" placeholder="Child's name" value={c.name}
                  onChange={e => updateComp(idx, 'name', e.target.value)}/>
              </div>
              <div className="rf-field" style={{ flex: 1 }}>
                <label className="rf-label">Age</label>
                <input className="rf-input" type="number" min="0" max="17" placeholder="5" value={c.age}
                  onChange={e => updateComp(idx, 'age', e.target.value)}/>
              </div>
              <button type="button" className="rf-remove-btn" onClick={() => removeComp(idx)} aria-label="Remove">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepTravel({ form, setForm }) {
  const today = new Date()
  const todayStr = today.toISOString().slice(0,10)
  return (
    <div className="rf-section-group">
      <div className="rf-section">
        <h3 className="rf-section-title"><span className="rf-section-bar"/>Arrival &amp; Departure</h3>
        <div className="rf-field-row">
          <div className="rf-field">
            <CustomDatePicker
              label="Arrival Date"
              value={form.arrivalDate}
              onChange={v => setForm(p => ({ ...p, arrivalDate: v }))}
              placeholder="Select arrival date"
              minDate={todayStr}
              type="arrival"
            />
          </div>
          <div className="rf-field">
            <CustomDatePicker
              label="Departure Date"
              value={form.departureDate}
              onChange={v => setForm(p => ({ ...p, departureDate: v }))}
              placeholder="Select departure date"
              minDate={form.arrivalDate || todayStr}
              type="departure"
            />
          </div>
        </div>
        <div className="rf-field">
          <label className="rf-label" htmlFor="tMode">Mode of Transport</label>
          <input id="tMode" className="rf-input" placeholder="e.g. Flight, Train, Car…"
            value={form.transport} onChange={e => setForm(p => ({ ...p, transport: e.target.value }))}/>
        </div>
        <div className="rf-field">
          <label className="rf-label" htmlFor="tNotes">Travel Notes <span className="rf-opt">(optional)</span></label>
          <textarea id="tNotes" className="rf-textarea" rows={3} placeholder="Flight number, arrival time, any special info…"
            value={form.travelNotes} onChange={e => setForm(p => ({ ...p, travelNotes: e.target.value }))}/>
        </div>
      </div>
    </div>
  )
}

function StepMeals({ form, setForm }) {
  const setPref = (who, val) => setForm(p => ({ ...p, meals: { ...p.meals, [who]: val } }))
  const allPeople = [
    { key: 'self', label: form.name || 'You' },
    ...form.companions.map((c, i) => ({ key: `comp_${i}`, label: c.name || `Companion ${i+1}` }))
  ]
  return (
    <div className="rf-section-group">
      <div className="rf-section">
        <h3 className="rf-section-title"><span className="rf-section-bar"/>Meal Preferences</h3>
        <p className="rf-section-hint">Select a meal preference for each guest.</p>
        {allPeople.map(({ key, label }) => (
          <div key={key} className="rf-meal-row">
            <span className="rf-meal-name">{label}</span>
            <div className="rf-meal-opts">
              {MEAL_OPTIONS.map(opt => (
                <button key={opt.value} type="button"
                  className={`rf-meal-chip${(form.meals[key] || '') === opt.value ? ' selected' : ''}`}
                  onClick={() => setPref(key, opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepStay({ form, setForm }) {
  return (
    <div className="rf-section-group">
      <div className="rf-section">
        <h3 className="rf-section-title"><span className="rf-section-bar"/>Accommodation</h3>
        <div className="rf-stay-opts">
          {[
            { v: 'provided', label: 'Use provided accommodation', desc: 'Stay in the arranged hotel/venue.' },
            { v: 'self',     label: 'Arranging my own stay',      desc: 'I have my own accommodation.' },
            { v: 'unsure',   label: 'Not decided yet',            desc: "I'll confirm later." },
          ].map(opt => (
            <button key={opt.v} type="button"
              className={`rf-stay-card${form.stayOption === opt.v ? ' selected' : ''}`}
              onClick={() => setForm(p => ({ ...p, stayOption: opt.v }))}>
              <span className="rf-stay-radio"/>
              <div>
                <div className="rf-stay-label">{opt.label}</div>
                <div className="rf-stay-desc">{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="rf-field" style={{ marginTop: '1rem' }}>
          <label className="rf-label" htmlFor="stayNotes">Additional Notes <span className="rf-opt">(optional)</span></label>
          <textarea id="stayNotes" className="rf-textarea" rows={3}
            placeholder="Any special requests or requirements…"
            value={form.stayNotes} onChange={e => setForm(p => ({ ...p, stayNotes: e.target.value }))}/>
        </div>
      </div>
    </div>
  )
}

function StepConfirm({ form }) {
  const mealLabel = v => MEAL_OPTIONS.find(o => o.value === v)?.label || '—'
  const allPeople = [
    { key: 'self', label: form.name || 'You' },
    ...form.companions.map((c, i) => ({ key: `comp_${i}`, label: c.name || `Companion ${i+1}` }))
  ]
  return (
    <div className="rf-section-group">
      <div className="rf-section">
        <h3 className="rf-section-title"><span className="rf-section-bar"/>Review Your Details</h3>
        <div className="rf-confirm-grid">
          <div className="rf-confirm-row"><span className="rf-confirm-lbl">Name</span><span>{form.name || '—'}</span></div>
          <div className="rf-confirm-row"><span className="rf-confirm-lbl">Age</span><span>{form.age || '—'}</span></div>
          <div className="rf-confirm-row"><span className="rf-confirm-lbl">Phone</span><span>{form.phone || '—'}</span></div>
          {form.email && <div className="rf-confirm-row"><span className="rf-confirm-lbl">Email</span><span>{form.email}</span></div>}
          <div className="rf-confirm-row"><span className="rf-confirm-lbl">Companions</span><span>{form.companions.length === 0 ? 'None' : form.companions.length}</span></div>
          <div className="rf-confirm-row"><span className="rf-confirm-lbl">Arrival</span><span>{form.arrivalDate || '—'}</span></div>
          <div className="rf-confirm-row"><span className="rf-confirm-lbl">Departure</span><span>{form.departureDate || '—'}</span></div>
          <div className="rf-confirm-row"><span className="rf-confirm-lbl">Transport</span><span>{form.transport || '—'}</span></div>
          <div className="rf-confirm-row"><span className="rf-confirm-lbl">Stay</span><span>{form.stayOption || '—'}</span></div>
        </div>
      </div>
      <div className="rf-section">
        <h3 className="rf-section-title"><span className="rf-section-bar"/>Meal Preferences</h3>
        {allPeople.map(({ key, label }) => (
          <div key={key} className="rf-confirm-row">
            <span className="rf-confirm-lbl">{label}</span>
            <span>{mealLabel(form.meals[key])}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Sidebar ────────────────────────────────────── */
function Sidebar({ eventInfo }) {
  /* 
   * FIX: All SVG icons inside sidebar now have EXPLICIT width/height="14"
   * attributes directly on the <svg> tag. This is the root cause fix —
   * CSS-only !important can be overridden by SVG's own intrinsic sizing
   * when no width/height is set on the element itself.
   */
  return (
    <aside className="rf-sidebar">
      <div className="rf-sb-logo-wrap">
        {eventInfo.logoUrl
          ? <img src={eventInfo.logoUrl} alt="Wedding logo" className="rf-sb-logo"/>
          : <div className="rf-sb-logo-placeholder">M &amp; N</div>}
      </div>
      <h2 className="rf-sb-names">{eventInfo.coupleNames}</h2>
      <p className="rf-sb-subtitle">WEDDING CELEBRATION</p>

      <div className="rf-sb-info">
        {/* DATE row */}
        <div className="rf-sb-row">
          <span className="rf-sb-row-icon" aria-hidden="true">
            <svg
              width="14" height="14"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ display: 'block', width: 14, height: 14, minWidth: 14, maxWidth: 14 }}
            >
              <rect x="2" y="3" width="16" height="16" rx="2.5"/>
              <path d="M2 8h16M6 1v4M14 1v4"/>
            </svg>
          </span>
          <span>{eventInfo.dateRange}</span>
        </div>

        {/* VENUE row */}
        <div className="rf-sb-row">
          <span className="rf-sb-row-icon" aria-hidden="true">
            <svg
              width="14" height="14"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ display: 'block', width: 14, height: 14, minWidth: 14, maxWidth: 14 }}
            >
              <circle cx="10" cy="9" r="3"/>
              <path d="M10 2a7 7 0 0 1 7 7c0 4-7 10-7 10S3 13 3 9a7 7 0 0 1 7-7z"/>
            </svg>
          </span>
          <span>{eventInfo.venue}</span>
        </div>

        {/* RSVP DEADLINE row */}
        <div className="rf-sb-row">
          <span className="rf-sb-row-icon" aria-hidden="true">
            <svg
              width="14" height="14"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ display: 'block', width: 14, height: 14, minWidth: 14, maxWidth: 14 }}
            >
              <circle cx="10" cy="10" r="8"/>
              <path d="M10 5v5l3 3"/>
            </svg>
          </span>
          <span>RSVP by {eventInfo.rsvpDeadline}</span>
        </div>
      </div>

      {/* Maps button */}
      <a
        href={MAPS_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="rf-sb-map-btn"
      >
        <svg
          width="13" height="13"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ display: 'block', width: 13, height: 13, minWidth: 13, maxWidth: 13, flexShrink: 0 }}
        >
          <circle cx="10" cy="9" r="3"/>
          <path d="M10 2a7 7 0 0 1 7 7c0 4-7 10-7 10S3 13 3 9a7 7 0 0 1 7-7z"/>
        </svg>
        View on Google Maps
      </a>

      {/* Contact */}
      <div className="rf-sb-contact">
        <span className="rf-sb-contact-icon" aria-hidden="true">
          <svg
            width="13" height="13"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ display: 'block', width: 13, height: 13, minWidth: 13, maxWidth: 13 }}
          >
            <rect x="2" y="5" width="16" height="12" rx="2"/>
            <path d="M2 7l8 5 8-5"/>
          </svg>
        </span>
        <span>Questions? <a href={`mailto:${eventInfo.contactEmail}`}>{eventInfo.contactEmail}</a></span>
      </div>
    </aside>
  )
}

/* ── Main RSVPForm ──────────────────────────────── */
export default function RSVPForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState('forward')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [eventInfo, setEventInfo] = useState({
    coupleNames:   'Margarita & Nitin',
    dateRange:     '25 – 26 November 2026',
    venue:         'Samode Bagh, Jaipur',
    rsvpDeadline:  '31 Oct 2026',
    contactEmail:  'contact@bride-groom.com',
    logoUrl:       null,
  })
  const [form, setForm] = useState({
    name: '', age: '', phone: '', email: '',
    companions: [],
    arrivalDate: '', departureDate: '', transport: '', travelNotes: '',
    meals: {},
    stayOption: '', stayNotes: '',
  })

  /* load event info */
  useEffect(() => {
    supabase.from('event_config').select('*').single().then(({ data }) => {
      if (data) setEventInfo(p => ({
        ...p,
        coupleNames:  data.couple_names   || p.coupleNames,
        dateRange:    data.date_range     || p.dateRange,
        venue:        data.venue          || p.venue,
        rsvpDeadline: data.rsvp_deadline  || p.rsvpDeadline,
        contactEmail: data.contact_email  || p.contactEmail,
        logoUrl:      data.logo_url       || null,
      }))
    })
  }, [])

  const stepLabels = ['Guest Detail', 'Companions', 'Travel', 'Meals', 'Stay', 'Confirm']
  const stepDescs  = [
    'Share your basic details to confirm attendance.',
    'Add any adults or children travelling with you.',
    'Let us know your travel and stay dates.',
    'Set meal preferences for every guest.',
    'Tell us about your accommodation plans.',
    'Review everything before submitting.',
  ]

  function validateStep(s) {
    const e = {}
    if (s === 0) {
      if (!form.name.trim())  e.name  = 'Name is required.'
      if (!form.age || isNaN(+form.age) || +form.age < 1) e.age = 'Enter a valid age.'
      if (!form.phone.trim()) e.phone = 'Phone number is required.'
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.'
    }
    return e
  }

  function next() {
    const e = validateStep(step)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setDir('forward')
    setStep(s => Math.min(s + 1, TOTAL - 1))
  }
  function back() {
    setErrors({})
    setDir('back')
    setStep(s => Math.max(s - 1, 0))
  }

  async function submit() {
    setSubmitting(true)
    try {
      const payload = {
        name:           form.name.trim(),
        age:            parseInt(form.age, 10),
        phone:          form.phone.trim(),
          email:          form.email.trim() || null,
        companions:     form.companions,
        arrival_date:   form.arrivalDate   || null,
        departure_date: form.departureDate || null,
        transport:      form.transport     || null,
        travel_notes:   form.travelNotes   || null,
        meals:          form.meals,
        stay_option:    form.stayOption    || null,
        stay_notes:     form.stayNotes     || null,
        submitted_at:   new Date().toISOString(),
      }
      const { error } = await supabase.from('rsvps').insert([payload])
      if (error) throw error
      navigate('/thank-you', { state: { name: form.name } })
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const stepComponents = [
    <StepGuest      key="guest"      form={form} setForm={setForm} errors={errors} />,
    <StepCompanions key="companions" form={form} setForm={setForm} />,
    <StepTravel     key="travel"     form={form} setForm={setForm} />,
    <StepMeals      key="meals"      form={form} setForm={setForm} />,
    <StepStay       key="stay"       form={form} setForm={setForm} />,
    <StepConfirm    key="confirm"    form={form} />,
  ]

  return (
    <div className="rf-root">
      <BgSvg />

      <div className="rf-layout">
        {/* ── Top Nav ── */}
        <nav className="rf-topnav" aria-label="Form progress">
          <div className="rf-nav-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="Logo">
              <circle cx="14" cy="14" r="13" stroke="var(--gold)" strokeWidth="1.5"/>
              <text x="14" y="18" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="12" fill="var(--gold-dark)" fontStyle="italic">M&amp;N</text>
            </svg>
            <span className="rf-nav-brand">RSVP</span>
          </div>
          <div className="rf-nav-step-badge">
            <span className="rf-nav-step-num">STEP {step + 1}</span>
            <span className="rf-nav-step-sep">OF</span>
            <span className="rf-nav-step-num">{TOTAL}</span>
          </div>
          <div className="rf-nav-dots" aria-hidden="true">
            {STEPS.map((_, i) => (
              <span key={i} className={`rf-nav-dot${i === step ? ' active' : i < step ? ' done' : ''}`}/>
            ))}
          </div>
        </nav>

        {/* ── Progress Bar ── */}
        <div className="rf-progress" role="progressbar" aria-valuenow={step+1} aria-valuemin={1} aria-valuemax={TOTAL}>
          <div className="rf-progress-fill" style={{ width: `${((step+1)/TOTAL)*100}%` }}/>
        </div>

        {/* ── Main Content ── */}
        <main className="rf-main">
          <div className="rf-content-wrap">
            <div className="rf-form-col">
              <div className={`rf-step-wrap rf-step-enter--${dir}`}>
                <div className="rf-step-header">
                  <h1 className="rf-step-title">{stepLabels[step]}</h1>
                  <p className="rf-step-desc">{stepDescs[step]}</p>
                </div>
                <div className="rf-step-body">
                  {stepComponents[step]}
                </div>
              </div>

              {/* ── Footer Nav ── */}
              <div className="rf-footer-nav">
                {step > 0 && (
                  <button type="button" className="rf-btn-back" onClick={back}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M10 3L5 8l5 5"/>
                    </svg>
                    Back
                  </button>
                )}
                {step < TOTAL - 1
                  ? <button type="button" className="rf-btn-next" onClick={next}>
                      Continue
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M6 3l5 5-5 5"/>
                      </svg>
                    </button>
                  : <button type="button" className="rf-btn-submit" onClick={submit} disabled={submitting}>
                      {submitting
                        ? <><span className="rf-spinner"/>Submitting…</>
                        : <>Submit RSVP
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M6 3l5 5-5 5"/>
                            </svg>
                          </>}
                    </button>
                }
              </div>
            </div>

            <Sidebar eventInfo={eventInfo} />
          </div>
        </main>
      </div>
    </div>
  )
}