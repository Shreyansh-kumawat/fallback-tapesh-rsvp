import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './CustomDatePicker.css'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

export default function CustomDatePicker({
  label,
  value,
  onChange,
  placeholder = 'Select date...',
  minDate,
  type,
}) {
  const today = new Date()
  const initDate = value ? new Date(value + 'T00:00:00') : null
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(initDate ? initDate.getFullYear() : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(initDate ? initDate.getMonth() : today.getMonth())
  const [mode, setMode] = useState('days')
  const wrapRef = useRef(null)
  const triggerRef = useRef(null)
  const popupRef = useRef(null)

  function toYMD(d) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00')
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
    }
  }, [value])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleClose = () => { setOpen(false); setMode('days') }
  const handleOpen = () => { setOpen(p => !p); setMode('days') }

  const selectedDate = value ? new Date(value + 'T00:00:00') : null

  const formatDisplay = d => {
    if (!d) return ''
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
  const getFirstDay = (y, m) => new Date(y, m, 1).getDay()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const getCellYMD = day => {
    const y = viewYear
    const m = String(viewMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const isDisabled = day => {
    if (!minDate) return false
    return getCellYMD(day) < minDate
  }

  const selectDay = day => {
    if (isDisabled(day)) return
    onChange(toYMD(new Date(viewYear, viewMonth, day)))
    handleClose()
  }

  const isSelected = day =>
    selectedDate &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getFullYear() === viewYear

  const daysCount = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDay(viewYear, viewMonth)
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysCount; d++) cells.push(d)

  const yearStart = Math.floor(viewYear / 12) * 12
  const years = Array.from({ length: 12 }, (_, i) => yearStart + i)

  const portal = open ? createPortal(
    <>
      <div className="cdp-overlay" onClick={handleClose} aria-hidden="true" />
      <div
        ref={popupRef}
        className="cdp-popup cdp-popup--centered"
        role="dialog"
        aria-modal="true"
        aria-label={label || 'Select date'}
      >
        <div className="cdp-header">
          <button type="button" className="cdp-nav-btn"
            onClick={mode === 'years' ? () => setViewYear(y => y - 12) : prevMonth}
            aria-label="Previous">
            &#8249;
          </button>
          <div className="cdp-header-center">
            <button type="button" className="cdp-month-btn"
              onClick={() => setMode(m => m === 'months' ? 'days' : 'months')}>
              {MONTHS[viewMonth]}
            </button>
            <button type="button" className="cdp-year-btn"
              onClick={() => setMode(m => m === 'years' ? 'days' : 'years')}>
              {viewYear}
            </button>
          </div>
          <button type="button" className="cdp-nav-btn"
            onClick={mode === 'years' ? () => setViewYear(y => y + 12) : nextMonth}
            aria-label="Next">
            &#8250;
          </button>
        </div>

        {mode === 'days' && (
          <div className="cdp-days-view">
            <div className="cdp-weekdays">
              {DAYS.map(d => <div key={d} className="cdp-wd">{d}</div>)}
            </div>
            <div className="cdp-grid">
              {cells.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} className="cdp-cell empty" />
                const disabled = isDisabled(day)
                const selected = isSelected(day)
                let cls = 'cdp-cell'
                if (selected) cls += ' selected'
                else if (disabled) cls += ' disabled'
                return (
                  <button
                    key={day}
                    type="button"
                    className={cls}
                    onClick={() => selectDay(day)}
                    disabled={disabled}
                    aria-pressed={selected}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {mode === 'months' && (
          <div className="cdp-months-view">
            {MONTHS.map((m, i) => (
              <button key={m} type="button"
                className={`cdp-month-cell${i === viewMonth ? ' selected' : ''}${
                  selectedDate && selectedDate.getFullYear() === viewYear && selectedDate.getMonth() === i ? ' has-sel' : ''}`}
                onClick={() => { setViewMonth(i); setMode('days') }}>
                {m.slice(0,3)}
              </button>
            ))}
          </div>
        )}

        {mode === 'years' && (
          <div className="cdp-years-view">
            {years.map(y => (
              <button key={y} type="button"
                className={`cdp-year-cell${y === viewYear ? ' selected' : ''}${
                  selectedDate && selectedDate.getFullYear() === y ? ' has-sel' : ''}`}
                onClick={() => { setViewYear(y); setMode('months') }}>
                {y}
              </button>
            ))}
          </div>
        )}

        <div className="cdp-footer">
          <button type="button" className="cdp-today-btn" onClick={() => {
            const t = new Date()
            setViewYear(t.getFullYear())
            setViewMonth(t.getMonth())
            setMode('days')
            onChange(toYMD(t))
            handleClose()
          }}>Today</button>
          {value && (
            <button type="button" className="cdp-clear-btn"
              onClick={() => { onChange(''); handleClose() }}>Clear</button>
          )}
        </div>
      </div>
    </>,
    document.body
  ) : null

  return (
    <div className="cdp-wrap" ref={wrapRef}>
      {label && <label className="cdp-label">{label}</label>}
      <button
        ref={triggerRef}
        type="button"
        className={`cdp-trigger${open ? ' open' : ''}`}
        onClick={handleOpen}
        aria-label={label || 'Select date'}
      >
        <svg className="cdp-cal-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="16" height="16" rx="2.5"/>
          <path d="M2 8h16M6 1v4M14 1v4"/>
        </svg>
        <span className={`cdp-trigger-text${!value ? ' placeholder' : ''}`}>
          {value ? formatDisplay(selectedDate) : placeholder}
        </span>
        <svg className={`cdp-chevron${open ? ' open' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 4l4 4 4-4"/>
        </svg>
      </button>
      {portal}
    </div>
  )
}
