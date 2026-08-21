import React, { useState } from 'react';
import { SkillListing, User, Review } from '../types';
import { Search, Filter, Sparkles, Star, Award, Clock, MapPin, Send, CheckCircle2, AlertCircle, X, ChevronRight } from 'lucide-react';

interface DiscoverViewProps {
  skills: SkillListing[];
  currentUser: User;
  onRequestSession: (skill: SkillListing, message: string, date: string, time: string) => Promise<void>;
  onAiMatch: (goal: string) => Promise<{ matches: { skillId: string; matchPercentage: number; reason: string }[]; aiNote: string }>;
}

const CATEGORIES = ['All', 'Programming', 'Graphic Design', 'Video Editing', 'Music & Guitar', 'Public Speaking'];

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  skills,
  currentUser,
  onRequestSession,
  onAiMatch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  
  // Selected skill modal for detail view & request
  const [selectedSkill, setSelectedSkill] = useState<SkillListing | null>(null);
  const [mentorReviews, setMentorReviews] = useState<Review[]>([]);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestDate, setRequestDate] = useState('2026-08-14');
  const [requestTime, setRequestTime] = useState('15:00');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Gemini AI Matcher Modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiGoalInput, setAiGoalInput] = useState('');
  const [isAiMatching, setIsAiMatching] = useState(false);
  const [aiResults, setAiResults] = useState<{ matches: { skillId: string; matchPercentage: number; reason: string }[]; aiNote: string } | null>(null);

  // Filter skills
  const filteredSkills = skills.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesLvl = selectedLevel === 'All' || s.level.toLowerCase() === selectedLevel.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCat && matchesLvl && matchesSearch;
  });

  // Handle open skill modal
  const handleOpenSkillDetail = async (skill: SkillListing) => {
    setSelectedSkill(skill);
    setRequestSuccess(false);
    setRequestMessage(`Hi ${skill.userName}, I'd love to request a 1-on-1 session to learn ${skill.title}.`);

    // Fetch mentor reviews
    try {
      const res = await fetch(`/api/reviews/mentor/${skill.userId}`);
      if (res.ok) {
        const data = await res.json();
        setMentorReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to load mentor reviews:', err);
    }
  };

  // Handle submit session request
  const handleSubmitSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkill) return;

    setIsSubmittingRequest(true);
    try {
      await onRequestSession(selectedSkill, requestMessage, requestDate, requestTime);
      setRequestSuccess(true);
      setTimeout(() => {
        setSelectedSkill(null);
        setRequestSuccess(false);
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  // Handle AI Match submit
  const handleRunAiMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiGoalInput.trim()) return;

    setIsAiMatching(true);
    try {
      const res = await onAiMatch(aiGoalInput);
      setAiResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiMatching(false);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-12">
      {/* Banner / Hero Prompt for Gemini AI Matcher */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border border-indigo-500/30 p-4 text-white shadow-lg">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex items-start justify-between">
          <div className="space-y-1 max-w-[85%]">
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>SkillSwap AI Matchmaker</span>
            </div>
            <h2 className="text-base font-bold tracking-tight text-white">Find Your Ideal Student Mentor</h2>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Tell our AI what skill or topic you want to master, and get instant student peer recommendations.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAiModal(true)}
          className="mt-3 w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs py-2 px-3 rounded-xl shadow-md transition flex items-center justify-center space-x-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Ask AI Skill Matchmaker</span>
        </button>
      </div>

      {/* Search Bar & Level Filter */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Python, Figma, Guitar, Video Editing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition"
            />
          </div>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-2 outline-none focus:border-indigo-500"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Available Listings ({filteredSkills.length})</span>
          <span>Exchange Fee: 30 PTS</span>
        </div>

        {filteredSkills.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400 space-y-2">
            <Filter className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-medium">No skill listings found for this search or category.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
              className="text-indigo-400 text-xs font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => handleOpenSkillDetail(skill)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col group"
              >
                {/* Skill Cover Image */}
                <div className="h-32 w-full bg-slate-950 relative overflow-hidden">
                  <img
                    src={skill.images?.[0] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'}
                    alt={skill.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                  <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 px-2 py-0.5 rounded-md text-[10px] font-semibold text-indigo-300">
                    {skill.category}
                  </div>

                  <div className="absolute top-2 right-2 bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>30 PTS</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {skill.level}
                      </span>
                      <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{skill.userRating || 5.0}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-xs text-slate-100 line-clamp-1 group-hover:text-indigo-300 transition">
                      {skill.title}
                    </h3>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>

                  {/* Mentor Footer */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0">
                      <img
                        src={skill.userAvatar}
                        alt={skill.userName}
                        className="w-6 h-6 rounded-full object-cover border border-slate-700"
                      />
                      <div className="truncate">
                        <p className="text-[11px] font-medium text-slate-200 truncate">{skill.userName}</p>
                        <p className="text-[9px] text-slate-400 truncate">{skill.userCollege}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSkillDetail(skill);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg transition"
                    >
                      Request
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skill Detail & Request Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl space-y-0 my-auto text-slate-200">
            {/* Header Image */}
            <div className="h-40 w-full relative bg-slate-950">
              <img
                src={selectedSkill.images?.[0] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'}
                alt={selectedSkill.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedSkill(null)}
                className="absolute top-3 right-3 bg-slate-900/80 text-slate-300 hover:text-white p-1.5 rounded-full backdrop-blur-md border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-md uppercase">
                    {selectedSkill.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md uppercase">
                    {selectedSkill.level}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1">{selectedSkill.title}</h2>
              </div>

              {/* Mentor Profile Section */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-start space-x-3">
                <img
                  src={selectedSkill.userAvatar}
                  alt={selectedSkill.userName}
                  className="w-10 h-10 rounded-full object-cover border border-indigo-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-white truncate">{selectedSkill.userName}</h4>
                    <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{selectedSkill.userRating}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-indigo-300 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedSkill.userCollege}</span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1 text-xs">
                <h4 className="font-semibold text-slate-300">About this Skill Session</h4>
                <p className="text-slate-400 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                  {selectedSkill.description}
                </p>
              </div>

              {/* Mentor Reviews Preview */}
              {mentorReviews.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="font-semibold text-xs text-slate-300">Student Reviews ({mentorReviews.length})</h4>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {mentorReviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-950 p-2 rounded-lg text-[11px] border border-slate-800/60">
                        <div className="flex items-center justify-between font-semibold text-slate-200">
                          <span>{rev.studentName}</span>
                          <span className="text-amber-400 font-bold">★ {rev.rating}.0</span>
                        </div>
                        <p className="text-slate-400 mt-0.5">{rev.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Session Form */}
              <form onSubmit={handleSubmitSession} className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="font-bold text-xs text-indigo-300 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Schedule Learning Request</span>
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold uppercase">Preferred Date</label>
                    <input
                      type="date"
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold uppercase">Preferred Time</label>
                    <input
                      type="time"
                      value={requestTime}
                      onChange={(e) => setRequestTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase">Note to Mentor</label>
                  <textarea
                    rows={2}
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-indigo-500 resize-none"
                    required
                  />
                </div>

                {requestSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Learning request sent successfully! Mentor notified.</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedSkill(null)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingRequest || currentUser.id === selectedSkill.userId}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold py-2 rounded-xl disabled:opacity-50 transition flex items-center justify-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingRequest ? 'Sending...' : 'Send Request (30 PTS)'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Gemini AI Skill Matcher Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-4 text-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm text-white">Gemini AI Skill Matchmaker</h3>
              </div>
              <button
                onClick={() => {
                  setShowAiModal(false);
                  setAiResults(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRunAiMatch} className="space-y-2">
              <label className="text-xs text-slate-300 font-medium">What skill, topic, or career goal do you want to master?</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g., Want to build a mobile app, learn acoustic guitar fingerstyle..."
                  value={aiGoalInput}
                  onChange={(e) => setAiGoalInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isAiMatching || !aiGoalInput.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3 py-2 rounded-xl disabled:opacity-50 transition"
                >
                  {isAiMatching ? 'Analyzing...' : 'Match'}
                </button>
              </div>
            </form>

            {aiResults && (
              <div className="space-y-3 pt-2 border-t border-slate-800 max-h-60 overflow-y-auto">
                {aiResults.aiNote && (
                  <p className="text-xs text-indigo-300 bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20 italic">
                    💡 AI Matchmaker Note: "{aiResults.aiNote}"
                  </p>
                )}

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300">Top Recommended Matches:</h4>
                  {aiResults.matches.map((m) => {
                    const sk = skills.find((s) => s.id === m.skillId);
                    if (!sk) return null;
                    return (
                      <div
                        key={m.skillId}
                        onClick={() => {
                          setShowAiModal(false);
                          handleOpenSkillDetail(sk);
                        }}
                        className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-100">{sk.title}</span>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            {m.matchPercentage}% Match
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{m.reason}</p>
                        <div className="text-[10px] text-indigo-300 font-semibold flex items-center justify-between pt-1">
                          <span>Mentor: {sk.userName} ({sk.userCollege})</span>
                          <span className="flex items-center space-x-0.5 text-indigo-400">
                            <span>Request Session</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
