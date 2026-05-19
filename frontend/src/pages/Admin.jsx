import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import './Admin.css'

const ADMIN_PASSWORD = '3/gTm-{@EnM>)'

export default function Admin() {
  const [authed, setAuthed]     = useState(false)
  const [pwd, setPwd]           = useState('')
  const [pwdErr, setPwdErr]     = useState('')
  const [rows, setRows]         = useState([])
  const [loading, setLoading]   = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [search, setSearch]     = useState('')
  const [dark, setDark]         = useState(false)

  const toggleTheme = () => setDark(d => !d)

  const login = () => {
    if (pwd === ADMIN_PASSWORD) { setAuthed(true); setPwdErr('') }
    else setPwdErr('Incorrect password. Please try again.')
  }

  useEffect(() => { if (authed) fetchData() }, [authed])

  const fetchData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('rsvp_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setRows(data || [])
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this RSVP entry?')) return
    setDeleting(id)
    const { error } = await supabase.from('rsvp_submissions').delete().eq('id', id)
    if (!error) setRows(prev => prev.filter(r => r.id !== id))
    setDeleting(null)
  }

  const filtered = rows.filter(r => {
    const q = search.toLowerCase()
    return (
      r.guest_name?.toLowerCase().includes(q) ||
      r.guest_phone?.toLowerCase().includes(q) ||
      r.guest_email?.toLowerCase().includes(q)
    )
  })

  const totalGuests = rows.reduce((acc, r) => {
    const companions = Array.isArray(r.companions) ? r.companions.length : 0
    return acc + 1 + companions
  }, 0)
  const totalCompanions = rows.reduce((a, r) => a + (Array.isArray(r.companions) ? r.companions.length : 0), 0)

  // ── PASSWORD GATE ──────────────────────────────────────────
  if (!authed) {
    return (
      <div className={`gate-wrap${dark ? ' adm-dark' : ''}`}>
        <button className="gate-theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {dark
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          }
        </button>
        <div className="gate-card">
          <div className="gate-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="#b8962e" fillOpacity="0.12"/>
              <path d="M20 8C16.13 8 13 11.13 13 15v2H11a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V19a2 2 0 0 0-2-2h-2v-2c0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5v2H15v-2c0-2.76 2.24-5 5-5zm0 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" fill="#b8962e"/>
            </svg>
          </div>
          <h1 className="gate-title">Admin Access</h1>
          <p className="gate-sub">Wedding RSVP Management</p>
          <div className="gate-field">
            <label className="gate-label">Password</label>
            <input
              type="password" value={pwd}
              onChange={e => { setPwd(e.target.value); setPwdErr('') }}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="Enter admin password" autoFocus
              className={`gate-input${pwdErr ? ' error' : ''}`}
            />
            {pwdErr && <p className="gate-err">{pwdErr}</p>}
          </div>
          <button className="gate-btn" onClick={login}>Unlock Panel</button>
        </div>
      </div>
    )
  }

  // ── ADMIN DASHBOARD ────────────────────────────────────────
  return (
    <div className={`adm-root${dark ? ' adm-dark' : ''}`}>

      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
            <path d="M20 4C13.37 4 8 9.37 8 16v3H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V21a2 2 0 0 0-2-2h-2v-3C32 9.37 26.63 4 20 4zm0 3c5.52 0 10 4.48 10 9v3H10v-3c0-5.52 4.48-9 10-9zm0 13a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" fill="#b8962e"/>
          </svg>
          <span>RSVP Admin</span>
        </div>
        <nav className="adm-nav-links">
          <div className="adm-nav-item active">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Guest List
          </div>
        </nav>
        <button className="adm-logout" onClick={() => { setAuthed(false); setPwd('') }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="adm-main">

        {/* Header */}
        <header className="adm-header">
          <div>
            <h1 className="adm-page-title">Guest List</h1>
            <p className="adm-page-sub">All RSVP submissions</p>
          </div>
          <div className="adm-header-actions">
            <button className="adm-theme-toggle" onClick={toggleTheme} title={dark ? 'Switch to Light' : 'Switch to Dark'}>
              {dark
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
              {dark ? 'Light' : 'Dark'}
            </button>
            <button className="adm-refresh-btn" onClick={fetchData} disabled={loading}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              Refresh
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="adm-stats-row">
          <div className="adm-stat-card">
            <span className="adm-stat-num">{rows.length}</span>
            <span className="adm-stat-label">RSVPs</span>
          </div>
          <div className="adm-stat-card">
            <span className="adm-stat-num">{totalGuests}</span>
            <span className="adm-stat-label">Total Guests</span>
          </div>
          <div className="adm-stat-card">
            <span className="adm-stat-num">{totalCompanions}</span>
            <span className="adm-stat-label">Companions</span>
          </div>
          <div className="adm-stat-card">
            <span className="adm-stat-num">{rows.filter(r => (r.meta?.allergy || r.meta?.notes)).length}</span>
            <span className="adm-stat-label">Special Notes</span>
          </div>
        </div>

        {/* Search */}
        <div className="adm-search-wrap">
          <svg className="adm-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            className="adm-search-input"
            placeholder="Search by name, phone or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="adm-search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="adm-loading">
            <span className="adm-spinner" />
            <span>Loading guests…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            <p>No entries found</p>
          </div>
        ) : (
          <div className="adm-cards-grid">
            {filtered.map((row, idx) => {
              const companions = Array.isArray(row.companions) ? row.companions : []
              const meta = row.meta || {}
              const adults   = companions.filter(c => c.type === 'adult')
              const children = companions.filter(c => c.type === 'child')

              return (
                <div key={row.id} className="adm-gcard">

                  {/* Card Header */}
                  <div className="adm-gcard-header">
                    <div className="adm-gcard-avatar">
                      {row.guest_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="adm-gcard-title">
                      <span className="adm-gcard-name">{row.guest_name}</span>
                      <span className="adm-gcard-idx">#{idx + 1}</span>
                    </div>
                    <button
                      className="adm-del-btn"
                      onClick={() => handleDelete(row.id)}
                      disabled={deleting === row.id}
                      title="Delete"
                    >
                      {deleting === row.id
                        ? <span className="adm-spinner adm-spinner--sm" />
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      }
                    </button>
                  </div>

                  {/* Info Grid */}
                  <div className="adm-gcard-body">

                    {/* Contact */}
                    <div className="adm-info-block">
                      <span className="adm-info-label">Contact</span>
                      {row.guest_phone && <span className="adm-info-val">{row.guest_phone}</span>}
                      {row.guest_email && <span className="adm-info-val adm-info-muted">{row.guest_email}</span>}
                    </div>

                    {/* Location */}
                    {(meta.country?.label || meta.state?.label) && (
                      <div className="adm-info-block">
                        <span className="adm-info-label">Location</span>
                        {meta.country?.label && (
                          <span className="adm-info-val">
                            {meta.country.flag} {meta.country.label}
                          </span>
                        )}
                        {meta.state?.label && <span className="adm-info-val adm-info-muted">{meta.state.label}</span>}
                      </div>
                    )}

                    {/* Travel */}
                    {(meta.departureDate || meta.arrivalDate) && (
                      <div className="adm-info-block">
                        <span className="adm-info-label">Travel</span>
                        {meta.departureDate && (
                          <span className="adm-info-val">
                            <span className="adm-travel-pill">Dep</span> {meta.departureDate}
                          </span>
                        )}
                        {meta.arrivalDate && (
                          <span className="adm-info-val">
                            <span className="adm-travel-pill">Arr</span> {meta.arrivalDate}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Companions */}
                    <div className="adm-info-block">
                      <span className="adm-info-label">Companions</span>
                      {companions.length === 0
                        ? <span className="adm-badge adm-badge--dim">Solo</span>
                        : (
                          <div className="adm-badges-row">
                            {adults.length > 0   && <span className="adm-badge adm-badge--gold">{adults.length} Adult{adults.length > 1 ? 's' : ''}</span>}
                            {children.length > 0 && <span className="adm-badge adm-badge--green">{children.length} Child{children.length > 1 ? 'ren' : ''}</span>}
                          </div>
                        )
                      }
                      {/* Companion Names */}
                      {companions.length > 0 && (
                        <div className="adm-companion-list">
                          {companions.map((c, i) => (
                            <span key={i} className="adm-companion-chip">
                              {c.type === 'child' ? '🧒' : '👤'} {c.name}{c.age ? ` (${c.age})` : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Allergy — alag block */}
                    {meta.allergy && (
                      <div className="adm-info-block adm-info-block--allergy">
                        <span className="adm-info-label adm-info-label--allergy">⚠ Allergy</span>
                        <span className="adm-info-val adm-val-allergy">{meta.allergy}</span>
                      </div>
                    )}

                    {/* Suggestion — alag block */}
                    {meta.notes && (
                      <div className="adm-info-block adm-info-block--suggest">
                        <span className="adm-info-label adm-info-label--suggest">💬 Suggestion</span>
                        <span className="adm-info-val adm-val-suggest">{meta.notes}</span>
                      </div>
                    )}

                  </div>

                  {/* Footer */}
                  <div className="adm-gcard-footer">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {new Date(row.created_at).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </div>

                </div>
              )
            })}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="adm-footer-count">Showing {filtered.length} of {rows.length} entries</p>
        )}

      </main>
    </div>
  )
}
