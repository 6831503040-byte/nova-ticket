
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { translations } from '../src/translations';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onBack: () => void;
  t: (key: keyof typeof translations['en']) => string;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onBack, t }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name,
      avatar
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(user.name);
    setAvatar(user.avatar || '');
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={onBack}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-neutral-400 hover:text-white"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="text-4xl font-black italic tracking-tighter">USER<span className="text-rose-600">PROFILE</span></h1>
      </div>

      <div className="bg-neutral-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="h-32 bg-gradient-to-r from-rose-600 to-purple-600"></div>
        
        <div className="px-8 pb-12 relative">
          {/* Avatar Section */}
          <div className="absolute -top-16 left-8 group">
            <div 
              onClick={handleImageClick}
              className={`w-32 h-32 rounded-3xl border-4 border-neutral-950 bg-neutral-800 overflow-hidden relative cursor-pointer shadow-2xl transition-transform duration-500 ${isEditing ? 'hover:scale-105 active:scale-95' : ''}`}
            >
              {avatar ? (
                <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-600">
                  <i className="fas fa-user text-4xl text-white"></i>
                </div>
              )}
              
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-camera text-white text-xl"></i>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          <div className="pt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Display Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                        placeholder="Your display name"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-4xl font-black text-white mb-1">{user.name}</h2>
                    <p className="text-neutral-500 font-medium">{user.email}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleCancel}
                      className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs transition-all border border-white/5 active:scale-95"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-10 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-rose-900/40 active:scale-95"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-10 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-xs transition-all border border-white/10 flex items-center gap-2 active:scale-95"
                  >
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-500 flex items-center justify-center">
                    <i className="fas fa-shield-halved"></i>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Security</span>
                </div>
                <p className="text-sm font-bold text-white mb-1">Account Verified</p>
                <p className="text-[10px] text-neutral-500 uppercase font-black">Level 2 Tier</p>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-500 flex items-center justify-center">
                    <i className="fas fa-ticket"></i>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Activity</span>
                </div>
                <p className="text-sm font-bold text-white mb-1">Total Bookings</p>
                <p className="text-[10px] text-neutral-500 uppercase font-black">4 Successful</p>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-500 flex items-center justify-center">
                    <i className="fas fa-wallet"></i>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Billing</span>
                </div>
                <p className="text-sm font-bold text-white mb-1">Payment Method</p>
                <p className="text-[10px] text-neutral-500 uppercase font-black">Visa **** 4242</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
