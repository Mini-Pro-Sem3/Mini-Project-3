import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Complaint,
  ComplaintStatus,
  CleaningTeam,
  NotificationItem,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_COMPLAINTS,
  INITIAL_TEAMS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  complaints: Complaint[];
  teams: CleaningTeam[];
  notifications: NotificationItem[];
  activeView: string;
  selectedComplaintId: string | null;
  adminSubView: string;
  isAuthModalOpen: boolean;
  authModalRole: UserRole;
  setActiveView: (view: string, complaintId?: string) => void;
  setAdminSubView: (subView: string) => void;
  openAuthModal: (role?: UserRole) => void;
  closeAuthModal: () => void;
  login: (email: string, role: UserRole) => boolean;
  register: (name: string, email: string, phone: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  submitComplaint: (data: {
    title: string;
    category: Complaint['category'];
    description: string;
    images: string[];
    location: Complaint['location'];
  }) => string;
  addVerification: (complaintId: string, type: 'cleaning_started' | 'cleaning_completed') => boolean;
  addComment: (complaintId: string, text: string) => boolean;
  adminUpdateStatus: (
    complaintId: string,
    status: ComplaintStatus,
    remarks?: string,
    resolvedImage?: string
  ) => void;
  adminAssignTeam: (complaintId: string, teamId: string, remarks?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COMPLAINTS: 'civicclean_complaints_v1',
  NOTIFICATIONS: 'civicclean_notifications_v1',
  CURRENT_USER: 'civicclean_current_user_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [teams] = useState<CleaningTeam[]>(INITIAL_TEAMS);

  // Initialize from LocalStorage or default
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default to citizen Sarah Chen for instant interactive experience
    return INITIAL_USERS[0];
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_COMPLAINTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeView, setActiveViewInternal] = useState<string>('landing');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [adminSubView, setAdminSubView] = useState<string>('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('citizen');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.warn('LocalStorage error saving complaints', e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('LocalStorage error saving notifications', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.warn('LocalStorage error saving currentUser', e);
    }
  }, [currentUser]);

  const setActiveView = (view: string, complaintId?: string) => {
    setActiveViewInternal(view);
    if (complaintId) {
      setSelectedComplaintId(complaintId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = (role: UserRole = 'citizen') => {
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (email: string, role: UserRole): boolean => {
    const existing = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );
    if (existing) {
      setCurrentUser(existing);
      setIsAuthModalOpen(false);
      setActiveView(role === 'admin' ? 'admin-dashboard' : 'citizen-dashboard');
      return true;
    }

    // Dynamic mock user for testing any email
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      role,
      ward: 'Ward 3 – West Central',
      department: role === 'admin' ? 'Municipal Sanitation Department' : undefined,
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    setActiveView(role === 'admin' ? 'admin-dashboard' : 'citizen-dashboard');
    return true;
  };

  const register = (name: string, email: string, phone: string): boolean => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'citizen',
      ward: 'Ward 3 – West Central',
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    setActiveView('citizen-dashboard');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('landing');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      const adminUser = users.find((u) => u.role === 'admin') || INITIAL_USERS[2];
      setCurrentUser(adminUser);
      setActiveView('admin-dashboard');
    } else {
      const citizenUser = users.find((u) => u.role === 'citizen') || INITIAL_USERS[0];
      setCurrentUser(citizenUser);
      setActiveView('citizen-dashboard');
    }
  };

  const submitComplaint = (data: {
    title: string;
    category: Complaint['category'];
    description: string;
    images: string[];
    location: Complaint['location'];
  }): string => {
    const uniqueId = `CC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      id: uniqueId,
      title: data.title || `${data.category} reported at ${data.location.address}`,
      category: data.category,
      description: data.description,
      images: data.images,
      location: data.location,
      citizenId: currentUser?.id || 'anonymous-citizen',
      citizenName: currentUser?.name || 'Concerned Citizen',
      citizenPhone: currentUser?.phone || '',
      status: 'Submitted',
      statusHistory: [
        {
          status: 'Submitted',
          timestamp: now,
          updatedBy: `${currentUser?.name || 'Citizen'} (Citizen)`,
          remarks: 'Complaint registered with GPS location and photo verification.',
        },
      ],
      verifications: [],
      comments: [],
      createdAt: now,
      updatedAt: now,
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Send notifications to Citizen & Admin
    const citizenNotif: NotificationItem = {
      id: `notif-${Date.now()}-1`,
      userId: currentUser?.id || 'anonymous-citizen',
      recipientRole: 'citizen',
      complaintId: uniqueId,
      title: 'Complaint Registered',
      message: `Your complaint #${uniqueId} at ${data.location.address} has been received.`,
      timestamp: now,
      read: false,
      type: 'status_change',
    };

    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}-2`,
      userId: 'user-admin',
      recipientRole: 'admin',
      complaintId: uniqueId,
      title: 'New Sanitation Issue Reported',
      message: `${currentUser?.name || 'A citizen'} reported ${data.category} in ${data.location.ward}.`,
      timestamp: now,
      read: false,
      type: 'new_report',
    };

    setNotifications((prev) => [citizenNotif, adminNotif, ...prev]);
    return uniqueId;
  };

  const addVerification = (
    complaintId: string,
    type: 'cleaning_started' | 'cleaning_completed'
  ): boolean => {
    if (!currentUser) {
      openAuthModal('citizen');
      return false;
    }

    let alreadyVerified = false;
    const now = new Date().toISOString();

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        // Check if user already verified this type for this complaint
        const exists = c.verifications.some(
          (v) => v.userId === currentUser.id && v.type === type
        );
        if (exists) {
          alreadyVerified = true;
          return c;
        }

        const updatedVerifications = [
          ...c.verifications,
          {
            userId: currentUser.id,
            userName: currentUser.name,
            type,
            timestamp: now,
          },
        ];

        return {
          ...c,
          verifications: updatedVerifications,
          updatedAt: now,
        };
      })
    );

    if (alreadyVerified) return false;

    // Send notification to complaint creator & admin
    const targetComplaint = complaints.find((c) => c.id === complaintId);
    if (targetComplaint) {
      const typeLabel =
        type === 'cleaning_started' ? 'Cleaning Started' : 'Cleaning Completed';

      const notifList: NotificationItem[] = [
        {
          id: `notif-${Date.now()}-v1`,
          userId: targetComplaint.citizenId,
          recipientRole: 'citizen',
          complaintId,
          title: `Community Verification: ${typeLabel}`,
          message: `${currentUser.name} verified "${typeLabel}" on your complaint #${complaintId}.`,
          timestamp: now,
          read: false,
          type: 'verification',
        },
        {
          id: `notif-${Date.now()}-v2`,
          userId: 'user-admin',
          recipientRole: 'admin',
          complaintId,
          title: `Citizen Verification (${typeLabel})`,
          message: `Citizen verified ${typeLabel.toLowerCase()} on report #${complaintId}.`,
          timestamp: now,
          read: false,
          type: 'verification',
        },
      ];
      setNotifications((prev) => [...notifList, ...prev]);
    }

    return true;
  };

  const addComment = (complaintId: string, text: string): boolean => {
    if (!currentUser || !text.trim()) return false;
    const now = new Date().toISOString();

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        const newComment = {
          id: `comm-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          text: text.trim(),
          timestamp: now,
        };
        return {
          ...c,
          comments: [...c.comments, newComment],
          updatedAt: now,
        };
      })
    );
    return true;
  };

  const adminUpdateStatus = (
    complaintId: string,
    status: ComplaintStatus,
    remarks?: string,
    resolvedImage?: string
  ) => {
    const now = new Date().toISOString();
    let citizenTargetId = '';

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        citizenTargetId = c.citizenId;

        const newHistory = [
          ...c.statusHistory,
          {
            status,
            timestamp: now,
            updatedBy: `${currentUser?.name || 'Municipal Admin'} (Admin)`,
            remarks: remarks || `Status changed to ${status}`,
          },
        ];

        return {
          ...c,
          status,
          statusHistory: newHistory,
          adminRemarks: remarks || c.adminRemarks,
          resolvedImages: resolvedImage ? [resolvedImage] : c.resolvedImages,
          updatedAt: now,
        };
      })
    );

    // Notify citizen
    if (citizenTargetId) {
      const statusNotification: NotificationItem = {
        id: `notif-${Date.now()}-st`,
        userId: citizenTargetId,
        recipientRole: 'citizen',
        complaintId,
        title: `Complaint Status Updated: ${status}`,
        message: `Your report #${complaintId} is now "${status}". ${remarks ? `Remarks: ${remarks}` : ''}`,
        timestamp: now,
        read: false,
        type: 'status_change',
      };
      setNotifications((prev) => [statusNotification, ...prev]);
    }
  };

  const adminAssignTeam = (complaintId: string, teamId: string, remarks?: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;

    const now = new Date().toISOString();
    let citizenTargetId = '';

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        citizenTargetId = c.citizenId;

        const newHistory = [
          ...c.statusHistory,
          {
            status: 'Assigned' as ComplaintStatus,
            timestamp: now,
            updatedBy: `${currentUser?.name || 'Municipal Admin'} (Admin)`,
            remarks: `Assigned to ${team.name}. ${remarks || ''}`,
          },
        ];

        return {
          ...c,
          status: 'Assigned',
          statusHistory: newHistory,
          assignedTeam: {
            id: team.id,
            name: team.name,
            supervisor: team.supervisor,
            contactNumber: team.phone,
            assignedAt: now,
          },
          adminRemarks: remarks || c.adminRemarks,
          updatedAt: now,
        };
      })
    );

    // Notify citizen
    if (citizenTargetId) {
      const assignNotification: NotificationItem = {
        id: `notif-${Date.now()}-as`,
        userId: citizenTargetId,
        recipientRole: 'citizen',
        complaintId,
        title: `Cleaning Team Assigned`,
        message: `Report #${complaintId} assigned to ${team.name} (Supervisor: ${team.supervisor}).`,
        timestamp: now,
        read: false,
        type: 'assignment',
      };
      setNotifications((prev) => [assignNotification, ...prev]);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        complaints,
        teams,
        notifications,
        activeView,
        selectedComplaintId,
        adminSubView,
        isAuthModalOpen,
        authModalRole,
        setActiveView,
        setAdminSubView,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        switchRole,
        submitComplaint,
        addVerification,
        addComment,
        adminUpdateStatus,
        adminAssignTeam,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
