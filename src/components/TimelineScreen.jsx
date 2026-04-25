import { motion } from 'framer-motion';
import { useStore } from '../useStore';

export default function TimelineScreen({ onComplete }) {
  const { config } = useStore();
  const timeline = config.timeline || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full flex flex-col items-center py-20 px-4 overflow-y-auto custom-scrollbar bg-black/20"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          Our <span className="text-rose-500">Journey</span>
        </h2>
        <p className="text-white/60 text-lg italic">A timeline of beautiful memories</p>
      </motion.div>

      <div className="relative w-full max-w-4xl">
        {/* Central Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-rose-500/50 to-transparent -translate-x-1/2 hidden md:block" />

        <div className="space-y-12 relative z-10">
          {timeline.map((event, index) => (
            <motion.div
              key={index}
              initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex flex-col md:flex-row items-center justify-between w-full mb-12 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Content Box */}
              <div className="w-full md:w-[45%]">
                <div className="glass p-6 rounded-2xl border border-white/10 hover:border-rose-500/30 transition-colors group relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                   <span className="text-rose-400 font-mono text-sm mb-2 block">{event.date}</span>
                   <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                   <p className="text-white/70 leading-relaxed text-sm md:text-base">{event.description}</p>
                </div>
              </div>

              {/* Dot on Line */}
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] hidden md:block" />

              {/* Empty space for alignment */}
              <div className="hidden md:block w-[45%]" />
            </motion.div>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onComplete}
        className="mt-20 px-10 py-4 bg-white text-black rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all mb-10"
      >
        Continue the Story
      </motion.button>

      {/* Decorative Glows */}
      <div className="fixed top-1/4 -left-20 w-64 h-64 bg-rose-500/10 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-20 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />
    </motion.div>
  );
}
