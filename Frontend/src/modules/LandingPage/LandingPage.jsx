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
  const [videoUrl, setVideoUrl] = useState('')

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

    // Fetch dynamic video settings
    const fetchVideoSettings = async () => {
      try {
        const res = await api.get('/common/settings')
        const settingsData = res?.data || res || {}
        const url = settingsData.general?.landing_video_url || settingsData.data?.general?.landing_video_url
        if (url) {
          setVideoUrl(url)
        }
      } catch (err) {
        console.error('Error loading landing page video setting:', err)
      }
    }
    fetchVideoSettings()
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Unified Services Selector Ecosystem */}
      <Ecosystem />

      {/* Key Super-App Services */}
      <Services />

      {/* Platform Value Propositions & Count Stats */}
      <WhyUs />

      {/* Premium Fleet Showcase */}
      <Showcase />

      {/* Dynamic Video Section */}
      <VideoSection videoUrl={videoUrl} />

      {/* Driver and Merchant Partners Portals */}
      <Partners />

      {/* Frequently Asked Questions */}
      <FAQ />

      {/* SEO Optimized Footer Links */}
      <Footer />
    </div>
  )
}
