import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import indiaGateImg from '@/assets/india_gate_real.png';
import jaipurImg from '@/assets/jaipur.avif';
import tajMahalImg from '@/assets/taj mahal.jpeg';

const ExplorerSection = () => {
  const navigate = useNavigate();

  const indiaCities = [
    {
      title: 'Taj Mahal',
      image: tajMahalImg,
      label: 'Agra',
      code: 'AGR',
      drop: 'Taj Mahal, Agra',
    },
    {
      title: 'Hawa Mahal',
      image: jaipurImg,
      label: 'Jaipur',
      code: 'JAI',
      drop: 'Hawa Mahal, Jaipur',
    },
    {
      title: 'India Gate',
      image: indiaGateImg,
      label: 'New Delhi',
      code: 'DEL',
      drop: 'India Gate, New Delhi',
    },
  ];

  const handleExploreDestination = (city) => {
    navigate('/taxi/user/ride/select-location', {
      state: {
        drop: city.drop || city.title,
      },
    });
  };

  return (
    <div className="px-0 pb-10 flex flex-col gap-10 mt-2">
      <div className="px-5">
        <motion.div 
          initial={{ opacity: 0, x: -10 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-4 ml-1"
        >
          <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Explore India</h2>
          <p className="mt-1 text-[12px] font-bold text-slate-500">
            Top tourist destinations across the country.
          </p>
        </motion.div>
      </div>

      <div 
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-5 pb-6 flex-nowrap"
        style={{ scrollBehavior: 'smooth' }}
      >
        {indiaCities.map((city, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="snap-start flex-shrink-0 w-[240px]"
          >
            <button
              type="button"
              onClick={() => handleExploreDestination(city)}
              className="w-full group text-left transition-all active:scale-[0.97] cursor-pointer outline-none block"
            >
              <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.08)] overflow-hidden h-[300px] transition-all relative">
                {/* Image Background */}
                <img
                  src={city.image}
                  alt={city.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80';
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/90" />
                
                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/30 z-10 flex items-center gap-1.5">
                  <MapPin size={12} className="text-white" />
                  <p className="text-[10px] font-black text-white tracking-widest uppercase">{city.code}</p>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 inset-x-0 p-5 z-20 flex flex-col justify-end h-full">
                  <h4 className="text-[20px] font-black text-white leading-tight tracking-tight drop-shadow-md">
                    {city.title}
                  </h4>
                  <p className="text-[13px] text-slate-200 font-medium mt-1 mb-4 opacity-90">
                    {city.label}
                  </p>
                  
                  {/* Sliding Arrow Button */}
                  <div className="w-full flex justify-end overflow-hidden">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all duration-300 group-hover:bg-white group-hover:text-slate-900">
                      <ArrowRight size={18} strokeWidth={3} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExplorerSection;
