import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../../../shared/context/SettingsContext';

const ServiceGrid = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const services = useMemo(() => [
    {
      id: 'daily',
      title: 'Daily Rides',
      icon: Car,
      color: 'bg-emerald-500',
      shadow: 'shadow-emerald-500/20',
      action: () => navigate('/taxi/user/ride/select-location'),
      adminIconKey: 'rideIcon'
    },
    {
      id: 'intercity',
      title: 'Intercity',
      icon: MapPin,
      color: 'bg-blue-500',
      shadow: 'shadow-blue-500/20',
      action: () => navigate('/taxi/user/ride/select-location?type=outstation'),
      adminIconKey: 'intercityIcon'
    },
    {
      id: 'rental',
      title: 'Rentals',
      icon: Clock,
      color: 'bg-orange-500',
      shadow: 'shadow-orange-500/20',
      action: () => navigate('/taxi/user/rental/select'),
      adminIconKey: 'rentalIcon'
    }
  ], [navigate]);

  return (
    <div className="px-5 mb-6">
      <div className="grid grid-cols-3 gap-3">
        {services.map((service, index) => {
          const adminIcon = settings?.services?.[service.adminIconKey] || '';
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={service.action}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)] border border-slate-100 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${service.color} ${service.shadow} text-white`}>
                {adminIcon ? (
                  <img src={adminIcon} alt={service.title} className="w-6 h-6 object-contain filter brightness-0 invert" />
                ) : (
                  <service.icon size={20} />
                )}
              </div>
              <span className="text-[11px] font-black tracking-tight text-slate-700">{service.title}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceGrid;
