import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Wallet, Utensils, Car } from 'lucide-react';
import { DEFAULT_LOCATION_LABEL, getSavedLocationLabel, LOCATION_UPDATED_EVENT } from '../services/locationStore';
import foodIcon from '@food/assets/category-icons/food.png.png';
import taxiIcon from '@food/assets/category-icons/taxi.png.png';

import { useSettings } from '../../../shared/context/SettingsContext';


const HeaderGreeting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, activeLogo } = useSettings();
  const appLogo = activeLogo || settings.general?.logo || settings.customization?.logo || '';
  const appName = settings.general?.app_name || 'App';
  const [locationLabel, setLocationLabel] = useState(getSavedLocationLabel);
  const routePrefix = location.pathname.startsWith('/taxi/user') ? '/taxi/user' : '';
  const selectLocationPath = `${routePrefix}/ride/select-location`;
  const walletPath = `${routePrefix}/wallet`;
  const isTaxi = location.pathname.includes('/taxi');
  const theme = {
    activeBg: isTaxi ? 'bg-[#059669]' : 'bg-[#d82c23]',
    activeHex: isTaxi ? '#059669' : '#d82c23',
    inactiveHex: isTaxi ? '#0c1428' : '#6e0d09',
    containerHex: isTaxi ? '#111d3a' : '#9c1c16',
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 95);
    };
    window.addEventListener('scroll', handleScroll);

    const syncLocationLabel = () => {
      setLocationLabel(getSavedLocationLabel());
    };

    syncLocationLabel();
    window.addEventListener('storage', syncLocationLabel);
    window.addEventListener(LOCATION_UPDATED_EVENT, syncLocationLabel);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', syncLocationLabel);
      window.removeEventListener(LOCATION_UPDATED_EVENT, syncLocationLabel);
    };
  }, []);

  return (
    <>
      <div 
        className="w-full pb-0 shadow-none overflow-visible"
        style={{ backgroundColor: theme.containerHex }}
      >
      {/* Top Location / Header Greeting Row */}
      <div className="px-5 pt-6 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative inline-flex items-center rounded-full px-1 py-0.5"
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-3 inset-y-1.5 rounded-full bg-emerald-500/5 blur-md"
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.92, 1.06, 0.92] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            {appLogo ? (
              <motion.img
                key={appLogo}
                src={appLogo}
                alt={appName}
                className="relative z-10 h-12 object-contain drop-shadow-sm"
                style={{
                  filter: 'url(#remove-white)'
                }}
                animate={{ y: [0, -2, 0], scale: [1, 1.02, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            ) : (
              <div className="relative z-10 flex h-12 min-w-[48px] items-center justify-center rounded-full bg-white/10 px-3 text-[12px] font-black uppercase tracking-[0.18em] text-white">
                {appName.slice(0, 2)}
              </div>
            )}
          </motion.div>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.03, ease: 'easeOut' }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate(selectLocationPath)}
            className="group flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-transparent px-0 py-0 text-left transition-opacity active:opacity-80"
          >
            <MapPin size={16} className="text-white/60 transition-colors group-hover:text-white" strokeWidth={2.5} />

            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/50">Location</p>
              <p className="truncate text-[11px] font-black tracking-tight text-white">{locationLabel}</p>
            </div>
          </motion.button>
        </div>

        <button
          onClick={() => navigate(walletPath)}
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-sm shrink-0 active:scale-95 transition-all hover:bg-white/20 hover:border-white/30"
        >
          <Wallet size={18} className="text-white" strokeWidth={2.5} />
          <span className="absolute top-[10px] right-[10px] h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
        </button>
      </div>

      {/* Mobile Option Buttons (Food & Taxi) */}
      <div className="px-5 mt-4 md:hidden flex flex-col pointer-events-auto overflow-visible">
        <div
          className="custom-tab-container overflow-visible"
          style={{
            '--tab-container-bg': theme.containerHex,
            '--active-tab-bg': theme.activeHex,
            '--inactive-tab-bg': theme.inactiveHex,
            backgroundColor: theme.containerHex
          }}
        >
          {/* Food Button */}
          <button
            onClick={() => navigate('/food/user')}
            className={`custom-tab overflow-visible ${
              location.pathname.includes('/food')
                ? 'custom-tab-active'
                : 'custom-tab-inactive'
            }`}
          >
            <img src={foodIcon} alt="K9Food" className="custom-tab-icon" />
            <span>K9Food</span>
          </button>

          {/* Taxi Button */}
          <button
            onClick={() => navigate('/taxi/user')}
            className={`custom-tab overflow-visible ${
              location.pathname.includes('/taxi')
                ? 'custom-tab-active'
                : 'custom-tab-inactive'
            }`}
          >
            <img src={taxiIcon} alt="K9Rides" className="custom-tab-icon custom-tab-icon-taxi" />
            <span>K9Rides</span>
          </button>
        </div>
      </div>
    </div>

      {/* Search Bar (Sticky Viewport) */}
      <div 
        className={`sticky top-0 z-[70] transition-all duration-300 -mt-4 pt-4 pb-4 px-5 ${
          isScrolled 
            ? 'shadow-[0_4px_20px_rgba(0,0,0,0.15)] border-b border-transparent' 
            : 'border-b border-transparent'
        }`}
        style={{
          background: theme.containerHex
        }}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate(selectLocationPath)}
          className="flex w-full items-center gap-2 rounded-[18px] border border-transparent bg-white px-3.5 py-3.5 text-left shadow-sm transition-all duration-300 hover:bg-gray-50"
        >
          <Search size={16} className="text-slate-400" strokeWidth={2.5} />
          <span className="min-w-0 flex-1 truncate text-[12px] font-bold text-slate-400">
            Search destination
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#00E676]">Go</span>
        </motion.button>
      </div>
    </>
  );
};

export default HeaderGreeting;
