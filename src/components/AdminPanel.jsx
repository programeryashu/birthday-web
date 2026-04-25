import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../useStore'
import { supabase } from '../lib/supabase'

export default function AdminPanel() {
  const { config, update, reset, exportJSON, importJSON } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(!config.adminPw)
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState(false)

  // Local form state
  const [form, setForm] = useState(config)
  const [prevConfig, setPrevConfig] = useState(config)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  // Sync form with store config when it changes
  useEffect(() => {
    setForm(config)
    setIsUnlocked(!config.adminPw)
  }, [config])

  // Sync body theme class with config theme
  useEffect(() => {
    const t = config.theme
    document.body.className = t ? `theme-${t}` : ''
  }, [config.theme])

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
  }

  const handleFileUpload = async (e, photoIdx) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setIsUploading(true)
      
      // 1. Create a unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `memories/${fileName}`

      // 2. Upload to Supabase Storage (Assumes 'memories' bucket exists)
      const { data, error } = await supabase.storage
        .from('memories')
        .upload(filePath, file)

      if (error) throw error

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('memories')
        .getPublicUrl(filePath)

      // 4. Update form state
      const newPhotos = [...form.photos]
      newPhotos[photoIdx].url = publicUrl
      setForm(prev => ({ ...prev, photos: newPhotos }))
      
      alert('Photo uploaded successfully! ✨')
    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload failed. Please ensure you have a "memories" bucket created in Supabase Storage and it is set to Public.')
    } finally {
      setIsUploading(false)
    }
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

                  {/* Prank Section */}
                  <section>
                    <h3 className="text-xs uppercase tracking-widest text-[var(--color-blush)] mb-4">😈 Prank Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Enable Prank</span>
                        <button 
                          className={`w-12 h-6 rounded-full transition-colors ${form.showPrank ? 'bg-rose-500' : 'bg-white/10'}`}
                          onClick={() => setForm(prev => ({ ...prev, showPrank: !prev.showPrank }))}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${form.showPrank ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-1 ml-1">Prank Intensity</label>
                        <select 
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 outline-none focus:border-[var(--color-rose)]"
                          value={form.prankIntensity}
                          onChange={e => setForm(prev => ({ ...prev, prankIntensity: e.target.value }))}
                        >
                          <option value="low" className="bg-[#1a0a2e]">Low (Mild Shaking)</option>
                          <option value="high" className="bg-[#1a0a2e]">High (Maximum Glitch)</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* Timeline Section */}
                  <section>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs uppercase tracking-widest text-[var(--color-blush)]">🗓️ Journey Timeline</h3>
                      <button 
                        className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded"
                        onClick={() => setForm(prev => ({ ...prev, timeline: [...(prev.timeline || []), { date: '', title: '', description: '' }] }))}
                      >
                        + Add Milestone
                      </button>
                    </div>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scroll">
                      {form.timeline?.map((item, idx) => (
                        <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2 relative group">
                          <div className="flex gap-2">
                             <input 
                              className="w-24 bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] outline-none focus:border-[var(--color-rose)]"
                              value={item.date}
                              onChange={e => {
                                const newTimeline = [...form.timeline]
                                newTimeline[idx].date = e.target.value
                                setForm(prev => ({ ...prev, timeline: newTimeline }))
                              }}
                              placeholder="Date/Phase"
                            />
                            <input 
                              className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-1 text-xs outline-none focus:border-[var(--color-rose)] font-bold"
                              value={item.title}
                              onChange={e => {
                                const newTimeline = [...form.timeline]
                                newTimeline[idx].title = e.target.value
                                setForm(prev => ({ ...prev, timeline: newTimeline }))
                              }}
                              placeholder="Milestone Title"
                            />
                            <button 
                              className="text-red-400 hover:text-red-300 px-1"
                              onClick={() => {
                                const newTimeline = form.timeline.filter((_, i) => i !== idx)
                                setForm(prev => ({ ...prev, timeline: newTimeline }))
                              }}
                            >
                              ✕
                            </button>
                          </div>
                          <textarea 
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-rose)] min-h-[50px] resize-none"
                            value={item.description}
                            onChange={e => {
                              const newTimeline = [...form.timeline]
                              newTimeline[idx].description = e.target.value
                              setForm(prev => ({ ...prev, timeline: newTimeline }))
                            }}
                            placeholder="Description..."
                          />
                        </div>
                      ))}
                      {(!form.timeline || form.timeline.length === 0) && (
                        <p className="text-center text-xs text-white/30 py-4 italic">No milestones added yet.</p>
                      )}
                    </div>
                  </section>

                  {/* Multimedia Section */}
                  <section>
                    <h3 className="text-xs uppercase tracking-widest text-[var(--color-blush)] mb-4">🎵 Multimedia</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-white/60 mb-1 ml-1">Custom Music URL (Direct Link)</label>
                        <input 
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 outline-none focus:border-[var(--color-rose)] transition-colors"
                          value={form.musicUrl}
                          onChange={e => setForm(prev => ({ ...prev, musicUrl: e.target.value }))}
                          placeholder="https://example.com/song.mp3"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-1 ml-1">Game Secret Message (Unlocked at Score 20)</label>
                        <input 
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 outline-none focus:border-[var(--color-rose)] transition-colors"
                          value={form.secretMessage}
                          onChange={e => setForm(prev => ({ ...prev, secretMessage: e.target.value }))}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Memories Section */}
                  <section>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs uppercase tracking-widest text-[var(--color-blush)]">📸 Memories</h3>
                      <button 
                        className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded"
                        onClick={() => setForm(prev => ({ ...prev, photos: [...(prev.photos || []), { url: '', caption: '' }] }))}
                      >
                        + Add Photo
                      </button>
                    </div>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scroll">
                      {form.photos?.map((photo, idx) => (
                        <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                          <div className="flex gap-2">
                            <input 
                              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-rose)]"
                              value={photo.url}
                              onChange={e => {
                                const newPhotos = [...form.photos]
                                newPhotos[idx].url = e.target.value
                                setForm(prev => ({ ...prev, photos: newPhotos }))
                              }}
                              placeholder="Image URL or upload..."
                            />
                            <div className="flex gap-1">
                              <label className="cursor-pointer bg-white/10 hover:bg-white/20 p-2 rounded-lg flex items-center justify-center min-w-[32px] transition-colors">
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  disabled={isUploading}
                                  onChange={(e) => handleFileUpload(e, idx)}
                                />
                                {isUploading ? '⏳' : '📁'}
                              </label>
                              <button 
                                className="text-red-400 hover:text-red-300 bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                                onClick={() => {
                                  const newPhotos = form.photos.filter((_, i) => i !== idx)
                                  setForm(prev => ({ ...prev, photos: newPhotos }))
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          <input 
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-rose)]"
                            value={photo.caption}
                            onChange={e => {
                              const newPhotos = [...form.photos]
                              newPhotos[idx].caption = e.target.value
                              setForm(prev => ({ ...prev, photos: newPhotos }))
                            }}
                            placeholder="Caption (optional)..."
                          />
                        </div>
                      ))}
                      {(!form.photos || form.photos.length === 0) && (
                        <p className="text-center text-xs text-white/30 py-4 italic">No photos added yet.</p>
                      )}
                    </div>
                  </section>
                  
                  {/* Music Settings */}
                  <section>
                    <h3 className="text-xs uppercase tracking-widest text-[var(--color-blush)] mb-4">🎵 Music Settings</h3>
                    <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                      <div>
                        <label className="flex justify-between text-xs text-white/60 mb-2 ml-1">
                          <span>Music Volume</span>
                          <span className="text-[var(--color-rose)]">{Math.round((form.musicVolume || 0.6) * 100)}%</span>
                        </label>
                        <input 
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          className="w-full accent-[var(--color-rose)] cursor-pointer"
                          value={form.musicVolume || 0.6}
                          onChange={e => setForm(prev => ({ ...prev, musicVolume: parseFloat(e.target.value) }))}
                        />
                      </div>
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
