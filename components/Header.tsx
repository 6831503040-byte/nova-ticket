
import React, { useState, useRef, useEffect } from 'react';
import { AppStep, User, Notification } from '../types';
import { Language, translations } from '../src/translations';

interface HeaderProps {
  user: User | null;
  currentStep: AppStep;
  onBack: () => void;
  onLogout: () => void;
  onLoginClick: () => void;
  onMyBookings: () => void;
  onHomeClick: () => void;
  onBrowseAll: () => void;
  onLatestNews: () => void;
  onProfileClick: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const Header: React.FC<HeaderProps> = ({ 
  user, currentStep, onBack, onLogout, onLoginClick, onMyBookings, onHomeClick, onBrowseAll, onLatestNews,
  onProfileClick, notifications, onMarkAllRead, onClearNotifications, lang, onLangChange, t
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };
  const showBack = currentStep !== 'HOME' && currentStep !== 'CONFIRMATION' && currentStep !== 'MY_BOOKINGS';
  const showLoginButton = !user && currentStep !== 'LOGIN';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-neutral-900/80 backdrop-blur-md border-b border-white/10 z-50 px-3 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm">
        {showBack && (
          <button 
            onClick={onBack}
            className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-1.5 md:gap-2 text-rose-500 font-bold"
          >
            <i className="fas fa-arrow-left"></i>
            <span className="hidden md:inline">Back</span>
          </button>
        )}
        <div className="flex items-center gap-1.5 md:gap-2 cursor-pointer group" onClick={onHomeClick}>
          <div className="w-6 h-6 md:w-8 md:h-8 bg-rose-600 rounded-lg flex items-center justify-center font-black italic group-hover:scale-110 transition-transform text-xs md:text-base">N</div>
          <span className="text-sm md:text-xl font-bold tracking-tighter">NOVA<span className="text-rose-600">TICKET</span></span>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-6">
        <div className="flex items-center bg-black/30 rounded-full p-0.5 md:p-1 border border-white/5 mr-1 md:mr-2">
          <button 
            onClick={() => onLangChange('en')}
            className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black transition-all ${lang === 'en' ? 'bg-rose-600 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}
          >
            EN
          </button>
          <button 
            onClick={() => onLangChange('th')}
            className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black transition-all ${lang === 'th' ? 'bg-rose-600 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}
          >
            TH
          </button>
        </div>

        <a 
          href="#" 
          className="hidden sm:flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-bold"
          onClick={(e) => e.preventDefault()}
        >
          <i className="fas fa-circle-question"></i>
          {t('help')}
        </a>

        {user && (
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) onMarkAllRead();
              }}
              className="relative p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <i className="fas fa-bell text-xl"></i>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-neutral-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-4 w-80 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h4 className="font-bold text-sm">Notifications</h4>
                  <button 
                    onClick={onClearNotifications}
                    className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-rose-500 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className={`p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${!n.read ? 'bg-rose-600/5' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === 'SALE_OPEN' ? 'bg-rose-600/20 text-rose-500' : 'bg-purple-600/20 text-purple-500'}`}>
                            <i className={`fas ${n.type === 'SALE_OPEN' ? 'fa-bolt' : 'fa-clock'} text-xs`}></i>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs">{n.title}</span>
                              <span className="text-[9px] text-neutral-500">{formatTime(n.timestamp)}</span>
                            </div>
                            <p className="text-[11px] text-neutral-400 leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <i className="fas fa-bell-slash text-neutral-700 text-3xl mb-3"></i>
                      <p className="text-xs text-neutral-500">No notifications yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {user ? (
          <>
            <button 
              onClick={onMyBookings}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentStep === 'MY_BOOKINGS' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
            >
              <i className="fas fa-ticket"></i>
              <span className="hidden md:inline">{t('myBookings')}</span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-white/10 pl-4 md:pl-6">
              <button 
                onClick={onProfileClick}
                className="flex items-center gap-3 text-left group"
              >
                <div className="hidden md:block">
                  <p className="text-[10px] text-neutral-500 leading-none">Logged in as</p>
                  <p className="text-sm font-semibold group-hover:text-rose-500 transition-colors">{user.name}</p>
                </div>
                <div className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center border-2 border-purple-400/30 group-hover:border-rose-500/50 transition-all ${!user.avatar ? 'bg-purple-600' : ''}`}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <i className="fas fa-user text-white text-xs"></i>
                  )}
                </div>
              </button>
              <button onClick={onLogout} className="text-neutral-400 hover:text-white transition-colors p-2" title={t('logout')}>
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </>
        ) : (
          showLoginButton && (
            <button 
              onClick={onLoginClick}
              className="bg-rose-600 hover:bg-rose-500 px-6 py-2 rounded-full text-sm font-bold transition-transform active:scale-95 shadow-lg shadow-rose-900/20"
            >
              {t('login')}
            </button>
          )
        )}
      </div>
    </header>
  );
};

export default Header;
