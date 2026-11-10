import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint, ComplaintStatus } from '../../types';
import { SAMPLE_IMAGES } from '../../data/imagePresets';
import { LeafletMap } from '../common/LeafletMap';
import {
  LayoutDashboard,
  ClipboardList,
  Map,
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  Search,
  Sparkles,
  BarChart3,
  LogOut,
  X,
  FileCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    complaints,
    teams,
    currentUser,
    adminSubView,
    setAdminSubView,
    adminUpdateStatus,
    adminAssignTeam,
    logout,
    setActiveView,
  } = useApp();

  // Search & table filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [wardFilter, setWardFilter] = useState<string>('all');

  // Modals
  const [assigningComplaint, setAssigningComplaint] = useState<Complaint | null>(null);
  const [updatingComplaint, setUpdatingComplaint] = useState<Complaint | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('In Progress');
  const [officialRemarks, setOfficialRemarks] = useState('');
  const [resolutionPhoto, setResolutionPhoto] = useState<string>(SAMPLE_IMAGES.resolvedCleanStreet);

  // Stats calculation
  const totalCount = complaints.length;
  const newCount = complaints.filter((c) => c.status === 'Submitted').length;
  const assignedCount = complaints.filter((c) => c.status === 'Assigned').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const resolutionRate =
    totalCount > 0 ? ((resolvedCount / totalCount) * 100).toFixed(1) : '0';

  // Filter complaints for table
  const filteredComplaints = complaints.filter((c) => {
    // subview specific restrictions
    if (adminSubView === 'in-progress' && c.status !== 'In Progress') return false;
    if (adminSubView === 'resolved' && c.status !== 'Resolved') return false;
    if (adminSubView === 'verifications' && c.verifications.length === 0) return false;

    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesWard = wardFilter === 'all' || c.location.ward === wardFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesWard;
  });

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningComplaint || !selectedTeamId) return;
    adminAssignTeam(assigningComplaint.id, selectedTeamId, officialRemarks);
    setAssigningComplaint(null);
    setSelectedTeamId('');
    setOfficialRemarks('');
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingComplaint) return;
    adminUpdateStatus(
      updatingComplaint.id,
      targetStatus,
      officialRemarks,
      targetStatus === 'Resolved' ? resolutionPhoto : undefined
    );
    setUpdatingComplaint(null);
    setOfficialRemarks('');
  };

  // Hotspot analysis groupings
  const wardMetrics = [
    { ward: 'Ward 1 – Downtown Central', count: complaints.filter((c) => c.location.ward === 'Ward 1').length, resolved: complaints.filter((c) => c.location.ward === 'Ward 1' && c.status === 'Resolved').length },
    { ward: 'Ward 2 – West End', count: complaints.filter((c) => c.location.ward === 'Ward 2').length, resolved: complaints.filter((c) => c.location.ward === 'Ward 2' && c.status === 'Resolved').length },
    { ward: 'Ward 3 – West Central', count: complaints.filter((c) => c.location.ward === 'Ward 3').length, resolved: complaints.filter((c) => c.location.ward === 'Ward 3' && c.status === 'Resolved').length },
    { ward: 'Ward 4 – Eastside Riverside', count: complaints.filter((c) => c.location.ward === 'Ward 4').length, resolved: complaints.filter((c) => c.location.ward === 'Ward 4' && c.status === 'Resolved').length },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E6E5DA] flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-5 border-b border-[#E6E5DA]">
            <div className="text-[10px] font-bold text-[#687447] tracking-wider uppercase">
              Sanitation Authority Console
            </div>
            <div className="text-sm font-bold text-[#292D25] truncate">
              {currentUser?.name || 'Officer Marcus Vance'}
            </div>
            <div className="text-xs text-[#71717A] truncate">
              {currentUser?.department || 'Municipal Resource Recovery'}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-medium">
            <button
              onClick={() => setAdminSubView('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSubView === 'overview'
                  ? 'bg-[#687447] text-white font-semibold shadow-xs'
                  : 'text-[#292D25] hover:bg-[#F6F5EC]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setAdminSubView('all-complaints')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSubView === 'all-complaints'
                  ? 'bg-[#687447] text-white font-semibold shadow-xs'
                  : 'text-[#292D25] hover:bg-[#F6F5EC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="w-4 h-4" />
                <span>All Complaints</span>
              </div>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                  adminSubView === 'all-complaints'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#F6F5EC] text-[#292D25]'
                }`}
              >
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => setAdminSubView('map-view')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSubView === 'map-view'
                  ? 'bg-[#687447] text-white font-semibold shadow-xs'
                  : 'text-[#292D25] hover:bg-[#F6F5EC]'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Live Map View</span>
            </button>

            <button
              onClick={() => setAdminSubView('teams')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSubView === 'teams'
                  ? 'bg-[#687447] text-white font-semibold shadow-xs'
                  : 'text-[#292D25] hover:bg-[#F6F5EC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Cleaning Teams</span>
              </div>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                  adminSubView === 'teams'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#F6F5EC] text-[#292D25]'
                }`}
              >
                {teams.length}
              </span>
            </button>

            <button
              onClick={() => setAdminSubView('in-progress')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSubView === 'in-progress'
                  ? 'bg-[#687447] text-white font-semibold shadow-xs'
                  : 'text-[#292D25] hover:bg-[#F6F5EC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4" />
                <span>In Progress</span>
              </div>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                  adminSubView === 'in-progress'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#F6F5EC] text-[#292D25]'
                }`}
              >
                {inProgressCount}
              </span>
            </button>

            <button
              onClick={() => setAdminSubView('resolved')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSubView === 'resolved'
                  ? 'bg-[#687447] text-white font-semibold shadow-xs'
                  : 'text-[#292D25] hover:bg-[#F6F5EC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Resolved Complaints</span>
              </div>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                  adminSubView === 'resolved'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#F6F5EC] text-[#292D25]'
                }`}
              >
                {resolvedCount}
              </span>
            </button>

            <button
              onClick={() => setAdminSubView('verifications')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSubView === 'verifications'
                  ? 'bg-[#687447] text-white font-semibold shadow-xs'
                  : 'text-[#292D25] hover:bg-[#F6F5EC]'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Citizen Verifications</span>
            </button>

            <button
              onClick={() => setAdminSubView('hotspots')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSubView === 'hotspots'
                  ? 'bg-[#687447] text-white font-semibold shadow-xs'
                  : 'text-[#292D25] hover:bg-[#F6F5EC]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Hotspot Analytics</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#E6E5DA] space-y-2">
          <button
            onClick={() => setActiveView('landing')}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-[#687447] hover:underline"
          >
            ← Public Website
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#C77B59] hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
        {/* SubView: Overview */}
        {adminSubView === 'overview' && (
          <div className="space-y-8">
            {/* Top Bar Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#292D25]">
                  Municipal Sanitation Overview
                </h1>
                <p className="text-xs sm:text-sm text-[#71717A]">
                  Real-time municipal dispatch, fleet allocation and citizen verification metrics.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAdminSubView('map-view')}
                  className="px-3.5 py-2 text-xs font-semibold text-[#292D25] bg-white border border-[#E6E5DA] rounded-lg hover:border-[#687447]"
                >
                  Inspect City Map
                </button>
                <button
                  onClick={() => setAdminSubView('all-complaints')}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-lg shadow-xs"
                >
                  Manage All Complaints
                </button>
              </div>
            </div>

            {/* 6 Metric KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-xl bg-white border border-[#E6E5DA] shadow-xs">
                <span className="text-[11px] font-semibold text-[#71717A] uppercase">Total</span>
                <div className="text-2xl font-bold text-[#292D25] font-mono tabular-nums mt-1">
                  {totalCount}
                </div>
                <span className="text-[10px] text-[#71717A]">Reported issues</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E6E5DA] shadow-xs">
                <span className="text-[11px] font-semibold text-[#C77B59] uppercase">New / Unassigned</span>
                <div className="text-2xl font-bold text-[#C77B59] font-mono tabular-nums mt-1">
                  {newCount}
                </div>
                <span className="text-[10px] text-[#C77B59]">Requires team</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E6E5DA] shadow-xs">
                <span className="text-[11px] font-semibold text-[#687447] uppercase">Assigned</span>
                <div className="text-2xl font-bold text-[#687447] font-mono tabular-nums mt-1">
                  {assignedCount}
                </div>
                <span className="text-[10px] text-[#71717A]">Crew notified</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E6E5DA] shadow-xs">
                <span className="text-[11px] font-semibold text-amber-700 uppercase">In Progress</span>
                <div className="text-2xl font-bold text-amber-800 font-mono tabular-nums mt-1">
                  {inProgressCount}
                </div>
                <span className="text-[10px] text-amber-700">Vehicle on-site</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E6E5DA] shadow-xs">
                <span className="text-[11px] font-semibold text-[#15803D] uppercase">Resolved</span>
                <div className="text-2xl font-bold text-[#15803D] font-mono tabular-nums mt-1">
                  {resolvedCount}
                </div>
                <span className="text-[10px] text-[#15803D]">Cleaned & closed</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E6E5DA] shadow-xs">
                <span className="text-[11px] font-semibold text-[#424D2B] uppercase">Resolution Rate</span>
                <div className="text-2xl font-bold text-[#424D2B] font-mono tabular-nums mt-1">
                  {resolutionRate}%
                </div>
                <span className="text-[10px] text-[#687447] font-medium flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>Target: 70%+</span>
                </span>
              </div>
            </div>

            {/* Quick Map Preview in Overview */}
            <div className="bg-white rounded-2xl border border-[#E6E5DA] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#292D25]">Citywide Sanitation Heatmap</h3>
                  <p className="text-xs text-[#71717A]">
                    Geotagged locations color-coded by current cleaning status
                  </p>
                </div>
                <button
                  onClick={() => setAdminSubView('map-view')}
                  className="text-xs font-semibold text-[#687447] hover:underline"
                >
                  Expand Full Map →
                </button>
              </div>
              <LeafletMap
                complaints={complaints}
                height="320px"
                onSelectComplaint={(id) => {
                  const target = complaints.find((c) => c.id === id);
                  if (target) setUpdatingComplaint(target);
                }}
              />
            </div>

            {/* Quick Action Queue (New Unassigned Complaints) */}
            <div className="bg-white rounded-2xl border border-[#E6E5DA] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#292D25]">
                  High Priority Triage Queue ({newCount} New Reports)
                </h3>
                <button
                  onClick={() => setAdminSubView('all-complaints')}
                  className="text-xs font-semibold text-[#687447] hover:underline"
                >
                  View Table
                </button>
              </div>

              {newCount === 0 ? (
                <div className="p-6 text-center text-xs text-[#71717A] bg-[#FAFAF5] rounded-xl border border-[#E6E5DA]">
                  All submitted complaints have been assigned to cleaning teams.
                </div>
              ) : (
                <div className="space-y-3">
                  {complaints
                    .filter((c) => c.status === 'Submitted')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-[#FAFAF5] border border-[#E6E5DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-12 h-12 rounded-lg object-cover border border-[#E6E5DA] shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-[11px] text-[#71717A]">
                              <span className="font-mono font-bold text-[#687447]">{item.id}</span>
                              <span aria-hidden="true">·</span>
                              <span>{item.category}</span>
                              <span aria-hidden="true">·</span>
                              <span>{item.location.ward}</span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-[#292D25] truncate">
                              {item.title}
                            </h4>
                            <div className="text-[11px] text-[#71717A] truncate">
                              {item.location.address}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setAssigningComplaint(item);
                              setSelectedTeamId(teams[0].id);
                            }}
                            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-lg transition-colors cursor-pointer"
                          >
                            Assign Crew →
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SubView: All Complaints / In Progress / Resolved Table */}
        {(adminSubView === 'all-complaints' ||
          adminSubView === 'in-progress' ||
          adminSubView === 'resolved' ||
          adminSubView === 'verifications') && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#292D25]">
                {adminSubView === 'in-progress'
                  ? 'Complaints Currently In Progress'
                  : adminSubView === 'resolved'
                  ? 'Resolved Complaints Archive'
                  : adminSubView === 'verifications'
                  ? 'Citizen Verified Sanitation Records'
                  : 'All Sanitation Complaints Management'}
              </h1>
              <p className="text-xs sm:text-sm text-[#71717A]">
                Filter, dispatch teams, update status and review photographic evidence.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl border border-[#E6E5DA] p-4 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="relative sm:col-span-1">
                <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID, title or citizen..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFAF5] border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                />
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFAF5] border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Submitted">Submitted (New)</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFAF5] border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                >
                  <option value="all">All Categories</option>
                  <option value="Overflowing dustbin">Overflowing dustbin</option>
                  <option value="Roadside garbage">Roadside garbage</option>
                  <option value="Uncollected household waste">Uncollected household waste</option>
                  <option value="Construction waste">Construction waste</option>
                  <option value="Illegal dumping">Illegal dumping</option>
                </select>
              </div>

              <div>
                <select
                  value={wardFilter}
                  onChange={(e) => setWardFilter(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFAF5] border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                >
                  <option value="all">All Wards</option>
                  <option value="Ward 1">Ward 1 – Downtown Central</option>
                  <option value="Ward 2">Ward 2 – West End</option>
                  <option value="Ward 3">Ward 3 – West Central</option>
                  <option value="Ward 4">Ward 4 – Eastside Riverside</option>
                </select>
              </div>
            </div>

            {/* Complaints Data Table */}
            <div className="bg-white rounded-2xl border border-[#E6E5DA] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F6F5EC] border-b border-[#E6E5DA] text-[#424D2B] font-bold">
                    <tr>
                      <th className="px-4 py-3">ID & Photo</th>
                      <th className="px-4 py-3">Citizen & Title</th>
                      <th className="px-4 py-3">Location & Ward</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Assigned Team</th>
                      <th className="px-4 py-3">Citizen Verifications</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E5DA]">
                    {filteredComplaints.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-[#71717A]">
                          No complaints match your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredComplaints.map((c) => (
                        <tr key={c.id} className="hover:bg-[#FAFAF5] transition-colors">
                          {/* ID & Photo */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={c.images[0]}
                                alt={c.id}
                                className="w-10 h-10 rounded-lg object-cover border border-[#E6E5DA] shrink-0"
                              />
                              <div>
                                <span className="font-mono font-bold text-[#687447] block">
                                  {c.id}
                                </span>
                                <span className="text-[10px] text-[#71717A] font-mono">
                                  {new Date(c.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Citizen & Title */}
                          <td className="px-4 py-3 max-w-xs">
                            <div className="font-bold text-[#292D25] truncate">{c.title}</div>
                            <div className="text-[11px] text-[#71717A]">
                              By {c.citizenName} {c.citizenPhone && `(${c.citizenPhone})`}
                            </div>
                          </td>

                          {/* Location & Ward */}
                          <td className="px-4 py-3 max-w-xs">
                            <div className="font-semibold text-[#292D25] truncate">
                              {c.location.address}
                            </div>
                            <div className="text-[11px] text-[#687447]">{c.location.ward}</div>
                          </td>

                          {/* Category */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-[#292D25] font-medium">{c.category}</span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                                c.status === 'Resolved'
                                  ? 'bg-green-100 text-green-800'
                                  : c.status === 'In Progress'
                                  ? 'bg-amber-100 text-amber-800'
                                  : c.status === 'Assigned'
                                  ? 'bg-stone-200 text-stone-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>

                          {/* Assigned Team */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {c.assignedTeam ? (
                              <div>
                                <div className="font-semibold text-[#292D25]">
                                  {c.assignedTeam.name}
                                </div>
                                <div className="text-[10px] text-[#71717A]">
                                  Lead: {c.assignedTeam.supervisor}
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setAssigningComplaint(c);
                                  setSelectedTeamId(teams[0].id);
                                }}
                                className="text-xs font-semibold text-[#C77B59] hover:underline"
                              >
                                + Assign Team
                              </button>
                            )}
                          </td>

                          {/* Citizen Verifications */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="font-mono font-bold text-[#292D25]">
                              {c.verifications.length} Votes
                            </div>
                            <div className="text-[10px] text-[#71717A]">
                              {c.verifications.filter((v) => v.type === 'cleaning_started').length}{' '}
                              started ·{' '}
                              {
                                c.verifications.filter((v) => v.type === 'cleaning_completed')
                                  .length
                              }{' '}
                              done
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setUpdatingComplaint(c);
                                  setTargetStatus(c.status);
                                  setOfficialRemarks(c.adminRemarks || '');
                                }}
                                className="px-2.5 py-1 text-xs font-semibold text-[#424D2B] bg-[#F6F5EC] hover:bg-[#ECEADF] rounded-md border border-[#E6E5DA] transition-colors"
                              >
                                Update Status
                              </button>

                              <button
                                onClick={() => setActiveView('complaint-detail', c.id)}
                                className="px-2.5 py-1 text-xs font-semibold text-[#687447] hover:underline"
                              >
                                Details →
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SubView: Full Map View */}
        {adminSubView === 'map-view' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#292D25]">
                Interactive Municipal Map Monitoring
              </h1>
              <p className="text-xs sm:text-sm text-[#71717A]">
                Click on any pin to view complaint details, citizen verification counts and fast status dispatch.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E6E5DA] p-4 shadow-xs">
              <LeafletMap
                complaints={complaints}
                height="580px"
                onSelectComplaint={(id) => {
                  const target = complaints.find((c) => c.id === id);
                  if (target) setUpdatingComplaint(target);
                }}
              />
            </div>
          </div>
        )}

        {/* SubView: Cleaning Teams */}
        {adminSubView === 'teams' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#292D25]">Municipal Sanitation Squads</h1>
              <p className="text-xs sm:text-sm text-[#71717A]">
                Active municipal cleaning crews, supervisors, vehicle assignments and active jobs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-white rounded-2xl border border-[#E6E5DA] p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E6E5DA]">
                    <div>
                      <h3 className="text-base font-bold text-[#292D25]">{team.name}</h3>
                      <span className="text-xs text-[#687447] font-semibold">{team.ward}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#F6F5EC] text-[#424D2B] border border-[#E6E5DA]">
                      {team.vehicleNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-[#292D25]">
                    <div>
                      <span className="text-[#71717A] block">Crew Supervisor</span>
                      <span className="font-bold">{team.supervisor}</span>
                    </div>
                    <div>
                      <span className="text-[#71717A] block">Dispatch Radio / Phone</span>
                      <span className="font-mono">{team.phone}</span>
                    </div>
                    <div>
                      <span className="text-[#71717A] block">Current Active Queue</span>
                      <span className="font-bold text-[#687447]">
                        {complaints.filter((c) => c.assignedTeam?.id === team.id && c.status !== 'Resolved').length} Active Jobs
                      </span>
                    </div>
                    <div>
                      <span className="text-[#71717A] block">Completed Cleanups</span>
                      <span className="font-bold text-[#15803D]">
                        {complaints.filter((c) => c.assignedTeam?.id === team.id && c.status === 'Resolved').length} Completed
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E6E5DA] flex items-center justify-between">
                    <span className="text-xs text-[#71717A]">Status: Ready for Dispatch</span>
                    <button
                      onClick={() => setAdminSubView('all-complaints')}
                      className="text-xs font-semibold text-[#687447] hover:underline"
                    >
                      View Assigned Jobs →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SubView: Hotspots & Analytics */}
        {adminSubView === 'hotspots' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-[#292D25]">
                Hotspot Waste Analytics & Trends
              </h1>
              <p className="text-xs sm:text-sm text-[#71717A]">
                Identify chronic waste accumulation areas, compare ward performance and allocate infrastructure.
              </p>
            </div>

            {/* Ward Performance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ward Comparison Card */}
              <div className="bg-white rounded-2xl border border-[#E6E5DA] p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#292D25]">
                  Complaints Reported by Municipal Ward
                </h3>

                <div className="space-y-4 pt-2">
                  {wardMetrics.map((item) => {
                    const percentage =
                      totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
                    return (
                      <div key={item.ward} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#292D25]">{item.ward}</span>
                          <span className="font-mono text-[#71717A]">
                            {item.count} Reports ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-[#F6F5EC] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#687447] rounded-full transition-all"
                            style={{ width: `${Math.max(percentage, 10)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sanitation Resolution Rate by Ward */}
              <div className="bg-white rounded-2xl border border-[#E6E5DA] p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#292D25]">
                  Sanitation Resolution Success Rate
                </h3>

                <div className="space-y-4 pt-2">
                  {wardMetrics.map((item) => {
                    const rate =
                      item.count > 0 ? Math.round((item.resolved / item.count) * 100) : 0;
                    return (
                      <div key={item.ward} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#292D25]">{item.ward}</span>
                          <span className="font-mono text-[#15803D] font-bold">
                            {item.resolved}/{item.count} Resolved ({rate}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-[#F6F5EC] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#15803D] rounded-full transition-all"
                            style={{ width: `${Math.max(rate, 15)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Identified Chronic Hotspots */}
            <div className="bg-white rounded-2xl border border-[#E6E5DA] p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#292D25]">
                Identified Repeated Hotspots (High Repeat Factor)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#FAFAF5] border border-[#E6E5DA] space-y-1.5">
                  <div className="text-xs font-bold text-[#C77B59]">HOTSPOT #1</div>
                  <div className="font-bold text-sm text-[#292D25]">Market Street Plaza</div>
                  <p className="text-xs text-[#71717A]">
                    Behind commercial market alleyway. 5 reports in past 14 days.
                  </p>
                  <div className="text-[11px] font-semibold text-[#687447] pt-1">
                    Recommendation: Upgrade to dual 4-yard compactor bin.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAF5] border border-[#E6E5DA] space-y-1.5">
                  <div className="text-xs font-bold text-[#C77B59]">HOTSPOT #2</div>
                  <div className="font-bold text-sm text-[#292D25]">East River Promenade</div>
                  <p className="text-xs text-[#71717A]">
                    Promenade running trail post #18. Repeated weekend overflow.
                  </p>
                  <div className="text-[11px] font-semibold text-[#687447] pt-1">
                    Recommendation: Schedule Sunday evening extra collection shift.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAF5] border border-[#E6E5DA] space-y-1.5">
                  <div className="text-xs font-bold text-[#C77B59]">HOTSPOT #3</div>
                  <div className="font-bold text-sm text-[#292D25]">Oak Street Curbside Bay</div>
                  <p className="text-xs text-[#71717A]">
                    Renovation dry debris illegal night drops.
                  </p>
                  <div className="text-[11px] font-semibold text-[#687447] pt-1">
                    Recommendation: Deploy solar CCTV camera warning signage.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: Assign Cleaning Team */}
      {assigningComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#E6E5DA] overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#F6F5EC] border-b border-[#E6E5DA] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#292D25]">
                Dispatch Cleaning Team · {assigningComplaint.id}
              </h3>
              <button
                onClick={() => setAssigningComplaint(null)}
                className="p-1 text-[#71717A] hover:text-[#292D25]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#292D25] mb-1">
                  Select Sanitation Squad
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.ward}) – {t.supervisor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292D25] mb-1">
                  Special Dispatch Instructions / Remarks
                </label>
                <textarea
                  rows={3}
                  value={officialRemarks}
                  onChange={(e) => setOfficialRemarks(e.target.value)}
                  placeholder="e.g. Priority dispatch. Bring heavy broom and split-bag loader."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningComplaint(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#71717A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-lg shadow-xs"
                >
                  Confirm & Dispatch Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Update Status & Upload Completion Photo */}
      {updatingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="max-w-lg w-full bg-white rounded-2xl border border-[#E6E5DA] overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#F6F5EC] border-b border-[#E6E5DA] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#292D25]">
                Update Complaint Status · {updatingComplaint.id}
              </h3>
              <button
                onClick={() => setUpdatingComplaint(null)}
                className="p-1 text-[#71717A] hover:text-[#292D25]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#292D25] mb-1">
                  New Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Assigned', 'In Progress', 'Resolved'] as ComplaintStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTargetStatus(st)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        targetStatus === st
                          ? 'bg-[#687447] text-white border-[#687447] shadow-xs'
                          : 'bg-[#FAFAF5] text-[#292D25] border-[#E6E5DA] hover:border-[#687447]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292D25] mb-1">
                  Official Municipal Remarks
                </label>
                <textarea
                  rows={3}
                  value={officialRemarks}
                  onChange={(e) => setOfficialRemarks(e.target.value)}
                  placeholder="Add notes for the citizen and public audit history..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                />
              </div>

              {/* If marking Resolved, allow attaching completion photo */}
              {targetStatus === 'Resolved' && (
                <div className="space-y-2 p-3 bg-[#FAFAF5] rounded-xl border border-[#E6E5DA]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#15803D] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Attach After-Cleaning Photo Proof</span>
                    </label>
                  </div>

                  <div className="h-32 rounded-lg overflow-hidden border border-[#E6E5DA] bg-slate-100">
                    <img
                      src={resolutionPhoto}
                      alt="Resolution preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[11px]">
                    <span className="text-[#71717A]">Photo Presets:</span>
                    <button
                      type="button"
                      onClick={() => setResolutionPhoto(SAMPLE_IMAGES.resolvedCleanStreet)}
                      className="px-2 py-0.5 rounded bg-white border border-[#E6E5DA] text-[#687447] font-semibold"
                    >
                      Clean Street View
                    </button>
                    <button
                      type="button"
                      onClick={() => setResolutionPhoto(SAMPLE_IMAGES.resolvedCleanPavement)}
                      className="px-2 py-0.5 rounded bg-white border border-[#E6E5DA] text-[#687447] font-semibold"
                    >
                      Clean Pavement
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdatingComplaint(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#71717A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-lg shadow-xs"
                >
                  Save & Notify Citizen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
