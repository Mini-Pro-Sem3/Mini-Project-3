import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Clock,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Search,
  Filter,
  Send,
  Sparkles,
} from 'lucide-react';

export const CommunityFeedPage: React.FC = () => {
  const { complaints, currentUser, addVerification, addComment, setActiveView, openAuthModal } =
    useApp();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'recent') return true; // sorted below
    if (activeFilter === 'cleaning_started') {
      return c.verifications.some((v) => v.type === 'cleaning_started');
    }
    if (activeFilter === 'cleaning_completed') {
      return c.verifications.some((v) => v.type === 'cleaning_completed');
    }
    if (activeFilter === 'in_progress') return c.status === 'In Progress';
    if (activeFilter === 'resolved') return c.status === 'Resolved';
    if (activeFilter === 'nearby') return c.location.ward.includes('Ward 3');

    return true;
  });

  const handleVerify = (
    complaintId: string,
    type: 'cleaning_started' | 'cleaning_completed'
  ) => {
    if (!currentUser) {
      openAuthModal('citizen');
      return;
    }

    const ok = addVerification(complaintId, type);
    if (!ok) {
      setStatusMessage('You have already verified this stage for this complaint.');
    } else {
      setStatusMessage(
        `Thank you ${currentUser.name}! Your public verification has been recorded.`
      );
    }
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleAddComment = (complaintId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[complaintId];
    if (!text || !text.trim()) return;

    if (!currentUser) {
      openAuthModal('citizen');
      return;
    }

    addComment(complaintId, text);
    setCommentInputs((prev) => ({ ...prev, [complaintId]: '' }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F6F5EC] text-xs font-semibold text-[#687447] border border-[#E6E5DA]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Oversight & Citizen Verification</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#292D25]">
            Community Sanitation Feed
          </h1>
          <p className="text-xs sm:text-sm text-[#292D25]/75">
            Public transparency stream. Verify whether municipal workers have started or finished cleaning reported spots.
          </p>
        </div>

        {/* Global Toast / Feedback */}
        {statusMessage && (
          <div className="p-3 bg-green-50 border border-green-200 text-xs text-green-800 rounded-xl flex items-center justify-between">
            <span>{statusMessage}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="font-bold text-green-700 hover:text-green-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-[#E6E5DA] p-4 shadow-xs space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by location, complaint ID or keywords..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#FAFAF5] border border-[#E6E5DA] rounded-xl focus:outline-none focus:border-[#687447]"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[#71717A] flex items-center gap-1 pr-2 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            {[
              { id: 'all', label: 'All Reports' },
              { id: 'recent', label: 'Recently Reported' },
              { id: 'cleaning_started', label: 'Cleaning Started' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'resolved', label: 'Resolved' },
              { id: 'nearby', label: 'Nearby (Ward 3)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#687447] text-white font-semibold shadow-xs'
                    : 'bg-[#F6F5EC] text-[#292D25] hover:bg-[#ECEADF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Stream */}
        <div className="space-y-6">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E6E5DA] p-12 text-center text-[#71717A] space-y-2">
              <p className="text-sm font-semibold">No complaints matched this filter.</p>
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs text-[#687447] hover:underline"
              >
                Reset Feed Filters
              </button>
            </div>
          ) : (
            filteredComplaints.map((item) => {
              const hasUserStartedVerify = item.verifications.some(
                (v) => v.userId === currentUser?.id && v.type === 'cleaning_started'
              );
              const hasUserCompletedVerify = item.verifications.some(
                (v) => v.userId === currentUser?.id && v.type === 'cleaning_completed'
              );

              const startedCount = item.verifications.filter(
                (v) => v.type === 'cleaning_started'
              ).length;
              const completedCount = item.verifications.filter(
                (v) => v.type === 'cleaning_completed'
              ).length;

              const isCommentsOpen = openCommentId === item.id;

              return (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#E6E5DA] overflow-hidden shadow-xs hover:border-[#687447]/60 transition-all"
                >
                  {/* Post Top Header */}
                  <div className="p-5 pb-3 flex items-center justify-between border-b border-[#E6E5DA]/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#687447]/15 text-[#424D2B] font-bold text-sm flex items-center justify-center border border-[#687447]/30">
                        {item.citizenName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#292D25]">
                          {item.citizenName}
                        </div>
                        <div className="text-[11px] text-[#71717A] flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[#687447]" />
                          <span>{item.location.ward}</span>
                          <span aria-hidden="true">·</span>
                          <Clock className="w-3 h-3" />
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-[#687447] block">
                        {item.id}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold mt-0.5 ${
                          item.status === 'Resolved'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-[#292D25] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#292D25]/80 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="text-xs text-[#71717A] flex items-center gap-1">
                      <span className="font-semibold text-[#292D25]">Exact Location:</span>
                      <span>{item.location.address}</span>
                      {item.location.landmark && (
                        <span className="italic">({item.location.landmark})</span>
                      )}
                    </div>

                    {/* Image / Photographs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-[#E6E5DA] h-60">
                        <img
                          src={item.images[0]}
                          alt="Reported garbage"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-white">
                          Reported Photo
                        </div>
                      </div>

                      {item.resolvedImages && item.resolvedImages.length > 0 ? (
                        <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-[#E6E5DA] h-60">
                          <img
                            src={item.resolvedImages[0]}
                            alt="Resolved cleanup"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#15803D] text-white">
                            Verified After-Cleanup
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-[#E6E5DA] h-60 flex flex-col items-center justify-center p-6 text-center bg-[#FAFAF5]">
                          <Clock className="w-6 h-6 text-[#71717A] mb-1" />
                          <span className="text-xs font-semibold text-[#292D25]">
                            Awaiting Cleanup Completion
                          </span>
                          <span className="text-[11px] text-[#71717A] mt-1">
                            {item.status === 'In Progress'
                              ? 'Crew currently active on site'
                              : 'Queued for municipal collection'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Citizen Verification Bar */}
                  <div className="px-5 py-3.5 bg-[#F6F5EC]/70 border-t border-b border-[#E6E5DA] flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-[#292D25]">
                      <span className="font-semibold">Community Ground Check:</span>{' '}
                      <span className="text-[#687447] font-bold">
                        {item.verifications.length} citizen confirmations
                      </span>
                    </div>

                    {/* Two verification buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerify(item.id, 'cleaning_started')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          hasUserStartedVerify
                            ? 'bg-[#687447] text-white'
                            : 'bg-white hover:bg-white/80 text-[#424D2B] border border-[#E6E5DA]'
                        }`}
                        title="Confirm you saw cleaning team or trucks on site"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>
                          {hasUserStartedVerify ? 'Started (Verified ✓)' : 'Cleaning Started'} (
                          {startedCount})
                        </span>
                      </button>

                      <button
                        onClick={() => handleVerify(item.id, 'cleaning_completed')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          hasUserCompletedVerify
                            ? 'bg-[#15803D] text-white'
                            : 'bg-white hover:bg-white/80 text-[#15803D] border border-green-200'
                        }`}
                        title="Confirm the area is now clean and trash removed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {hasUserCompletedVerify ? 'Cleaned (Verified ✓)' : 'Cleaning Completed'} (
                          {completedCount})
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Action Bar (Comments toggle & View Details) */}
                  <div className="px-5 py-3 flex items-center justify-between text-xs text-[#71717A]">
                    <button
                      onClick={() => setOpenCommentId(isCommentsOpen ? null : item.id)}
                      className="hover:text-[#687447] font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>
                        {item.comments.length}{' '}
                        {item.comments.length === 1 ? 'Comment' : 'Comments'}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveView('complaint-detail', item.id)}
                      className="font-semibold text-[#687447] hover:underline"
                    >
                      Full Details & Timeline →
                    </button>
                  </div>

                  {/* Comments Accordion */}
                  {isCommentsOpen && (
                    <div className="px-5 py-4 bg-[#FAFAF5] border-t border-[#E6E5DA] space-y-3">
                      {item.comments.length > 0 ? (
                        <div className="space-y-2">
                          {item.comments.map((c) => (
                            <div
                              key={c.id}
                              className="p-2.5 rounded-lg bg-white border border-[#E6E5DA] text-xs space-y-0.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#292D25]">{c.userName}</span>
                                <span className="text-[10px] font-mono text-[#71717A]">
                                  {new Date(c.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="text-[#292D25]/85">{c.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-[#71717A]">
                          No citizen updates posted yet. Be the first to add a note!
                        </div>
                      )}

                      {/* Add comment form */}
                      <form
                        onSubmit={(e) => handleAddComment(item.id, e)}
                        className="flex gap-2 pt-1"
                      >
                        <input
                          type="text"
                          value={commentInputs[item.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [item.id]: e.target.value,
                            }))
                          }
                          placeholder="Add your observation (e.g. 'Bin is cleared now')..."
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span>Send</span>
                          <Send className="w-3 h-3" />
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
