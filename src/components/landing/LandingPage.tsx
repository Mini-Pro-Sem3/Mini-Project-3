import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { LeafletMap } from '../common/LeafletMap';

export const LandingPage: React.FC = () => {
  const { complaints, setActiveView } = useApp();

  // Statistics calculation
  const totalComplaints = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const assignedCount = complaints.filter((c) => c.status === 'Assigned').length;
  const activeCount = complaints.filter((c) => c.status !== 'Resolved').length;
  const areasCovered = Array.from(new Set(complaints.map((c) => c.location.ward))).length || 4;

  const recentComplaints = complaints.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-[#E6E5DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F6F5EC] border border-[#E6E5DA] text-xs font-semibold text-[#424D2B]">
                <ShieldCheck className="w-4 h-4 text-[#687447]" />
                <span>Official Municipal Sanitation & Citizen Oversight Network</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#292D25] leading-[1.1] text-balance">
                Cleaner Streets <br />
                <span className="text-[#687447]">Start With Us.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#292D25]/80 max-w-xl leading-relaxed">
                Report uncollected garbage, track sanitation progress and work together to build
                cleaner, healthier communities. Connect directly with municipal cleanup squads in real-time.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveView('report')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Report an Issue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveView('community')}
                  className="px-6 py-3.5 text-sm font-semibold text-[#292D25] bg-[#F6F5EC] hover:bg-[#ECEADF] border border-[#E6E5DA] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Community Reports</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-4 flex items-center gap-6 text-xs text-[#71717A]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#687447]" />
                  <span>Geotagged Photo Verification</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#687447]" />
                  <span>Transparent Public Timelines</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Graphic */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl p-4 bg-[#F6F5EC] border border-[#E6E5DA] shadow-xs">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E6E5DA]/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#687447]" />
                    <span className="text-xs font-bold text-[#292D25]">Citywide Collection Feed</span>
                  </div>
                  <span className="text-xs font-mono text-[#687447] font-semibold">Active Dispatch</span>
                </div>

                {/* Hero Illustration / Clean Neighborhood Showcase */}
                <div className="mt-3 relative rounded-xl overflow-hidden bg-white border border-[#E6E5DA] p-4">
                  <div className="w-full h-48 bg-gradient-to-b from-[#E6E5DA]/40 to-[#F6F5EC] rounded-lg p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-semibold text-[#424D2B] border border-[#E6E5DA]">
                        Ward 3 & 4 Sanitation Sector
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#15803D] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                        <Sparkles className="w-3 h-3" />
                        <span>Compactor On-Site</span>
                      </div>
                    </div>

                    {/* Stylized Street Scene */}
                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-lg border border-[#E6E5DA] shadow-xs flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#687447]/15 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-[#687447]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-[#292D25] truncate">
                            Mission Parkway Pedestrian Route
                          </div>
                          <div className="text-[11px] text-[#71717A] flex items-center gap-2">
                            <span>Status: Resolved</span>
                            <span>·</span>
                            <span>3 Citizen Confirmations</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-[#FAFAF5] rounded-lg border border-[#E6E5DA]/80 flex items-center justify-between text-xs text-[#292D25]">
                        <span className="text-slate-600">Average Cleanup Dispatch:</span>
                        <span className="font-mono font-bold text-[#424D2B]">3.4 Hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action bar */}
                <div className="mt-3 pt-2 flex items-center justify-between text-xs text-[#71717A]">
                  <span>Municipal Fleet Coverage: 4 Wards</span>
                  <button
                    onClick={() => setActiveView('community')}
                    className="font-semibold text-[#687447] hover:underline flex items-center gap-1"
                  >
                    <span>View Map</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="py-14 bg-white border-b border-[#E6E5DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#687447] mb-1">
              Public Accountability Metrics
            </h2>
            <p className="text-2xl font-bold text-[#292D25]">
              Real Impact Measured by Neighborhood Data
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#FAFAF5] border border-[#E6E5DA] text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#292D25] font-mono tabular-nums">
                {totalComplaints + 128}
              </div>
              <div className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mt-1">
                Total Complaints Reported
              </div>
              <div className="text-[11px] text-[#687447] font-medium mt-2">
                100% Geotagged & Logged
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#FAFAF5] border border-[#E6E5DA] text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#15803D] font-mono tabular-nums">
                {resolvedCount + 104}
              </div>
              <div className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mt-1">
                Issues Resolved
              </div>
              <div className="text-[11px] text-[#15803D] font-medium mt-2">
                Verified with After-Photos
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#FAFAF5] border border-[#E6E5DA] text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#687447] font-mono tabular-nums">
                {areasCovered}
              </div>
              <div className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mt-1">
                Wards Covered
              </div>
              <div className="text-[11px] text-[#71717A] font-medium mt-2">
                Across 24 Neighborhoods
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#FAFAF5] border border-[#E6E5DA] text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#C77B59] font-mono tabular-nums">
                {activeCount + 24}
              </div>
              <div className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mt-1">
                Active Reports
              </div>
              <div className="text-[11px] text-[#C77B59] font-medium mt-2">
                {inProgressCount + assignedCount} Assigned / En Route
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#F6F5EC]/50 border-b border-[#E6E5DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#687447] mb-2">
              Simple 4-Step Process
            </h2>
            <h3 className="text-3xl font-bold text-[#292D25]">
              How CivicClean Keeps Our City Clean
            </h3>
            <p className="text-sm text-[#292D25]/75 mt-2">
              From identification to final citizen sign-off, every step is transparent and tracked.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-white border border-[#E6E5DA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F6F5EC] border border-[#E6E5DA] flex items-center justify-center text-[#687447] mb-4">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-[#687447] tracking-wider mb-1">STEP 01</div>
                <h4 className="text-lg font-bold text-[#292D25] mb-2">Spot the Garbage</h4>
                <p className="text-xs text-[#292D25]/75 leading-relaxed">
                  Notice overflowing bins, roadside piles, or illegal construction dumping anywhere in your neighborhood.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-white border border-[#E6E5DA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F6F5EC] border border-[#E6E5DA] flex items-center justify-center text-[#687447] mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-[#687447] tracking-wider mb-1">STEP 02</div>
                <h4 className="text-lg font-bold text-[#292D25] mb-2">Upload Photo & GPS</h4>
                <p className="text-xs text-[#292D25]/75 leading-relaxed">
                  Snap a photo on your smartphone. Browser GPS pins the exact coordinates on the city map instantly.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-white border border-[#E6E5DA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F6F5EC] border border-[#E6E5DA] flex items-center justify-center text-[#687447] mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-[#687447] tracking-wider mb-1">STEP 03</div>
                <h4 className="text-lg font-bold text-[#292D25] mb-2">Track Cleaning Progress</h4>
                <p className="text-xs text-[#292D25]/75 leading-relaxed">
                  Watch municipal dispatchers assign the sanitation squad and see real-time updates as workers arrive.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-white border border-[#E6E5DA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F6F5EC] border border-[#E6E5DA] flex items-center justify-center text-[#15803D] mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-[#15803D] tracking-wider mb-1">STEP 04</div>
                <h4 className="text-lg font-bold text-[#292D25] mb-2">Verify Completed Work</h4>
                <p className="text-xs text-[#292D25]/75 leading-relaxed">
                  Inspect after-cleaning photos and confirm via community vote that the area is spotless and sanitized.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Reports Preview Section */}
      <section className="py-20 bg-white border-b border-[#E6E5DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#687447] mb-1">
                Transparency in Action
              </h2>
              <h3 className="text-3xl font-bold text-[#292D25]">
                Recent Sanitation Reports
              </h3>
              <p className="text-sm text-[#292D25]/75 mt-1">
                Check active and resolved complaints submitted by fellow citizens across the municipality.
              </p>
            </div>
            <button
              onClick={() => setActiveView('community')}
              className="text-xs font-bold text-[#687447] hover:text-[#424D2B] flex items-center gap-1 shrink-0"
            >
              <span>Explore All Reports</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="rounded-2xl border border-[#E6E5DA] bg-[#FAFAF5] overflow-hidden shadow-xs hover:border-[#687447] transition-all flex flex-col"
              >
                {/* Photo Preview */}
                <div className="relative h-44 bg-slate-200 overflow-hidden">
                  <img
                    src={complaint.images[0]}
                    alt={complaint.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-mono font-bold text-[#687447] border border-[#E6E5DA]">
                    {complaint.id}
                  </div>
                  <div
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-semibold ${
                      complaint.status === 'Resolved'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : complaint.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-stone-100 text-stone-800 border border-stone-200'
                    }`}
                  >
                    {complaint.status}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-xs text-[#71717A] flex items-center gap-2">
                      <span>{complaint.location.ward}</span>
                      <span aria-hidden="true">·</span>
                      <span>{complaint.category}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#292D25] line-clamp-2 leading-snug">
                      {complaint.title}
                    </h4>

                    <div className="text-xs text-[#71717A] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[#687447]" />
                      <span className="truncate">{complaint.location.address}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E6E5DA] flex items-center justify-between text-xs">
                    <span className="text-[#71717A]">
                      {complaint.verifications.length} Community Verifications
                    </span>
                    <button
                      onClick={() => setActiveView('complaint-detail', complaint.id)}
                      className="font-semibold text-[#687447] hover:underline"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Preview Section */}
      <section className="py-16 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-[#E6E5DA] p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#292D25]">
                  City Sanitation Activity Map
                </h3>
                <p className="text-xs text-[#71717A]">
                  Click on any marker to inspect real-time municipal response and community verifications.
                </p>
              </div>
              <button
                onClick={() => setActiveView('report')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Submit Report Near You</span>
              </button>
            </div>

            <LeafletMap
              complaints={complaints}
              height="400px"
              onSelectComplaint={(id) => setActiveView('complaint-detail', id)}
            />
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-[#424D2B] text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F6F5EC]">
            Together, We Create Cleaner Communities.
          </h2>
          <p className="text-sm sm:text-base text-[#F6F5EC]/80 max-w-2xl mx-auto">
            Take 30 seconds to report garbage on your street. Join hundreds of active civic
            reporters helping sanitation squads clear urban hotspots every single day.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveView('report')}
              className="px-6 py-3 text-sm font-semibold text-[#424D2B] bg-[#F6F5EC] hover:bg-white rounded-xl shadow-xs transition-colors"
            >
              Report Garbage Now
            </button>
            <button
              onClick={() => setActiveView('community')}
              className="px-6 py-3 text-sm font-semibold text-white bg-[#687447] hover:bg-[#57623a] border border-[#A8B89A]/40 rounded-xl transition-colors"
            >
              Browse Community Feed
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
