import React from 'react'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import k9Logo from '../assets/k9-logo.jpg'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    company: [
      { name: 'About Us', href: '/landing-page' },
      { name: 'Careers', href: '/landing-page' },
      { name: 'Newsroom', href: '/landing-page' }
    ],
    services: [
      { name: 'Ride Hailing', href: '/login/services' },
      { name: 'Food Delivery', href: '/login/services' },
      { name: 'Parcels & Logistics', href: '/login/services' },
      { name: 'Airport Transfers', href: '/login/services' }
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'FAQs', href: '#faq' }
    ]
  }

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' }
  ]

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
        
        {/* Left Column: Branding */}
        <div className="lg:col-span-4 text-left space-y-6">
          <a href="#" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-lg bg-white">
              <img src={k9Logo} alt="K9 Rides" className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              K9 Rides
            </span>
          </a>
          <p className="text-sm leading-relaxed text-slate-400">
            K9 Rides is the leading on-demand super-app platform connecting passengers, diners, merchants, and cargo owners to drivers and logistics providers.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((social, idx) => {
              const Icon = social.icon
              return (
                <a
                  key={idx}
                  href={social.href}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-[#C5902A] hover:text-black transition-all duration-300 border border-slate-800"
                  aria-label="Social Link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </div>

          {/* App Download Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="/login/services"
              className="transition-transform duration-200 hover:scale-[1.03]"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                alt="Get it on Google Play" 
                className="h-10 w-auto"
                loading="lazy"
              />
            </a>

            <a
              href="/login/services"
              className="transition-transform duration-200 hover:scale-[1.03]"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                alt="Download on the App Store" 
                className="h-10 w-auto"
                loading="lazy"
              />
            </a>
          </div>
        </div>

        {/* Link Columns */}
        <div className="lg:col-span-2 text-left space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Company</h4>
          <ul className="space-y-2 text-sm">
            {links.company.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="hover:text-white transition-colors duration-200">{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 text-left space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Services</h4>
          <ul className="space-y-2 text-sm">
            {links.services.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="hover:text-white transition-colors duration-200">{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 text-left space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Legal</h4>
          <ul className="space-y-2 text-sm">
            {links.legal.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="hover:text-white transition-colors duration-200">{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Contact info */}
        <div className="lg:col-span-2 text-left space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C5902A] dark:text-[#F5D476] shrink-0 mt-0.5" />
              <span>K9 Village , Siliguri,West Bengal.India</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#C5902A] dark:text-[#F5D476] shrink-0" />
              <span>+91 7358789910</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#C5902A] dark:text-[#F5D476] shrink-0" />
              <span>k9bharatrides@gmail.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>© {currentYear} K9 Rides Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="/terms" className="hover:text-white transition-colors duration-200">Terms</a>
          <a href="/privacy" className="hover:text-white transition-colors duration-200">Privacy</a>
          <a href="/support" className="hover:text-white transition-colors duration-200">Support</a>
        </div>
      </div>
    </footer>
  )
}
