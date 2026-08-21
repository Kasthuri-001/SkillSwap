import React, { useState, useEffect } from 'react';
import { User, SkillListing, LearningRequest, ChatMessage, NotificationItem } from './types';
import { HeaderBar } from './components/HeaderBar';
import { MobileFrame } from './components/MobileFrame';
import { DiscoverView } from './components/DiscoverView';
import { MySkillsView } from './components/MySkillsView';
import { ScheduleView } from './components/ScheduleView';
import { ChatView } from './components/ChatView';
import { ProfileView } from './components/ProfileView';
import { AdminConsole } from './components/AdminConsole';
import { FlutterCodeViewer } from './components/FlutterCodeViewer';
import { Bell, X, Check, Award } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [skills, setSkills] = useState<SkillListing[]>([]);
  const [requests, setRequests] = useState<LearningRequest[]>([]);
  const [chatThreads, setChatThreads] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [activeTab, setActiveTab] = useState<'discover' | 'my_skills' | 'schedule' | 'chat' | 'profile' | 'flutter_code'>('discover');
  const [showAdminConsole, setShowAdminConsole] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [activeChatRequestId, setActiveChatRequestId] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    loadInitialData();

    // Setup periodic sync poll
    const interval = setInterval(() => {
      syncData();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentUser?.id]);

  const loadInitialData = async () => {
    try {
      // 1. Fetch Users List
      const resUsers = await fetch('/api/admin/users').then(r => r.json());
      if (resUsers.users) {
        setAllUsers(resUsers.users);
        if (!currentUser) {
          setCurrentUser(resUsers.users[0]); // Alex Rivers default
        }
      }

      // 2. Fetch Skills
      const resSkills = await fetch('/api/skills').then(r => r.json());
      if (resSkills.skills) setSkills(resSkills.skills);

      if (currentUser) {
        syncUserSpecificData(currentUser.id);
      }
    } catch (err) {
      console.error('Failed to load initial SkillSwap data:', err);
    }
  };

  const syncData = async () => {
    try {
      const resSkills = await fetch('/api/skills').then(r => r.json());
      if (resSkills.skills) setSkills(resSkills.skills);

      const resUsers = await fetch('/api/admin/users').then(r => r.json());
      if (resUsers.users) {
        setAllUsers(resUsers.users);
        if (currentUser) {
          const updatedSelf = resUsers.users.find((u: User) => u.id === currentUser.id);
          if (updatedSelf) setCurrentUser(updatedSelf);
        }
      }

      if (currentUser) {
        syncUserSpecificData(currentUser.id);
      }
    } catch (err) {
      console.error('Sync error:', err);
    }
  };

  const syncUserSpecificData = async (userId: string) => {
    try {
      const [resRequests, resThreads, resNotifs] = await Promise.all([
        fetch(`/api/requests?userId=${userId}`).then(r => r.json()),
        fetch(`/api/chat/threads/${userId}`).then(r => r.json()),
        fetch(`/api/notifications/${userId}`).then(r => r.json())
      ]);

      if (resRequests.requests) setRequests(resRequests.requests);
      if (resThreads.threads) setChatThreads(resThreads.threads);
      if (resNotifs.notifications) setNotifications(resNotifs.notifications);
    } catch (err) {
      console.error('User data sync error:', err);
    }
  };

  // Switch Active User Demo Profile
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    syncUserSpecificData(user.id);
  };

  // Create Skill Listing
  const handleCreateSkill = async (newSkillData: {
    title: string;
    category: string;
    description: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    tags: string[];
  }) => {
    if (!currentUser) return;

    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        ...newSkillData
      })
    });

    if (res.ok) {
      const data = await res.json();
      setSkills(prev => [data.skill, ...prev]);
    }
  };

  // Delete Skill Listing
  const handleDeleteSkill = async (skillId: string) => {
    const res = await fetch(`/api/skills/${skillId}`, { method: 'DELETE' });
    if (res.ok) {
      setSkills(prev => prev.filter(s => s.id !== skillId));
    }
  };

  // Request Session
  const handleRequestSession = async (skill: SkillListing, message: string, date: string, time: string) => {
    if (!currentUser) return;

    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requesterId: currentUser.id,
        skillId: skill.id,
        message,
        scheduledDate: date,
        scheduledTime: time
      })
    });

    if (res.ok) {
      syncData();
    }
  };

  // Gemini AI Matchmaker
  const handleAiMatch = async (goal: string) => {
    const res = await fetch('/api/skills/ai-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userGoal: goal,
        wantedSkills: currentUser?.skillsWanted || [],
        currentCollege: currentUser?.college || ''
      })
    });
    return await res.json();
  };

  // Update Request Status (Accept / Reject / Complete)
  const handleUpdateRequestStatus = async (requestId: string, status: 'accepted' | 'rejected' | 'completed' | 'cancelled') => {
    if (!currentUser) return;

    const res = await fetch(`/api/requests/${requestId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        actionUserId: currentUser.id
      })
    });

    if (res.ok) {
      syncData();
    }
  };

  // Submit Review
  const handleSubmitReview = async (mentorId: string, rating: number, feedback: string, skillTitle: string) => {
    if (!currentUser) return;

    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mentorId,
        studentId: currentUser.id,
        rating,
        feedback,
        skillTitle
      })
    });

    syncData();
  };

  // Send Chat Message
  const handleSendMessage = async (requestId: string, receiverId: string, content: string, imageUrl?: string) => {
    if (!currentUser) return;

    await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        receiverId,
        content,
        imageUrl
      })
    });

    syncUserSpecificData(currentUser.id);
  };

  // Mark Chat Read
  const handleMarkChatRead = async (requestId: string) => {
    if (!currentUser) return;
    await fetch('/api/chat/read', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, userId: currentUser.id })
    });
  };

  // Mark All Notifications Read
  const handleMarkNotifsRead = async () => {
    if (!currentUser) return;
    await fetch(`/api/notifications/read-all/${currentUser.id}`, { method: 'PUT' });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300 font-sans">
        <div className="animate-pulse space-y-2 text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 mx-auto"></div>
          <p className="text-xs">Loading SkillSwap Campus...</p>
        </div>
      </div>
    );
  }

  const unreadNotifsCount = notifications.filter(n => !n.read).length;
  const unreadChatCount = chatThreads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);
  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;

  const userSkillsList = skills.filter(s => s.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <HeaderBar
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        unreadCount={unreadNotifsCount}
        onOpenNotifications={() => setShowNotificationModal(true)}
        onOpenAdmin={() => setShowAdminConsole(true)}
      />

      {/* Admin Portal Overlay */}
      {showAdminConsole ? (
        <div className="flex-1 max-w-5xl w-full mx-auto p-2">
          <AdminConsole onBackToApp={() => setShowAdminConsole(false)} />
        </div>
      ) : (
        /* Main Mobile Container Frame */
        <MobileFrame
          activeTab={activeTab}
          onChangeTab={(t) => setActiveTab(t)}
          unreadChatCount={unreadChatCount}
          pendingRequestsCount={pendingRequestsCount}
        >
          {activeTab === 'discover' && (
            <DiscoverView
              skills={skills}
              currentUser={currentUser}
              onRequestSession={handleRequestSession}
              onAiMatch={handleAiMatch}
            />
          )}

          {activeTab === 'my_skills' && (
            <MySkillsView
              currentUser={currentUser}
              userSkills={userSkillsList}
              onCreateSkill={handleCreateSkill}
              onDeleteSkill={handleDeleteSkill}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleView
              currentUser={currentUser}
              requests={requests}
              onUpdateRequestStatus={handleUpdateRequestStatus}
              onSubmitReview={handleSubmitReview}
            />
          )}

          {activeTab === 'chat' && (
            <ChatView
              currentUser={currentUser}
              threads={chatThreads}
              activeRequestId={activeChatRequestId}
              onSendMessage={handleSendMessage}
              onMarkRead={handleMarkChatRead}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              allUsers={allUsers}
              onSwitchUser={handleSwitchUser}
              onUpdateProfile={async (updated) => {
                const res = await fetch('/api/auth/profile', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: currentUser.id, ...updated })
                });
                if (res.ok) {
                  const data = await res.json();
                  setCurrentUser(data.user);
                }
              }}
            />
          )}

          {activeTab === 'flutter_code' && <FlutterCodeViewer />}
        </MobileFrame>
      )}

      {/* Notification Dropdown Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-4 space-y-3 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">SkillSwap Notifications</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMarkNotifsRead}
                  className="text-[11px] font-semibold text-indigo-300 hover:text-white"
                >
                  Mark All Read
                </button>
                <button onClick={() => setShowNotificationModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-500">No notifications yet.</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-xl border text-xs space-y-1 transition ${
                      notif.read ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-950 border-indigo-500/40 text-slate-200 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{notif.title}</span>
                      <span className="text-[9px] text-slate-500">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
