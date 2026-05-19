import { useState, useRef, useEffect } from 'react'
import './CustomDatePicker.css'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

export default function CustomDatePicker({ label, value, onChange, placeholder = 'Select date...' }) {
  const today = new Date()
  const initDate = value ? new Date(value + 'T00:00:00') : null
  const [open, setOpen] = useState(false)
  const [openUp, setOpenUp] = useState(false)
  const [popupStyle, setPopupStyle] = useState({})
  const [viewYear, setViewYear] = useState(initDate ? initDate.getFullYear() : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(initDate ? initDate.getMonth() : today.getMonth())
  const [mode, setMode] = useState('days') // 'days' | 'months' | 'years'
  const wrapRef = useRef(null)
  const triggerRef = useRef(null)

  // sync view when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00')
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
    }
  }, [value])

  useEffect(() => {
    const handler = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
        setMode('days')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Recalculate popup position on scroll/resize while open
  useEffect(() => {
    if (!open) return
    const updatePos = () => calcPopupPosition()
    window.addEventListener('scroll', updatePos, true)
    window.addEventListener('resize', updatePos)
    return () => {
      window.removeEventListener('scroll', updatePos, true)
      window.removeEventListener('resize', updatePos)
    }
  }, [open])

  const POPUP_WIDTH = 288
  const POPUP_HEIGHT = 380

  const calcPopupPosition = () => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const goUp = spaceBelow < POPUP_HEIGHT
    setOpenUp(goUp)

    // Horizontal: align left edge with trigger, clamp to viewport
    let left = rect.left
    const maxLeft = window.innerWidth - POPUP_WIDTH - 8
    if (left > maxLeft) left = maxLeft
    if (left < 8) left = 8

    const style = {
      left: `${left}px`,
      width: `${Math.min(POPUP_WIDTH, window.innerWidth - 16)}px`,
    }

    if (goUp) {
      style.top = 'auto'
      style.bottom = `${window.innerHeight - rect.top + 6}px`
    } else {
      style.top = `${rect.bottom + 6}px`
      style.bottom = 'auto'
    }

    setPopupStyle(style)
  }

  const handleOpen = () => {
    if (!open) {
      calcPopupPosition()
    }
    setOpen(p => !p)
    setMode('days')
  }

  const selectedDate = value ? new Date(value + 'T00:00:00') : null

  const formatDisplay = d => {
    if (!d) return ''
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const toYMD = d => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
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

  const selectDay = day => {
    const d = new Date(viewYear, viewMonth, day)
    onChange(toYMD(d))
    setOpen(false)
    setMode('days')
  }

  const isToday = day => {
    return today.getDate() === day &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
  }

  const isSelected = day => {
    return selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getFullYear() === viewYear
  }

  const daysCount = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDay(viewYear, viewMonth)
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysCount; d++) cells.push(d)

  // Year range for year picker
  const yearStart = Math.floor(viewYear / 12) * 12
  const years = Array.from({ length: 12 }, (_, i) => yearStart + i)

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

      {open && (
        <div
          className={`cdp-popup${openUp ? ' open-up' : ''}`}
          style={popupStyle}
        >
          {/* Header */}
          <div className="cdp-header">
            <button type="button" className="cdp-nav-btn" onClick={mode === 'years' ? () => { setViewYear(y => y - 12) } : prevMonth} aria-label="Previous">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M8 2L4 6l4 4"/></svg>
            </button>

            <div className="cdp-header-center">
              <button
                type="button"
                className="cdp-month-btn"
                onClick={() => setMode(m => m === 'months' ? 'days' : 'months')}
              >
                {MONTHS[viewMonth]}
              </button>
              <button
                type="button"
                className="cdp-year-btn"
                onClick={() => setMode(m => m === 'years' ? 'days' : 'years')}
              >
                {viewYear}
              </button>
            </div>

            <button type="button" className="cdp-nav-btn" onClick={mode === 'years' ? () => { setViewYear(y => y + 12) } : nextMonth} aria-label="Next">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 2l4 4-4 4"/></svg>
            </button>
          </div>

          {/* DAYS VIEW */}
          {mode === 'days' && (
            <div className="cdp-days-view">
              <div className="cdp-weekdays">
                {DAYS.map(d => <div key={d} className="cdp-wd">{d}</div>)}
              </div>
              <div className="cdp-grid">
                {cells.map((day, i) =>
                  day === null
                    ? <div key={`e-${i}`} className="cdp-cell empty" />
                    : <button
                        key={day}
                        type="button"
                        className={`cdp-cell${
                          isSelected(day) ? ' selected' : isToday(day) ? ' today' : ''
                        }`}
                        onClick={() => selectDay(day)}
                      >{day}</button>
                )}
              </div>
            </div>
          )}

          {/* MONTHS VIEW */}
          {mode === 'months' && (
            <div className="cdp-months-view">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  className={`cdp-month-cell${
                    i === viewMonth ? ' selected' : ''
                  }${
                    selectedDate && selectedDate.getFullYear() === viewYear && selectedDate.getMonth() === i ? ' has-sel' : ''
                  }`}
                  onClick={() => { setViewMonth(i); setMode('days') }}
                >{m.slice(0,3)}</button>
              ))}
            </div>
          )}

          {/* YEARS VIEW */}
          {mode === 'years' && (
            <div className="cdp-years-view">
              {years.map(y => (
                <button
                  key={y}
                  type="button"
                  className={`cdp-year-cell${
                    y === viewYear ? ' selected' : ''
                  }${
                    selectedDate && selectedDate.getFullYear() === y ? ' has-sel' : ''
                  }`}
                  onClick={() => { setViewYear(y); setMode('months') }}
                >{y}</button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="cdp-footer">
            <button type="button" className="cdp-today-btn" onClick={() => {
              const t = new Date()
              setViewYear(t.getFullYear())
              setViewMonth(t.getMonth())
              setMode('days')
              onChange(toYMD(t))
              setOpen(false)
            }}>Today</button>
            {value && (
              <button type="button" className="cdp-clear-btn" onClick={() => { onChange(''); setOpen(false) }}>Clear</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
