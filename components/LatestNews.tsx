
import React, { useState } from 'react';
import { Event } from '../types';
import { translations } from '../src/translations';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  tag: string;
  image: string;
  content: string;
  fullContent?: string;
}

const NEWS_FEED: NewsItem[] = [
  {
    id: 'n1',
    title: 'Taylor Swift adds extra night in Bangkok!',
    date: '2 hours ago',
    tag: 'ANNOUNCEMENT',
    image: 'https://shop.musaastudios.com/cdn/shop/files/ErasTourMiamiN1Poster.png?v=1734177752$0',
    content: 'Due to overwhelming demand, an additional show for The Eras Tour has been added for October 15th.',
    fullContent: 'The Eras Tour is officially expanding its stay in the heart of Thailand! Due to record-breaking traffic on our servers and hundreds of thousands of fans in the queue, we are thrilled to announce a final third night at Rajamangala Stadium on October 15th, 2025. Tickets for this newly added date will go on sale tomorrow at 10:00 AM local time. Ensure your NovaAccount is verified and your payment methods are updated to avoid any delays. This is your last chance to be part of this historic musical journey!'
  },
  {
    id: 'n2',
    title: 'System Maintenance Notice',
    date: '1 day ago',
    tag: 'SYSTEM',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop',
    content: 'Scheduled maintenance will occur on June 20th at 02:00 AM. Booking services may be temporarily unavailable.',
    fullContent: 'To ensure the best possible experience during upcoming high-demand sales, NovaTicket will undergo scheduled system optimization and database maintenance on June 20th, 2025, from 02:00 AM to 05:00 AM ICT. During this window, ticket purchases, seat selections, and profile updates will be offline. We apologize for any inconvenience and appreciate your patience as we work to make NovaTicket faster and more secure for all music fans.'
  }
];

const COMING_SOON_EVENTS: Event[] = [
  {
    id: 'cs1',
    title: 'Dua Lipa: Radical Optimism Tour',
    venue: 'Rajamangala Stadium',
    date: 'MAR 10, 2026',
    image: 'https://themusicuniverse.com/wp-content/uploads/2025/04/dualipa25tour.jpg',
    priceRange: '2,500 - 15,000 THB',
    minPrice: 2500,
    stadiumLayoutType: 'STADIUM',
    description: 'The global pop sensation returns with her newest world tour with high production value.',
    rounds: [{ id: 'cs1a', date: 'Tuesday, 10 Mar 2026', time: '19:00' }],
    status: 'OPEN',
    saleStartTime: ''
  },
  {
    id: 'cs2',
    title: 'Ultra Music Festival Bangkok',
    venue: 'Siam Park City',
    date: 'APR 18 - 19, 2026',
    image: 'https://s.isanook.com/jo/0/ui/493/2469401/ultrathailand2023__cover_002.jpg',
    priceRange: '3,000 - 25,000 THB',
    minPrice: 3000,
    stadiumLayoutType: 'ARENA',
    description: 'The worlds premier electronic music festival returns for a massive two-day event.',
    rounds: [{ id: 'cs2a', date: 'Saturday, 18 Apr 2026', time: '14:00' }],
    status: 'OPEN',
    saleStartTime: ''
  }
];

