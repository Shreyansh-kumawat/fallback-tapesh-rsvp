import { useState, useRef, useEffect, useCallback } from 'react'
import { FiPhone, FiChevronDown, FiSearch } from 'react-icons/fi'

const COUNTRIES = [
  { code: 'IN', dial: '+91',  flag: '🇮🇳', name: 'India' },
  { code: 'US', dial: '+1',   flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dial: '+44',  flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
  { code: 'AU', dial: '+61',  flag: '🇦🇺', name: 'Australia' },
  { code: 'CA', dial: '+1',   flag: '🇨🇦', name: 'Canada' },
  { code: 'SG', dial: '+65',  flag: '🇸🇬', name: 'Singapore' },
  { code: 'NZ', dial: '+64',  flag: '🇳🇿', name: 'New Zealand' },
  { code: 'DE', dial: '+49',  flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', dial: '+33',  flag: '🇫🇷', name: 'France' },
  { code: 'IT', dial: '+39',  flag: '🇮🇹', name: 'Italy' },
  { code: 'ES', dial: '+34',  flag: '🇪🇸', name: 'Spain' },
  { code: 'NL', dial: '+31',  flag: '🇳🇱', name: 'Netherlands' },
  { code: 'CH', dial: '+41',  flag: '🇨🇭', name: 'Switzerland' },
  { code: 'SE', dial: '+46',  flag: '🇸🇪', name: 'Sweden' },
  { code: 'NO', dial: '+47',  flag: '🇳🇴', name: 'Norway' },
  { code: 'DK', dial: '+45',  flag: '🇩🇰', name: 'Denmark' },
  { code: 'JP', dial: '+81',  flag: '🇯🇵', name: 'Japan' },
  { code: 'KR', dial: '+82',  flag: '🇰🇷', name: 'South Korea' },
  { code: 'CN', dial: '+86',  flag: '🇨🇳', name: 'China' },
  { code: 'HK', dial: '+852', flag: '🇭🇰', name: 'Hong Kong' },
  { code: 'MY', dial: '+60',  flag: '🇲🇾', name: 'Malaysia' },
  { code: 'TH', dial: '+66',  flag: '🇹🇭', name: 'Thailand' },
  { code: 'ID', dial: '+62',  flag: '🇮🇩', name: 'Indonesia' },
  { code: 'PH', dial: '+63',  flag: '🇵🇭', name: 'Philippines' },
  { code: 'PK', dial: '+92',  flag: '🇵🇰', name: 'Pakistan' },
  { code: 'BD', dial: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: 'LK', dial: '+94',  flag: '🇱🇰', name: 'Sri Lanka' },
  { code: 'NP', dial: '+977', flag: '🇳🇵', name: 'Nepal' },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: 'QA', dial: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: 'KW', dial: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: 'BH', dial: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: 'OM', dial: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: 'ZA', dial: '+27',  flag: '🇿🇦', name: 'South Africa' },
  { code: 'NG', dial: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'KE', dial: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: 'MX', dial: '+52',  flag: '🇲🇽', name: 'Mexico' },
  { code: 'BR', dial: '+55',  flag: '🇧🇷', name: 'Brazil' },
  { code: 'AR', dial: '+54',  flag: '🇦🇷', name: 'Argentina' },
  { code: 'RU', dial: '+7',   flag: '🇷🇺', name: 'Russia' },
]

/**
 * PhoneField
 * Props:
 *   value        — string: "<dial>|<number>"  e.g. "+91|9876543210"
 *   onChange     — (newValue: string) => void
 *   error        — string | undefined
 *   required     — bool
 *   label        — string (optional, default "Mobile Number")
 *   placeholder  — string (optional)
 */
export default function PhoneField({
  value = '+91|',
  onChange,
  error,
  required = false,
  label = 'Mobile Number',
  placeholder = 'Number daalen',
}) {
  const [dialCode, numberPart] = value.split('|')
  const selectedCountry = COUNTRIES.find((c) => c.dial === dialCode) || COUNTRIES[0]

  const [open, setOpen]       = useState(false)
  const [search, setSearch]   = useState('')
  const [highlighted, setHighlighted] = useState(0)

  const dropdownRef = useRef(null)
  const searchRef   = useRef(null)
  const listRef     = useRef(null)

  // Filter list
  const filtered = COUNTRIES.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.dial.includes(q) ||
      c.code.toLowerCase().includes(q)
    )
  })

  // Open → focus search
  useEffect(() => {
    if (open) {
      setSearch('')
      setHighlighted(0)
      setTimeout(() => searchRef.current?.focus(), 30)
    }
  }, [open])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Scroll highlighted item into view
  useEffect(() => {
    const item = listRef.current?.children[highlighted]
    item?.scrollIntoView({ block: 'nearest' })
  }, [highlighted])

  const selectCountry = useCallback((country) => {
    onChange(`${country.dial}|${numberPart ?? ''}`)
    setOpen(false)
  }, [onChange, numberPart])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && filtered[highlighted]) {
      e.preventDefault()
      selectCountry(filtered[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const handleNumberChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 15)
    onChange(`${selectedCountry.dial}|${digits}`)
  }

  const inputBase = `
    bg-transparent border border-white/10
    px-3 py-3 text-white text-sm placeholder-white/25
    transition-all duration-200 focus:outline-none
    focus:border-[#c9a84c] focus:shadow-[0_0_0_2px_rgba(201,168,76,0.12)]
  `.trim()

  return (
    <div>
      {label && (
        <label className="block text-[0.6rem] tracking-[0.3rem] uppercase text-[#c9a84c]/70 mb-2">
          {label}{required && ' *'}
        </label>
      )}

      <div className="flex gap-0" ref={dropdownRef}>

        {/* ── Country Code Button ── */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={`
              flex items-center gap-1.5 ${inputBase}
              border-r-0 min-w-[84px] justify-between
              ${open ? 'border-[#c9a84c] shadow-[0_0_0_2px_rgba(201,168,76,0.12)]' : ''}
            `}
          >
            <span className="text-base leading-none">{selectedCountry.flag}</span>
            <span className="text-white/80 text-xs tracking-wide">{selectedCountry.dial}</span>
            <FiChevronDown
              className={`text-white/30 text-xs transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* ── Dropdown ── */}
          {open && (
            <div
              className="
                absolute z-50 top-full left-0 mt-1 w-64
                bg-[#111] border border-white/15
                shadow-[0_8px_32px_rgba(0,0,0,0.6)]
              "
            >
              {/* Search bar */}
              <div className="p-2 border-b border-white/10">
                <div className="relative">
                  <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-white/30 text-xs" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setHighlighted(0)
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Naam ya code se search karein..."
                    className="
                      w-full bg-white/5 border border-white/10
                      pl-7 pr-3 py-2 text-white text-xs placeholder-white/25
                      focus:outline-none focus:border-[#c9a84c]/60
                    "
                  />
                </div>
              </div>

              {/* Results list */}
              <ul
                ref={listRef}
                className="max-h-48 overflow-y-auto overscroll-contain"
              >
                {filtered.length === 0 ? (
                  <li className="px-4 py-3 text-white/30 text-xs text-center">
                    Koi result nahi mila
                  </li>
                ) : (
                  filtered.map((country, idx) => (
                    <li
                      key={country.code}
                      onMouseEnter={() => setHighlighted(idx)}
                      onClick={() => selectCountry(country)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 cursor-pointer
                        text-sm transition-colors duration-100
                        ${
                          highlighted === idx
                            ? 'bg-[#c9a84c]/15 text-[#c9a84c]'
                            : 'text-white/70 hover:bg-white/5'
                        }
                        ${
                          selectedCountry.code === country.code
                            ? 'text-[#c9a84c]'
                            : ''
                        }
                      `}
                    >
                      <span className="text-base">{country.flag}</span>
                      <span className="flex-1 text-xs truncate">{country.name}</span>
                      <span className="text-xs text-white/40 font-mono">{country.dial}</span>
                      {selectedCountry.code === country.code && (
                        <span className="text-[#c9a84c] text-xs">✓</span>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* ── Number Input ── */}
        <div className="relative flex-1">
          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-sm pointer-events-none" />
          <input
            type="tel"
            inputMode="numeric"
            value={numberPart ?? ''}
            onChange={handleNumberChange}
            placeholder={placeholder}
            className={`${inputBase} w-full pl-9`}
          />
        </div>

      </div>

      {error && (
        <p className="text-red-400 text-[0.7rem] mt-1">{error}</p>
      )}
    </div>
  )
}
