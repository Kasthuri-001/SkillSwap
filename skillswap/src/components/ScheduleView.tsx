import React, { useState } from 'react';
import { LearningRequest, User } from '../types';
import { Calendar, Clock, Video, CheckCircle2, XCircle, Star, Send, Award, AlertCircle } from 'lucide-react';

interface ScheduleViewProps {
  currentUser: User;
  requests: LearningRequest[];
  onUpdateRequestStatus: (requestId: string, status: 'accepted' | 'rejected' | 'completed' | 'cancelled') => Promise<void>;
  onSubmitReview: (mentorId: string, rating: number, feedback: string, skillTitle: string) => Promise<void>;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  currentUser,
  requests,
  onUpdateRequestStatus,
  onSubmitReview
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'upcoming' | 'completed'>('pending');

  // Review Modal state
  const [reviewRequest, setReviewRequest] = useState<LearningRequest | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Filter requests
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const upcomingRequests = requests.filter(r => r.status === 'accepted');
  const completedRequests = requests.filter(r => r.status === 'completed');

  const displayedList =
    activeTab === 'pending'
      ? pendingRequests
      : activeTab === 'upcoming'
      ? upcomingRequests
      : completedRequests;

  const handleMarkCompleteClick = (req: LearningRequest) => {
    // If current user is the requester (student), let them rate mentor when marking complete
    if (req.requesterId === currentUser.id) {
      setReviewRequest(req);
    } else {
      onUpdateRequestStatus(req.id, 'completed');
    }
  };

  const handleCompleteAndReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewRequest) return;

    setIsSubmittingReview(true);
    try {
      // 1. Mark status as completed
      await onUpdateRequestStatus(reviewRequest.id, 'completed');

      // 2. Submit rating for mentor
      await onSubmitReview(reviewRequest.providerId, rating, feedback, reviewRequest.skillTitle);

      setReviewSubmitted(true);
      setTimeout(() => {
        setReviewRequest(null);
        setReviewSubmitted(false);
        setFeedback('');
        setRating(5);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center space-x-1.5">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>Sessions & Requests</span>
        </h2>
        <p className="text-xs text-slate-400">Manage learning requests, upcoming calls, and completed skill swaps</p>
      </div>

      {/* Segmented Filter Tabs */}
      <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 grid grid-cols-3 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('pending')}
          className={`py-1.5 rounded-lg font-semibold transition relative ${
            activeTab === 'pending' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Pending ({pendingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-1.5 rounded-lg font-semibold transition ${
            activeTab === 'upcoming' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Upcoming ({upcomingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`py-1.5 rounded-lg font-semibold transition ${
            activeTab === 'completed' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Completed ({completedRequests.length})</span>
        </button>
      </div>

      {/* List Content */}
      <div className="space-y-3">
        {displayedList.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400 space-y-2">
            <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-medium">No {activeTab} requests found.</p>
          </div>
        ) : (
          displayedList.map((req) => {
            const isMentor = req.providerId === currentUser.id;
            const partnerName = isMentor ? req.requesterName : req.providerName;
            const partnerAvatar = isMentor ? req.requesterAvatar : req.providerAvatar;
            const partnerRole = isMentor ? 'Student Requester' : 'Mentor Instructor';

            return (
              <div
                key={req.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-sm"
              >
                {/* Header: Skill Title & Points Badge */}
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded uppercase">
                      {isMentor ? 'Teaching Session' : 'Learning Session'}
                    </span>
                    <h3 className="font-bold text-xs text-white pt-0.5">{req.skillTitle}</h3>
                  </div>

                  <div className="flex items-center space-x-1 text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 text-[10px] font-bold">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>{isMentor ? '+50 PTS' : '-30 PTS'}</span>
                  </div>
                </div>

                {/* Partner Details */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img src={partnerAvatar} alt={partnerName} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-200 truncate">{partnerName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{partnerRole}</p>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-indigo-300 font-semibold space-y-0.5">
                    <div className="flex items-center space-x-1 justify-end">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{req.scheduledDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 justify-end">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{req.scheduledTime}</span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {req.message && (
                  <p className="text-xs text-slate-400 bg-slate-950/40 p-2 rounded-lg italic border border-slate-800/50">
                    "{req.message}"
                  </p>
                )}

                {/* Action Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      req.status === 'accepted'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : req.status === 'completed'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : req.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {req.status}
                  </span>

                  {/* Actions for Pending Request */}
                  {req.status === 'pending' && isMentor && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateRequestStatus(req.id, 'rejected')}
                        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-rose-500/30"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => onUpdateRequestStatus(req.id, 'accepted')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm"
                      >
                        Accept Session
                      </button>
                    </div>
                  )}

                  {/* Actions for Upcoming Accepted Session */}
                  {req.status === 'accepted' && (
                    <div className="flex items-center space-x-2">
                      <a
                        href={req.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Call</span>
                      </a>

                      <button
                        onClick={() => handleMarkCompleteClick(req)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Complete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Review & Feedback Modal */}
      {reviewRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-4 space-y-4 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="font-bold text-sm text-white">Rate Your Mentor</h3>
              </div>
              <button onClick={() => setReviewRequest(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCompleteAndReviewSubmit} className="space-y-3">
              <p className="text-xs text-slate-300">
                How was your SkillSwap session with <span className="font-bold text-white">{reviewRequest.providerName}</span> for{' '}
                <span className="font-bold text-indigo-300">{reviewRequest.skillTitle}</span>?
              </p>

              {/* Star Rating selector */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Rating</label>
                <div className="flex items-center space-x-2 mt-1">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          starVal <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-2">{rating}.0 / 5.0</span>
                </div>
              </div>

              {/* Feedback comment */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Written Feedback</label>
                <textarea
                  rows={3}
                  placeholder="Share a short review to help other students..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              {reviewSubmitted && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Session marked completed! +50 PTS awarded to mentor. Review published.</span>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewRequest(null)}
                  className="flex-1 bg-slate-800 text-slate-300 text-xs font-semibold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl disabled:opacity-50 transition flex items-center justify-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Submit & Complete'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
