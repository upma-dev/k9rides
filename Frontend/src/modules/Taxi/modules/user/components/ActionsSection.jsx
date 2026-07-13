import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ActionCard = ({ title, description, image, surfaceClass, titleClass, buttonClass, buttonText, path, delay = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 300, damping: 24 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={(e) => {
        e.stopPropagation();
        navigate(path);
      }}
      className={`group relative flex min-h-[176px] flex-1 flex-col overflow-hidden rounded-3xl border border-white/60 p-5 shadow-[0_12px_24px_rgba(2,6,23,0.06)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(2,6,23,0.12)] cursor-pointer ${surfaceClass}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(120px_90px_at_12%_20%,rgba(255,255,255,0.95),transparent_75%)]" aria-hidden="true" />

      <div className="relative z-10 flex flex-1 flex-col pointer-events-none">
        <div className="max-w-[150px]">
          <h3 className={`text-[20px] font-black leading-none tracking-tight ${titleClass}`}>{title}</h3>
          <p className="mt-2 text-[12.5px] font-bold leading-snug text-slate-500/90">{description}</p>
        </div>

        <div className="mt-auto pt-4">
          <div
            className={`relative inline-flex items-center rounded-full px-4 py-2.5 text-[12px] font-black whitespace-nowrap text-white shadow-lg overflow-hidden transition-all group-hover:scale-105 ${buttonClass}`}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 inline-flex items-center gap-2">
              {buttonText}
              <ArrowRight size={14} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-2 -right-4 w-[110px] opacity-95 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:-translate-y-2 group-hover:-translate-x-2">
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain drop-shadow-[0_22px_38px_rgba(2,6,23,0.25)]"
        />
      </div>
    </motion.div>
  );
};

const ActionsSection = () => {
  const location = useLocation();
  const routePrefix = location.pathname.startsWith('/taxi/user') ? '/taxi/user' : '';
  const resolvePath = (path) => `${routePrefix}${path}`;

  return (
    <div className="px-5 mt-4">
      <motion.div 
        initial={{ opacity: 0, x: -10 }} 
        whileInView={{ opacity: 1, x: 0 }} 
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-4 ml-1"
      >
        <h2 className="text-[20px] font-black text-slate-900 tracking-tight">What do you need today?</h2>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <ActionCard
          title="Ride"
          description="Bike, auto, and cab rides."
          image="/1_Bike.png"
          surfaceClass="bg-gradient-to-br from-orange-50/90 via-white/80 to-amber-100/60"
          titleClass="text-slate-900"
          buttonClass="bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/30"
          buttonText="Book Now"
          path={resolvePath('/ride/select-location')}
          delay={0.1}
        />

        <ActionCard
          title="Delivery"
          description="Send parcels across the city."
          image="/5_Parcel.png"
          surfaceClass="bg-gradient-to-br from-indigo-50/90 via-white/80 to-blue-100/60"
          titleClass="text-slate-900"
          buttonClass="bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-indigo-500/30"
          buttonText="Send Now"
          path={resolvePath('/parcel/type')}
          delay={0.2}
        />
      </div>
    </div>
  );
};

export default ActionsSection;
