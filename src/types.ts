export type UserRole = 'citizen' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  ward?: string;
}

export type ComplaintStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved';

export type GarbageCategory =
  | 'Overflowing dustbin'
  | 'Roadside garbage'
  | 'Uncollected household waste'
  | 'Construction waste'
  | 'Illegal dumping'
  | 'Other';

export interface StatusUpdate {
  status: ComplaintStatus;
  timestamp: string;
  updatedBy: string;
  remarks?: string;
}

export interface CommunityVerification {
  userId: string;
  userName: string;
  type: 'cleaning_started' | 'cleaning_completed';
  timestamp: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  text: string;
  timestamp: string;
}

export interface Complaint {
  id: string;
  title: string;
  category: GarbageCategory;
  description: string;
  images: string[];
  resolvedImages?: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
    landmark?: string;
    ward: string;
  };
  citizenId: string;
  citizenName: string;
  citizenPhone?: string;
  status: ComplaintStatus;
  statusHistory: StatusUpdate[];
  assignedTeam?: {
    id: string;
    name: string;
    supervisor: string;
    contactNumber: string;
    assignedAt: string;
  };
  adminRemarks?: string;
  verifications: CommunityVerification[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // Target recipient or 'admin' or 'all'
  recipientRole?: UserRole;
  complaintId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'status_change' | 'new_report' | 'verification' | 'assignment' | 'comment';
}

export interface CleaningTeam {
  id: string;
  name: string;
  ward: string;
  vehicleNumber: string;
  supervisor: string;
  phone: string;
  activeJobs: number;
}
