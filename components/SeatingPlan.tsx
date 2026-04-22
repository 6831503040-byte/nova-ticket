
import React, { useState, useEffect } from 'react';
import { Event, Seat, Booking, PerformanceRound, User } from '../types';
import { translations } from '../src/translations';
import { ZONE_CONFIG } from '../src/constants';

interface SeatingPlanProps {
  event: Event;
  selectedRound: PerformanceRound;
  bookings: Booking[];
  user: User;
  onConfirm: (seats: string[]) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const COLS = Array.from({ length: 16 }, (_, i) => i + 1);

const SeatingPlan: React.FC<SeatingPlanProps> = ({ event, selectedRound, bookings, user, onConfirm, t }) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);

  useEffect(() => {
    const initialSeats: Seat[] = [];
    
    // Find all seats already booked for this specific event and round
    const bookedSeatIds = new Set<string>();
    bookings.forEach(b => {
      if (b.event.id === event.id && b.roundId === selectedRound.id) {
        b.seats.forEach(s => bookedSeatIds.add(s));
      }
    });

    ROWS.forEach(row => {
      const zone = ZONE_CONFIG.find(z => z.rows.includes(row))!;
      COLS.forEach(col => {
        const seatId = `${row}${col}`;
        const isPermanentlySold = bookedSeatIds.has(seatId);

        initialSeats.push({
          id: seatId,
          row,
          col,
          price: zone.price,
          status: isPermanentlySold ? 'sold' : 'available',
          zone: zone.name,
          color: zone.color
        });
      });
    });
    setSeats(initialSeats);
  }, [event.id, selectedRound.id, bookings]);

  const toggleSeat = (id: string) => {
    const seat = seats?.find(s => s.id === id);
    if (!seat || seat.status === 'sold') return;
    
    if (selectedSeats.includes(id)) {
      setSelectedSeats(prev => prev.filter(s => s !== id));
    } else {
      if (selectedSeats.length >= 3) {
        alert("Maximum 3 seats per transaction");
        return;
      }
      setSelectedSeats(prev => [...prev, id]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, id) => {
    const seat = seats?.find(s => s.id === id);
    return sum + (seat?.price || 0);
  }, 0);

  if (seats.length === 0) return <div className="p-12 text-center text-neutral-500">{t('loadingSeating')}</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-black">
      {/* Dynamic Status Legend */}
      <div className="bg-neutral-900 border-b border-white/10 px-6 py-4 flex flex-col gap-4">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 rounded bg-neutral-800 border border-white/5 flex items-center justify-center">
               <i className="fas fa-times text-[8px] text-neutral-600"></i>
             </div>
             <span className="text-[10px] font-bold uppercase text-neutral-500">{t('soldOut')}</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 rounded bg-emerald-500 border border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
             <span className="text-[10px] font-bold uppercase text-neutral-500">{t('yourSelection')}</span>
           </div>
        </div>
        
        <div className="h-[1px] w-full max-w-2xl mx-auto bg-white/5"></div>

        <div className="flex flex-wrap justify-center gap-6">
          {ZONE_CONFIG.map(zone => (
            <div key={zone.name} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${zone.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`}></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-500 font-bold uppercase leading-none mb-1">{zone.name}</span>
                <span className="text-xs font-black">{zone.price.toLocaleString()} THB</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col items-center custom-scrollbar">
        <div className="w-full max-w-5xl">
          {/* Stage Visualization */}
          <div className="relative mb-24 mt-8 flex justify-center">
            <div className="w-full max-w-3xl h-20 bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-t-[150px] border-t-4 border-rose-600 flex items-center justify-center shadow-[0_-15px_60px_rgba(225,29,72,0.3)]">
              <div className="flex flex-col items-center">
                <span className="text-rose-600 uppercase tracking-[1em] font-black text-lg animate-pulse">{t('stage')}</span>
                <div className="flex gap-4 mt-2">
                   <div className="w-1 h-1 bg-rose-500 rounded-full animate-ping"></div>
                   <div className="w-1 h-1 bg-rose-500 rounded-full animate-ping delay-150"></div>
                   <div className="w-1 h-1 bg-rose-500 rounded-full animate-ping delay-300"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Details Label */}
          <div className="text-center mb-8">
            <span className="text-[10px] text-rose-500 font-black uppercase tracking-[0.3em] bg-rose-500/10 px-6 py-2 rounded-full border border-rose-500/20">
              {selectedRound.date} @ {selectedRound.time}
            </span>
          </div>

          {/* Seating Arrangement */}
          <div className="grid gap-2 md:gap-4 select-none perspective-1000 mb-20 overflow-x-auto pb-8 scrollbar-hide w-full">
            {ROWS.map(row => (
              <div key={row} className="flex items-center justify-start md:justify-center gap-1.5 md:gap-4 min-w-max px-4">
                <div className="w-6 md:w-8 text-neutral-600 font-black text-[10px] md:text-xs text-center shrink-0">{row}</div>
                <div className="flex gap-0.5 md:gap-2">
                  {COLS.map((col, idx) => {
                    const id = `${row}${col}`;
                    const seat = seats.find(s => s.id === id);
                    if (!seat) return null;

                    const isSelected = selectedSeats.includes(id);
                    const isSold = seat.status === 'sold';
                    const zone = ZONE_CONFIG.find(z => z.rows.includes(row))!;

                    const isGap = idx === 3 || idx === 11;

                    return (
                      <React.Fragment key={id}>
                        {isGap && <div className="w-2 md:w-8"></div>}
                        <button
                          onMouseEnter={() => setHoveredSeat(seat)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          onClick={() => toggleSeat(id)}
                          disabled={isSold}
                          className={`
                            w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 rounded-sm md:rounded-md text-[7px] md:text-[9px] font-bold transition-all duration-150 border relative flex items-center justify-center
                            ${isSold ? 'bg-neutral-900 border-white/5 cursor-not-allowed opacity-40' : ''}
                            ${isSelected ? 'bg-emerald-500 border-emerald-300 text-white scale-110 shadow-[0_0_15px_rgba(16,185,129,0.7)] z-10' : ''}
                            ${!isSold && !isSelected ? `${zone.color} bg-opacity-20 ${zone.borderColor} hover:bg-opacity-40 text-white` : ''}
                          `}
                        >
                          {isSold ? (
                            <i className="fas fa-times text-neutral-700"></i>
                          ) : isSelected ? (
                            <i className="fas fa-check"></i>
                          ) : (
                            col
                          )}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
                <div className="w-6 md:w-8 text-neutral-600 font-black text-[10px] md:text-xs text-center">{row}</div>
              </div>
            ))}
          </div>

          {/* Detailed Floating Information */}
          {hoveredSeat && (
            <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-neutral-900 border border-white/20 px-6 py-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60] animate-fadeIn pointer-events-none flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${hoveredSeat.status === 'sold' ? 'bg-neutral-800' : hoveredSeat.color}`}></div>
              <div className="flex flex-col">
                 <div className="flex items-center gap-2">
                    <span className="text-rose-500 font-black text-lg">Seat {hoveredSeat.id}</span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-neutral-400 font-bold uppercase">{hoveredSeat.zone}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-white font-black text-sm">
                      {hoveredSeat.status === 'sold' ? 'UNAVAILABLE' : `${hoveredSeat.price.toLocaleString()} THB`}
                    </span>
                    {hoveredSeat.status === 'available' && <span className="text-emerald-500 text-[10px] font-bold">AVAILABLE</span>}
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Footer bar */}
      <div className="bg-neutral-900 border-t border-white/10 p-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 z-50">
        <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-2">{t('selected')} ({selectedSeats.length}/3)</span>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedSeats.length > 0 ? selectedSeats.map(s => (
                <div key={s} className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm font-black shadow-lg shadow-emerald-900/20 animate-fadeIn">{s}</div>
              )) : (
                <span className="text-neutral-600 text-sm italic">{t('pleaseSelectSeats')}</span>
              )}
            </div>
          </div>
          <div className="hidden md:block h-12 w-[1px] bg-white/10"></div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-1">{t('totalPayable')}</span>
            <span className="text-3xl font-black text-white">{totalPrice.toLocaleString()} <span className="text-sm font-normal text-neutral-500">THB</span></span>
          </div>
        </div>

        <button 
          onClick={() => selectedSeats.length > 0 && onConfirm(selectedSeats)}
          disabled={selectedSeats.length === 0}
          className={`
            w-full md:w-auto px-16 py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all text-lg
            ${selectedSeats.length > 0 
              ? 'bg-rose-600 hover:bg-rose-500 shadow-xl shadow-rose-900/40 active:scale-[0.97]' 
              : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'}
          `}
        >
          {selectedSeats.length > 0 ? t('holdAndProceed') : t('selectSeatsFirst')}
        </button>
      </div>
    </div>
  );
};

export default SeatingPlan;
