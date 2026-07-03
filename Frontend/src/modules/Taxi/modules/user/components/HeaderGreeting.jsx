import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Wallet, Utensils, Car } from 'lucide-react';
import { DEFAULT_LOCATION_LABEL, getSavedLocationLabel, LOCATION_UPDATED_EVENT } from '../services/locationStore';
import foodIcon from '@food/assets/category-icons/food.png.png';
import taxiIcon from '@food/assets/category-icons/taxi.png.png';

import { useSettings } from '../../../shared/context/SettingsContext';

const fallingCoins = [
  { id: 1, left: '24%', delay: 0 },
  { id: 2, left: '50%', delay: 0.65 },
  { id: 3, left: '72%', delay: 1.2 },
];

const HeaderGreeting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, activeLogo } = useSettings();
  const appLogo = activeLogo || settings.general?.logo || settings.customization?.logo || '/k9-logo.png';
  const appName = settings.general?.app_name || 'App';
  const [locationLabel, setLocationLabel] = useState(getSavedLocationLabel);
  const routePrefix = location.pathname.startsWith('/taxi/user') ? '/taxi/user' : '';
  const selectLocationPath = `${routePrefix}/ride/select-location`;
  const walletPath = `${routePrefix}/wallet`;
  const isTaxi = window.location.pathname.includes('/taxi');
  const theme = {
    activeBg: isTaxi ? 'bg-[#2563eb]' : 'bg-[#d82c23]',
    activeHex: isTaxi ? '#2563eb' : '#d82c23',
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
        className="w-full rounded-b-[2rem] pb-2 shadow-none overflow-visible"
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
          className="relative w-12 h-12 overflow-hidden rounded-full border border-white/10 bg-white/10 flex items-center justify-center shadow-[0_12px_30px_rgba(15,23,42,0.08)] shrink-0 active:scale-95 transition-transform"
        >
          <motion.div
            className="absolute inset-x-2 top-1 h-3 rounded-full bg-gradient-to-b from-amber-200/20 to-transparent"
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {fallingCoins.map((coin) => (
            <motion.span
              key={coin.id}
              aria-hidden="true"
              className="absolute top-1 block h-1.5 w-1.5 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 shadow-[0_1px_4px_rgba(245,158,11,0.45)]"
              style={{ left: coin.left }}
              animate={{
                y: [0, 10, 16],
                opacity: [0, 1, 1, 0],
                scale: [0.85, 1, 0.92],
              }}
              transition={{
                duration: 1.8,
                delay: coin.delay,
                repeat: Infinity,
                repeatDelay: 0.8,
                ease: 'easeIn',
              }}
            />
          ))}

          <motion.div
            className="relative z-10"
            animate={{ y: [0, -1, 0], rotate: [0, -2, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Wallet size={20} className="text-white" strokeWidth={2.5} />
          </motion.div>
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
              window.location.pathname.includes('/food')
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
              window.location.pathname.includes('/taxi')
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

      {/* Search Bar (Sticky Viewport, turns white on scroll) */}
      <div 
        className={`sticky top-0 z-[70] transition-all duration-300 pt-2 pb-3 px-5 ${
          isScrolled 
            ? 'shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-b border-gray-100/80' 
            : 'border-b border-transparent'
        }`}
        style={{
          background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : theme.containerHex
        }}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate(selectLocationPath)}
          className={`flex w-full items-center gap-2 rounded-[18px] border border-transparent px-3.5 py-3.5 text-left transition-all duration-300 ${
            isScrolled 
              ? 'bg-gray-100/80 hover:bg-gray-100 shadow-none' 
              : 'bg-white shadow-sm'
          }`}
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
