import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, Award, MapPin, Edit3, CheckCircle2, Shield, Star, Clock, BookOpen, Users, LogOut } from 'lucide-react';

interface ProfileViewProps {
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (u: User) => void;
  onUpdateProfile: (updatedData: Partial<User>) => Promise<void>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  onUpdateProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(currentUser.bio);
  const [college, setCollege] = useState(currentUser.college);
  const [availability, setAvailability] = useState(currentUser.availability);
  const [skillsOfferedText, setSkillsOfferedText] = useState(currentUser.skillsOffered.join(', '));
  const [skillsWantedText, setSkillsWantedText] = useState(currentUser.skillsWanted.join(', '));
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateProfile({
        bio,
        college,
        availability,
        skillsOffered: skillsOfferedText.split(',').map((s) => s.trim()).filter(Boolean),
        skillsWanted: skillsWantedText.split(',').map((s) => s.trim()).filter(Boolean)
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-12">
      {/* Profile Card Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <h2 className="text-base font-bold text-white">{currentUser.name}</h2>
                {currentUser.role === 'admin' && (
                  <span className="bg-purple-500/20 text-purple-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-purple-500/30">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-300 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{currentUser.college}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition border border-slate-700"
            title="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
          "{currentUser.bio}"
        </p>

        {/* Rating & Availability */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 flex items-center space-x-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <div>
              <p className="font-bold text-white">{currentUser.rating} / 5.0</p>
              <p className="text-[10px] text-slate-400">{currentUser.ratingCount} Sessions Taught</p>
            </div>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <div className="truncate">
              <p className="font-bold text-white truncate">{currentUser.availability}</p>
              <p className="text-[10px] text-slate-400">Available Schedule</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Points Wallet Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900 border border-amber-500/30 rounded-2xl p-4 space-y-2 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-amber-200">Skill Points Balance</h3>
              <p className="text-[10px] text-slate-400">100% Cashless Student Exchange Ledger</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xl font-extrabold text-amber-400">{currentUser.skillPoints}</span>
            <span className="text-xs font-semibold text-amber-300 ml-1">PTS</span>
          </div>
        </div>

        <div className="bg-slate-950/80 rounded-xl p-2.5 text-[11px] text-slate-300 space-y-1 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">• Teach a skill session</span>
            <span className="text-emerald-400 font-bold">+50 PTS</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">• Learn a skill session</span>
            <span className="text-amber-400 font-bold">-30 PTS</span>
          </div>
        </div>
      </div>

      {/* Skills Offered & Wanted */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Offered */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
          <h3 className="font-bold text-xs text-indigo-300 flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Skills I Teach</span>
          </h3>
          <div className="flex flex-wrap gap-1">
            {currentUser.skillsOffered.map((sk, idx) => (
              <span key={idx} className="bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-xs px-2.5 py-1 rounded-full font-medium">
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Wanted */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
          <h3 className="font-bold text-xs text-purple-300 flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Skills I Want to Learn</span>
          </h3>
          <div className="flex flex-wrap gap-1">
            {currentUser.skillsWanted.map((sk, idx) => (
              <span key={idx} className="bg-purple-500/20 text-purple-200 border border-purple-500/30 text-xs px-2.5 py-1 rounded-full font-medium">
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Account Switcher Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2">
        <h3 className="font-bold text-xs text-slate-300">Fast Demo Account Switcher</h3>
        <p className="text-[11px] text-slate-400">Switch profiles to test SkillSwap from different student or admin perspectives:</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {allUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => onSwitchUser(u)}
              className={`p-2 rounded-xl text-left border text-xs flex items-center space-x-2 transition ${
                u.id === currentUser.id
                  ? 'bg-indigo-600 border-indigo-400 text-white font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <img src={u.avatarUrl} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
              <div className="truncate">
                <p className="truncate text-[11px]">{u.name.split(' ')[0]}</p>
                <p className="text-[9px] opacity-70 truncate">{u.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-4 space-y-3 text-slate-200 shadow-2xl">
            <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2">Edit Student Profile</h3>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Availability Schedule</label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Skills You Teach (comma separated)</label>
                <input
                  type="text"
                  value={skillsOfferedText}
                  onChange={(e) => setSkillsOfferedText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Skills You Want to Learn</label>
                <input
                  type="text"
                  value={skillsWantedText}
                  onChange={(e) => setSkillsWantedText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-slate-800 text-slate-300 text-xs font-semibold py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-xl disabled:opacity-50 transition"
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
