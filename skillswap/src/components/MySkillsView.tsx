import React, { useState } from 'react';
import { SkillListing, User } from '../types';
import { Plus, Trash2, Edit2, BookOpen, Award, CheckCircle2, X } from 'lucide-react';

interface MySkillsViewProps {
  currentUser: User;
  userSkills: SkillListing[];
  onCreateSkill: (newSkillData: {
    title: string;
    category: string;
    description: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    tags: string[];
  }) => Promise<void>;
  onDeleteSkill: (skillId: string) => Promise<void>;
}

const CATEGORIES = ['Programming', 'Graphic Design', 'Video Editing', 'Music & Guitar', 'Public Speaking', 'Languages', 'Data & Math'];

export const MySkillsView: React.FC<MySkillsViewProps> = ({
  currentUser,
  userSkills,
  onCreateSkill,
  onDeleteSkill
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Programming');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    try {
      const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [category];
      await onCreateSkill({
        title,
        category,
        description,
        level,
        tags
      });

      setSuccessMessage('Skill listing published! Students can now request sessions.');
      setTimeout(() => {
        setShowCreateModal(false);
        setSuccessMessage('');
        setTitle('');
        setDescription('');
        setTagsInput('');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-12">
      {/* Top Title & Add Skill Button */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>My Skill Listings</span>
          </h2>
          <p className="text-xs text-slate-400">Teach what you know to earn Skill Points (+50 PTS / session)</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 px-3 rounded-xl shadow-md transition flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs text-slate-300">
        <div>
          <p className="font-semibold text-slate-200">Active Listings: {userSkills.length}</p>
          <p className="text-[11px] text-slate-400">Availability: {currentUser.availability}</p>
        </div>
        <div className="flex items-center space-x-1 text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>Earn 50 PTS</span>
        </div>
      </div>

      {/* Listings */}
      <div className="space-y-3">
        {userSkills.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-300">No Skill Listings Published Yet</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Share your knowledge in Programming, Design, Guitar, or Public Speaking to start earning points!
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl"
            >
              Create Your First Skill Listing
            </button>
          </div>
        ) : (
          userSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-sm relative group hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded uppercase">
                      {skill.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded uppercase">
                      {skill.level}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-white mt-1">{skill.title}</h3>
                </div>

                <button
                  onClick={() => onDeleteSkill(skill.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition"
                  title="Delete Skill Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{skill.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex flex-wrap gap-1">
                  {skill.tags.map((t, idx) => (
                    <span key={idx} className="bg-slate-950 text-slate-400 px-2 py-0.5 rounded-md text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>
                <span className="font-semibold text-amber-400">30 PTS Fee</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Skill Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-4 space-y-3 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-white">Create New Skill Listing</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Skill Title</label>
                <input
                  type="text"
                  placeholder="e.g., Intro to React & TypeScript, Guitar Fingerstyle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Description & Curriculum</label>
                <textarea
                  rows={3}
                  placeholder="What will students learn in a 1-on-1 session with you?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Python, Coding, Interview, Algorithms"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              {successMessage && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl disabled:opacity-50 transition"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Skill Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
