
import React, { useState, useMemo } from 'react';
import { Event } from '../types';
import { translations } from '../src/translations';

const ALL_MOCK_EVENTS: Event[] = [
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
    category: 'CONCERT',
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
    category: 'CONCERT',
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
    category: 'CONCERT',
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
    category: 'CONCERT',
    status: 'OPEN'
  },
  {
    id: '5',
    title: 'Wonderfruit Festival 2025',
    venue: 'The Fields at Siam Country Club',
    date: 'DEC 11 - 15, 2025',
    image: 'https://imgproxy.ra.co/_/quality:66/aHR0cHM6Ly9pbWFnZXMucmEuY28vNDA2NjE1YWMyYWRlZTQzMWNlMzFiMjEzZGIxYjBlZDUwYjkxMGQ0Mi5wbmc=',
    priceRange: '5,000 - 25,000 THB',
    minPrice: 5000,
    stadiumLayoutType: 'ARENA',
    description: 'Thailand’s pioneering carbon-neutral celebrate...',
    rounds: [
      { id: '5a', date: 'Thursday, 11 Dec 2025', time: '12:00' },
      { id: '5b', date: 'Friday, 12 Dec 2025', time: '10:00' },
      { id: '5c', date: 'Saturday, 13 Dec 2025', time: '10:00' },
      { id: '5d', date: 'Sunday, 14 Dec 2025', time: '10:00' },
      { id: '5e', date: 'Monday, 15 Dec 2025', time: '10:00' }
    ],
    category: 'FESTIVAL',
    status: 'OPEN'
  },
  {
    id: '6',
    title: 'LEE YOUNGJI WORLD TOUR [ALL OR NOTHING]',
    venue: 'MCC Hall The Mall Bangkapi',
    date: 'OCT 25, 2024',
    image: 'https://networksites.livenationinternational.com/networksites/gdjdu0ro/bnlyj001.jpeg?format=webp&width=3840&quality=75',
    priceRange: '2,500 - 5,500 THB',
    minPrice: 2500,
    stadiumLayoutType: 'ARENA',
    description: 'Join the rap icon for an intimate night.',
    rounds: [{ id: '6a', date: 'Saturday, 25 Oct 2024', time: '18:00' }],
    category: 'CONCERT',
    status: 'OPEN'
  },
  {
    id: '7',
    title: 'CHA EUN-WOO 2026 Just One 10 Minute [Mystery Elevator] in Bangkok',
    venue: 'Union Hall, Union Mall',
    date: 'FEB 14, 2026',
    image: 'https://m.thaiticketmajor.com/img_poster/prefix_1/2817/5817/cha-eun-woo-2024-just-one-10-minute-mystery-elevator-65d8626249342-l.png',
    priceRange: '2,500 - 6,500 THB',
    minPrice: 2500,
    stadiumLayoutType: 'ARENA',
    description: 'Spend your Valentine\'s Day with the one and only Cha Eun-woo in his highly anticipated solo fan meeting tour.',
    rounds: [{ id: '7a', date: 'Saturday, 14 Feb 2026', time: '18:00' }],
    category: 'FAN_MEETING',
    status: 'OPEN',
    saleStartTime: ''
  }
];

interface BrowseAllProps {
  onSelectEvent: (event: Event) => void;
  t: (key: keyof typeof translations['en']) => string;
}

type QuickFilter = 'ALL' | 'WEEKEND' | 'UNDER_3000' | 'AVAILABLE';

const BrowseAll: React.FC<BrowseAllProps> = ({ onSelectEvent, t }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('ALL');

  const filteredEvents = useMemo(() => {
    return ALL_MOCK_EVENTS.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            event.venue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || event.category === categoryFilter;
      
      let matchesQuick = true;
      if (quickFilter === 'WEEKEND') {
        matchesQuick = event.rounds.some(r => r.date.includes('Saturday') || r.date.includes('Sunday'));
      } else if (quickFilter === 'UNDER_3000') {
        matchesQuick = event.minPrice <= 3000;
      } else if (quickFilter === 'AVAILABLE') {
        matchesQuick = event.status === 'OPEN';
      }

      return matchesSearch && matchesCategory && matchesQuick;
    });
  }, [searchTerm, categoryFilter, quickFilter]);

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto animate-fadeIn">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-black mb-2 md:mb-4">{t('browseAll')}</h1>
        <p className="text-neutral-500 text-sm md:text-base mb-6 md:mb-8">{t('heroSub')}</p>
        
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-rose-500 transition-colors"></i>
              <input 
                type="text"
                placeholder="Search by artist, venue or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-rose-500 transition-all text-white min-h-[56px]"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0 snap-x">
              {['ALL', 'CONCERT', 'FESTIVAL', 'FAN_MEETING'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold whitespace-nowrap transition-all border min-h-[48px] md:min-h-[56px] text-xs md:text-sm snap-start ${categoryFilter === cat ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-900/20' : 'bg-neutral-900 border-white/10 text-neutral-400 hover:border-white/30'}`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mr-2">Quick Filters:</span>
            {[
              { id: 'ALL', label: t('viewAll') },
              { id: 'WEEKEND', label: t('trendingEvents') },
              { id: 'AVAILABLE', label: t('officialTickets') }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setQuickFilter(filter.id as QuickFilter)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border min-h-[44px] ${quickFilter === filter.id ? 'bg-white text-black border-white' : 'bg-transparent border-white/20 text-neutral-400 hover:border-white/40 hover:text-white'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="py-24 text-center">
           <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-600">
             <i className="fas fa-search text-3xl"></i>
           </div>
           <h3 className="text-xl font-bold">No events found</h3>
           <p className="text-neutral-500 mt-2">Try adjusting your search or filters.</p>
           <button 
            onClick={() => { setSearchTerm(''); setCategoryFilter('ALL'); setQuickFilter('ALL'); }}
            className="mt-6 text-rose-500 font-bold hover:underline min-h-[44px] px-6"
           >
             Clear all filters
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredEvents.map(event => (
            <div 
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className={`group cursor-pointer bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden hover:border-rose-500/50 transition-all flex flex-col ${event.status === 'SOLD_OUT' ? 'opacity-75 grayscale-[0.5]' : ''}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={event.image} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={event.title} 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-black/60 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                    {event.category?.replace('_', ' ')}
                  </span>
                </div>

                {/* Availability Badge */}
                <div className="absolute bottom-4 right-4">
                  {event.status === 'SOLD_OUT' ? (
                    <span className="bg-neutral-950/80 backdrop-blur-md text-neutral-400 text-[10px] font-black px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                      Sold Out
                    </span>
                  ) : event.status === 'COMING_SOON' ? (
                    <span className="bg-purple-600/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-purple-400/30 uppercase tracking-widest">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="bg-rose-600/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-rose-400/30 uppercase tracking-widest">
                      Available
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-1 group-hover:text-rose-500 transition-colors line-clamp-1">{event.title}</h3>
                <p className="text-xs text-neutral-400 mb-1 flex items-center gap-1">
                   <i className="fas fa-location-dot text-rose-500"></i> {event.venue}
                </p>
                <p className="text-[10px] text-neutral-500 font-bold uppercase mb-3">
                   {event.rounds.length} rounds available
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                   <div className="flex flex-col">
                     <span className="text-[9px] text-neutral-500 uppercase font-bold">From</span>
                     <span className="text-rose-500 font-black text-base">{event.minPrice.toLocaleString()} THB</span>
                   </div>
                   <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all min-h-[44px]">
                     Details
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseAll;
