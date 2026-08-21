import React, { useState, useEffect } from 'react';
import { PlatformAnalytics, User, SkillListing, Report } from '../types';
import { Shield, Users, BookOpen, CheckCircle2, AlertTriangle, Trash2, ArrowLeft, BarChart3, Award } from 'lucide-react';

interface AdminConsoleProps {
  onBackToApp: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ onBackToApp }) => {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [skillsList, setSkillsList] = useState<SkillListing[]>([]);
  const [reportsList, setReportsList] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'skills' | 'reports'>('analytics');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resAnal, resUsers, resSkills, resReports] = await Promise.all([
        fetch('/api/admin/analytics').then(r => r.json()),
        fetch('/api/admin/users').then(r => r.json()),
        fetch('/api/admin/skills').then(r => r.json()),
        fetch('/api/admin/reports').then(r => r.json())
      ]);

      if (resAnal.analytics) setAnalytics(resAnal.analytics);
      if (resUsers.users) setUsersList(resUsers.users);
      if (resSkills.skills) setSkillsList(resSkills.skills);
      if (resReports.reports) setReportsList(resReports.reports);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus as any } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to remove this skill listing?')) return;
    try {
      const res = await fetch(`/api/admin/skills/${skillId}`, { method: 'DELETE' });
      if (res.ok) {
        setSkillsList(prev => prev.filter(s => s.id !== skillId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-12 bg-slate-950 min-h-full text-slate-200">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <button onClick={onBackToApp} className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-purple-500/20 text-purple-300 rounded-lg">
              <Shield className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-sm text-white">SkillSwap Admin Portal</h2>
          </div>
        </div>

        <button
          onClick={onBackToApp}
          className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl transition"
        >
          Exit Admin
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 grid grid-cols-4 gap-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-1.5 rounded-lg transition ${activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-1.5 rounded-lg transition ${activeTab === 'users' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`py-1.5 rounded-lg transition ${activeTab === 'skills' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
        >
          Listings
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`py-1.5 rounded-lg transition ${activeTab === 'reports' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
        >
          Reports
        </button>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Students</span>
              <p className="text-lg font-bold text-white">{analytics.totalStudents}</p>
            </div>

            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Listings</span>
              <p className="text-lg font-bold text-white">{analytics.totalSkills}</p>
            </div>

            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Completed Sessions</span>
              <p className="text-lg font-bold text-emerald-400">{analytics.completedSessions}</p>
            </div>

            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Points Circulation</span>
              <p className="text-lg font-bold text-amber-400">{analytics.pointsCirculation} PTS</p>
            </div>
          </div>

          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-xs text-slate-200">Category Distribution</h4>
            <div className="space-y-1.5">
              {analytics.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="space-y-0.5 text-xs">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>{cat.category}</span>
                    <span className="font-semibold">{cat.count} listings</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (cat.count / analytics.totalSkills) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Management Tab */}
      {activeTab === 'users' && (
        <div className="space-y-2">
          {usersList.map((u) => (
            <div key={u.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5 min-w-0">
                <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                <div className="truncate">
                  <p className="font-bold text-white truncate">{u.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{u.college} • {u.skillPoints} PTS</p>
                </div>
              </div>

              <button
                onClick={() => handleToggleUserStatus(u.id, u.status)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                  u.status === 'suspended'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Skill Listings Moderation Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-2">
          {skillsList.map((s) => (
            <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
              <div className="min-w-0 pr-2">
                <p className="font-bold text-white truncate">{s.title}</p>
                <p className="text-[10px] text-slate-400 truncate">By {s.userName} • {s.category}</p>
              </div>

              <button
                onClick={() => handleRemoveSkill(s.id)}
                className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 rounded-lg border border-rose-500/20 shrink-0"
                title="Remove Listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-2">
          {reportsList.length === 0 ? (
            <p className="text-center py-6 text-xs text-slate-500">No reported complaints.</p>
          ) : (
            reportsList.map((rep) => (
              <div key={rep.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-white">
                  <span>Reported: {rep.targetTitleOrName}</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">{rep.status}</span>
                </div>
                <p className="text-slate-400 text-[11px]">Reason: "{rep.reason}"</p>
                <p className="text-[10px] text-slate-500">By {rep.reportedByName}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
