import React, { useState } from 'react';
import { Smartphone, Monitor, Tablet, Compass, BookOpen, Calendar, MessageSquare, User as UserIcon, Code2 } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: 'discover' | 'my_skills' | 'schedule' | 'chat' | 'profile' | 'flutter_code';
  onChangeTab: (tab: 'discover' | 'my_skills' | 'schedule' | 'chat' | 'profile' | 'flutter_code') => void;
  unreadChatCount?: number;
  pendingRequestsCount?: number;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeTab,
  onChangeTab,
  unreadChatCount = 0,
  pendingRequestsCount = 0
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'full'>('mobile');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4 font-sans">
      {/* Device Viewport Selector Bar */}
      <div className="w-full max-w-5xl mb-3 flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider hidden sm:inline">Preview Mode:</span>
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition ${
                deviceMode === 'mobile' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile App</span>
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition ${
                deviceMode === 'tablet' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDeviceMode('full')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition ${
                deviceMode === 'full' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Responsive</span>
            </button>
          </div>
        </div>

        {/* Flutter Code Inspector Toggle Button */}
        <button
          onClick={() => onChangeTab('flutter_code')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition ${
            activeTab === 'flutter_code'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Flutter Code Inspector</span>
          <span className="sm:hidden">Flutter Code</span>
        </button>
      </div>

      {/* Main Container Container according to Device Mode */}
      <div
        className={`w-full transition-all duration-300 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative ${
          deviceMode === 'mobile'
            ? 'max-w-[420px] min-h-[780px] h-[82vh]'
            : deviceMode === 'tablet'
            ? 'max-w-[768px] min-h-[820px] h-[85vh]'
            : 'max-w-5xl min-h-[800px] h-[88vh]'
        }`}
      >
        {/* Device Status Bar (Simulated Mobile Top Bar) */}
        {deviceMode === 'mobile' && (
          <div className="bg-slate-950 px-5 py-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-400 select-none border-b border-slate-900 z-20">
            <span>9:41</span>
            <div className="w-16 h-3.5 bg-slate-800 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950"></div>
            </div>
            <div className="flex items-center space-x-1 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Inner Content Area */}
        <div className="flex-1 overflow-y-auto flex flex-col relative bg-slate-950 text-slate-100">
          {children}
        </div>

        {/* Flutter Material 3 Bottom Navigation Bar */}
        {activeTab !== 'flutter_code' && (
          <nav className="bg-slate-900 border-t border-slate-800 px-2 py-1.5 grid grid-cols-5 gap-1 z-20">
            {/* Discover */}
            <button
              onClick={() => onChangeTab('discover')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
                activeTab === 'discover'
                  ? 'text-indigo-400 font-bold bg-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className={`w-5 h-5 ${activeTab === 'discover' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[10px] mt-0.5 font-medium">Discover</span>
            </button>

            {/* My Skills */}
            <button
              onClick={() => onChangeTab('my_skills')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
                activeTab === 'my_skills'
                  ? 'text-indigo-400 font-bold bg-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className={`w-5 h-5 ${activeTab === 'my_skills' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[10px] mt-0.5 font-medium">My Skills</span>
            </button>

            {/* Schedule */}
            <button
              onClick={() => onChangeTab('schedule')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition relative ${
                activeTab === 'schedule'
                  ? 'text-indigo-400 font-bold bg-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className={`w-5 h-5 ${activeTab === 'schedule' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[10px] mt-0.5 font-medium">Schedule</span>
              {pendingRequestsCount > 0 && (
                <span className="absolute top-1 right-3 bg-amber-500 text-slate-950 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            {/* Chat */}
            <button
              onClick={() => onChangeTab('chat')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition relative ${
                activeTab === 'chat'
                  ? 'text-indigo-400 font-bold bg-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className={`w-5 h-5 ${activeTab === 'chat' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[10px] mt-0.5 font-medium">Chat</span>
              {unreadChatCount > 0 && (
                <span className="absolute top-1 right-3 bg-indigo-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadChatCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() => onChangeTab('profile')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
                activeTab === 'profile'
                  ? 'text-indigo-400 font-bold bg-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserIcon className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[10px] mt-0.5 font-medium">Profile</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};
