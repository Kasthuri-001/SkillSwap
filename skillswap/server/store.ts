import { User, SkillListing, LearningRequest, ChatMessage, NotificationItem, Review, Report, PlatformAnalytics } from '../src/types';

class DataStore {
  public users: User[] = [];
  public skills: SkillListing[] = [];
  public requests: LearningRequest[] = [];
  public messages: ChatMessage[] = [];
  public notifications: NotificationItem[] = [];
  public reviews: Review[] = [];
  public reports: Report[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Initial Users
    this.users = [
      {
        id: 'usr_1',
        name: 'Alex Rivers',
        email: 'alex.rivers@university.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        bio: 'Computer Science Senior. Passionate about Python, React, Data Structures, and mobile dev.',
        college: 'Stanford University',
        skillsOffered: ['Python Programming', 'React Native', 'Data Structures & Algorithms'],
        skillsWanted: ['UI/UX Design', 'Acoustic Guitar', 'Spanish'],
        availability: 'Mon, Wed, Fri after 4 PM',
        skillPoints: 180,
        rating: 4.9,
        ratingCount: 14,
        role: 'student',
        status: 'active',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
      },
      {
        id: 'usr_2',
        name: 'Priya Sharma',
        email: 'priya.sharma@design.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
        bio: 'Visual Communication & Figma Design Specialist. Love converting raw ideas into stunning mobile mockups.',
        college: 'Rhode Island School of Design',
        skillsOffered: ['Figma UI/UX Design', 'Graphic Design & Branding', 'Adobe Illustrator'],
        skillsWanted: ['Python', 'Video Editing'],
        availability: 'Weekends 10 AM - 6 PM',
        skillPoints: 240,
        rating: 5.0,
        ratingCount: 22,
        role: 'student',
        status: 'active',
        createdAt: new Date(Date.now() - 45 * 86400000).toISOString()
      },
      {
        id: 'usr_3',
        name: 'Marcus Chen',
        email: 'marcus.c@media.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        bio: 'Film & Digital Media major. Premiere Pro & DaVinci Resolve color grading expert.',
        college: 'USC School of Cinematic Arts',
        skillsOffered: ['Video Editing', 'DaVinci Color Grading', 'Motion Graphics'],
        skillsWanted: ['Public Speaking', 'React Programming'],
        availability: 'Tue & Thu 2 PM - 8 PM',
        skillPoints: 120,
        rating: 4.8,
        ratingCount: 9,
        role: 'student',
        status: 'active',
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
      },
      {
        id: 'usr_4',
        name: 'Sophia Taylor',
        email: 'sophia.music@arts.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
        bio: 'Music Production & Classical Guitarist. 8 years of acoustic fingerstyle guitar experience.',
        college: 'Berklee College of Music',
        skillsOffered: ['Acoustic Guitar', 'Music Production & Logic Pro', 'Vocal Warmups'],
        skillsWanted: ['Graphic Design', 'Social Media Marketing'],
        availability: 'Daily 5 PM - 9 PM',
        skillPoints: 310,
        rating: 4.95,
        ratingCount: 31,
        role: 'student',
        status: 'active',
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
      },
      {
        id: 'usr_5',
        name: 'David Kim',
        email: 'david.kim@business.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
        bio: 'Debate Champion & Public Speaking Coach. Helping students overcome stage fear and ace pitch presentations.',
        college: 'Harvard University',
        skillsOffered: ['Public Speaking', 'Pitch Deck Presentation', 'Negotiation Skills'],
        skillsWanted: ['Python Data Science', 'Guitar'],
        availability: 'Mon-Thu 6 PM - 10 PM',
        skillPoints: 195,
        rating: 4.88,
        ratingCount: 18,
        role: 'student',
        status: 'active',
        createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
      },
      {
        id: 'usr_admin',
        name: 'SkillSwap Admin',
        email: 'admin@skillswap.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
        bio: 'Platform Moderator & Campus Community Coordinator.',
        college: 'SkillSwap Central Office',
        skillsOffered: ['Community Management', 'Platform Safety'],
        skillsWanted: [],
        availability: '24/7 Support',
        skillPoints: 9999,
        rating: 5.0,
        ratingCount: 100,
        role: 'admin',
        status: 'active',
        createdAt: new Date(Date.now() - 100 * 86400000).toISOString()
      }
    ];

    // Initial Skill Listings
    this.skills = [
      {
        id: 'skl_1',
        userId: 'usr_1',
        userName: 'Alex Rivers',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        userCollege: 'Stanford University',
        userRating: 4.9,
        title: 'Mastering Python & Data Structures',
        category: 'Programming',
        description: 'Learn fundamental Python programming from scratch to object-oriented programming, arrays, linked lists, and interview coding prep.',
        level: 'Intermediate',
        tags: ['Python', 'Data Structures', 'Coding Prep', 'Algorithms'],
        pointsCost: 30,
        images: ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600'],
        createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
      },
      {
        id: 'skl_2',
        userId: 'usr_2',
        userName: 'Priya Sharma',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
        userCollege: 'RISD',
        userRating: 5.0,
        title: 'Figma UI/UX & Mobile App Prototyping',
        category: 'Graphic Design',
        description: 'Hands-on interactive Figma design session. Learn autolayout, components, design tokens, responsive mobile frames, and micro-interactions.',
        level: 'Beginner',
        tags: ['Figma', 'UI/UX', 'Mobile Design', 'Wireframing'],
        pointsCost: 30,
        images: ['https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=600'],
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
      },
      {
        id: 'skl_3',
        userId: 'usr_3',
        userName: 'Marcus Chen',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        userCollege: 'USC Cinematic Arts',
        userRating: 4.8,
        title: 'Video Editing & Cinematic Cuts in Premiere Pro',
        category: 'Video Editing',
        description: 'Master fast timeline editing, jump cuts, sound design sync, color correction, and exporting viral reel formats.',
        level: 'Intermediate',
        tags: ['Premiere Pro', 'Video Editing', 'Reels', 'Color Grading'],
        pointsCost: 30,
        images: ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=600'],
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
      },
      {
        id: 'skl_4',
        userId: 'usr_4',
        userName: 'Sophia Taylor',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
        userCollege: 'Berklee',
        userRating: 4.95,
        title: 'Acoustic Guitar Fingerpicking for Beginners',
        category: 'Music & Guitar',
        description: 'Learn chord progressions, fingerstyle patterns, rhythm counting, and play your favorite acoustic songs in just 3 sessions.',
        level: 'Beginner',
        tags: ['Guitar', 'Acoustic', 'Music', 'Chords'],
        pointsCost: 30,
        images: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=600'],
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
      },
      {
        id: 'skl_5',
        userId: 'usr_5',
        userName: 'David Kim',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
        userCollege: 'Harvard University',
        userRating: 4.88,
        title: 'Public Speaking & Confident Speech Delivery',
        category: 'Public Speaking',
        description: 'Overcome vocal tremors and stage fear. Practice pitch modulation, body language, slide deck pacing, and Q&A handling.',
        level: 'Advanced',
        tags: ['Public Speaking', 'Presentation', 'Confidence', 'Leadership'],
        pointsCost: 30,
        images: ['https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600'],
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
      }
    ];

    // Initial Learning Requests
    this.requests = [
      {
        id: 'req_101',
        requesterId: 'usr_1', // Alex
        requesterName: 'Alex Rivers',
        requesterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        providerId: 'usr_2', // Priya
        providerName: 'Priya Sharma',
        providerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
        skillId: 'skl_2',
        skillTitle: 'Figma UI/UX & Mobile App Prototyping',
        message: 'Hey Priya! I want to design a mobile layout for my React Native app. Can we schedule a 1-on-1 session?',
        status: 'accepted',
        scheduledDate: '2026-08-12',
        scheduledTime: '16:00',
        durationMinutes: 60,
        meetingUrl: 'https://meet.jit.si/skillswap-figma-session-101',
        pointsTransferred: 30,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 'req_102',
        requesterId: 'usr_3', // Marcus
        requesterName: 'Marcus Chen',
        requesterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        providerId: 'usr_1', // Alex
        providerName: 'Alex Rivers',
        providerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        skillId: 'skl_1',
        skillTitle: 'Mastering Python & Data Structures',
        message: 'Hi Alex! Need help understanding Binary Search Trees for my class project.',
        status: 'pending',
        scheduledDate: '2026-08-14',
        scheduledTime: '17:30',
        durationMinutes: 45,
        pointsTransferred: 30,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 'req_103',
        requesterId: 'usr_5', // David
        requesterName: 'David Kim',
        requesterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
        providerId: 'usr_4', // Sophia
        providerName: 'Sophia Taylor',
        providerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
        skillId: 'skl_4',
        skillTitle: 'Acoustic Guitar Fingerpicking for Beginners',
        message: 'Hi Sophia, I bought a guitar last week and would love to learn basic open chords!',
        status: 'completed',
        scheduledDate: '2026-08-05',
        scheduledTime: '18:00',
        durationMinutes: 60,
        pointsTransferred: 30,
        createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
      }
    ];

    // Initial Chat Messages
    this.messages = [
      {
        id: 'msg_1',
        requestId: 'req_101',
        senderId: 'usr_1',
        senderName: 'Alex Rivers',
        receiverId: 'usr_2',
        content: 'Hi Priya! Excited for our Figma prototyping session!',
        read: true,
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: 'msg_2',
        requestId: 'req_101',
        senderId: 'usr_2',
        senderName: 'Priya Sharma',
        receiverId: 'usr_1',
        content: 'Hey Alex! Sounds great. Have Figma desktop installed before we start. Here is a starter preview of auto-layout.',
        imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=400',
        read: true,
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        id: 'msg_3',
        requestId: 'req_101',
        senderId: 'usr_1',
        senderName: 'Alex Rivers',
        receiverId: 'usr_2',
        content: 'Awesome! Got it installed. See you on Wednesday at 4 PM!',
        read: true,
        timestamp: new Date(Date.now() - 1800000).toISOString()
      }
    ];

    // Initial Reviews
    this.reviews = [
      {
        id: 'rev_1',
        mentorId: 'usr_4',
        studentId: 'usr_5',
        studentName: 'David Kim',
        studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
        rating: 5,
        feedback: 'Sophia is an extraordinary guitar instructor! Taught me 4 fundamental chords and finger patterns in one hour. Very patient and articulate.',
        skillTitle: 'Acoustic Guitar Fingerpicking for Beginners',
        date: '2026-08-05'
      },
      {
        id: 'rev_2',
        mentorId: 'usr_2',
        studentId: 'usr_3',
        studentName: 'Marcus Chen',
        studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        rating: 5,
        feedback: 'Priya explained Figma component sets and autolayout so clearly. Highly recommend learning UI/UX from her!',
        skillTitle: 'Figma UI/UX & Mobile App Prototyping',
        date: '2026-08-02'
      }
    ];

    // Initial Notifications
    this.notifications = [
      {
        id: 'notif_1',
        userId: 'usr_1',
        title: 'Learning Request Accepted!',
        message: 'Priya Sharma accepted your learning request for Figma UI/UX.',
        type: 'request',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'notif_2',
        userId: 'usr_1',
        title: 'New Request Received',
        message: 'Marcus Chen sent you a learning request for Python Programming.',
        type: 'request',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ];

    // Reports
    this.reports = [
      {
        id: 'rep_1',
        reportedBy: 'usr_3',
        reportedByName: 'Marcus Chen',
        reportedType: 'skill',
        targetId: 'skl_99',
        targetTitleOrName: 'Spam Crypto Trading Tips',
        reason: 'Unrelated commercial spam listing',
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  // Analytics Helper
  public getAnalytics(): PlatformAnalytics {
    const totalStudents = this.users.filter(u => u.role === 'student').length;
    const totalSkills = this.skills.length;
    const completedSessions = this.requests.filter(r => r.status === 'completed').length;
    const pointsCirculation = this.users.reduce((acc, u) => acc + u.skillPoints, 0);
    const activeRequests = this.requests.filter(r => r.status === 'pending' || r.status === 'accepted').length;

    const catMap: Record<string, number> = {};
    for (const skill of this.skills) {
      catMap[skill.category] = (catMap[skill.category] || 0) + 1;
    }

    const categoryBreakdown = Object.entries(catMap).map(([category, count]) => ({ category, count }));

    return {
      totalStudents,
      totalSkills,
      completedSessions,
      pointsCirculation,
      activeRequests,
      categoryBreakdown
    };
  }
}

export const db = new DataStore();
