import React from 'react'
import { motion } from 'framer-motion'
import { Car, Store, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function Partners() {
  const partners = [
    {
      type: 'driver',
      icon: Car,
      title: 'Become a Driver Partner',
      subtitle: 'Drive and earn on your schedule',
      description: 'Join our fleet of professional taxi and delivery partners. Take home higher earnings with low platform fees, flexible shifts, and instant wallet withdrawals.',
      benefits: [
        'Flexible working hours',
        'Competitive commissions',
        'In-app navigation & safety features',
        'Fast weekly or instant cash payouts'
      ],
      ctaText: 'Register as Driver',
      ctaHref: '/taxi/signup',
      themeClass: 'from-[#1A1A1A] to-slate-900 border border-slate-800 text-white',
      accentText: 'text-[#F5D476]',
      badgeBg: 'bg-white/10 text-white border border-white/20'
    },
    {
      type: 'restaurant',
      icon: Store,
      title: 'Register Your Restaurant',
      subtitle: 'Expand your kitchen footprint',
      description: 'Partner with K9 Rides to list your menu online. Tap into thousands of local orders and leverage our reliable dispatch fleet to maximize kitchen revenue.',
      benefits: [
        'Access to extensive customer database',
        'Advanced order & dashboard analytics',
        'Flexible pricing & promotional campaigns',
        'Professional delivery network integration'
      ],
      ctaText: 'Register Restaurant',
      ctaHref: '/food/restaurant/onboarding?step=1',
      themeClass: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white',
      accentText: 'text-slate-550 dark:text-slate-400',
      badgeBg: 'bg-[#C5902A]/10 dark:bg-[#C5902A]/5 text-[#C5902A] dark:text-[#F5D476] border border-[#C5902A]/20 dark:border-[#C5902A]/15'
    }
  ]

  return (
    <section id="partners" className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-black tracking-widest text-[#C5902A] dark:text-[#F5D476] uppercase">
            Partnership Opportunities
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Grow and Earn with K9 Rides
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            We support localized economic growth. Whether you are an independent driver or a local culinary business, our tools are built to scale your business.
          </p>
        </div>

        {/* Option Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {partners.map((partner, idx) => {
            const Icon = partner.icon
            return (
              <motion.div
                key={partner.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.2, type: 'spring', stiffness: 80 }}
                className={`rounded-[32px] p-8 sm:p-12 bg-gradient-to-br flex flex-col justify-between hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 ${partner.themeClass}`}
              >
                <div className="space-y-8 text-left">
                  {/* Badge / Header */}
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${partner.badgeBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${partner.badgeBg}`}>
                      {partner.type} onboarding
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {partner.title}
                    </h3>
                    <p className={`text-sm font-semibold ${partner.accentText}`}>
                      {partner.subtitle}
                    </p>
                    <p className="text-sm leading-relaxed opacity-90 pt-2">
                      {partner.description}
                    </p>
                  </div>

                  {/* Benefits List */}
                  <ul className="space-y-3.5 pt-4">
                    {partner.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                        <span className="opacity-95">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="pt-8 mt-8 border-t border-black/10 dark:border-white/10">
                  <a
                    href={partner.ctaHref}
                    className={`w-full inline-flex items-center justify-center gap-2 font-bold px-6 py-4 rounded-2xl transition-all duration-300 ${
                      partner.type === 'driver'
                        ? 'bg-white text-slate-900 hover:bg-slate-100 font-extrabold shadow-lg shadow-black/10'
                        : 'bg-[#F5D476] hover:bg-[#C5902A] text-slate-950 hover:text-white shadow-xl shadow-[#C5902A]/20 hover:shadow-[#C5902A]/35'
                    }`}
                  >
                    {partner.ctaText}
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
