import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

export default function AdminPanel() {
  const { config, update, reset, exportJSON, importJSON } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(!config.adminPw)
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState(false)

  // Local form state
  const [form, setForm] = useState(config)

  useEffect(() => {
    setForm(config)
    setIsUnlocked(!config.adminPw)
  }, [config])

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => {
    setIsOpen(false)
    if (config.adminPw) setIsUnlocked(false)
    setPasswordInput('')
    setError(false)
  }

  const handleUnlock = () => {
    if (passwordInput === config.adminPw) {
      setIsUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 1000)
    }
  }

  const handleSave = () => {
    update(form)
    handleClose()
    alert('Changes saved! 💾')
  }

  const setTheme = (t) => {
    setForm(prev => ({ ...prev, theme: t }))
    document.body.className = t ? `theme-${t}` : ''
  }

  return (
    <>
      {/* Hidden Trigger */}
      <div 
        className="fixed top-4 left-4 z-[200] text-lg opacity-20 cursor-pointer select-none hover:opacity-60 transition-opacity"
        onDoubleClick={handleOpen}
        title="Double-click for admin"
      >
        🎁
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[#1a0a2e] border border-rose-500/30 rounded-[24px] p-6 sm:p-8 w-full max-w-[540px] max-h-[90vh] overflow-y-auto text-white shadow-2xl relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <button 
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                onClick={handleClose}
              >
                ✕ Close
              </button>

              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-rose)] text-center mb-8">
                🎛️ Birthday Admin Panel
              </h2>

              {!isUnlocked ? (
                <div className="text-center py-8">
                  <p className="text-white/60 mb-4">Enter admin password</p>
                  <input 
                    type="password" 
                    className={`bg-white/10 border ${error ? 'border-red-500' : 'border-white/20'} rounded-lg px-4 py-2 w-48 text-center outline-none transition-colors mb-4`}
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    placeholder="Password..."
                    onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                  />
                  <br />
                  <button 
                    className="bg-[var(--color-rose)] text-white px-6 py-2 rounded-xl hover:opacity-90 transition-opacity"
                    onClick={handleUnlock}
                  >
                    Unlock
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Content Section */}
                  <section>
                    <h3 className="text-xs uppercase tracking-widest text-[var(--color-blush)] mb-4">📝 Content</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-white/60 mb-1 ml-1">Birthday Person Name</label>
                        <input 
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 outline-none focus:border-[var(--color-rose)] transition-colors"
                          value={form.name}
                          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-1 ml-1">Curiosity Quote</label>
                        <input 
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 outline-none focus:border-[var(--color-rose)] transition-colors"
                          value={form.quote}
                          onChange={e => setForm(prev => ({ ...prev, quote: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-1 ml-1">Birthday Letter</label>
                        <textarea 
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 outline-none focus:border-[var(--color-rose)] transition-colors min-h-[120px] resize-none"
                          value={form.letter}
                          onChange={e => setForm(prev => ({ ...prev, letter: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-1 ml-1">Final Surprise Message</label>
                        <textarea 
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 outline-none focus:border-[var(--color-rose)] transition-colors min-h-[80px] resize-none"
                          value={form.finalMsg}
                          onChange={e => setForm(prev => ({ ...prev, finalMsg: e.target.value }))}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Theme Section */}
                  <section>
                    <h3 className="text-xs uppercase tracking-widest text-[var(--color-blush)] mb-4">🎨 Theme</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: '', label: 'Default' },
                        { id: 'pink', label: 'Pink 🌸' },
                        { id: 'neon', label: 'Neon 💚' },
                        { id: 'premium', label: 'Gold ✨' },
                        { id: 'dark', label: 'Dark 🌑' }
                      ].map(t => (
                        <button 
                          key={t.id}
                          className={`px-4 py-2 rounded-lg border text-sm transition-all ${form.theme === t.id ? 'bg-[var(--color-rose)] border-[var(--color-rose)] text-white' : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'}`}
                          onClick={() => setTheme(t.id)}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Security Section */}
                  <section>
                    <h3 className="text-xs uppercase tracking-widest text-[var(--color-blush)] mb-4">🔒 Security</h3>
                    <div>
                      <label className="block text-xs text-white/60 mb-1 ml-1">Set Admin Password (blank to disable)</label>
                      <input 
                        type="password"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 outline-none focus:border-[var(--color-rose)] transition-colors"
                        value={form.adminPw}
                        onChange={e => setForm(prev => ({ ...prev, adminPw: e.target.value }))}
                        placeholder="New password..."
                      />
                    </div>
                  </section>

                  {/* Actions Section */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <button 
                      className="bg-[var(--color-rose)] text-white px-6 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity"
                      onClick={handleSave}
                    >
                      💾 Save Changes
                    </button>
                    <button 
                      className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-colors"
                      onClick={exportJSON}
                    >
                      📤 Export JSON
                    </button>
                    <button 
                      className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-colors"
                      onClick={importJSON}
                    >
                      📥 Import JSON
                    </button>
                    <button 
                      className="bg-red-900/50 border border-red-500/30 text-white px-4 py-2 rounded-xl hover:bg-red-800/50 transition-colors"
                      onClick={() => { if(confirm('Reset all settings?')) { reset(); handleClose(); } }}
                    >
                      🔄 Reset All
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
