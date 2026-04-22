
import React, { useState } from 'react';
import { Event } from '../types';
import { translations } from '../src/translations';

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Taylor Swift | The Eras Tour',
    venue: 'Rajamangala Stadium',
    date: 'OCT 12 - 14, 2025',
    image: 'https://shop.musaastudios.com/cdn/shop/files/ErasTourMiamiN1Poster.png?v=1734177752$0',
    priceRange: '2,500 - 15,000 THB',
    minPrice: 2500,
    stadiumLayoutType: 'STADIUM',
    description: 'The Eras Tour is the ongoing sixth headlining concert tour by American singer-songwriter Taylor Swift.',
    rounds: [
      { id: '1a', date: 'Sunday, 12 Oct 2025', time: '19:00' },
      { id: '1b', date: 'Monday, 13 Oct 2025', time: '19:00' },
      { id: '1c', date: 'Tuesday, 14 Oct 2025', time: '19:00' }
    ],
    status: 'OPEN'
  },
  {
    id: '2',
    title: 'Bruno Mars: Live in Bangkok',
    venue: 'IMPACT Arena',
    date: 'NOV 05, 2025',
    image: 'https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/p2/131/2024/01/23/Bruno-Mars-konser-di-Thailand-dan-Singapura-787588543.jpg',
    priceRange: '1,500 - 9,500 THB',
    minPrice: 1500,
    stadiumLayoutType: 'ARENA',
    description: 'Global superstar Bruno Mars is returning to Bangkok.',
    rounds: [{ id: '2a', date: 'Wednesday, 05 Nov 2025', time: '20:00' }],
    status: 'OPEN'
  },
  {
    id: '3',
    title: 'The Weeknd: After Hours Til Dawn',
    venue: 'National Stadium',
    date: 'DEC 20, 2025',
    image: 'https://images.bubbleup.com/vipnation/1-default/2-vipnationcom/static_vip_1280x1280_theweeknd_2025_national_1738276072.jpg',
    priceRange: '3,000 - 20,000 THB',
    minPrice: 3000,
    stadiumLayoutType: 'STADIUM',
    description: 'The Weeknd brings his cinematic stadium tour to Bangkok.',
    rounds: [{ id: '3a', date: 'Saturday, 20 Dec 2025', time: '21:00' }],
    status: 'OPEN'
  },
  {
    id: '4',
    title: 'Coldplay: Music of the Spheres',
    venue: 'Rajamangala Stadium',
    date: 'JAN 15, 2026',
    image: 'https://publichouse-hotels.com/wp-content/uploads/2024/01/konser-coldplay-bangkok-2024-music-of-the-spheres-world-tour_169.jpeg',
    priceRange: '2,000 - 18,000 THB',
    minPrice: 2000,
    stadiumLayoutType: 'STADIUM',
    description: 'Coldplay is bringing the most sustainable concert tour ever.',
    rounds: [{ id: '4a', date: 'Thursday, 15 Jan 2026', time: '19:30' }],
    status: 'OPEN'
  },
  {
    id: '7',
    title: 'CHA EUN-WOO 2026 [Mystery Elevator]',
    venue: 'Union Hall, Union Mall',
    date: 'FEB 14, 2026',
    image: 'https://m.thaiticketmajor.com/img_poster/prefix_1/2817/5817/cha-eun-woo-2024-just-one-10-minute-mystery-elevator-65d8626249342-l.png',
    priceRange: '2,500 - 6,500 THB',
    minPrice: 2500,
    stadiumLayoutType: 'ARENA',
    description: 'Spend your Valentine\'s Day with the one and only Cha Eun-woo in his highly anticipated solo fan meeting tour.',
    rounds: [{ id: '7a', date: 'Saturday, 14 Feb 2026', time: '18:00' }],
    status: 'COMING_SOON',
    saleStartTime: '2026-05-01T10:00:00Z'
  }
];

