import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Ecosystem from './components/Ecosystem'
import Services from './components/Services'
import WhyUs from './components/WhyUs'
import Showcase from './components/Showcase'
import VideoSection from './components/VideoSection'
import Partners from './components/Partners'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import api from '../Taxi/shared/api/axiosInstance'

export default function LandingPage() {
  const [landingSettings, setLandingSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dynamic SEO Title & Meta tags for better discoverability
    document.title = "K9 Rides - All-in-One Super-App for Rides, Food & Logistics"
    
    // Find or create meta description tag
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', 'K9 Rides is the ultimate multi-service super-app for Ride Hailing (Taxi & Shares), Food & Dining Delivery, secure Courier Parcels, Airport Transfers, Hourly rentals, and Logistics cargo.')

    // Fetch dynamic landing settings
    const fetchLandingSettings = async () => {
      try {
        const res = await api.get('/common/landing-page/settings')
        if (res?.data?.success && res?.data?.data) {
          setLandingSettings(res.data.data)
        }
      } catch (err) {
        console.error('Error loading landing page settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLandingSettings()
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-[#C5902A] selection:text-white">
      {/* Navigation Header */}
      <Navbar settings={landingSettings} />

      {/* Hero Section */}
      <Hero settings={landingSettings} />

      {/* Unified Services Selector Ecosystem */}
      <Ecosystem settings={landingSettings} />

      {/* Key Super-App Services */}
      <Services settings={landingSettings} />

      {/* Platform Value Propositions & Count Stats */}
      <WhyUs settings={landingSettings} />

      {/* Premium Fleet Showcase */}
      <Showcase settings={landingSettings} />

      {/* Dynamic Video Section */}
      <VideoSection settings={landingSettings} />

      {/* Driver and Merchant Partners Portals */}
      <Partners settings={landingSettings} />

      {/* Frequently Asked Questions */}
      <FAQ settings={landingSettings} />

      {/* SEO Optimized Footer Links */}
      <Footer settings={landingSettings} />
    </div>
  )
}
