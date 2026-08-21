import React, { useState } from 'react';
import { User } from '../types';
import { Award, Bell, Shield, UserCheck, ChevronDown } from 'lucide-react';

interface HeaderBarProps {
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (user: User) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenAdmin: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  unreadCount,
  onOpenNotifications,
  onOpenAdmin
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between shadow-sm relative z-30">
      {/* Brand & App Title */}
      <div className="flex items-center space-x-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-bold text-lg text-white shadow-md">
          S
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <h1 className="font-bold text-base tracking-tight text-slate-100">SkillSwap</h1>
            <span className="text-[10px] uppercase font-semibold tracking-wider bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
              Campus
            </span>
          </div>
          <p className="text-[11px] text-slate-400 -mt-0.5">Student Skill Exchange</p>
        </div>
      </div>

      {/* Right Controls: Points, Notifications, Admin & Account Switcher */}
      <div className="flex items-center space-x-2">
        {/* Skill Points Wallet Badge */}
        <div 
          className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm"
          title="Your Skill Points Balance. Teach skills to earn +50 PTS!"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>{currentUser.skillPoints} PTS</span>
        </div>

        {/* Admin Button if Admin */}
        {currentUser.role === 'admin' && (
          <button
            onClick={onOpenAdmin}
            className="flex items-center space-x-1 text-xs bg-purple-600 hover:bg-purple-700 text-white font-medium px-2.5 py-1 rounded-full transition shadow-sm"
            title="Open Admin Moderation & Analytics"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        )}

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-full transition border border-slate-700"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Account Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 p-1 pr-2 rounded-full border border-slate-700 transition"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-600"
            />
            <span className="text-xs font-medium text-slate-200 hidden md:inline max-w-[80px] truncate">
              {currentUser.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 z-50 text-slate-200">
              <div className="px-3 py-1.5 border-b border-slate-700 mb-1">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Active Student Account</p>
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-indigo-300 truncate">{currentUser.college}</p>
              </div>

              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Switch Profile Demo:</p>
              <div className="max-h-56 overflow-y-auto space-y-0.5 px-1">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setShowUserDropdown(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center space-x-2 text-xs transition ${
                      u.id === currentUser.id ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <img src={u.avatarUrl} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{u.name}</span>
                        {u.role === 'admin' && (
                          <span className="text-[9px] bg-purple-500/30 text-purple-200 px-1 rounded">Admin</span>
                        )}
                      </div>
                      <p className="text-[10px] opacity-70 truncate">{u.skillsOffered[0] || u.college}</p>
                    </div>
                    {u.id === currentUser.id && <UserCheck className="w-3.5 h-3.5 text-indigo-300" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
