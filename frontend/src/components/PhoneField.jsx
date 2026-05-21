import { useState, useRef, useEffect, useCallback } from 'react'
import { FiPhone, FiChevronDown, FiSearch } from 'react-icons/fi'

// Helper: convert ISO 3166-1 alpha-2 country code to flag emoji
function getFlagEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('')
}

const COUNTRIES = [
  // ── Top picks pinned first ──
  { code: 'IN', dial: '+91',   name: 'India' },
  { code: 'US', dial: '+1',    name: 'United States' },
  { code: 'GB', dial: '+44',   name: 'United Kingdom' },
  { code: 'AE', dial: '+971',  name: 'UAE' },
  { code: 'AU', dial: '+61',   name: 'Australia' },
  { code: 'CA', dial: '+1',    name: 'Canada' },
  { code: 'SG', dial: '+65',   name: 'Singapore' },
  // ── All countries A–Z ──
  { code: 'AF', dial: '+93',   name: 'Afghanistan' },
  { code: 'AL', dial: '+355',  name: 'Albania' },
  { code: 'DZ', dial: '+213',  name: 'Algeria' },
  { code: 'AD', dial: '+376',  name: 'Andorra' },
  { code: 'AO', dial: '+244',  name: 'Angola' },
  { code: 'AG', dial: '+1268', name: 'Antigua and Barbuda' },
  { code: 'AR', dial: '+54',   name: 'Argentina' },
  { code: 'AM', dial: '+374',  name: 'Armenia' },
  { code: 'AW', dial: '+297',  name: 'Aruba' },
  { code: 'AT', dial: '+43',   name: 'Austria' },
  { code: 'AZ', dial: '+994',  name: 'Azerbaijan' },
  { code: 'BS', dial: '+1242', name: 'Bahamas' },
  { code: 'BH', dial: '+973',  name: 'Bahrain' },
  { code: 'BD', dial: '+880',  name: 'Bangladesh' },
  { code: 'BB', dial: '+1246', name: 'Barbados' },
  { code: 'BY', dial: '+375',  name: 'Belarus' },
  { code: 'BE', dial: '+32',   name: 'Belgium' },
  { code: 'BZ', dial: '+501',  name: 'Belize' },
  { code: 'BJ', dial: '+229',  name: 'Benin' },
  { code: 'BT', dial: '+975',  name: 'Bhutan' },
  { code: 'BO', dial: '+591',  name: 'Bolivia' },
  { code: 'BA', dial: '+387',  name: 'Bosnia and Herzegovina' },
  { code: 'BW', dial: '+267',  name: 'Botswana' },
  { code: 'BR', dial: '+55',   name: 'Brazil' },
  { code: 'BN', dial: '+673',  name: 'Brunei' },
  { code: 'BG', dial: '+359',  name: 'Bulgaria' },
  { code: 'BF', dial: '+226',  name: 'Burkina Faso' },
  { code: 'BI', dial: '+257',  name: 'Burundi' },
  { code: 'CV', dial: '+238',  name: 'Cabo Verde' },
  { code: 'KH', dial: '+855',  name: 'Cambodia' },
  { code: 'CM', dial: '+237',  name: 'Cameroon' },
  { code: 'CF', dial: '+236',  name: 'Central African Republic' },
  { code: 'TD', dial: '+235',  name: 'Chad' },
  { code: 'CL', dial: '+56',   name: 'Chile' },
  { code: 'CN', dial: '+86',   name: 'China' },
  { code: 'CO', dial: '+57',   name: 'Colombia' },
  { code: 'KM', dial: '+269',  name: 'Comoros' },
  { code: 'CD', dial: '+243',  name: 'Congo (DRC)' },
  { code: 'CG', dial: '+242',  name: 'Congo (Republic)' },
  { code: 'CR', dial: '+506',  name: 'Costa Rica' },
  { code: 'HR', dial: '+385',  name: 'Croatia' },
  { code: 'CU', dial: '+53',   name: 'Cuba' },
  { code: 'CW', dial: '+599',  name: 'Curaçao' },
  { code: 'CY', dial: '+357',  name: 'Cyprus' },
  { code: 'CZ', dial: '+420',  name: 'Czech Republic' },
  { code: 'DK', dial: '+45',   name: 'Denmark' },
  { code: 'DJ', dial: '+253',  name: 'Djibouti' },
  { code: 'DM', dial: '+1767', name: 'Dominica' },
  { code: 'DO', dial: '+1849', name: 'Dominican Republic' },
  { code: 'EC', dial: '+593',  name: 'Ecuador' },
  { code: 'EG', dial: '+20',   name: 'Egypt' },
  { code: 'SV', dial: '+503',  name: 'El Salvador' },
  { code: 'GQ', dial: '+240',  name: 'Equatorial Guinea' },
  { code: 'ER', dial: '+291',  name: 'Eritrea' },
  { code: 'EE', dial: '+372',  name: 'Estonia' },
  { code: 'SZ', dial: '+268',  name: 'Eswatini' },
  { code: 'ET', dial: '+251',  name: 'Ethiopia' },
  { code: 'FJ', dial: '+679',  name: 'Fiji' },
  { code: 'FI', dial: '+358',  name: 'Finland' },
  { code: 'FR', dial: '+33',   name: 'France' },
  { code: 'GA', dial: '+241',  name: 'Gabon' },
  { code: 'GM', dial: '+220',  name: 'Gambia' },
  { code: 'GE', dial: '+995',  name: 'Georgia' },
  { code: 'DE', dial: '+49',   name: 'Germany' },
  { code: 'GH', dial: '+233',  name: 'Ghana' },
  { code: 'GR', dial: '+30',   name: 'Greece' },
  { code: 'GD', dial: '+1473', name: 'Grenada' },
  { code: 'GT', dial: '+502',  name: 'Guatemala' },
  { code: 'GN', dial: '+224',  name: 'Guinea' },
  { code: 'GW', dial: '+245',  name: 'Guinea-Bissau' },
  { code: 'GY', dial: '+592',  name: 'Guyana' },
  { code: 'HT', dial: '+509',  name: 'Haiti' },
  { code: 'HN', dial: '+504',  name: 'Honduras' },
  { code: 'HK', dial: '+852',  name: 'Hong Kong' },
  { code: 'HU', dial: '+36',   name: 'Hungary' },
  { code: 'IS', dial: '+354',  name: 'Iceland' },
  { code: 'ID', dial: '+62',   name: 'Indonesia' },
  { code: 'IR', dial: '+98',   name: 'Iran' },
  { code: 'IQ', dial: '+964',  name: 'Iraq' },
  { code: 'IE', dial: '+353',  name: 'Ireland' },
  { code: 'IL', dial: '+972',  name: 'Israel' },
  { code: 'IT', dial: '+39',   name: 'Italy' },
  { code: 'CI', dial: '+225',  name: 'Ivory Coast' },
  { code: 'JM', dial: '+1876', name: 'Jamaica' },
  { code: 'JP', dial: '+81',   name: 'Japan' },
  { code: 'JO', dial: '+962',  name: 'Jordan' },
  { code: 'KZ', dial: '+77',   name: 'Kazakhstan' },
  { code: 'KE', dial: '+254',  name: 'Kenya' },
  { code: 'KI', dial: '+686',  name: 'Kiribati' },
  { code: 'KW', dial: '+965',  name: 'Kuwait' },
  { code: 'KG', dial: '+996',  name: 'Kyrgyzstan' },
  { code: 'LA', dial: '+856',  name: 'Laos' },
  { code: 'LV', dial: '+371',  name: 'Latvia' },
  { code: 'LB', dial: '+961',  name: 'Lebanon' },
  { code: 'LS', dial: '+266',  name: 'Lesotho' },
  { code: 'LR', dial: '+231',  name: 'Liberia' },
  { code: 'LY', dial: '+218',  name: 'Libya' },
  { code: 'LI', dial: '+423',  name: 'Liechtenstein' },
  { code: 'LT', dial: '+370',  name: 'Lithuania' },
  { code: 'LU', dial: '+352',  name: 'Luxembourg' },
  { code: 'MO', dial: '+853',  name: 'Macau' },
  { code: 'MG', dial: '+261',  name: 'Madagascar' },
  { code: 'MW', dial: '+265',  name: 'Malawi' },
  { code: 'MY', dial: '+60',   name: 'Malaysia' },
  { code: 'MV', dial: '+960',  name: 'Maldives' },
  { code: 'ML', dial: '+223',  name: 'Mali' },
  { code: 'MT', dial: '+356',  name: 'Malta' },
  { code: 'MH', dial: '+692',  name: 'Marshall Islands' },
  { code: 'MR', dial: '+222',  name: 'Mauritania' },
  { code: 'MU', dial: '+230',  name: 'Mauritius' },
  { code: 'MX', dial: '+52',   name: 'Mexico' },
  { code: 'FM', dial: '+691',  name: 'Micronesia' },
  { code: 'MD', dial: '+373',  name: 'Moldova' },
  { code: 'MC', dial: '+377',  name: 'Monaco' },
  { code: 'MN', dial: '+976',  name: 'Mongolia' },
  { code: 'ME', dial: '+382',  name: 'Montenegro' },
  { code: 'MA', dial: '+212',  name: 'Morocco' },
  { code: 'MZ', dial: '+258',  name: 'Mozambique' },
  { code: 'MM', dial: '+95',   name: 'Myanmar' },
  { code: 'NA', dial: '+264',  name: 'Namibia' },
  { code: 'NR', dial: '+674',  name: 'Nauru' },
  { code: 'NP', dial: '+977',  name: 'Nepal' },
  { code: 'NL', dial: '+31',   name: 'Netherlands' },
  { code: 'NZ', dial: '+64',   name: 'New Zealand' },
  { code: 'NI', dial: '+505',  name: 'Nicaragua' },
  { code: 'NE', dial: '+227',  name: 'Niger' },
  { code: 'NG', dial: '+234',  name: 'Nigeria' },
  { code: 'KP', dial: '+850',  name: 'North Korea' },
  { code: 'MK', dial: '+389',  name: 'North Macedonia' },
  { code: 'NO', dial: '+47',   name: 'Norway' },
  { code: 'OM', dial: '+968',  name: 'Oman' },
  { code: 'PK', dial: '+92',   name: 'Pakistan' },
  { code: 'PW', dial: '+680',  name: 'Palau' },
  { code: 'PS', dial: '+970',  name: 'Palestine' },
  { code: 'PA', dial: '+507',  name: 'Panama' },
  { code: 'PG', dial: '+675',  name: 'Papua New Guinea' },
  { code: 'PY', dial: '+595',  name: 'Paraguay' },
  { code: 'PE', dial: '+51',   name: 'Peru' },
  { code: 'PH', dial: '+63',   name: 'Philippines' },
  { code: 'PL', dial: '+48',   name: 'Poland' },
  { code: 'PT', dial: '+351',  name: 'Portugal' },
  { code: 'PR', dial: '+1939', name: 'Puerto Rico' },
  { code: 'QA', dial: '+974',  name: 'Qatar' },
  { code: 'RO', dial: '+40',   name: 'Romania' },
  { code: 'RU', dial: '+7',    name: 'Russia' },
  { code: 'RW', dial: '+250',  name: 'Rwanda' },
  { code: 'KN', dial: '+1869', name: 'Saint Kitts and Nevis' },
  { code: 'LC', dial: '+1758', name: 'Saint Lucia' },
  { code: 'VC', dial: '+1784', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', dial: '+685',  name: 'Samoa' },
  { code: 'SM', dial: '+378',  name: 'San Marino' },
  { code: 'ST', dial: '+239',  name: 'São Tomé and Príncipe' },
  { code: 'SA', dial: '+966',  name: 'Saudi Arabia' },
  { code: 'SN', dial: '+221',  name: 'Senegal' },
  { code: 'RS', dial: '+381',  name: 'Serbia' },
  { code: 'SC', dial: '+248',  name: 'Seychelles' },
  { code: 'SL', dial: '+232',  name: 'Sierra Leone' },
  { code: 'SK', dial: '+421',  name: 'Slovakia' },
  { code: 'SI', dial: '+386',  name: 'Slovenia' },
  { code: 'SB', dial: '+677',  name: 'Solomon Islands' },
  { code: 'SO', dial: '+252',  name: 'Somalia' },
  { code: 'ZA', dial: '+27',   name: 'South Africa' },
  { code: 'KR', dial: '+82',   name: 'South Korea' },
  { code: 'SS', dial: '+211',  name: 'South Sudan' },
  { code: 'ES', dial: '+34',   name: 'Spain' },
  { code: 'LK', dial: '+94',   name: 'Sri Lanka' },
  { code: 'SD', dial: '+249',  name: 'Sudan' },
  { code: 'SR', dial: '+597',  name: 'Suriname' },
  { code: 'SE', dial: '+46',   name: 'Sweden' },
  { code: 'CH', dial: '+41',   name: 'Switzerland' },
  { code: 'SY', dial: '+963',  name: 'Syria' },
  { code: 'TW', dial: '+886',  name: 'Taiwan' },
  { code: 'TJ', dial: '+992',  name: 'Tajikistan' },
  { code: 'TZ', dial: '+255',  name: 'Tanzania' },
  { code: 'TH', dial: '+66',   name: 'Thailand' },
  { code: 'TL', dial: '+670',  name: 'Timor-Leste' },
  { code: 'TG', dial: '+228',  name: 'Togo' },
  { code: 'TO', dial: '+676',  name: 'Tonga' },
  { code: 'TT', dial: '+1868', name: 'Trinidad and Tobago' },
  { code: 'TN', dial: '+216',  name: 'Tunisia' },
  { code: 'TR', dial: '+90',   name: 'Turkey' },
  { code: 'TM', dial: '+993',  name: 'Turkmenistan' },
  { code: 'TV', dial: '+688',  name: 'Tuvalu' },
  { code: 'UG', dial: '+256',  name: 'Uganda' },
  { code: 'UA', dial: '+380',  name: 'Ukraine' },
  { code: 'UY', dial: '+598',  name: 'Uruguay' },
  { code: 'UZ', dial: '+998',  name: 'Uzbekistan' },
  { code: 'VU', dial: '+678',  name: 'Vanuatu' },
  { code: 'VE', dial: '+58',   name: 'Venezuela' },
  { code: 'VN', dial: '+84',   name: 'Vietnam' },
  { code: 'YE', dial: '+967',  name: 'Yemen' },
  { code: 'ZM', dial: '+260',  name: 'Zambia' },
  { code: 'ZW', dial: '+263',  name: 'Zimbabwe' },
].map((c) => ({ ...c, flag: getFlagEmoji(c.code) }))

export default function PhoneField({
  value = '+91|',
  onChange,
  error,
  required = false,
  label = 'Mobile Number',
  placeholder = 'Number daalen',
}) {
  const parts = (value || '+91|').split('|')
  const dialCode   = parts[0] || '+91'
  const numberPart = parts[1] ?? ''

  const selectedCountry =
    COUNTRIES.find((c) => c.dial === dialCode && c.code === (COUNTRIES.find((x) => x.dial === dialCode)?.code)) ||
    COUNTRIES.find((c) => c.dial === dialCode) ||
    COUNTRIES[0]

  const [open,        setOpen]        = useState(false)
  const [search,      setSearch]      = useState('')
  const [highlighted, setHighlighted] = useState(0)

  const wrapRef   = useRef(null)
  const searchRef = useRef(null)
  const listRef   = useRef(null)

  const filtered = COUNTRIES.filter((c) => {
    const q = search.toLowerCase().trim()
    if (!q) return true
    return (
      c.name.toLowerCase().includes(q) ||
      c.dial.replace('+', '').startsWith(q.replace('+', '')) ||
      c.code.toLowerCase().startsWith(q)
    )
  })

  // Focus search input when dropdown opens
  useEffect(() => {
    if (!open) return
    setSearch('')
    setHighlighted(0)
    // rAF ensures the DOM node is mounted before focus
    const id = requestAnimationFrame(() => {
      searchRef.current?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [open])

  // Close on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // Scroll highlighted item into view
  useEffect(() => {
    listRef.current?.children[highlighted]?.scrollIntoView({ block: 'nearest' })
  }, [highlighted])

  const selectCountry = useCallback(
    (country) => {
      onChange(`${country.dial}|${numberPart}`)
      setOpen(false)
    },
    [onChange, numberPart]
  )

  const handleSearchKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[highlighted]) selectCountry(filtered[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const handleNumberChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 15)
    onChange(`${selectedCountry.dial}|${digits}`)
  }

  const base = [
    'bg-transparent border border-white/10',
    'px-3 py-3 text-white text-sm placeholder-white/25',
    'transition-all duration-200 focus:outline-none',
    'focus:border-[#c9a84c] focus:shadow-[0_0_0_2px_rgba(201,168,76,0.12)]',
  ].join(' ')

  return (
    <div>
      {label && (
        <label className="block text-[0.6rem] tracking-[0.3rem] uppercase text-[#c9a84c]/70 mb-2">
          {label}{required && ' *'}
        </label>
      )}

      <div className="flex" ref={wrapRef}>

        {/* ── Country Code Trigger ── */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={[
              'flex items-center gap-1.5 min-w-[92px] justify-between border-r-0',
              base,
              open ? 'border-[#c9a84c] shadow-[0_0_0_2px_rgba(201,168,76,0.12)]' : '',
            ].join(' ')}
          >
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{selectedCountry.flag}</span>
            <span className="text-white/80 text-xs tracking-wide">{selectedCountry.dial}</span>
            <FiChevronDown
              className="text-white/30 text-xs flex-shrink-0"
              style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </button>

          {/* ── Dropdown panel ── */}
          {open && (
            <div
              style={{ zIndex: 9999 }}
              className="absolute top-full left-0 mt-1 w-72 bg-[#0f0f0f] border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
            >
              {/* Search */}
              <div className="p-2 border-b border-white/10">
                <div className="relative">
                  <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/35 text-xs pointer-events-none" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setHighlighted(0) }}
                    onKeyDown={handleSearchKey}
                    placeholder="Naam ya +code se search karein..."
                    className="w-full bg-white/5 border border-white/10 pl-7 pr-3 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50 rounded-none"
                  />
                </div>
              </div>

              {/* List */}
              <ul ref={listRef} className="max-h-52 overflow-y-auto overscroll-contain">
                {filtered.length === 0 ? (
                  <li className="px-4 py-4 text-white/30 text-xs text-center">Koi result nahi mila</li>
                ) : (
                  filtered.map((country, idx) => (
                    <li
                      key={`${country.code}-${country.dial}`}
                      onMouseEnter={() => setHighlighted(idx)}
                      onMouseDown={(e) => { e.preventDefault(); selectCountry(country) }}
                      className={[
                        'flex items-center gap-3 px-3 py-2.5 cursor-pointer select-none',
                        highlighted === idx ? 'bg-[#c9a84c]/15' : 'hover:bg-white/5',
                        selectedCountry.code === country.code ? 'text-[#c9a84c]' : 'text-white/70',
                      ].join(' ')}
                    >
                      <span style={{ fontSize: '1.1rem', lineHeight: 1, minWidth: '1.4rem' }}>
                        {country.flag}
                      </span>
                      <span className="flex-1 text-xs truncate">{country.name}</span>
                      <span className="text-xs text-white/40 font-mono flex-shrink-0">{country.dial}</span>
                      {selectedCountry.code === country.code && (
                        <span className="text-[#c9a84c] text-xs flex-shrink-0">✓</span>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* ── Number input ── */}
        <div className="relative flex-1">
          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-sm pointer-events-none" />
          <input
            type="tel"
            inputMode="numeric"
            value={numberPart}
            onChange={handleNumberChange}
            placeholder={placeholder}
            className={`${base} w-full pl-9`}
          />
        </div>

      </div>

      {error && <p className="text-red-400 text-[0.7rem] mt-1">{error}</p>}
    </div>
  )
}
