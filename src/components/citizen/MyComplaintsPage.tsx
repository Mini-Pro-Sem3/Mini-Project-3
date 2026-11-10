import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint, ComplaintStatus } from '../../types';
import { LeafletMap } from '../common/LeafletMap';
import {
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Truck,
  ArrowLeft,
  MessageSquare,
  Send,
  AlertTriangle,
} from 'lucide-react';

const STAGES: ComplaintStatus[] = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];

export const MyComplaintsPage: React.FC = () => {
  const {
    complaints,
    currentUser,
    selectedComplaintId,
    setActiveView,
    addVerification,
    addComment,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentText, setCommentText] = useState('');

  // Selected complaint for detail modal/page
  const activeComplaint = complaints.find((c) => c.id === selectedComplaintId);

  // Filter complaints
  const myComplaints = complaints.filter((c) => {
    // If citizen is logged in, show their complaints, or show all if none found
    const matchesUser =
      !currentUser ||
      c.citizenId === currentUser.id ||
      c.citizenName === currentUser.name ||
      currentUser.role === 'admin';

    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesUser && matchesStatus && matchesSearch;
  });

  const getStageIndex = (status: ComplaintStatus) => {
    return STAGES.indexOf(status);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint || !commentText.trim()) return;
    addComment(activeComplaint.id, commentText);
    setCommentText('');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* If a complaint is selected, show Complaint Detail View */}
        {activeComplaint ? (
          <div className="space-y-6">
            {/* Top Back navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveView('my-complaints')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#687447] hover:text-[#424D2B] bg-white border border-[#E6E5DA] px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Complaints</span>
              </button>

              <div className="text-xs text-[#71717A] flex items-center gap-2">
                <span>Complaint Reference:</span>
                <span className="font-mono font-bold text-[#292D25] bg-[#F6F5EC] px-2.5 py-1 rounded border border-[#E6E5DA]">
                  {activeComplaint.id}
                </span>
              </div>
            </div>

            {/* Main Details Card */}
            <div className="bg-white rounded-2xl border border-[#E6E5DA] p-6 sm:p-8 shadow-xs space-y-8">
              {/* Title & Status Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E5DA]">
                <div>
                  <div className="text-xs font-semibold text-[#687447] uppercase tracking-wider mb-1">
                    {activeComplaint.category} · {activeComplaint.location.ward}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#292D25]">
                    {activeComplaint.title}
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-[#71717A] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#687447]" />
                    <span>{activeComplaint.location.address}</span>
                    <span aria-hidden="true">·</span>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Reported {new Date(activeComplaint.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold ${
                      activeComplaint.status === 'Resolved'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : activeComplaint.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : activeComplaint.status === 'Assigned'
                        ? 'bg-stone-200 text-stone-800 border border-stone-300'
                        : 'bg-orange-100 text-orange-800 border border-orange-200'
                    }`}
                  >
                    Status: {activeComplaint.status}
                  </span>
                </div>
              </div>

              {/* 4-Stage Horizontal Progress Tracker */}
              <div className="bg-[#FAFAF5] p-6 rounded-2xl border border-[#E6E5DA]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-6">
                  Complaint Progress Workflow
                </h3>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-[#E6E5DA] z-0">
                    <div
                      className="h-full bg-[#687447] transition-all duration-500"
                      style={{
                        width: `${(getStageIndex(activeComplaint.status) / (STAGES.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                    {STAGES.map((stage, idx) => {
                      const currentIndex = getStageIndex(activeComplaint.status);
                      const isCompleted = idx <= currentIndex;
                      const isCurrent = idx === currentIndex;

                      return (
                        <div key={stage} className="flex sm:flex-col items-center gap-3 sm:text-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                              isCompleted
                                ? 'bg-[#687447] text-white shadow-xs'
                                : 'bg-white border-2 border-[#E6E5DA] text-[#71717A]'
                            } ${isCurrent ? 'ring-4 ring-[#687447]/20 scale-105' : ''}`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                          </div>
                          <div>
                            <div
                              className={`text-xs font-bold ${
                                isCompleted ? 'text-[#292D25]' : 'text-[#71717A]'
                              }`}
                            >
                              {stage}
                            </div>
                            <div className="text-[10px] text-[#71717A] hidden sm:block">
                              {stage === 'Submitted' && 'Registered'}
                              {stage === 'Assigned' && 'Crew Assigned'}
                              {stage === 'In Progress' && 'Vehicle On-Site'}
                              {stage === 'Resolved' && 'Area Sanitized'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Before and After Visual Inspection */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-3">
                  Photographic Evidence (Before & After)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Original Uploaded Photo */}
                  <div className="rounded-xl border border-[#E6E5DA] overflow-hidden bg-slate-100">
                    <div className="p-2.5 bg-[#F6F5EC] border-b border-[#E6E5DA] flex items-center justify-between text-xs font-semibold text-[#292D25]">
                      <span>Original Reported Photo</span>
                      <span className="text-[#C77B59] font-mono">Before Cleanup</span>
                    </div>
                    <div className="h-64 overflow-hidden">
                      <img
                        src={activeComplaint.images[0]}
                        alt="Garbage reported"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* After-Cleaning Photo */}
                  <div className="rounded-xl border border-[#E6E5DA] overflow-hidden bg-slate-100 flex flex-col justify-between">
                    <div className="p-2.5 bg-[#F6F5EC] border-b border-[#E6E5DA] flex items-center justify-between text-xs font-semibold text-[#292D25]">
                      <span>Municipal Completion Photo</span>
                      <span className="text-[#15803D] font-mono">After Cleanup</span>
                    </div>
                    <div className="h-64 overflow-hidden flex items-center justify-center bg-[#FAFAF5]">
                      {activeComplaint.resolvedImages && activeComplaint.resolvedImages.length > 0 ? (
                        <img
                          src={activeComplaint.resolvedImages[0]}
                          alt="Resolved clean street"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-6 space-y-2 text-[#71717A]">
                          <Clock className="w-8 h-8 mx-auto text-[#687447]" />
                          <div className="text-xs font-semibold text-[#292D25]">
                            Completion photo pending
                          </div>
                          <p className="text-[11px] max-w-xs">
                            Sanitation crew will upload photographic proof once cleaning and compaction are completed.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2-Column Split: Detailed Info & Map */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Assigned Team & Remarks */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#FAFAF5] border border-[#E6E5DA] space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#424D2B]">
                      Assigned Municipal Squad
                    </h4>
                    {activeComplaint.assignedTeam ? (
                      <div className="space-y-1.5 text-xs text-[#292D25]">
                        <div className="flex items-center gap-2 font-bold text-sm text-[#292D25]">
                          <Truck className="w-4 h-4 text-[#687447]" />
                          <span>{activeComplaint.assignedTeam.name}</span>
                        </div>
                        <div>
                          <span className="text-[#71717A]">Supervisor:</span>{' '}
                          <span className="font-medium">{activeComplaint.assignedTeam.supervisor}</span>
                        </div>
                        <div>
                          <span className="text-[#71717A]">Emergency Contact:</span>{' '}
                          <span className="font-mono">{activeComplaint.assignedTeam.contactNumber}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-[#71717A]">
                        Awaiting assignment by Municipal Dispatch officer.
                      </div>
                    )}
                  </div>

                  {/* Municipal Remarks */}
                  {activeComplaint.adminRemarks && (
                    <div className="p-4 rounded-xl bg-[#F6F5EC] border border-[#E6E5DA] space-y-1">
                      <div className="text-xs font-bold text-[#424D2B] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#687447]" />
                        <span>Official Municipal Remarks</span>
                      </div>
                      <p className="text-xs text-[#292D25]/85 italic">
                        "{activeComplaint.adminRemarks}"
                      </p>
                    </div>
                  )}

                  {/* Citizen Verification Action Buttons */}
                  <div className="p-4 rounded-xl bg-white border border-[#E6E5DA] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#292D25]">
                        Community Verification ({activeComplaint.verifications.length})
                      </h4>
                      <span className="text-[11px] text-[#71717A]">Public Ground-Check</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => addVerification(activeComplaint.id, 'cleaning_started')}
                        className="py-2 px-3 rounded-lg text-xs font-semibold bg-[#F6F5EC] hover:bg-[#ECEADF] text-[#424D2B] border border-[#E6E5DA] transition-colors text-center"
                      >
                        ✓ Cleaning Started
                      </button>
                      <button
                        onClick={() => addVerification(activeComplaint.id, 'cleaning_completed')}
                        className="py-2 px-3 rounded-lg text-xs font-semibold bg-green-50 hover:bg-green-100 text-[#15803D] border border-green-200 transition-colors text-center"
                      >
                        ✓ Cleaning Completed
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Map of location */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                    Geotagged Location Map
                  </h4>
                  <LeafletMap
                    complaints={[activeComplaint]}
                    height="240px"
                    center={[activeComplaint.location.lat, activeComplaint.location.lng]}
                    zoom={15}
                  />
                  <div className="text-xs font-mono text-[#71717A] flex items-center justify-between">
                    <span>LAT: {activeComplaint.location.lat.toFixed(5)}</span>
                    <span>LNG: {activeComplaint.location.lng.toFixed(5)}</span>
                  </div>
                </div>
              </div>

              {/* Status Timeline History */}
              <div className="pt-6 border-t border-[#E6E5DA]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-4">
                  Audit History & Timestamps
                </h3>
                <div className="space-y-3">
                  {activeComplaint.statusHistory.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#FAFAF5] border border-[#E6E5DA] flex items-start justify-between text-xs gap-4"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#292D25]">{step.status}</span>
                          <span aria-hidden="true" className="text-[#71717A]">·</span>
                          <span className="text-[#71717A]">By {step.updatedBy}</span>
                        </div>
                        {step.remarks && (
                          <div className="text-[#292D25]/75 text-[11px]">{step.remarks}</div>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-[#71717A] shrink-0">
                        {new Date(step.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citizen Comments & Updates Thread */}
              <div className="pt-6 border-t border-[#E6E5DA] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#687447]" />
                  <span>Citizen Updates & Discussion ({activeComplaint.comments.length})</span>
                </h3>

                {activeComplaint.comments.length > 0 && (
                  <div className="space-y-2.5">
                    {activeComplaint.comments.map((comm) => (
                      <div
                        key={comm.id}
                        className="p-3 rounded-xl bg-[#FAFAF5] border border-[#E6E5DA] text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#292D25]">
                            {comm.userName}{' '}
                            {comm.userRole === 'admin' && (
                              <span className="text-[10px] text-white bg-[#424D2B] px-1.5 py-0.5 rounded font-normal ml-1">
                                Sanitation Officer
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] font-mono text-[#71717A]">
                            {new Date(comm.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-[#292D25]/80">{comm.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a citizen note (e.g. 'Truck arrived 10 min ago')..."
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Post</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          /* Complaints List / Grid View */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-[#687447] uppercase tracking-wider mb-1">
                  Citizen Tracker
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#292D25]">
                  Track My Complaints
                </h1>
                <p className="text-xs sm:text-sm text-[#292D25]/75">
                  View progress timelines and municipal action on all your reported sanitation issues.
                </p>
              </div>

              <button
                onClick={() => setActiveView('report')}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Report Another Issue</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl border border-[#E6E5DA] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Segmented status buttons */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {['all', 'Submitted', 'Assigned', 'In Progress', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      filterStatus === st
                        ? 'bg-[#687447] text-white shadow-xs font-semibold'
                        : 'bg-[#F6F5EC] text-[#292D25] hover:bg-[#ECEADF]'
                    }`}
                  >
                    {st === 'all' ? 'All Complaints' : st}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID, street or category..."
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFAF5] border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                />
              </div>
            </div>

            {/* Complaints Cards Grid */}
            {myComplaints.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E6E5DA] p-12 text-center space-y-3">
                <AlertTriangle className="w-10 h-10 mx-auto text-[#C77B59]" />
                <h3 className="text-base font-bold text-[#292D25]">No complaints found</h3>
                <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                  No reports matched your current filter criteria. You can submit a new report or clear filters.
                </p>
                <button
                  onClick={() => {
                    setFilterStatus('all');
                    setSearchQuery('');
                  }}
                  className="text-xs font-semibold text-[#687447] hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myComplaints.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#E6E5DA] overflow-hidden shadow-xs hover:border-[#687447] transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Photo Header */}
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-mono font-bold text-[#687447] border border-[#E6E5DA]">
                          {item.id}
                        </div>
                        <div
                          className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold ${
                            item.status === 'Resolved'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'In Progress'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-800'
                          }`}
                        >
                          {item.status}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        <div className="text-xs text-[#71717A] flex items-center gap-2">
                          <span>{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.location.ward}</span>
                        </div>

                        <h3 className="text-sm font-bold text-[#292D25] line-clamp-2 leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs text-[#71717A] line-clamp-2">
                          {item.description}
                        </p>

                        <div className="text-xs text-[#71717A] flex items-center gap-1.5 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#687447] shrink-0" />
                          <span className="truncate">{item.location.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 pt-3 border-t border-[#E6E5DA] flex items-center justify-between text-xs">
                      <span className="text-[#71717A] font-mono">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setActiveView('complaint-detail', item.id)}
                        className="px-3 py-1.5 font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-lg transition-colors cursor-pointer"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
