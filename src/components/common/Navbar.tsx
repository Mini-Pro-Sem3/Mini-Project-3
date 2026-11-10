import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Recycle,
  Bell,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  ChevronDown,
  PlusCircle,
  LayoutDashboard,
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const {
    currentUser,
    activeView,
    setActiveView,
    openAuthModal,
    logout,
    switchRole,
    notifications,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Unread notifications count for current user
  const unreadCount = notifications.filter(
    (n) =>
      !n.read &&
      (n.userId === currentUser?.id ||
        (currentUser?.role === 'admin' && (n.recipientRole === 'admin' || n.userId === 'user-admin')))
  ).length;

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAF5]/95 backdrop-blur-md border-b border-[#E6E5DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-[#687447] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Recycle className="w-5 h-5 text-[#F6F5EC]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#292D25] block">
                Civic<span className="text-[#687447]">Clean</span>
              </span>
            </div>
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#292D25]/80">
            <button
              onClick={() => setActiveView('landing')}
              className={`hover:text-[#687447] transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'landing' ? 'text-[#687447] font-semibold' : ''
              }`}
            >
              Home
            </button>

            <button
              onClick={() => {
                if (currentUser?.role === 'admin') {
                  setActiveView('admin-dashboard');
                } else {
                  setActiveView('citizen-dashboard');
                }
              }}
              className={`hover:text-[#687447] transition-colors whitespace-nowrap shrink-0 ${
                activeView.includes('dashboard') ? 'text-[#687447] font-semibold' : ''
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveView('community')}
              className={`hover:text-[#687447] transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'community' ? 'text-[#687447] font-semibold' : ''
              }`}
            >
              Community Feed
            </button>

            <button
              onClick={() => setActiveView('my-complaints')}
              className={`hover:text-[#687447] transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'my-complaints' ? 'text-[#687447] font-semibold' : ''
              }`}
            >
              Track Reports
            </button>
          </nav>

          {/* Zone 3: 1 primary action & user controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Role Switcher Pill for reviewer testing */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#424D2B] bg-[#F6F5EC] border border-[#E6E5DA] rounded-lg hover:border-[#687447] transition-colors whitespace-nowrap shrink-0"
                title="Switch active role between Citizen and Municipal Admin"
              >
                {currentUser?.role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#687447]" />
                    <span>Role: Municipal Admin</span>
                  </>
                ) : (
                  <>
                    <UserIcon className="w-3.5 h-3.5 text-[#687447]" />
                    <span>Role: Citizen</span>
                  </>
                )}
                <ChevronDown className="w-3 h-3 text-[#71717A]" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E6E5DA] py-2 z-50">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 border-b border-[#E6E5DA]/60">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => {
                      switchRole('citizen');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#292D25] hover:bg-[#F6F5EC] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-[#292D25]">Sarah Chen</div>
                      <div className="text-[11px] text-[#71717A]">Citizen (Ward 3)</div>
                    </div>
                    {currentUser?.role === 'citizen' && (
                      <span className="text-[#687447] font-bold">✓</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      switchRole('admin');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#292D25] hover:bg-[#F6F5EC] flex items-center justify-between border-t border-[#E6E5DA]/40"
                  >
                    <div>
                      <div className="font-semibold text-[#292D25]">Officer Marcus Vance</div>
                      <div className="text-[11px] text-[#71717A]">Municipal Sanitation Admin</div>
                    </div>
                    {currentUser?.role === 'admin' && (
                      <span className="text-[#687447] font-bold">✓</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* In-app notification bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-[#292D25]/80 hover:text-[#687447] hover:bg-[#F6F5EC] rounded-lg transition-colors focus:outline-none"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#C77B59] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            {currentUser?.role === 'admin' ? (
              <button
                onClick={() => setActiveView('admin-dashboard')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#424D2B] rounded-lg hover:bg-[#343D22] transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Console</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('report')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#687447] rounded-lg hover:bg-[#57623a] transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Garbage</span>
              </button>
            )}

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-[#E6E5DA]">
                <button
                  onClick={logout}
                  className="p-2 text-[#71717A] hover:text-[#C77B59] hover:bg-[#F6F5EC] rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('citizen')}
                className="px-3.5 py-2 text-xs font-medium text-[#292D25] hover:text-[#687447] bg-white border border-[#E6E5DA] rounded-lg hover:border-[#687447] transition-colors whitespace-nowrap shrink-0"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
