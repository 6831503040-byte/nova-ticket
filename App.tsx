
import React, { useState, useEffect, useRef } from 'react';
import { AppStep, Event, User, PerformanceRound, Booking, Notification } from './types';
import { Language, translations } from './src/translations';
import Header from './components/Header';
import Home from './components/Home';
import EventDetail from './components/EventDetail';
import Login from './components/Login';
import QueueRoom from './components/QueueRoom';
import SeatingPlan from './components/SeatingPlan';
import Payment from './components/Payment';
import Confirmation from './components/Confirmation';
import MyBookings from './components/MyBookings';
import BrowseAll from './components/BrowseAll';
import LatestNews from './components/LatestNews';
import { io } from 'socket.io-client';
import { ZONE_CONFIG } from './src/constants';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('HOME');
  const [stepHistory, setStepHistory] = useState<AppStep[]>(['HOME']);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedRound, setSelectedRound] = useState<PerformanceRound | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingTimer, setBookingTimer] = useState<number>(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);
  const [validatedTotal, setValidatedTotal] = useState<number | null>(null);
  const [validationToken, setValidationToken] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const socketRef = useRef<any>(null);

  const t = (key: keyof typeof translations['en']) => translations[lang][key] || key;

  useEffect(() => {
    socketRef.current = io();
    
    socketRef.current.on('notification', (data: Notification) => {
      // Only show notification if user is logged in
      if (data) {
        console.log('Received notification:', data);
        setNotification(data);
        setNotificationHistory(prev => [data, ...prev]);
        // Auto-hide after 10 seconds
        setTimeout(() => setNotification(null), 10000);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []); 

  const handleTriggerNotification = (eventId: string, eventTitle: string) => {
    if (socketRef.current) {
      socketRef.current.emit('trigger-notification', { eventId, eventTitle });
    }
  };

  const handleNavigate = (step: AppStep) => {
    if (step === 'HOME') {
      setStepHistory(['HOME']);
      handleReturnHome();
      return;
    }
    setStepHistory(prev => [...prev, step]);
    setCurrentStep(step);
  };

  const goBack = () => {
    if (stepHistory.length <= 1) {
      handleReturnHome();
      return;
    }
    
    const newHistory = [...stepHistory];
    newHistory.pop(); // Remove current
    const prevStep = newHistory[newHistory.length - 1];
    
    setStepHistory(newHistory);
    setCurrentStep(prevStep);
  };

  const handleLogout = () => {
    setUser(null);
    setBookings([]); // Clear bookings on logout
    if (['QUEUE', 'SEATING', 'PAYMENT', 'MY_BOOKINGS'].includes(currentStep)) {
      setCurrentStep('LOGIN');
    }
  };

  useEffect(() => {
    let interval: any;
    if (bookingTimer > 0) {
      interval = setInterval(() => {
        setBookingTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [bookingTimer]);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    handleNavigate('EVENT_DETAIL');
  };

  const handleRoundSelected = (round: PerformanceRound) => {
    setSelectedRound(round);
    if (!user) {
      handleNavigate('LOGIN');
    } else {
      handleNavigate('QUEUE');
    }
  };

  const handleLoginSuccess = async (userData: User) => {
    setUser(userData);
    
    // Fetch persistent bookings from server
    try {
      const response = await fetch(`/api/bookings/${userData.email}`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }

    if (selectedEvent && selectedRound) {
      handleNavigate('QUEUE');
    } else {
      handleNavigate('HOME');
    }
  };

  const handleQueueFinished = React.useCallback(() => {
    handleNavigate('SEATING');
  }, []);

  const handleSeatsConfirmed = async (seats: string[]) => {
    if (!selectedEvent) return;
    
    setSelectedSeats(seats);
    
    try {
      // Secure Price Validation (Backend as Single Source of Truth)
      const response = await fetch('/api/checkout/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: selectedEvent.id, seats })
      });
      
      const data = await response.json();
      if (data.success) {
        setValidatedTotal(data.total);
        setValidationToken(data.token);
        setBookingTimer(600);
        handleNavigate('PAYMENT');
      } else {
        alert('Price validation failed. Please try again.');
      }
    } catch (error) {
      console.error('Validation error:', error);
      alert('Network error during price validation.');
    }
  };

  const handlePaymentSuccess = async () => {
    const now = new Date();
    const dateStr = now.getFullYear().toString() + 
                    (now.getMonth() + 1).toString().padStart(2, '0') + 
                    now.getDate().toString().padStart(2, '0');
    const sequence = (bookings.length + 1).toString().padStart(4, '0');
    
    const firstSeatRow = selectedSeats[0]?.charAt(0);
    const bookingZone = ZONE_CONFIG.find(z => z.rows.includes(firstSeatRow))?.name || 'N/A';

    const newBooking: Booking = {
      orderId: `NV-${dateStr}-${sequence}`,
      event: selectedEvent!,
      roundId: selectedRound!.id, // Store roundId for persistent seat blocking
      seats: selectedSeats,
      zone: bookingZone,
      totalPrice: validatedTotal || 0,
      bookingDate: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    // Save booking to server for persistence
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, booking: newBooking })
      });
    } catch (error) {
      console.error('Failed to save booking:', error);
    }

    setBookings([newBooking, ...bookings]);
    handleNavigate('CONFIRMATION');
  };

  const handleReturnHome = () => {
    setCurrentStep('HOME');
    setStepHistory(['HOME']); // Reset history when returning home
    setSelectedEvent(null);
    setSelectedRound(null);
    setSelectedSeats([]);
  };

  const handleGoToMyBookings = () => {
    handleNavigate('MY_BOOKINGS');
    setSelectedEvent(null);
    setSelectedRound(null);
    setSelectedSeats([]);
  };

  const handleGoToBrowseAll = () => {
    handleNavigate('BROWSE_ALL');
    setSelectedEvent(null);
    setSelectedRound(null);
    setSelectedSeats([]);
  };

  const handleTriggerLogin = () => {
    handleNavigate('LOGIN');
  };

  const handleMarkAllRead = () => {
    setNotificationHistory(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearHistory = () => {
    setNotificationHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
      <Header 
        user={user} 
        currentStep={currentStep} 
        onBack={goBack} 
        onLogout={handleLogout}
        onLoginClick={() => handleNavigate('LOGIN')}
        onMyBookings={handleGoToMyBookings}
        onHomeClick={() => handleNavigate('HOME')}
        onBrowseAll={() => handleNavigate('BROWSE_ALL')}
        onLatestNews={() => handleNavigate('LATEST_NEWS')}
        notifications={notificationHistory}
        onMarkAllRead={handleMarkAllRead}
        onClearNotifications={handleClearHistory}
        lang={lang}
        onLangChange={setLang}
        t={t}
      />

      <main className="flex-1 overflow-y-auto pt-16 custom-scrollbar">
        <div className="min-h-full">
          {currentStep === 'HOME' && (
            <Home 
              onSelectEvent={handleSelectEvent} 
              onBrowseAll={() => handleNavigate('BROWSE_ALL')}
              onLatestNews={() => handleNavigate('LATEST_NEWS')}
              onNotify={handleTriggerNotification}
              t={t}
            />
          )}
          {currentStep === 'BROWSE_ALL' && <BrowseAll onSelectEvent={handleSelectEvent} t={t} />}
          {currentStep === 'LATEST_NEWS' && <LatestNews onSelectEvent={handleSelectEvent} t={t} />}
          {currentStep === 'EVENT_DETAIL' && selectedEvent && (
            <EventDetail 
              event={selectedEvent} 
              user={user}
              onRoundSelect={handleRoundSelected} 
              onTriggerLogin={handleTriggerLogin}
              onNotify={handleTriggerNotification}
              t={t}
            />
          )}
          {currentStep === 'LOGIN' && <Login onLogin={handleLoginSuccess} t={t} />}
          {currentStep === 'QUEUE' && <QueueRoom onFinished={handleQueueFinished} event={selectedEvent!} />}
          {currentStep === 'SEATING' && selectedEvent && selectedRound && (
            <SeatingPlan 
              event={selectedEvent} 
              selectedRound={selectedRound}
              bookings={bookings}
              user={user!}
              onConfirm={handleSeatsConfirmed} 
              t={t}
            />
          )}
          {currentStep === 'PAYMENT' && selectedEvent && (
            <Payment 
              event={selectedEvent} 
              seats={selectedSeats} 
              timer={bookingTimer}
              total={validatedTotal || 0}
              onSuccess={handlePaymentSuccess}
              t={t}
            />
          )}
          {currentStep === 'CONFIRMATION' && selectedEvent && (
            <Confirmation 
              event={selectedEvent} 
              seats={selectedSeats} 
              totalPrice={bookings[0]?.totalPrice || 0}
              zone={bookings[0]?.zone}
              orderId={bookings[0]?.orderId || ''}
              onViewBookings={handleGoToMyBookings}
              onBookAnother={handleReturnHome}
              t={t}
            />
          )}
          {currentStep === 'MY_BOOKINGS' && (
            <MyBookings 
              bookings={bookings} 
              onExplore={handleGoToBrowseAll} 
              onBack={handleReturnHome}
              t={t}
            />
          )}
        </div>
      </main>

      {/* Real-time Notification System UI */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-slideDown">
          <div className={`p-6 rounded-3xl border shadow-2xl backdrop-blur-xl flex items-start gap-4 ${
            notification.type === 'SALE_OPEN' 
              ? 'bg-rose-600/90 border-rose-400 text-white' 
              : 'bg-neutral-900/90 border-white/20 text-white'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              notification.type === 'SALE_OPEN' ? 'bg-white/20' : 'bg-rose-600/20'
            }`}>
              <i className={`fas ${notification.type === 'SALE_OPEN' ? 'fa-bolt' : 'fa-clock'} text-xl`}></i>
            </div>
            <div className="flex-1">
              <h4 className="font-black text-lg leading-tight mb-1">{notification.title}</h4>
              <p className="text-sm opacity-90 leading-relaxed">{notification.message}</p>
              <button 
                onClick={() => setNotification(null)}
                className="mt-3 text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <button className="fixed bottom-6 right-6 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-500 transition-colors z-50">
        <i className="fas fa-question text-white"></i>
      </button>
    </div>
  );
};

export default App;