interface LatestNewsProps {
  onSelectEvent: (event: Event) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LatestNews: React.FC<LatestNewsProps> = ({ onSelectEvent, t }) => {
  const [notifiedEvents, setNotifiedEvents] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const toggleNotify = (id: string, title: string) => {
    if (notifiedEvents.includes(id)) {
      setNotifiedEvents(prev => prev.filter(e => e !== id));
      setToast(`Notification removed for ${title}`);
    } else {
      setNotifiedEvents(prev => [...prev, id]);
      setToast(`We'll notify you when ${title} tickets go live!`);
    }
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto animate-fadeIn pb-24">
      {/* Detailed News Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 animate-fadeIn">
          <div className="bg-neutral-900 border border-white/10 rounded-[2.5rem] max-w-2xl w-full overflow-hidden relative shadow-2xl">
            <button 
              onClick={() => setSelectedNews(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors z-10"
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className="h-64 relative">
              <img src={selectedNews.image} className="w-full h-full object-cover" alt={selectedNews.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
              <div className="absolute bottom-6 left-8">
                 <span className="bg-rose-600 text-white text-[10px] font-black px-3 py-1 rounded uppercase tracking-widest mb-2 inline-block">
                   {selectedNews.tag}
                 </span>
                 <h2 className="text-3xl font-black text-white">{selectedNews.title}</h2>
              </div>
            </div>

            <div className="p-8 md:p-10">
              <div className="flex items-center gap-4 text-neutral-500 text-sm mb-6">
                <span className="flex items-center gap-2"><i className="far fa-calendar"></i> {selectedNews.date}</span>
                <span className="flex items-center gap-2"><i className="far fa-user"></i> Nova Editor</span>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-neutral-300 leading-relaxed text-lg mb-8">
                  {selectedNews.fullContent || selectedNews.content}
                </p>
              </div>
              <button 
                onClick={() => setSelectedNews(null)}
                className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-neutral-200 transition-colors uppercase tracking-widest"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-20 right-4 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl z-[100] animate-bounce flex items-center gap-2">
          <i className="fas fa-bell"></i>
          <span className="font-bold">{toast}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: News Feed */}
        <div className="lg:w-2/3 space-y-8">
           <h1 className="text-4xl font-black mb-8 flex items-center gap-4">
             <i className="fas fa-newspaper text-rose-500"></i>
             {t('latestNews')}
           </h1>
           
           <div className="space-y-6">
             {NEWS_FEED.map(news => (
               <div key={news.id} className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden flex flex-col md:flex-row hover:border-white/10 transition-all group">
                 <div className="w-full md:w-48 h-48 flex-shrink-0">
                   <img src={news.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 </div>
                 <div className="p-6 flex-1">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-[10px] font-black bg-rose-600/10 text-rose-500 px-2 py-1 rounded tracking-widest">{news.tag}</span>
                     <span className="text-xs text-neutral-500">{news.date}</span>
                   </div>
                   <h3 className="text-xl font-bold mb-2 group-hover:text-rose-500 transition-colors">{news.title}</h3>
                   <p className="text-neutral-400 text-sm line-clamp-2 mb-4">{news.content}</p>
                   <button 
                    onClick={() => setSelectedNews(news)}
                    className="text-rose-500 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all p-3 -ml-3 rounded-lg hover:bg-rose-500/10 min-h-[44px]"
                   >
                     Read More <i className="fas fa-arrow-right"></i>
                   </button>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Right: Coming Soon */}
        <div className="lg:w-1/3">
           <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
             <i className="fas fa-rocket text-purple-500"></i>
             Coming Soon
           </h2>
           
           <div className="space-y-6">
             {COMING_SOON_EVENTS.map(event => (
               <div 
                 key={event.id} 
                 className="bg-neutral-900/50 border border-white/5 rounded-2xl p-4 group cursor-pointer hover:border-white/20 transition-all"
                 onClick={() => onSelectEvent(event)}
               >
                 <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                   <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-rose-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg">PREVIEW ONLY</span>
                   </div>
                 </div>
                 <h4 className="font-bold text-lg mb-1">{event.title}</h4>
                 <div className="flex items-center justify-between">
                   <p className="text-xs text-neutral-500 font-bold">{event.date}</p>
                   <button 
                     onClick={(e) => { e.stopPropagation(); toggleNotify(event.id, event.title); }}
                     className={`text-xs font-black px-4 py-3 rounded-lg transition-all min-h-[44px] ${notifiedEvents.includes(event.id) ? 'bg-rose-600 text-white' : 'bg-neutral-800 text-rose-500 hover:bg-neutral-700 border border-neutral-700'}`}
                   >
                     <i className={`${notifiedEvents.includes(event.id) ? 'fas' : 'far'} fa-bell mr-2`}></i>
                     {notifiedEvents.includes(event.id) ? 'Subscribed' : 'Notify Me'}
                   </button>
                 </div>
               </div>
             ))}
           </div>

           <div className="mt-12 bg-gradient-to-br from-purple-900/40 to-rose-900/40 border border-white/10 rounded-3xl p-6 text-center">
              <i className="fas fa-crown text-amber-500 text-3xl mb-4"></i>
              <h3 className="font-bold text-lg mb-2">Nova VIP Membership</h3>
              <p className="text-neutral-400 text-xs mb-6">Get 24h early access to tickets and exclusive lounge entrance.</p>
              <button className="w-full bg-white text-black font-black py-3 rounded-xl hover:bg-neutral-200 transition-colors">
                JOIN NOW
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
