
import React, { useState } from 'react';
import { Event } from '../types';
import { translations } from '../src/translations';

interface ConfirmationProps {
  event: Event;
  seats: string[];
  totalPrice: number;
  zone?: string;
  orderId: string;
  onViewBookings: () => void;
  onBookAnother: () => void;
  t: (key: keyof typeof translations['en']) => string;
}

const Confirmation: React.FC<ConfirmationProps> = ({ event, seats, totalPrice, zone, orderId, onViewBookings, onBookAnother, t }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      window.print();
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center mt-12 animate-fadeIn pb-24 relative">
      {showToast && (
        <div className="fixed top-20 right-4 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl z-[100] animate-bounce flex items-center gap-2">
          <i className="fas fa-file-pdf"></i>
          <span className="font-bold">E-Ticket downloaded successfully!</span>
        </div>
      )}

      <div className="max-w-2xl w-full">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-bounce">
           <i className="fas fa-check text-white text-4xl"></i>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black mb-4">{t('paymentSuccessful')}</h1>
        <p className="text-neutral-400 text-lg mb-12">{t('paymentSuccessMsg')}</p>

        <div className="bg-white text-black rounded-3xl overflow-hidden shadow-2xl relative print:shadow-none print:border print:border-neutral-200">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-neutral-950 rounded-full print:hidden"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-neutral-950 rounded-full print:hidden"></div>
          
          <div className="p-8 border-b-2 border-dashed border-neutral-200">
             <div className="flex justify-between items-start mb-6">
                <div className="text-left">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{t('orderIdText')}</p>
                  <p className="font-bold">{orderId}</p>
                </div>
                <div className="text-right">
                   <div className="w-12 h-12 bg-rose-600 rounded flex items-center justify-center font-black italic text-white">N</div>
                </div>
             </div>
             <h2 className="text-2xl font-black text-left mb-2">{event.title}</h2>
             <div className="grid grid-cols-2 gap-4 text-left">
               <div>
                 <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Date & Time</p>
                 <p className="font-semibold text-sm">{event.date}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Venue</p>
                 <p className="font-semibold text-sm">{event.venue}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{t('seatsText')}</p>
                 <p className="font-bold text-rose-600">{seats.join(', ')}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{t('zoneText')}</p>
                 <p className="font-semibold text-sm">{zone || 'N/A'}</p>
               </div>
             </div>
          </div>

          <div className="p-8 bg-neutral-50 flex items-center justify-between">
             <div className="w-32 h-32 bg-white p-2 border border-neutral-200">
               <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=TICKET-VERIFIED" className="w-full h-full opacity-80" />
             </div>
             <div className="text-right">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{t('totalPaid')}</p>
                <p className="text-2xl font-black">{totalPrice.toLocaleString()} THB</p>
                <p className="text-[10px] text-green-600 font-bold uppercase mt-1">Verified Digital Ticket</p>
             </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center print:hidden">
           <button 
             onClick={handleDownload}
             disabled={isDownloading}
             className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
           >
             <i className="fas fa-file-arrow-down"></i> {t('downloadPDF')}
           </button>
           <button 
             onClick={onViewBookings}
             className="bg-rose-600 hover:bg-rose-500 px-8 py-4 rounded-2xl font-bold shadow-lg shadow-rose-900/40 transition-colors flex items-center justify-center gap-2"
           >
             <i className="fas fa-ticket"></i>
             View My Bookings
           </button>
           <button 
             onClick={onBookAnother}
             className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-2xl font-bold shadow-lg shadow-purple-900/40 transition-colors flex items-center justify-center gap-2"
           >
             <i className="fas fa-calendar-plus"></i>
             Book Another Event
           </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
