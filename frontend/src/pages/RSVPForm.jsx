import { useMemo, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase.js'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import './RSVPForm.css'
import CustomDatePicker from '../components/CustomDatePicker.jsx'

const STEPS = ['guest','companions','travel','meals','stay','confirm']
const TOTAL = STEPS.length

const emptyAdult = () => ({ name: '', phone: '' })
const emptyChild = () => ({ name: '', age: '' })

const MAPS_LINK = 'https://maps.app.goo.gl/6EnhNqNissXUDHJ59'

/* ─ BgWash ─ */
function BgWash() {
  return <div className="rf-bg-wash" aria-hidden="true" />
}

/* ─ Floating Petals ─ */
const PETALS = [
  { left: '8%',  delay: '0s',   dur: '14s', size: 10, color: '#e8c57a' },
  { left: '22%', delay: '3s',   dur: '18s', size: 8,  color: '#e8a09a' },
  { left: '38%', delay: '6s',   dur: '12s', size: 12, color: '#a8c5ac' },
  { left: '55%', delay: '1.5s', dur: '16s', size: 9,  color: '#e8c57a' },
  { left: '70%', delay: '4s',   dur: '20s', size: 7,  color: '#e8a09a' },
  { left: '85%', delay: '8s',   dur: '15s', size: 11, color: '#a8c5ac' },
]
function FloatingPetals() {
  return (
    <>
      {PETALS.map((p, i) => (
        <div key={i} className="rf-petal"
          style={{ left: p.left, animationDelay: p.delay, animationDuration: p.dur }}
          aria-hidden="true">
          <svg width={p.size} height={p.size} viewBox="0 0 12 12">
            <ellipse cx="6" cy="6" rx="5" ry="3" fill={p.color} opacity="0.85"
              transform="rotate(-30 6 6)"/>
          </svg>
        </div>
      ))}
    </>
  )
}

/* ─ BgSvg ─ */
function BgSvg() {
  return (
    <svg className="rf-bg-svg" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 700 400" shapeRendering="geometricPrecision"
      textRendering="geometricPrecision" aria-hidden="true">
      <defs>
        <linearGradient id="rBgGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8c57a" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#f5e8cc" stopOpacity="0.10"/>
        </linearGradient>
        <linearGradient id="rBgGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8a09a" stopOpacity="0.14"/>
          <stop offset="100%" stopColor="#faeae9" stopOpacity="0.08"/>
        </linearGradient>
        <linearGradient id="rBgGrad3" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8c5ac" stopOpacity="0.14"/>
          <stop offset="100%" stopColor="#edf4ee" stopOpacity="0.07"/>
        </linearGradient>
      </defs>
      <style>{`
        #rBg3_tr{animation:rBg3_tr__tr 12000ms linear infinite}
        @keyframes rBg3_tr__tr{0%{transform:translate(1485px,924px) rotate(108deg)}100%{transform:translate(1485px,924px) rotate(252deg)}}
        #rBg7_to{animation:rBg7_to__to 12000ms linear infinite}
        @keyframes rBg7_to__to{0%{transform:translate(1626px,922px)}33%{transform:translate(1568px,819px)}67%{transform:translate(1427px,988px)}100%{transform:translate(1626px,922px)}}
        #rBg11_tr{animation:rBg11_tr__tr 12000ms linear infinite}
        @keyframes rBg11_tr__tr{0%{transform:translate(763px,965px) rotate(0deg)}100%{transform:translate(763px,965px) rotate(360deg)}}
      `}</style>
      <g id="rBg3_tr" transform="translate(1485px,924px) rotate(108deg)">
        <polygon points="-120,0 -60,-104 60,-104 120,0 60,104 -60,104" fill="url(#rBgGrad1)" transform="translate(-1485,-924)"/>
      </g>
      <g id="rBg7_to" transform="translate(1626px,922px)">
        <circle r="90" fill="url(#rBgGrad1)" transform="translate(-1626,-922)"/>
      </g>
      <g id="rBg11_tr" transform="translate(763px,965px) rotate(0deg)">
        <circle r="130" fill="url(#rBgGrad2)" transform="translate(-763,-965)"/>
      </g>
    </svg>
  )
}

/* ─ MEAL OPTIONS ─ */
const MEAL_OPTIONS = [
  { value: 'veg',    label: 'Vegetarian' },
  { value: 'nonveg', label: 'Non-Vegetarian' },
  { value: 'jain',   label: 'Jain' },
  { value: 'vegan',  label: 'Vegan' },
]

/* ─ STEP: GUEST ─ */
function StepGuest({ form, setForm, errors }) {
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
            <label className="rf-label" htmlFor="gPhone">Phone <span className="rf-req">*</span></label>
            <PhoneInput
              id="gPhone"
              international
              defaultCountry="IN"
              value={form.phone}
              onChange={val => setForm(p => ({ ...p, phone: val || '' }))}
              className={`rf-phone-input-wrap${errors.phone ? ' error' : ''}`}
            />
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

/* ─ STEP: COMPANIONS ─ */
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
                <input className="rf-input" placeholder="+91…" value={c.phone}
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

/* ─ STEP: TRAVEL ─ */
function StepTravel({ form, setForm }) {
  const today = new Date()
  const todayStr = today.toISOString().slice(0,10)
  return (
    <div className="rf-section-group">
      <div className="rf-section">
        <h3 className="rf-section-title"><span className="rf-section-bar"/>Arrival &amp; Departure</h3>
        <div className="rf-field-row">
          <div className="rf-field">
            <CustomDatePicker label="Arrival Date" value={form.arrivalDate}
              onChange={v => setForm(p => ({ ...p, arrivalDate: v }))}
              placeholder="Select arrival date" minDate={todayStr} type="arrival"/>
          </div>
          <div className="rf-field">
            <CustomDatePicker label="Departure Date" value={form.departureDate}
              onChange={v => setForm(p => ({ ...p, departureDate: v }))}
              placeholder="Select departure date" minDate={form.arrivalDate || todayStr} type="departure"/>
          </div>
        </div>
        <div className="rf-field">
          <label className="rf-label" htmlFor="tMode">Mode of Transport</label>
          <input id="tMode" className="rf-input" placeholder="e.g. Flight, Train, Car…"
            value={form.transport} onChange={e => setForm(p => ({ ...p, transport: e.target.value }))}/>
        </div>
        <div className="rf-field">
          <label className="rf-label" htmlFor="tNotes">Travel Notes <span className="rf-opt">(optional)</span></label>
          <textarea id="tNotes" className="rf-textarea" rows={3}
            placeholder="Flight number, arrival time, any special info…"
            value={form.travelNotes} onChange={e => setForm(p => ({ ...p, travelNotes: e.target.value }))}/>
        </div>
      </div>
    </div>
  )
}

/* ─ STEP: MEALS ─ */
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
          <div key={key} style={{ marginBottom: 20 }}>
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

/* ─ STEP: STAY ─ */
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

/* ─ STEP: CONFIRM ─ */
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

/* ─ MAIN ─ */
export default function RSVPForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState('forward')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [eventInfo, setEventInfo] = useState({
    coupleNames:  'Margarita & Nitin',
    dateRange:    '25 – 26 November 2026',
    venue:        'Samode Bagh, Jaipur',
    rsvpDeadline: '31 Oct 2026',
    contactEmail: 'contact@bride-groom.com',
    logoUrl:      null,
  })
  const [form, setForm] = useState({
    name: '', age: '', phone: '', email: '',
    companions: [],
    arrivalDate: '', departureDate: '', transport: '', travelNotes: '',
    meals: {},
    stayOption: '', stayNotes: '',
  })

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
      if (!form.phone || !form.phone.trim()) e.phone = 'Phone number is required.'
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.'
    }
    return e
  }

  function next() {
    const e = validateStep(step)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({}); setDir('forward'); setStep(s => Math.min(s + 1, TOTAL - 1))
  }
  function back() {
    setErrors({}); setDir('back'); setStep(s => Math.max(s - 1, 0))
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
      <BgWash />
      <FloatingPetals />
      <BgSvg />

      <div className="rf-layout">
        {/* TOP NAV */}
        <nav className="rf-topnav" aria-label="Form progress">
          <div className="rf-topnav-inner">
            <div className="rf-nav-logo">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-label="Logo">
                <circle cx="14" cy="14" r="13" stroke="#c9973a" strokeWidth="1.5"/>
                <text x="14" y="18" textAnchor="middle" fontFamily="Cormorant Garamond, serif"
                  fontSize="10" fill="#8a6520" fontStyle="italic">M&amp;N</text>
              </svg>
              <span className="rf-nav-brand">Margarita &amp; Nitin</span>
            </div>

            <div className="rf-nav-dots" aria-hidden="true">
              {STEPS.map((_, i) => (
                <div key={i} className="rf-nav-dot-unit">
                  {i > 0 && <div className="rf-nav-dot-line" />}
                  <div className={`rf-nav-dot${i === step ? ' active' : i < step ? ' done' : ''}`}>
                    {i < step
                      ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M2 5l2.5 2.5L8 2.5"/></svg>
                      : i + 1
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className="rf-nav-step-badge">
              <span className="rf-nav-step-num">{step + 1}</span>
              <span className="rf-nav-step-sep">/</span>
              <span>{TOTAL}</span>
            </div>
          </div>
        </nav>

        {/* PROGRESS BAR */}
        <div className="rf-progress" role="progressbar" aria-valuenow={step+1} aria-valuemin={1} aria-valuemax={TOTAL}>
          <div className="rf-progress-fill" style={{ width: `${((step+1)/TOTAL)*100}%` }}/>
        </div>

        {/* MAIN */}
        <main className="rf-main">
          <div className="rf-content-wrap">
            <div className="rf-form-col">
              <div className={`rf-step-wrap rf-step-enter--${dir}`}>
                {/* KICKER */}
                <div className="rf-step-kicker">Step {step + 1} of {TOTAL}</div>

                {/* STEP HEADER */}
                <div className="rf-step-header">
                  <h2 className="rf-step-title">{stepLabels[step]}</h2>
                  <p className="rf-step-desc">{stepDescs[step]}</p>
                </div>

                {/* STEP BODY */}
                <div className="rf-step-body">
                  {stepComponents[step]}
                </div>

                {/* FOOTER NAV */}
                <div className="rf-footer-nav">
                  {step > 0 && (
                    <button type="button" className="rf-btn-back" onClick={back}>
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 3L5 8l5 5"/></svg>
                      Back
                    </button>
                  )}
                  {step < TOTAL - 1
                    ? <button type="button" className="rf-btn-next" onClick={next}>
                        Continue
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3l5 5-5 5"/></svg>
                        <span className="rf-btn-arr">→</span>
                      </button>
                    : <button type="button" className="rf-btn-submit" onClick={submit} disabled={submitting}>
                        {submitting
                          ? <><span className="rf-spinner"/>Submitting…</>
                          : <>Submit RSVP <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3l5 5-5 5"/></svg></>}
                      </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
