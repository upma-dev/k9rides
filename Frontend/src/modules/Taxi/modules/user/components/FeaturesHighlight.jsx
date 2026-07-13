import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Navigation2, Package, Gavel } from 'lucide-react';

const features = [
  {
    id: 1,
    title: '0% Commission',
    description: 'Fair rides. No hidden fees.',
    icon: Wallet,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20'
  },
  {
    id: 2,
    title: 'Smart Bidding',
    description: 'Set & negotiate your fare.',
    icon: Gavel,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20'
  },
  {
    id: 3,
    title: 'Outstation',
    description: 'Comfortable intercity trips.',
    icon: Navigation2,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/20'
  },
  {
    id: 4,
    title: 'Fast Delivery',
    description: 'Quick parcel drop-offs.',
    icon: Package,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20'
  }
];

const FeaturesHighlight = ({ bgImageUrl }) => {
  return (
    <div className="w-full mt-4 mb-6 relative overflow-hidden bg-white">
      {/* Auto-changing Image Background */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000 ease-in-out bg-cover bg-center opacity-30" 
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      />
      
      {/* Light gradient overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/85 to-white/95 z-0" />

      <div className="relative z-10 px-5 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-[19px] font-black text-slate-900 tracking-tight">Why K9 Rides?</h3>
            <p className="text-[12px] text-slate-500 font-bold mt-0.5">Everything you need in one app</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shadow-sm border border-slate-200">
            <span className="text-[18px]">✨</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-10">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="bg-white/80 border border-slate-100 rounded-[20px] p-4 flex flex-col gap-3 backdrop-blur-md transition-all shadow-[0_4px_16px_rgba(15,23,42,0.03)]"
            >
              <div className={`w-10 h-10 rounded-xl ${feat.bg} flex items-center justify-center`}>
                <feat.icon size={20} strokeWidth={2.5} className={feat.color} />
              </div>
              <div>
                <h4 className="text-[13px] font-black text-slate-900 leading-tight mb-1">{feat.title}</h4>
                <p className="text-[10px] text-slate-500 font-bold leading-tight">{feat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesHighlight;
