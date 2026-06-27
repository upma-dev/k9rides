import { useState, useEffect, useMemo } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown, Search, Mic, Bell, CheckCircle2, Tag, Gift, AlertCircle, Clock, BellOff, X, ChevronRight, ShoppingBag, Sparkles, Utensils, Car } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@food/components/ui/popover";
import { Badge } from "@food/components/ui/badge";
import { Avatar, AvatarFallback } from "@food/components/ui/avatar";
import foodIcon from "@food/assets/category-icons/food.png";
import taxiIcon from "@food/assets/category-icons/taxi.png";
import quickIcon from "@food/assets/category-icons/quick.png";
import hotelIcon from "@food/assets/category-icons/hotel.png";
import useNotificationInbox from "@food/hooks/useNotificationInbox";

const ICON_MAP = {
  CheckCircle2,
  Tag,
  Gift,
  AlertCircle
};



export default function HomeHeader({
  activeTab,
  setActiveTab,
  location,
  savedAddressText,
  handleLocationClick,
  handleSearchFocus,
  placeholderIndex,
  placeholders,
  handleVegModeChange,
  isVegMode,
  vegModeToggleRef,
  isCategoryStuck = false,
}) {
  const navigate = useNavigate();

  const isTaxi = window.location.pathname.includes('/taxi');
  const theme = {
    activeBg: isTaxi ? 'bg-[#2563eb]' : 'bg-[#e65100]',
    activeHex: isTaxi ? '#2563eb' : '#e65100',
    inactiveHex: isTaxi ? '#09101d' : '#4a1d0b',
    containerHex: isTaxi ? '#0b1528' : '#301205',
  };

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('food_user_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const {
    items: broadcastNotifications,
    unreadCount: broadcastUnreadCount,
    dismiss: dismissBroadcastNotification,
  } = useNotificationInbox("user", { limit: 20 });

  useEffect(() => {
    const syncNotifications = () => {
      const saved = localStorage.getItem('food_user_notifications');
      setNotifications(saved ? JSON.parse(saved) : []);
    };

    // Listen for updates from the main Notifications page
    window.addEventListener('notificationsUpdated', syncNotifications);
    // Also listen for new notifications being added via listeners in Notifications.jsx (indirectly via localStorage update)
    // But since localStorage doesn't fire events on same window, we can use a custom event or a simple interval if needed.
    // However, the Notifications.jsx already multi-dispatches.

    return () => window.removeEventListener('notificationsUpdated', syncNotifications);
  }, []);

  const festCategories = [
    { id: "food", name: "Food", icon: foodIcon, bgColor: "bg-white dark:bg-[#1a1a1a]" },
    { id: "quick", name: "Quick", icon: quickIcon, bgColor: "bg-white dark:bg-[#1a1a1a]" },
    { id: "taxi", name: "Taxi", icon: taxiIcon, bgColor: "bg-white dark:bg-[#1a1a1a]" },
    { id: "hotel", name: "Hotel", icon: hotelIcon, bgColor: "bg-white dark:bg-[#1a1a1a]" },
  ];

  const mergedNotifications = useMemo(() => {
    const localItems = Array.isArray(notifications)
      ? notifications.map((item) => ({ ...item, source: "local" }))
      : [];
    const broadcastItems = (broadcastNotifications || []).map((item) => ({
      ...item,
      source: "broadcast",
      time: item.createdAt
        ? new Date(item.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        : "Just now",
      type: "broadcast",
      icon: "Bell",
      iconColor: "text-blue-600",
    }));

    return [...broadcastItems, ...localItems].sort(
      (a, b) =>
        new Date(b.createdAt || b.timestamp || 0).getTime() -
        new Date(a.createdAt || a.timestamp || 0).getTime()
    );
  }, [broadcastNotifications, notifications]);

  const unreadCount = notifications.filter(n => !n.read).length + broadcastUnreadCount;

  const handleDeleteNotification = (id, source = "local") => {
    if (source === "broadcast") {
      dismissBroadcastNotification(id);
      return;
    }
    setNotifications((prev) => {
      const next = prev.filter((notification) => notification.id !== id);
      localStorage.setItem('food_user_notifications', JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('notificationsUpdated', { detail: { count: next.filter((n) => !n.read).length } }));
      return next;
    });
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 95);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const slideBanners = [
    {
      id: 0,
      bg: "bg-gradient-to-r from-[#ff5100]/40 to-[#e11d48]/40",
      content: (
        <div className="flex justify-between items-center h-full px-4 w-full">
          <div className="flex flex-col items-start justify-center w-[60%]">
            <div className="text-[12px] font-bold text-white/80 tracking-widest uppercase mb-0.5">FLAT</div>
            <div className="text-[28px] leading-[1] font-black text-white tracking-tight mb-0.5 drop-shadow-md">50% OFF</div>
            <div className="text-[11px] font-medium text-white/90">with FREE delivery</div>
          </div>
          <div className="w-[40%] flex justify-end">
            <img src={foodIcon} alt="offer" className="w-[85px] h-[85px] object-contain drop-shadow-2xl scale-110" />
          </div>
        </div>
      )
    },
    {
      id: 1,
      bg: "bg-gradient-to-r from-[#e11d48]/40 to-[#b30707]/40",
      content: (
        <div className="flex justify-between items-center h-full px-4 w-full">
          <div className="flex flex-col items-start w-[65%]">
            <div className="text-[24px] leading-[1.1] font-black text-white tracking-tight mb-0.5">Flat ₹150 OFF</div>
            <div className="text-[11px] font-bold text-gray-200 opacity-90">on Premium Dining restaurants</div>
          </div>
          <div className="w-[35%] flex justify-end">
            <Sparkles className="w-[60px] h-[60px] text-white/30 fill-white/20 drop-shadow-2xl" strokeWidth={1} />
          </div>
        </div>
      )
    },
    {
      id: 2,
      bg: "bg-gradient-to-r from-[#ff5100]/40 to-[#b30707]/40",
      content: (
        <div className="flex justify-between items-center h-full px-4 w-full">
          <div className="flex flex-col items-start w-[65%]">
            <div className="text-[24px] leading-[1.1] font-black text-white tracking-tight mb-0.5">Free Delivery</div>
            <div className="text-[11px] font-bold text-gray-200 opacity-90">on all fast food orders above ₹199</div>
          </div>
          <div className="w-[35%] flex justify-end">
            <Gift className="w-[60px] h-[60px] text-white/30 fill-white/20 drop-shadow-2xl" strokeWidth={1} />
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      {/* Dynamic Header Wrapper */}
      <div 
        className="relative w-full rounded-b-[2.5rem] bg-gradient-to-br from-[#ff3d00] via-[#ee3f24] to-[#b30707] shadow-[0_12px_40px_rgba(238,63,36,0.22)] pb-6 flex flex-col overflow-hidden z-30"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {/* Location / Bell / Veg bar */}
        <motion.div
          className="relative z-20 px-4 pt-5 flex items-center justify-between gap-3"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {(() => {
            const addressToShow = savedAddressText || (location?.area && location?.city
              ? `${location.area}, ${location.city}`
              : location?.area || location?.city || "");

            return (
              <div
                className="flex items-center gap-2.5 cursor-pointer group min-w-0 flex-1 select-none"
                onClick={handleLocationClick}
              >
                <div className="bg-white/15 p-2 rounded-xl backdrop-blur-md border border-white/25 hover:scale-105 active:scale-95 transition-all shadow-md flex-shrink-0 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white animate-bounce" style={{ animationDuration: '3s' }} />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-extrabold text-white/80 uppercase tracking-widest drop-shadow-sm">Deliver to</span>
                    <ChevronDown className="h-3 w-3 text-white/80 transition-transform duration-300 group-hover:rotate-180" />
                  </div>
                  {addressToShow ? (
                    <span className="text-sm font-extrabold text-white truncate drop-shadow-md max-w-full">
                      {addressToShow}
                    </span>
                  ) : (
                    <span className="text-xs font-black text-yellow-305 hover:text-yellow-400 underline decoration-dotted transition-colors flex items-center gap-1 drop-shadow-md">
                      Add delivery location
                    </span>
                  )}
                </div>
              </div>
            );
          })()}

          <div className="flex items-center gap-2 flex-shrink-0 relative z-20">
            <Popover>
              <PopoverTrigger asChild>
                <div className="h-10 w-10 relative flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-sm cursor-pointer active:scale-95 transition-all hover:bg-white/25 flex-shrink-0">
                  <Bell className="h-[22px] w-[22px] text-white drop-shadow-sm" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white animate-pulse" />
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 overflow-hidden border-none shadow-2xl rounded-2xl mt-2" align="end">
                <div className="bg-white dark:bg-gray-900">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      Notifications
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="bg-primary-orange/10 text-accent-orange border-none text-[10px] h-4">
                          {unreadCount} New
                        </Badge>
                      )}
                    </h3>
                    <Link to="/food/user/notifications" className="text-xs font-bold text-accent-orange hover:text-accent-orange/90">
                      {mergedNotifications.length > 0 ? "View All" : ""}
                    </Link>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mergedNotifications.length > 0 ? (
                      mergedNotifications.slice(0, 5).map((notif) => {
                        const Icon = ICON_MAP[notif.icon] || Bell;
                        return (
                          <div
                            key={notif.id}
                            className={`p-4 flex items-start gap-3 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${!notif.read ? 'bg-primary-orange/5/20' : ''}`}
                          >
                            <div className={`mt-1 p-2 rounded-full ${notif.type === "order" ? "bg-green-100/50 text-green-600" : "bg-primary-orange/10/50 text-accent-orange"}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{notif.title}</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{notif.time}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleDeleteNotification(notif.id, notif.source);
                                    }}
                                    className="rounded-full p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                {notif.message}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center flex flex-col items-center gap-2">
                        <BellOff className="h-10 w-10 text-gray-200" />
                        <p className="text-xs text-gray-400 font-medium">All caught up!</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50/50 dark:bg-gray-800/50 text-center">
                    <Link to="/food/user/notifications" className="text-xs font-bold text-gray-400 hover:text-gray-600">
                      {mergedNotifications.length > 0 ? "Manage Settings" : "Check Notifications Page"}
                    </Link>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Veg Mode Toggle */}
            <div
              className="flex items-center gap-1.5 h-10 bg-white/15 backdrop-blur-md rounded-full px-2.5 border border-white/25 shadow-sm cursor-pointer hover:bg-white/25 active:scale-95 transition-all flex-shrink-0"
              onClick={() => handleVegModeChange && handleVegModeChange(!isVegMode)}
              ref={vegModeToggleRef}
            >
              <div className={`flex items-center justify-center p-[2px] rounded-sm border ${isVegMode ? 'border-green-600' : 'border-gray-500'} bg-white flex-shrink-0`}>
                <div className={`w-[6px] h-[6px] rounded-full ${isVegMode ? 'bg-green-600' : 'bg-gray-500'}`} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tight text-white drop-shadow-sm hidden xs:inline`}>
                Veg
              </span>
              <div className={`w-6 h-3.5 rounded-full relative transition-colors ml-0.5 flex-shrink-0 ${isVegMode ? 'bg-green-500' : 'bg-gray-450/80'}`}>
                <div className={`absolute top-[1.5px] w-2.5 h-2.5 rounded-full bg-white transition-transform ${isVegMode ? 'translate-x-[11px]' : 'translate-x-[1.5px]'}`} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Option Tabs (Food & Taxi) - animated entrance */}
        <motion.div
          className="relative mt-4 px-4 flex flex-col z-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
        >
          <div
            className="flex w-full bg-black/20 rounded-2xl p-1 border border-white/10"
          >
            {/* Food Button */}
            <button
              onClick={() => navigate('/food/user')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
                window.location.pathname.includes('/food')
                  ? 'bg-white text-[#ff5100] shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <img src={foodIcon} alt="K9Food" className="w-5 h-5 object-contain" />
              <span>K9Food</span>
            </button>

            {/* Taxi Button */}
            <button
              onClick={() => navigate('/taxi/user')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
                window.location.pathname.includes('/taxi')
                  ? 'bg-white text-[#ff5100] shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <img src={taxiIcon} alt="K9Rides" className="w-5 h-5 object-contain" />
              <span>K9Rides</span>
            </button>
          </div>
        </motion.div>

        {/* Search bar moved to Home.jsx as a true viewport-sticky element */}

        {/* Sliding Banners Card Overlay — animated entrance */}
        <motion.div
          className="relative mx-4 mt-4 overflow-hidden h-[120px] rounded-2xl shadow-lg border border-white/10 z-20"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
        >
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slideBanners.map((banner) => (
              <div 
                key={banner.id} 
                className={`w-full h-full shrink-0 flex items-center justify-between ${banner.bg}`}
              >
                {banner.content}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Carousel Pager Dots */}
        <div className="relative mt-3 flex justify-center gap-1.5 z-20">
          {slideBanners.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-white w-4' : 'bg-white/40 w-1.5'}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
