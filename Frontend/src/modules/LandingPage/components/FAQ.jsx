import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)

  const faqs = [
    {
      question: 'What services are supported by K9 Rides?',
      answer: 'K9 Rides is an all-in-one super-app supporting Ride Hailing (Taxi & Cab Sharing), Food & Dining Delivery, secure Parcel Courier Services, pre-scheduled Airport Transfers, Hourly Vehicle Rentals, and commercial Cargo/Logistics.'
    },
    {
      question: 'How do I register as a driver partner?',
      answer: 'You can sign up directly by clicking the "Register as Driver" CTA on this page or visiting the "/taxi/signup" portal. You will need to upload your valid driver license, vehicle registry credentials, and complete a background verification checklist.'
    },
    {
      question: 'How do restaurant partners get paid?',
      answer: 'Listings and orders are managed through our advanced Restaurant Dashboard. Payments are calculated daily and can be paid directly into your verified bank account or digital wallet with transparent ledger records.'
    },
    {
      question: 'Is in-app payment secure?',
      answer: 'Yes. K9 Rides utilizes certified SSL encryption and standard integrated payment gateways (like Stripe or Razorpay) to secure card transactions, digital wallets, and bank transfers.'
    },
    {
      question: 'Can I schedule airport transfers in advance?',
      answer: 'Absolutely. The Airport Transfer module allows you to pre-schedule rides hours or days in advance. Simply select the transfer option, select your flight schedule, and a driver will be dispatched to match your flight timing.'
    }
  ]

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-xs font-black tracking-widest text-[#F38F24] uppercase">
            Frequently Asked Questions
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Have Questions? We Have Answers.
          </p>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Find quick answers to common questions regarding our super-app services, rider accounts, and partner registrations.
          </p>
        </div>

        {/* FAQ List Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                >
                  <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg pr-4">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                    isOpen ? 'bg-[#F38F24] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100/50 dark:border-slate-800/50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
