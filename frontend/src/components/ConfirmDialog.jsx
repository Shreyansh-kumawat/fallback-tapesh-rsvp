import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCheck, FiUser, FiPhone, FiUsers } from 'react-icons/fi'

export default function ConfirmDialog({ open, data, onConfirm, onCancel, loading }) {
  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md border border-white/10 bg-[#0d0d0d] p-7"
            style={{ borderTop: '2px solid #c9a84c' }}
          >
            {/* Title */}
            <div className="text-center mb-6">
              <p className="text-[0.55rem] tracking-[0.4rem] uppercase text-[#c9a84c]/60 mb-2">Confirm karein</p>
              <h2 className="font-serif text-xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                Kya ye sahi jaankari hai?
              </h2>
            </div>

            {/* Guest info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <FiUser className="text-[#c9a84c]/60 shrink-0" />
                <span className="text-white/50 w-20 shrink-0 text-[0.7rem] uppercase tracking-wider">Naam</span>
                <span className="text-white">{data?.guest_name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiPhone className="text-[#c9a84c]/60 shrink-0" />
                <span className="text-white/50 w-20 shrink-0 text-[0.7rem] uppercase tracking-wider">Mobile</span>
                <span className="text-white">{data?.guest_phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[#c9a84c]/60 shrink-0 text-base">✓</span>
                <span className="text-white/50 w-20 shrink-0 text-[0.7rem] uppercase tracking-wider">Status</span>
                <span className={data?.is_attending ? 'text-[#c9a84c]' : 'text-red-400'}>
                  {data?.is_attending ? 'Aa raha / rahi hoon ✓' : 'Nahi aa sakta / sakti ✗'}
                </span>
              </div>
              {data?.companions?.length > 0 && (
                <div className="flex items-start gap-3 text-sm">
                  <FiUsers className="text-[#c9a84c]/60 shrink-0 mt-0.5" />
                  <span className="text-white/50 w-20 shrink-0 text-[0.7rem] uppercase tracking-wider">Saath</span>
                  <div className="flex flex-col gap-1">
                    {data.companions.map((c, i) => (
                      <span key={i} className="text-white">
                        {c.name}{c.phone ? ` — ${c.phone}` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-white/8 mb-6" />

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/15 text-white/50 text-[0.7rem] tracking-[0.2rem] uppercase hover:border-white/30 hover:text-white/80 transition-all duration-200 disabled:opacity-40"
              >
                <FiX /> Wapas
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#c9a84c] text-[#0d0d0d] text-[0.7rem] tracking-[0.2rem] uppercase font-semibold hover:bg-[#f0d080] transition-all duration-200 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#0d0d0d]/40 border-t-[#0d0d0d] rounded-full animate-spin" />
                ) : (
                  <><FiCheck /> Haan, Submit Karein</>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
