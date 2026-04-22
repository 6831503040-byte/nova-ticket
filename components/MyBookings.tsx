
import React, { useState } from 'react';
import { Booking } from '../types';
import { translations } from '../src/translations';

interface MyBookingsProps {
  bookings: Booking[];
  onExplore: () => void;
  onBack: () => void;
  t: (key: keyof typeof translations['en']) => string;
}

const MyBookings: React.FC<MyBookingsProps> = ({ bookings, onExplore, onBack, t }) => {
  const [selectedQR, setSelectedQR] = useState<Booking | null>(null);

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto animate-fadeIn relative">
      {/* QR Modal */}
      {selectedQR && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full relative">
            <button 
              onClick={() => setSelectedQR(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-1">E-Ticket QR Code</h3>
              <p className="text-neutral-500 text-sm mb-6">Order ID: {selectedQR.orderId}</p>
              
              <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BOOKING-${selectedQR.orderId}`} 
                  alt="QR Code" 
                  className="w-48 h-48"
                />
              </div>
              
              <div className="space-y-2 text-left bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Event</p>
                <p className="font-bold text-rose-500">{selectedQR.event.title}</p>
                <p className="text-sm">Seats: <span className="font-bold text-white">{selectedQR.seats.join(', ')}</span></p>
              </div>
              
              <button 
                onClick={() => setSelectedQR(null)}
                className="w-full bg-rose-600 hover:bg-rose-500 font-bold py-4 rounded-xl mt-8 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-neutral-900 rounded-xl border border-white/5 hover:bg-white/5 transition-colors text-rose-500"
            title="Back to Main Page"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h1 className="text-4xl font-black">{t('myBookings')}</h1>
            <p className="text-neutral-500">History of your secured tickets.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-neutral-900 px-4 py-2 rounded-xl border border-white/5">
             <span className="text-rose-500 font-black text-xl">{bookings.length}</span>
             <span className="text-neutral-500 text-xs font-bold uppercase ml-2">Tickets</span>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-neutral-900/50 rounded-3xl border border-dashed border-white/10">
          <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-ticket-alt text-neutral-600 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold mb-2">No Bookings Yet</h2>
          <p className="text-neutral-500 mb-8 max-w-xs">You haven't booked any tickets yet. Explore the hottest events now!</p>
          <button 
            onClick={onExplore}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-rose-900/20"
          >
            {t('browseAll')}
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking.orderId}
              className="bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row transition-all hover:border-rose-600/30 group"
            >
              <div className="w-full md:w-48 aspect-square md:aspect-auto relative">
                <img 
                  src={booking.event.image} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80" 
                  alt={booking.event.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
              </div>

              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter shadow-sm shadow-emerald-900/50">Secured</span>
                       <span className="text-neutral-500 text-xs font-bold">Order: {booking.orderId}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{booking.event.title}</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-400">
                      <span className="flex items-center gap-2"><i className="fas fa-calendar-day text-rose-500"></i> {booking.event.date}</span>
                      <span className="flex items-center gap-2"><i className="fas fa-location-dot text-rose-500"></i> {booking.event.venue}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Total Paid</p>
                    <p className="text-xl font-black text-white">{booking.totalPrice.toLocaleString()} THB</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex gap-2">
                    {booking.seats.map(seat => (
                      <span key={seat} className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-sm font-bold text-rose-500">
                        {seat}
                      </span>
                    ))}
                    <span className="ml-2 self-center text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Seats</span>
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => setSelectedQR(booking)}
                      className="w-full md:w-auto bg-rose-600 hover:bg-rose-500 text-white px-10 py-3 rounded-xl font-black tracking-widest uppercase text-xs transition-all shadow-lg shadow-rose-900/20 active:scale-95"
                    >
                      <i className="fas fa-qrcode mr-2"></i>
                      View QR Ticket
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 bg-gradient-to-r from-purple-900/20 to-rose-900/20 p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="text-center md:text-left">
           <h4 className="text-xl font-bold mb-2">Want to book more?</h4>
           <p className="text-neutral-400 text-sm">Discover upcoming concerts and performances in your area.</p>
         </div>
         <button 
           onClick={onExplore}
           className="whitespace-nowrap bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-neutral-200 transition-colors"
         >
            Browse All Events
         </button>
      </div>
    </div>
  );
};

export default MyBookings;
