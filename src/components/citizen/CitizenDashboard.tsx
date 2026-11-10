import React from 'react';
import { useApp } from '../../context/AppContext';
import { LeafletMap } from '../common/LeafletMap';
import {
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  MapPin,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { currentUser, complaints, setActiveView } = useApp();

  // Filter complaints by citizen (or show sample if none yet)
  const myComplaints = complaints.filter(
    (c) => c.citizenId === currentUser?.id || c.citizenName === currentUser?.name
  );

  const totalMyComplaints = myComplaints.length;
  const pendingCount = myComplaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Assigned'
  ).length;
  const inProgressCount = myComplaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = myComplaints.filter((c) => c.status === 'Resolved').length;

  const communityLatest = complaints.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAFAF5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl border border-[#E6E5DA] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#F6F5EC] text-xs font-semibold text-[#424D2B]">
              <span>Citizen Portal</span>
              <span aria-hidden="true">·</span>
              <span>{currentUser?.ward || 'Ward 3 – West Central'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#292D25]">
              Welcome back, {currentUser?.name || 'Citizen'}
            </h1>
            <p className="text-xs sm:text-sm text-[#292D25]/75">
              Track your sanitation submissions, verify nearby street cleanup, and collaborate with your neighborhood.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('report')}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report New Garbage</span>
            </button>
            <button
              onClick={() => setActiveView('community')}
              className="px-4 py-2.5 text-xs font-semibold text-[#292D25] bg-[#F6F5EC] hover:bg-[#ECEADF] border border-[#E6E5DA] rounded-xl transition-colors cursor-pointer"
            >
              Community Feed
            </button>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-[#E6E5DA] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#71717A]">My Total Reports</span>
              <div className="w-8 h-8 rounded-lg bg-[#F6F5EC] flex items-center justify-center text-[#687447]">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#292D25] font-mono tabular-nums mt-3">
              {totalMyComplaints}
            </div>
            <div className="text-[11px] text-[#687447] mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>All Logged Geotagged Issues</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E6E5DA] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#71717A]">Pending Complaints</span>
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#C77B59] font-mono tabular-nums mt-3">
              {pendingCount}
            </div>
            <div className="text-[11px] text-[#71717A] mt-1">Awaiting Fleet Dispatch</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E6E5DA] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#71717A]">Cleaning In Progress</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-800 font-mono tabular-nums mt-3">
              {inProgressCount}
            </div>
            <div className="text-[11px] text-amber-700 mt-1">Sanitation Squad Active</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E6E5DA] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#71717A]">Successfully Resolved</span>
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#15803D]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#15803D] font-mono tabular-nums mt-3">
              {resolvedCount}
            </div>
            <div className="text-[11px] text-[#15803D] mt-1">Inspected & Verified</div>
          </div>
        </div>

        {/* 2-Column Split: My Recent Submissions & Nearby Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: My Recent Complaints */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#292D25]">My Complaints</h3>
                <p className="text-xs text-[#71717A]">Your recently submitted sanitation reports</p>
              </div>
              <button
                onClick={() => setActiveView('my-complaints')}
                className="text-xs font-semibold text-[#687447] hover:underline flex items-center gap-1"
              >
                <span>View All ({totalMyComplaints})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myComplaints.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#E6E5DA] space-y-3">
                <p className="text-xs text-[#71717A]">You haven't submitted any complaints yet.</p>
                <button
                  onClick={() => setActiveView('report')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#687447] rounded-lg"
                >
                  Report First Issue
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myComplaints.slice(0, 3).map((complaint) => (
                  <div
                    key={complaint.id}
                    onClick={() => setActiveView('complaint-detail', complaint.id)}
                    className="p-4 rounded-xl bg-white border border-[#E6E5DA] hover:border-[#687447] transition-all shadow-xs cursor-pointer flex items-center gap-4 group"
                  >
                    <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-[#E6E5DA]">
                      <img
                        src={complaint.images[0]}
                        alt={complaint.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[11px] text-[#71717A] mb-1">
                        <span className="font-mono font-bold text-[#687447]">{complaint.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{complaint.category}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#292D25] truncate group-hover:text-[#687447] transition-colors">
                        {complaint.title}
                      </h4>
                      <div className="text-[11px] text-[#71717A] flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-[#687447] shrink-0" />
                        <span className="truncate">{complaint.location.address}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          complaint.status === 'Resolved'
                            ? 'bg-green-100 text-green-800'
                            : complaint.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {complaint.status}
                      </span>
                      <div className="text-[10px] text-[#71717A] mt-1">
                        {complaint.verifications.length} Verifications
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Mini Interactive Map */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#292D25]">Nearby Garbage Locations</h3>
                <p className="text-xs text-[#71717A]">Reports in your municipal district</p>
              </div>
              <button
                onClick={() => setActiveView('community')}
                className="text-xs font-semibold text-[#687447] hover:underline"
              >
                Expand Feed
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E6E5DA] p-3 shadow-xs">
              <LeafletMap
                complaints={complaints}
                height="280px"
                onSelectComplaint={(id) => setActiveView('complaint-detail', id)}
              />
              <div className="pt-3 px-2 flex items-center justify-between text-[11px] text-[#71717A]">
                <span>Pins update in real time with municipal status.</span>
                <span className="font-semibold text-[#687447]">Ward 1–4 Network</span>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Community Reports Preview */}
        <div className="bg-white rounded-2xl border border-[#E6E5DA] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#292D25]">Community Transparency Stream</h3>
              <p className="text-xs text-[#71717A]">
                Inspect reports from fellow citizens and add your verification vote
              </p>
            </div>
            <button
              onClick={() => setActiveView('community')}
              className="text-xs font-semibold text-[#687447] hover:underline flex items-center gap-1"
            >
              <span>Explore All Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communityLatest.map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveView('complaint-detail', c.id)}
                className="p-4 rounded-xl bg-[#FAFAF5] border border-[#E6E5DA] hover:border-[#687447] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-[#687447]">{c.id}</span>
                    <span className="text-[11px] font-semibold text-[#424D2B] bg-[#F6F5EC] px-2 py-0.5 rounded">
                      {c.status}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-[#292D25] line-clamp-1">{c.title}</h5>
                  <p className="text-[11px] text-[#71717A] mt-1 line-clamp-2">{c.description}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E6E5DA] flex items-center justify-between text-[11px] text-[#71717A]">
                  <span>By {c.citizenName}</span>
                  <span className="font-semibold text-[#687447]">
                    {c.verifications.length} Verifications
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
