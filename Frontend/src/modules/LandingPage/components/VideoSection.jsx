import React from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

export default function VideoSection({ videoUrl }) {
  const resolvedUrl = videoUrl || '/k9_bg_vdo.mp4'

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      }
    }
  }

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 overflow-hidden">
      {/* Dynamic background highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C5902A]/5 dark:bg-[#C5902A]/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5902A]/10 border border-[#C5902A]/20 dark:bg-[#C5902A]/5 dark:border-[#C5902A]/15">
            <span className="flex h-2 w-2 rounded-full bg-[#C5902A] animate-pulse" />
            <span className="text-xs font-bold tracking-wide text-[#C5902A] dark:text-[#F5D476] uppercase">
              See K9 Rides in Action
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
            Watch How We're <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5902A] to-[#F5D476]">Transforming Rides</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Take a look at how our integrated super-app works seamlessly on the road, delivering exceptional convenience, logistics handling, and premium cab booking.
          </p>
        </div>

        {/* Video Player Box */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-2xl group transition-all duration-500 hover:shadow-[#C5902A]/10 hover:border-[#C5902A]/20 p-2">
            
            {/* Inner Glow Border */}
            <div className="absolute inset-0 rounded-[22px] border border-white/5 pointer-events-none z-10" />

            {/* Premium HTML5 Video Player */}
            <video
              key={resolvedUrl}
              src={resolvedUrl}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full rounded-[18px] object-cover shadow-inner"
            >
              Your browser does not support the video tag.
            </video>
            
          </div>
        </motion.div>
      </div>
    </section>
  )
}
