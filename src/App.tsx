import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ReportGarbagePage } from './components/citizen/ReportGarbagePage';
import { MyComplaintsPage } from './components/citizen/MyComplaintsPage';
import { CommunityFeedPage } from './components/citizen/CommunityFeedPage';
import { AuthModal } from './components/auth/AuthModal';
import { NotificationsDrawer } from './components/notifications/NotificationsDrawer';

const MainApp: React.FC = () => {
  const { activeView } = useApp();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF5] text-[#292D25]">
      {/* Strict Top Bar Contract Header */}
      <Navbar onOpenNotifications={() => setIsNotificationsOpen(true)} />

      {/* Main Content Router */}
      <div className="flex-1">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'citizen-dashboard' && <CitizenDashboard />}
        {activeView === 'admin-dashboard' && <AdminDashboard />}
        {activeView === 'report' && <ReportGarbagePage />}
        {activeView === 'my-complaints' && <MyComplaintsPage />}
        {activeView === 'complaint-detail' && <MyComplaintsPage />}
        {activeView === 'community' && <CommunityFeedPage />}
      </div>

      {/* Footer on landing, citizen, and community views */}
      {activeView !== 'admin-dashboard' && <Footer />}

      {/* Interactive Modals and Drawers */}
      <AuthModal />
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
