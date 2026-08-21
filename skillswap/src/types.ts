export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  college: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string;
  skillPoints: number;
  rating: number;
  ratingCount: number;
  role: 'student' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface SkillListing {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userCollege: string;
  userRating: number;
  title: string;
  category: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  pointsCost: number;
  images?: string[];
  createdAt: string;
}

export interface LearningRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  skillId: string;
  skillTitle: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  scheduledDate?: string;
  scheduledTime?: string;
  durationMinutes?: number;
  meetingUrl?: string;
  pointsTransferred?: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  imageUrl?: string;
  read: boolean;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'status' | 'reminder' | 'chat' | 'points';
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  mentorId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  feedback: string;
  skillTitle: string;
  date: string;
}

export interface Report {
  id: string;
  reportedBy: string;
  reportedByName: string;
  reportedType: 'skill' | 'user';
  targetId: string;
  targetTitleOrName: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface PlatformAnalytics {
  totalStudents: number;
  totalSkills: number;
  completedSessions: number;
  pointsCirculation: number;
  activeRequests: number;
  categoryBreakdown: { category: string; count: number }[];
}
