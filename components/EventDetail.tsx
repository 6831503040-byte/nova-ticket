
import React, { useState } from 'react';
import { Event, PerformanceRound, User } from '../types';
import { translations } from '../src/translations';

interface EventDetailProps {
  event: Event;
  user: User | null;
  onRoundSelect: (round: PerformanceRound) => void;
  onTriggerLogin?: () => void;
  onNotify?: (eventId: string, eventTitle: string) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, user, onRoundSelect, onTriggerLogin, onNotify, t }) => {
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const saleStarted = !event.saleStartTime || new Date() >= new Date(event.saleStartTime);
  const isComingSoon = event.status === 'COMING_SOON' && !saleStarted;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFavorite = () => {
    if (!user) {
      showToast('Please login to save events to favorites');
      return;
    }
    
    const newState = !isFavorited;
    setIsFavorited(newState);
    showToast(newState ? 'Added to your favorites!' : 'Removed from favorites');
  };

  const handleNotify = () => {
    if (!user) {
      showToast('Please login to set a reminder');
      return;
    }
    if (onNotify) {
      onNotify(event.id, event.title);
      showToast('Reminder set! You will be notified in 10 seconds.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: `Check out ${event.title} at ${event.venue}!`,
      url: window.location.href,
    };

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    try {
      if (navigator.share && (navigator.canShare ? navigator.canShare(shareData) : true)) {
        await navigator.share(shareData);
      } else {
        await copyToClipboard();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Share failed, falling back to clipboard:', err);
        await copyToClipboard();
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12 animate-fadeIn relative">
      {/* Dynamic Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 bg-neutral-900 border border-white/10 text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] animate-bounce flex items-center gap-3">
          <i className={`fas ${toastMessage.includes('Added') || toastMessage.includes('copied') ? 'fa-check-circle text-emerald-500' : 'fa-info-circle text-rose-500'}`}></i>
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Poster */}
        <div className="lg:w-1/3">
          <div className="sticky top-24">
            <div className="relative group overflow-hidden rounded-3xl shadow-2xl border border-white/10">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleShare}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 p-4 rounded-2xl transition-all text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 border border-neutral-700 min-h-[48px] text-white"
              >
                <i className="fas fa-share-nodes text-rose-500"></i> Share
              </button>
              <button 
                onClick={handleFavorite}
                className={`flex-1 p-4 rounded-2xl transition-all text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 border min-h-[48px] ${
                  isFavorited && user
                    ? 'bg-rose-600/10 border-rose-600 text-rose-500' 
                    : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white'
                }`}
              >
                <i className={`${isFavorited && user ? 'fas' : 'far'} fa-heart transition-transform ${isFavorited && user ? 'scale-110' : ''}`}></i> 
                {isFavorited && user ? 'Favorited' : 'Favorite'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:w-2/3 space-y-8">
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-rose-600/20 text-rose-500 text-[10px] font-black uppercase tracking-widest mb-4 border border-rose-600/30">
              {t('officialTickets')}
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black mb-4 leading-tight">{event.title}</h1>
            
            {isComingSoon && (
              <div className="mb-6 p-4 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/40">
                    <i className="fas fa-clock text-xl text-white"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">Tickets sale starts on</p>
                    <p className="text-lg font-black text-white">
                      {new Date(event.saleStartTime!).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleNotify}
                  className="w-full md:w-auto bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-bell"></i> Notify Me (10s)
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-3 md:gap-6 text-neutral-400">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <i className="fas fa-calendar-day text-rose-500"></i>
                <span className="text-xs md:text-sm font-bold">{event.date}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <i className="fas fa-location-dot text-rose-500"></i>
                <span className="text-xs md:text-sm font-bold">{event.venue}</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
            <h3 className="text-xl font-black flex items-center gap-3">
               <span className="w-1.5 h-6 bg-rose-600 rounded-full"></span>
               {t('home')}
            </h3>
            <p className="text-neutral-400 leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <i className="fas fa-clock text-rose-600"></i>
                {t('viewAll')}
              </h3>
              <span className="text-neutral-500 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                {event.rounds.length} {event.rounds.length > 1 ? 'Show Dates' : 'Date Available'}
              </span>
            </div>
            
            <p className="text-neutral-400 text-sm italic">Select your preferred date to view seat availability:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.rounds.map((round) => (
                <button
                  key={round.id}
                  onClick={() => event.status !== 'SOLD_OUT' && !isComingSoon && setSelectedRoundId(round.id)}
                  disabled={event.status === 'SOLD_OUT' || isComingSoon}
                  className={`
                    p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden group
                    ${selectedRoundId === round.id 
                      ? 'bg-rose-600/10 border-rose-600 shadow-[0_10px_30px_rgba(225,29,72,0.15)]' 
                      : 'bg-black border-white/10 hover:border-white/30'}
                    ${(event.status === 'SOLD_OUT' || isComingSoon) ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                  `}
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Performance</p>
                  <h4 className="text-lg font-black">{round.date}</h4>
                  <p className="text-rose-500 font-bold flex items-center gap-2 mt-1">
                    <i className="far fa-clock"></i> {round.time}
                  </p>
                  {selectedRoundId === round.id && (
                    <div className="absolute top-4 right-4 text-rose-500">
                      <i className="fas fa-circle-check text-xl"></i>
                    </div>
                  )}
                  <div className="absolute bottom-[-10px] right-[-10px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <i className="fas fa-ticket text-7xl -rotate-12"></i>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <button
              disabled={!selectedRoundId || event.status === 'SOLD_OUT' || isComingSoon}
              onClick={() => {
                const round = event.rounds.find(r => r.id === selectedRoundId);
                if (round) onRoundSelect(round);
              }}
              className={`
                w-full py-5 rounded-2xl font-black text-xl uppercase tracking-[0.1em] transition-all
                ${selectedRoundId && event.status !== 'SOLD_OUT' && !isComingSoon
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-xl shadow-rose-900/40 active:scale-[0.98]' 
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}
              `}
            >
              {isComingSoon ? 'TICKET SALE NOT STARTED' : event.status === 'SOLD_OUT' ? t('soldOut').split(' / ')[0] : selectedRoundId ? t('buyTickets') : t('selectSeatsFirst')}
            </button>
            <div className="flex flex-col items-center gap-4 mt-6">
               <p className="text-xs text-neutral-500 flex items-center gap-2">
                 <i className="fas fa-shield-halved text-emerald-500"></i> Verified Official Ticketing Platform
               </p>
               <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                  <i className="fab fa-cc-visa text-2xl"></i>
                  <i className="fab fa-cc-mastercard text-2xl"></i>
                  <i className="fab fa-apple-pay text-2xl"></i>
                  <i className="fab fa-google-pay text-2xl"></i>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
