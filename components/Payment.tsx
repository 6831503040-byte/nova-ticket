
import React, { useState } from 'react';
import { Event } from '../types';
import { translations } from '../src/translations';

interface PaymentProps {
  event: Event;
  seats: string[];
  timer: number;
  total: number;
  onSuccess: () => void;
  t: (key: keyof typeof translations['en']) => string;
}

const Payment: React.FC<PaymentProps> = ({ event, seats, timer, total, onSuccess, t }) => {
  const [method, setMethod] = useState<'CARD' | 'QR' | 'WALLET'>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletPhone, setWalletPhone] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0, len = v.length; i < len; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ').substring(0, 19);
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)} / ${v.substring(2, 4)}`;
    }
    return v.substring(0, 7);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, number: formatCardNumber(e.target.value) });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, expiry: formatExpiry(e.target.value) });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 3) {
      setCardData({ ...cardData, cvv: value });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, name: e.target.value.toUpperCase() });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate payment sequence
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2500);
  };

  const isCardComplete = cardData.number.replace(/\s/g, '').length === 16 && 
                        cardData.expiry.replace(/[^0-9]/g, '').length === 4 && 
                        cardData.cvv.length === 3 &&
                        cardData.name.trim().length > 2;

  const isWalletComplete = walletPhone.replace(/[^0-9]/g, '').length === 10;

  const isFormValid = (method === 'CARD' && isCardComplete) || 
                      (method === 'QR') || 
                      (method === 'WALLET' && isWalletComplete);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pb-24 animate-fadeIn">
      <div className="lg:col-span-2 space-y-4 md:space-y-6">
        {/* Timer Header */}
        <div className="bg-rose-600/10 border border-rose-500/20 rounded-2xl p-4 flex items-center justify-between shadow-lg">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center animate-pulse">
               <i className="fas fa-clock text-white text-xs"></i>
             </div>
             <span className="text-xs md:text-sm font-bold text-rose-500 uppercase tracking-widest">{t('seatsHeldFor')}</span>
           </div>
           <span className="text-xl md:text-3xl font-black tabular-nums text-rose-500">{formatTime(timer)}</span>
        </div>

        <section className="bg-neutral-900 border border-white/10 rounded-3xl p-5 md:p-8 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <i className="fas fa-shield-halved text-7xl rotate-12"></i>
          </div>
          
          <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8 flex items-center gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-purple-600 shadow-lg shadow-purple-900/40 text-sm md:text-base flex items-center justify-center font-black">1</div>
            {t('paymentMethod')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-10">
            <button 
              onClick={() => setMethod('CARD')}
              className={`p-4 md:p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 md:gap-4 relative overflow-hidden group ${method === 'CARD' ? 'bg-rose-600/10 border-rose-600 shadow-xl' : 'bg-black border-white/5 hover:border-white/20'}`}
            >
              <i className={`fas fa-credit-card text-xl md:text-2xl ${method === 'CARD' ? 'text-rose-500' : 'text-neutral-500'}`}></i>
              <span className={`font-black text-[10px] md:text-xs uppercase tracking-widest ${method === 'CARD' ? 'text-white' : 'text-neutral-400'}`}>{t('creditCard')}</span>
              {method === 'CARD' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500"></div>}
            </button>
            <button 
              onClick={() => setMethod('QR')}
              className={`p-4 md:p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 md:gap-4 relative overflow-hidden group ${method === 'QR' ? 'bg-rose-600/10 border-rose-600 shadow-xl' : 'bg-black border-white/5 hover:border-white/20'}`}
            >
              <i className={`fas fa-qrcode text-xl md:text-2xl ${method === 'QR' ? 'text-rose-500' : 'text-neutral-500'}`}></i>
              <span className={`font-black text-[10px] md:text-xs uppercase tracking-widest ${method === 'QR' ? 'text-white' : 'text-neutral-400'}`}>{t('promptPay')}</span>
              {method === 'QR' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500"></div>}
            </button>
            <button 
              onClick={() => setMethod('WALLET')}
              className={`p-4 md:p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 md:gap-4 relative overflow-hidden group ${method === 'WALLET' ? 'bg-rose-600/10 border-rose-600 shadow-xl' : 'bg-black border-white/5 hover:border-white/20'}`}
            >
              <i className={`fas fa-wallet text-xl md:text-2xl ${method === 'WALLET' ? 'text-rose-500' : 'text-neutral-500'}`}></i>
              <span className={`font-black text-[10px] md:text-xs uppercase tracking-widest ${method === 'WALLET' ? 'text-white' : 'text-neutral-400'}`}>{t('trueMoney')}</span>
              {method === 'WALLET' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500"></div>}
            </button>
          </div>

          <div className="min-h-[280px]">
            {method === 'CARD' && (
              <div className="space-y-6 animate-fadeIn">
                 <div className="grid grid-cols-2 gap-6">
                   <div className="col-span-2">
                     <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 block">{t('cardholderName')}</label>
                     <input 
                       type="text"
                       className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 focus:border-rose-500 outline-none transition-all placeholder:text-neutral-700 font-bold" 
                       placeholder="JOHN DOE" 
                       value={cardData.name}
                       onChange={handleNameChange}
                     />
                   </div>
                   <div className="col-span-2">
                     <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 block">{t('cardNumber')}</label>
                     <div className="relative">
                       <input 
                         type="text"
                         inputMode="numeric"
                         className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 focus:border-rose-500 outline-none transition-all placeholder:text-neutral-700 font-mono tracking-widest text-lg" 
                         placeholder="0000 0000 0000 0000" 
                         value={cardData.number}
                         onChange={handleCardNumberChange}
                       />
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                         <i className="fab fa-cc-visa text-xl text-neutral-600"></i>
                         <i className="fab fa-cc-mastercard text-xl text-neutral-600"></i>
                       </div>
                     </div>
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 block">{t('expiryDate')}</label>
                     <input 
                       type="text"
                       inputMode="numeric"
                       className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 focus:border-rose-500 outline-none transition-all placeholder:text-neutral-700 font-bold" 
                       placeholder="MM / YY" 
                       value={cardData.expiry}
                       onChange={handleExpiryChange}
                     />
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 block">{t('cvv')}</label>
                     <input 
                       type="password"
                       inputMode="numeric"
                       className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 focus:border-rose-500 outline-none transition-all placeholder:text-neutral-700 font-bold" 
                       placeholder="•••" 
                       value={cardData.cvv}
                       onChange={handleCvvChange}
                     />
                   </div>
                 </div>
              </div>
            )}

            {method === 'QR' && (
              <div className="flex flex-col items-center py-6 animate-fadeIn">
                <div className="relative p-2 bg-white rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.1)] group">
                  <div className="absolute inset-0 bg-blue-600/5 rounded-2xl pointer-events-none"></div>
                  <div className="bg-blue-600 py-1.5 px-4 rounded-t-lg mb-2 flex justify-between items-center">
                    <span className="text-[10px] font-black text-white italic">PromptPay</span>
                    <i className="fas fa-qrcode text-white text-[10px]"></i>
                  </div>
                  <div className="w-56 h-56 p-2 bg-white">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=NovaTicket-Secure-Payment" alt="QR" className="w-full h-full" />
                  </div>
                  <div className="absolute inset-0 border-4 border-transparent group-hover:border-blue-500/20 transition-all rounded-2xl"></div>
                </div>
                <div className="mt-8 text-center bg-blue-600/10 border border-blue-500/20 py-4 px-8 rounded-2xl">
                  <p className="text-sm font-black text-blue-400 uppercase tracking-widest mb-1">{t('scanQR')}</p>
                  <p className="text-[10px] text-neutral-500 uppercase font-bold">{t('totalPayable')}: {total.toLocaleString()} THB</p>
                </div>
              </div>
            )}

            {method === 'WALLET' && (
              <div className="flex flex-col items-center py-12 animate-fadeIn">
                 <div className="w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-orange-900/40">
                   <i className="fas fa-wallet text-3xl text-white"></i>
                 </div>
                 <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">{t('trueMoney')}</h3>
                 <p className="text-neutral-500 text-sm max-w-xs text-center mb-8">Pay securely using your TrueMoney Wallet application. Verification via 10-digit mobile number.</p>
                 <div className={`w-full max-w-sm bg-black border rounded-2xl p-4 flex items-center gap-4 transition-all ${walletPhone.length === 10 ? 'border-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.2)]' : 'border-white/5'}`}>
                    <div className="w-12 h-12 rounded-xl bg-orange-600/10 text-orange-500 flex items-center justify-center font-bold">TH</div>
                    <div className="flex-1">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block mb-1">Mobile Number</label>
                      <input 
                        type="tel" 
                        inputMode="numeric"
                        className="bg-transparent border-none outline-none w-full text-xl font-black tracking-[0.2em] placeholder:text-neutral-800" 
                        placeholder="08XXXXXXXX" 
                        value={walletPhone}
                        maxLength={10}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val.length <= 10) setWalletPhone(val);
                        }}
                      />
                    </div>
                    {walletPhone.length === 10 && <i className="fas fa-check-circle text-orange-500 animate-fadeIn"></i>}
                 </div>
                 <p className="mt-4 text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Format: 10 digits (e.g. 0812345678)</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 sticky top-24 shadow-2xl">
          <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter">
            <i className="fas fa-receipt text-rose-500"></i>
            {t('orderSummary')}
          </h2>
          
          <div className="flex items-start gap-5 mb-8 border-b border-white/5 pb-8 relative group">
            <div className="relative overflow-hidden rounded-xl w-24 h-24 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
              <img src={event.image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-black text-sm leading-tight group-hover:text-rose-500 transition-colors uppercase tracking-tight">{event.title}</h3>
              <p className="text-[10px] text-neutral-500 mt-2 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <i className="far fa-calendar text-rose-500"></i> {event.date}
              </p>
              <p className="text-[10px] text-neutral-500 mt-2 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <i className="fas fa-location-dot text-rose-500"></i> {event.venue}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{t('selected')} Seats ({seats.length})</span>
              <span className="text-xs font-black text-white bg-white/5 px-2 py-1 rounded border border-white/5">{seats.join(', ')}</span>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{t('serviceFee')}</span>
              <span className="text-xs font-black text-neutral-300">200 THB</span>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{t('vat')}</span>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">{t('included')}</span>
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-8 shadow-inner">
            <div className="flex justify-between items-end">
              <span className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">{t('totalPayable')}</span>
              <span className="text-3xl font-black text-rose-600 drop-shadow-[0_0_15px_rgba(225,29,72,0.3)]">{total.toLocaleString()} <span className="text-sm ml-1 text-white">THB</span></span>
            </div>
          </div>

          <button 
            onClick={handlePay}
            disabled={isProcessing || !isFormValid}
            className={`w-full py-5 rounded-2xl font-black text-base uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 active:scale-95 shadow-xl shadow-rose-900/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none ${isProcessing ? 'bg-rose-500 cursor-wait' : 'bg-rose-600 hover:bg-rose-500'}`}
          >
            {isProcessing ? (
               <>
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 {t('processing')}
               </>
            ) : (
               <>
                 <i className="fas fa-lock text-sm opacity-50"></i>
                 {t('confirmBooking')}
               </>
            )}
          </button>
          
          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-center text-[9px] font-bold text-neutral-600 uppercase tracking-widest leading-relaxed">
              {t('termsAndPolicies')}
            </p>
            <div className="flex items-center gap-2 border-t border-white/5 pt-4 w-full justify-center">
              <i className="fas fa-shield-halved text-rose-600 text-[10px]"></i>
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">{t('securedBy')}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Payment;
