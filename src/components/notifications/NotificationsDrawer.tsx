import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  CheckCheck,
  Sparkles,
  AlertCircle,
  Truck,
  CheckCircle2,
} from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveView,
  } = useApp();

  if (!isOpen) return null;

  // Filter notifications for this user
  const userNotifications = notifications.filter((n) => {
    if (currentUser?.role === 'admin') {
      return n.recipientRole === 'admin' || n.userId === 'user-admin' || n.userId === currentUser.id;
    }
    return n.userId === currentUser?.id || n.recipientRole === 'citizen';
  });

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleNotificationClick = (complaintId?: string, id?: string) => {
    if (id) markNotificationAsRead(id);
    if (complaintId) {
      setActiveView('complaint-detail', complaintId);
      onClose();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return <Sparkles className="w-4 h-4 text-[#687447]" />;
      case 'assignment':
        return <Truck className="w-4 h-4 text-[#424D2B]" />;
      case 'verification':
        return <CheckCircle2 className="w-4 h-4 text-[#15803D]" />;
      case 'new_report':
        return <AlertCircle className="w-4 h-4 text-[#C77B59]" />;
      default:
        return <Bell className="w-4 h-4 text-[#687447]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E6E5DA] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#F6F5EC] border-b border-[#E6E5DA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#687447] text-white flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#292D25]">System Notifications</h3>
              <p className="text-[11px] text-[#71717A]">
                {unreadCount} unread {unreadCount === 1 ? 'alert' : 'alerts'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-semibold text-[#687447] hover:underline flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#71717A] hover:text-[#292D25] hover:bg-white/80"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E6E5DA]/70 p-2">
          {userNotifications.length === 0 ? (
            <div className="p-12 text-center text-[#71717A] space-y-2">
              <Bell className="w-8 h-8 mx-auto text-[#E6E5DA]" />
              <p className="text-xs font-semibold">No notifications yet.</p>
              <p className="text-[11px]">
                You'll receive alerts here when sanitation progress or community votes occur.
              </p>
            </div>
          ) : (
            userNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.complaintId, notif.id)}
                className={`p-3.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 ${
                  notif.read ? 'bg-white hover:bg-[#FAFAF5]' : 'bg-[#F6F5EC]/80 hover:bg-[#F6F5EC]'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E6E5DA] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {getIcon(notif.type)}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs ${
                        notif.read ? 'font-semibold text-[#292D25]' : 'font-bold text-[#424D2B]'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-[10px] font-mono text-[#71717A]">
                      {new Date(notif.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-[#292D25]/75 leading-relaxed">{notif.message}</p>

                  {notif.complaintId && (
                    <div className="pt-1 flex items-center justify-between text-[10px]">
                      <span className="font-mono text-[#687447] font-bold">
                        #{notif.complaintId}
                      </span>
                      <span className="text-[#687447] font-semibold hover:underline">
                        View Progress →
                      </span>
                    </div>
                  )}
                </div>

                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-[#C77B59] shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FAFAF5] border-t border-[#E6E5DA] text-center text-[11px] text-[#71717A]">
          CivicClean Municipal Broadcast & Verification Channel
        </div>
      </div>
    </div>
  );
};
