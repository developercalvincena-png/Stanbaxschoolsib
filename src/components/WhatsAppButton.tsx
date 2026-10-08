import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { MessageCircle } from './RealIcons';

export const WhatsAppButton: React.FC = () => {
  const { schoolInfo } = useSchool();
  const cleanPhone = (schoolInfo.whatsapp || schoolInfo.phone || '2348031234567').replace(/[^0-9]/g, '');

  const handleClick = () => {
    const text = encodeURIComponent(`Hello Stanbax Schools Ibadan, I would like to make an inquiry regarding admissions and school schedule.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-110 active:scale-95 group ring-4 ring-emerald-500/20"
      title="Chat with Stanbax Schools Admissions Desk on WhatsApp"
      aria-label="WhatsApp Chat"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-1">
        WhatsApp Desk
      </span>
    </button>
  );
};
