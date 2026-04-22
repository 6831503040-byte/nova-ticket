
import React, { useState } from 'react';
import { User } from '../types';
import { translations } from '../src/translations';

interface LoginProps {
  onLogin: (user: User) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const Login: React.FC<LoginProps> = ({ onLogin, t }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation of login/register
    onLogin({
      id: `usr_${Date.now()}`,
      name: isRegister ? fullName : (email.split('@')[0] || 'User'),
      email: email
    });
  };

  return (
    <div className="flex items-center justify-center p-6 mt-12 animate-fadeIn">
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg shadow-rose-900/40">
             <i className={`fas ${isRegister ? 'fa-user-plus' : 'fa-lock'} text-white text-2xl`}></i>
          </div>
          <h2 className="text-3xl font-bold">{isRegister ? t('secureRegister') : t('secureLogin')}</h2>
          <p className="text-neutral-500 text-sm mt-2">{isRegister ? t('joinExperience') : t('accessTickets')}</p>
          
          <div className="mt-4 p-3 bg-rose-600/10 border border-rose-600/20 rounded-xl text-rose-500 text-xs font-bold flex items-center justify-center gap-2">
            <i className="fas fa-info-circle"></i>
            {t('authRequired')}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div className="animate-slideDown">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">{t('fullName')}</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-600 transition-colors text-white"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">{t('emailAddress')}</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-600 transition-colors text-white"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">{t('password')}</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-600 transition-colors text-white"
              placeholder="••••••••"
            />
          </div>
          {!isRegister && (
            <div className="flex items-center justify-between text-xs text-rose-500 font-bold animate-fadeIn">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-rose-600" /> {t('rememberMe')}
              </label>
              <button type="button" className="hover:underline">{t('forgotPassword')}</button>
            </div>
          )}
          <button 
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-rose-900/40 transition-transform active:scale-95"
          >
            {isRegister ? t('signUp') : t('signIn')}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-neutral-500 text-sm">{isRegister ? t('alreadyHaveAccount') : t('dontHaveAccount')}</p>
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-purple-500 font-black uppercase tracking-widest text-[11px] mt-2 hover:underline transition-all"
          >
            {isRegister ? t('login') : t('createAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
