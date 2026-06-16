import React from 'react'
import { motion } from 'framer-motion'
import { Music, Mic, Navigation, Sparkles, ShieldCheck, Mail, Globe } from 'lucide-react'
import marketingCar from '../assets/marketing-car.jpg'

export default function Showcase() {
  const features = [
    {
      icon: Music,
      title: 'Personalized Content',
      description: 'Stream music, play podcasts, or join premium mobile games directly on the in-car console.'
    },
    {
      icon: Mic,
      title: 'Interactive Voice Assistant',
      description: 'Adjust cabin temperature, set destination routes, or change music tracks hands-free.'
    },
    {
      icon: Navigation,
      title: 'Real-Time Recommendations',
      description: 'Receive traffic-optimized navigation guides and localized tips during your transit.'
    },
    {
      icon: Sparkles,
      title: 'Ambient AI Adjustments',
      description: 'Cabin lighting and sound levels adapt automatically based on passenger preferences.'
    }
  ]

  return (
    <section className="py-24 bg-[#1A1A1A] text-white overflow-hidden border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-black tracking-widest text-[#F38F24] uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-current text-[#F38F24]" />
            K9 RIDES • POWERED BY MEKING TECHNOLOGY
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Comfort • Convenience • Safety
          </h3>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Enrolling 1 Lac+ Drivers in India. Enjoy premium smart ride features tailored to your journey. You are 100% insured.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Key Features */}
          <div className="lg:col-span-5 text-left space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F38F24]/10 border border-[#F38F24]/20 text-[#F38F24] text-[10px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Passenger Insurance Included
              </span>
              <h4 className="text-2xl font-black text-white">
                Next-Gen Smart In-Car Experience
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                K9 Rides does more than just drive you. We bring interactive voice controls, customized media playlists, and local insights directly to your ride.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="space-y-2 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-[#F38F24] group-hover:bg-[#F38F24] group-hover:text-black flex items-center justify-center transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h5 className="text-sm font-extrabold text-white">
                      {feature.title}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-4 text-xs text-slate-500">
              <a href="mailto:k9bharatrides@gmail.com" className="flex items-center gap-1.5 hover:text-[#F38F24] transition-colors">
                <Mail className="w-4 h-4 text-[#F38F24]" />
                k9bharatrides@gmail.com
              </a>
              <a href="https://www.k9rides.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#F38F24] transition-colors">
                <Globe className="w-4 h-4 text-[#F38F24]" />
                www.k9rides.com
              </a>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ type: 'spring', stiffness: 70, damping: 15 }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-slate-800 bg-white group h-[320px] sm:h-[420px] flex items-center justify-center p-4">
              {/* Ensure flyer image fits completely inside the container */}
              <img
                src={marketingCar}
                alt="K9 Rides Premium Vehicle standard"
                className="w-full h-full object-contain group-hover:scale-[1.02] transition-all duration-[800ms] pointer-events-none"
                loading="lazy"
              />
              
              {/* Subtle overlay elements positioned carefully to avoid overlapping text */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1A1A]/95 backdrop-blur-md border border-slate-800 text-white text-[9px] font-black uppercase tracking-wider shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F38F24]" />
                100% Insured
              </div>

              <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F38F24] text-black text-[9px] font-black uppercase tracking-wider shadow-lg">
                Comfort Fleet
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
