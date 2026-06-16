import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { UtensilsCrossed, Car, ArrowRight } from 'lucide-react'
import k9Logo from '../assets/k9-logo.jpg'

export default function Ecosystem() {
  const navigate = useNavigate()

  const selectionOptions = [
    {
      id: "food",
      name: "Food Delivery",
      description: "Order from the best restaurants around you",
      icon: UtensilsCrossed,
      color: "bg-[#1A1A1A]",
      path: "/food/user"
    },
    {
      id: "taxi",
      name: "Ride Hailing",
      description: "Book safe and reliable rides instantly",
      icon: Car,
      color: "bg-[#F38F24]",
      path: "/taxi/user"
    }
  ]

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950/60 overflow-hidden border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Interactive App Simulator / Selector Widget */}
        <div className="mx-auto max-w-5xl rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row min-h-[500px]">
          
          {/* Left Side: Dark Branding (Unified Ecosystem) */}
          <div className="md:w-[45%] lg:w-[50%] bg-[#1A1A1A] p-10 sm:p-12 text-white flex flex-col justify-between text-left relative overflow-hidden">
            {/* Ambient gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-[#F38F24]/10 rounded-full blur-[100px]" />
              <div className="absolute top-[60%] right-[10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[90px]" />
            </div>

            <div className="relative z-10 space-y-12">
              {/* App Brand */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-lg overflow-hidden">
                  <img src={k9Logo} alt="K9 Rides" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white">K9 Rides</h2>
              </div>

              {/* Tagline */}
              <div className="space-y-6">
                <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-white">
                  The unified <br />
                  <span className="text-[#F38F24]">ecosystem</span> <br />
                  for everything.
                </h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  Food delivery, ride-hailing, and more. Experience seamless services crafted with enterprise-grade reliability and premium design.
                </p>
              </div>
            </div>

            {/* Footer tags */}
            <div className="relative z-10 flex gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-8">
              <span>Food</span>
              <span className="text-[#F38F24]">•</span>
              <span>Rides</span>
              <span className="text-slate-700">•</span>
              <span>Logistics</span>
            </div>
          </div>

          {/* Right Side: Light Selector */}
          <div className="flex-1 bg-white p-10 sm:p-12 flex flex-col justify-center text-left relative z-20">
            <div className="max-w-md w-full mx-auto space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Choose a Service
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                  Select the module you want to access today.
                </p>
              </div>

              {/* Selection cards */}
              <div className="space-y-4">
                {selectionOptions.map((opt) => {
                  const Icon = opt.icon
                  return (
                    <div
                      key={opt.id}
                      onClick={() => navigate(opt.path)}
                      className="group cursor-pointer bg-white border border-slate-200 hover:border-[#F38F24]/30 rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between"
                    >
                      <div className="flex gap-4 items-center">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                          opt.id === 'food' ? 'bg-[#1A1A1A]' : 'bg-[#F38F24]'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-slate-900 mb-0.5">{opt.name}</h4>
                          <p className="text-slate-500 text-[12px] font-medium leading-tight max-w-[22ch]">{opt.description}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#F38F24]/10 transition-colors shrink-0">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F38F24] transition-colors" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