interface HomeProps {
  onSelectEvent: (event: Event) => void;
  onBrowseAll: () => void;
  onLatestNews: () => void;
  onNotify: (eventId: string, eventTitle: string) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const Home: React.FC<HomeProps> = ({ onSelectEvent, onBrowseAll, onLatestNews, onNotify, t }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleNotifyClick = (e: React.MouseEvent, eventId: string, eventTitle: string) => {
    e.stopPropagation();
    onNotify(eventId, eventTitle);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto animate-fadeIn relative">
      {/* feedback Toast */}
      {showFeedback && (
        <div className="fixed top-24 right-4 bg-purple-600 text-white px-6 py-3 rounded-2xl shadow-xl z-[100] animate-bounce flex items-center gap-2 border border-white/20">
          <i className="fas fa-bell"></i>
          <span className="font-bold">Reminder set! Wait 10 seconds...</span>
        </div>
      )}
      <section className="mb-8 md:mb-12 relative overflow-hidden rounded-3xl h-[400px] md:h-[500px] flex items-center p-6 md:p-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1429962714451-bb934ecbb4ec?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl px-2 sm:px-0">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 leading-[1.1] md:leading-none">
            {t('unforgettableMoments').split(' ')[0]} <br className="hidden sm:block"/>
            <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent italic">{t('unforgettableMoments').split(' ')[1]}</span>
          </h1>
          <p className="text-neutral-300 text-sm md:text-lg mb-6 md:mb-8 leading-relaxed max-w-lg">
            {t('heroSub')}
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <button 
              onClick={onLatestNews}
              className="bg-rose-600 hover:bg-rose-500 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transition-all shadow-lg shadow-rose-900/40 active:scale-95 min-h-[44px] text-sm md:text-base"
            >
              {t('latestNews')}
            </button>
            <button 
              onClick={onBrowseAll}
              className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transition-all active:scale-95 min-h-[44px] text-sm md:text-base text-white"
            >
              {t('browseAll')}
            </button>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('trendingEvents')}</h2>
        <button onClick={onBrowseAll} className="text-rose-500 font-bold hover:underline text-sm md:text-base min-h-[44px] px-2 md:px-4">{t('viewAll')}</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {MOCK_EVENTS.map((event) => (
          <div 
            key={event.id}
            onClick={() => onSelectEvent(event)}
            className={`group cursor-pointer bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden hover:border-rose-500/50 transition-all hover:shadow-[0_0_30px_rgba(225,29,72,0.15)] flex flex-col ${event.status === 'SOLD_OUT' ? 'opacity-75 grayscale-[0.5]' : ''}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              {/* Availability Indicator */}
              <div className="absolute top-4 right-4">
                {event.status === 'SOLD_OUT' ? (
                   <span className="bg-neutral-950/80 backdrop-blur-md text-neutral-400 text-[10px] font-black px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                    {t('soldOut').split(' / ')[0]}
                  </span>
                ) : event.status === 'COMING_SOON' ? (
                  <span className="bg-purple-600/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-purple-400/30 uppercase tracking-widest">
                    Coming Soon
                  </span>
                ) : (
                  <span className="bg-rose-600/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-rose-400/30 uppercase tracking-widest">
                    Available Now
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 left-4">
                 <p className="text-rose-500 text-xs font-black uppercase tracking-widest">{event.date}</p>
                 <h3 className="text-xl font-bold text-white mt-1 group-hover:text-rose-500 transition-colors">{event.title}</h3>
              </div>
            </div>
            <div className="p-5 bg-neutral-900 flex-1 flex flex-col">
              <p className="text-neutral-400 text-sm flex items-center gap-1 mb-2">
                <i className="fas fa-location-dot text-rose-500"></i> {event.venue}
              </p>
              <p className="text-xs text-neutral-500 font-bold uppercase mb-4">
                {event.rounds.length} {event.rounds.length > 1 ? 'Rounds Available' : 'Show Only'}
              </p>
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold">Starting from</span>
                  <span className="text-base font-bold text-white">{event.minPrice.toLocaleString()} THB</span>
                </div>
                {event.status === 'COMING_SOON' ? (
                  <button 
                    onClick={(e) => handleNotifyClick(e, event.id, event.title)}
                    className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest transition-all min-h-[44px] flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 active:scale-95"
                  >
                    <i className="fas fa-bell"></i> Notify Me
                  </button>
                ) : (
                  <button 
                    className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all min-h-[44px] flex items-center justify-center ${
                      event.status === 'SOLD_OUT'
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                      : 'bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-900/20'
                    }`}
                    disabled={event.status === 'SOLD_OUT'}
                  >
                    {event.status === 'SOLD_OUT' ? t('soldOut').split(' / ')[0] : t('buyTickets')}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
