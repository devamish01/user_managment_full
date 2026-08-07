import { useState, useMemo } from 'react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalPaid: number;
  totalWins: number;
  totalWon: number;
  totalSent: number;
  totalDonated: number;
  joinedDate: string;
  paymentCount: number;
  lastPaymentDate?: string;
  isActive: boolean;
  rank: number; // 0 = auto, admin can override
}

interface Transaction {
  id: string;
  userName: string;
  amount: number;
  fundType: string;
  date: string;
  status: 'Success' | 'Pending' | 'Rejected';
}

interface Fund {
  id: string;
  name: string;
  description: string;
  total: number;
  color: string;
  icon: string;
}

interface GiveawayEvent {
  id: string;
  name: string;
  type: 'Daily' | 'Weekly' | 'Monthly';
  amount: number;
  winnersCount: number;
  date: string;
  status: 'Active' | 'Completed';
  winnerType?: 'single' | 'multiple';
  participantMode?: 'all' | 'daily' | 'weekly' | 'monthly';
  conditions?: {
    joinFilter: string;
    minContribution: number;
    fundFilter: string;
    statusFilter: string;
  };
}

interface Winner {
  id: string;
  userName: string;
  amount: number;
  date: string;
  giveawayName: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
  channelId: string;
  channelName: string;
  thumbnail: string;
  views: number;
  likes: number;
  commentCount: number; // Total on YouTube
  fetchedCount: number; // Fetched in app
  publishedAt: string;
  status: 'Syncing' | 'Completed' | 'Failed';
  description: string;
  tags: string[];
}

interface YouTubeComment {
  id: string;
  videoId: string;
  userName: string;
  userId: string;
  text: string;
  likes: number;
  date: string;
  isTopComment: boolean;
}

interface YouTubeUser {
  id: string;
  channelId: string;
  name: string;
  avatar: string;
  avatarColor: string;
  firstSeen: string;
  lastSeen: string;
  totalComments: number;
  videosCommented: number;
  videoNames: string[];
  likesReceived: number;
  topCommentLikes: number;
  status: 'New User' | 'Repeat User';
  joinedAt: string;
  topComment?: { text: string; likes: number; videoName: string };
}

// Dummy Data
const initialUsers: User[] = [
  { id: '1', name: 'Aminesh Verma', email: 'aminesh@example.com', avatar: 'AV', totalPaid: 110500, totalWins: 2, totalWon: 10000, totalSent: 8000, totalDonated: 5000, joinedDate: '2024-01-15', paymentCount: 12, lastPaymentDate: '2024-12-15', isActive: true, rank: 0 },
  { id: '2', name: 'Priya Sharma', email: 'priya@example.com', avatar: 'PS', totalPaid: 8000, totalWins: 1, totalWon: 3000, totalSent: 3000, totalDonated: 3000, joinedDate: '2024-12-15', paymentCount: 2, lastPaymentDate: '2024-12-15', isActive: true, rank: 0 },
  { id: '3', name: 'Rahul Kumar', email: 'rahul@example.com', avatar: 'RK', totalPaid: 12000, totalWins: 0, totalWon: 0, totalSent: 0, totalDonated: 7000, joinedDate: '2024-01-25', paymentCount: 3, lastPaymentDate: '2024-12-14', isActive: true, rank: 0 },
  { id: '4', name: 'Sneha Patel', email: 'sneha@example.com', avatar: 'SP', totalPaid: 6000, totalWins: 3, totalWon: 5000, totalSent: 2000, totalDonated: 2000, joinedDate: '2024-12-14', paymentCount: 4, lastPaymentDate: '2024-12-14', isActive: true, rank: 0 },
  { id: '5', name: 'Vikram Singh', email: 'vikram@example.com', avatar: 'VS', totalPaid: 20000, totalWins: 1, totalWon: 8000, totalSent: 5000, totalDonated: 10000, joinedDate: '2024-02-05', paymentCount: 5, lastPaymentDate: '2024-12-14', isActive: true, rank: 0 },
  { id: '6', name: 'Anita Desai', email: 'anita@example.com', avatar: 'AD', totalPaid: 5000, totalWins: 0, totalWon: 0, totalSent: 0, totalDonated: 4000, joinedDate: '2024-03-15', paymentCount: 1, lastPaymentDate: '2024-12-13', isActive: false, rank: 0 },
  { id: '7', name: 'Rohan Mehta', email: 'rohan@example.com', avatar: 'RM', totalPaid: 9000, totalWins: 2, totalWon: 5000, totalSent: 4000, totalDonated: 3500, joinedDate: '2024-01-30', paymentCount: 3, lastPaymentDate: '2024-12-13', isActive: true, rank: 0 },
  { id: '8', name: 'Kavya Reddy', email: 'kavya@example.com', avatar: 'KR', totalPaid: 11000, totalWins: 1, totalWon: 0, totalSent: 0, totalDonated: 6000, joinedDate: '2024-12-13', paymentCount: 2, lastPaymentDate: '2024-12-13', isActive: true, rank: 0 },
];

const initialTransactions: Transaction[] = [
  { id: '1', userName: 'Aminesh Verma', amount: 5000, fundType: 'Giveaway', date: '2024-12-15 10:30', status: 'Success' },
  { id: '2', userName: 'Priya Sharma', amount: 3000, fundType: 'Donation', date: '2024-12-15 09:45', status: 'Success' },
  { id: '3', userName: 'Rahul Kumar', amount: 7000, fundType: 'Trading', date: '2024-12-14 16:20', status: 'Success' },
  { id: '4', userName: 'Sneha Patel', amount: 2000, fundType: 'Support', date: '2024-12-14 14:15', status: 'Success' },
  { id: '5', userName: 'Vikram Singh', amount: 10000, fundType: 'Giveaway', date: '2024-12-14 11:00', status: 'Success' },
  { id: '6', userName: 'Anita Desai', amount: 4000, fundType: 'Donation', date: '2024-12-13 15:30', status: 'Success' },
  { id: '7', userName: 'Rohan Mehta', amount: 5000, fundType: 'Giveaway', date: '2024-12-13 12:45', status: 'Success' },
  { id: '8', userName: 'Kavya Reddy', amount: 6000, fundType: 'Trading', date: '2024-12-13 10:00', status: 'Success' },
];

const initialFunds: Fund[] = [
  { id: '1', name: 'Giveaway Fund', description: 'Join daily & monthly giveaways', total: 39000, color: 'from-violet-500 to-purple-500', icon: '🎁' },
  { id: '2', name: 'Donation Fund', description: 'Help people in need', total: 22500, color: 'from-emerald-500 to-teal-500', icon: '💚' },
  { id: '3', name: 'Trading Fund', description: 'Contribute for trading growth', total: 31800, color: 'from-orange-500 to-amber-500', icon: '📈' },
  { id: '4', name: 'Support Me', description: 'Directly support the creator', total: 17200, color: 'from-pink-500 to-rose-500', icon: '☕' },
];

const initialGiveaways: GiveawayEvent[] = [
  { id: '1', name: 'Daily Giveaway - Dec 15', type: 'Daily', amount: 5000, winnersCount: 5, date: '2024-12-15', status: 'Active' },
  { id: '2', name: 'Weekly Giveaway - Week 50', type: 'Weekly', amount: 15000, winnersCount: 3, date: '2024-12-14', status: 'Completed' },
  { id: '3', name: 'Monthly Giveaway - December', type: 'Monthly', amount: 50000, winnersCount: 10, date: '2024-12-01', status: 'Active' },
];

const initialWinners: Winner[] = [
  { id: '1', userName: 'Aminesh Verma', amount: 10000, date: '2024-12-14', giveawayName: 'Weekly Giveaway - Week 50' },
  { id: '2', userName: 'Sneha Patel', amount: 5000, date: '2024-12-14', giveawayName: 'Weekly Giveaway - Week 50' },
  { id: '3', userName: 'Rohan Mehta', amount: 5000, date: '2024-12-14', giveawayName: 'Weekly Giveaway - Week 50' },
  { id: '4', userName: 'Priya Sharma', amount: 3000, date: '2024-12-13', giveawayName: 'Daily Giveaway - Dec 13' },
  { id: '5', userName: 'Vikram Singh', amount: 8000, date: '2024-12-10', giveawayName: 'Daily Giveaway - Dec 10' },
];

// Icons
const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Transactions: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  Funds: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Giveaways: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Trophy: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>,
  History: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Profile: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Wallet: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  ChevronLeft: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  Youtube: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

export const Overview = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showVerification, setShowVerification] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ name: '', amount: '', fund: 'giveaway' });
  const [verificationForm, setVerificationForm] = useState({ name: '', transactionId: '', screenshot: '' });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const [giveawayForm, setGiveawayForm] = useState({ 
    type: 'daily', 
    amount: '', 
    winners: '',
    winnerType: 'multiple' as 'single' | 'multiple',
    joinFilter: 'all',
    minContribution: '',
    fundFilter: 'all',
    statusFilter: 'all'
  });
  const [showPaymentMethod, setShowPaymentMethod] = useState('upi');
  const [showEligiblePreview, setShowEligiblePreview] = useState(false);
  const [eligibleUsers, setEligibleUsers] = useState<User[]>([]);
  const [selectedGiveawayId, setSelectedGiveawayId] = useState<string | null>(null);
  const [isRunningGiveaway, setIsRunningGiveaway] = useState(false);
  const [rollingWinnerName, setRollingWinnerName] = useState('');
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [recentWinners, setRecentWinners] = useState<Winner[]>([]);
  const [editingGiveaway, setEditingGiveaway] = useState<GiveawayEvent | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyTypeFilter, setHistoryTypeFilter] = useState('All');
  
  // YouTube State
  const [youtubeChannelUrl, setYoutubeChannelUrl] = useState('');
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [videoComments, setVideoComments] = useState<YouTubeComment[]>([]);
  const [commentSearch, setCommentSearch] = useState('');
  const [isFetchingYoutube, setIsFetchingYoutube] = useState(false);
  const [selectedYTUserId, setSelectedYTUserId] = useState<string | null>(null);
  const [ytUserFilter, setYTUserFilter] = useState('all');
  const [ytUserSearch, setYTUserSearch] = useState('');
  const [ytUserVideoFilter, setYtUserVideoFilter] = useState('');
  const [ytVideoTab, setYtVideoTab] = useState('all');
  const [ytVideoSearch, setYtVideoSearch] = useState('');
  const [ytCommentTab, setYtCommentTab] = useState('all');
  const [settingsTab, setSettingsTab] = useState('import');
  const [apiKey, setApiKey] = useState('');

  // Dummy YouTube Users Data
  const ytUsers: YouTubeUser[] = [
    {
      id: 'yt-alex-1', channelId: 'UC_alex123', name: 'Alex Johnson', avatar: 'AJ', avatarColor: 'from-blue-500 to-indigo-600',
      firstSeen: '22/05/2026', lastSeen: '22/05/2026 16:30:00', totalComments: 2, videosCommented: 2,
      videoNames: ['React Dashboard Setup Guide', 'TypeScript for Admin Panels'], likesReceived: 27, topCommentLikes: 18,
      status: 'Repeat User', joinedAt: '22/05/2026 14:45:00',
      topComment: { text: 'Very clean dashboard demo. The reusable card layout was my favorite part.', likes: 18, videoName: 'React Dashboard Setup Guide' }
    },
    {
      id: 'yt-maria-1', channelId: 'UC_maria789', name: 'Maria Garcia', avatar: 'MG', avatarColor: 'from-orange-500 to-red-500',
      firstSeen: '21/05/2026', lastSeen: '21/05/2026', totalComments: 1, videosCommented: 1,
      videoNames: ['Tailwind Dashboard Components'], likesReceived: 14, topCommentLikes: 14,
      status: 'New User', joinedAt: '21/05/2026'
    },
    {
      id: 'yt-sarah-1', channelId: 'UC_sarah456', name: 'Sarah Williams', avatar: 'SW', avatarColor: 'from-emerald-500 to-teal-600',
      firstSeen: '22/05/2026', lastSeen: '22/05/2026', totalComments: 1, videosCommented: 1,
      videoNames: ['React Dashboard Setup Guide'], likesReceived: 11, topCommentLikes: 11,
      status: 'New User', joinedAt: '22/05/2026'
    },
    {
      id: 'yt-dev-1', channelId: 'UC_devjournal', name: 'Dev Journal', avatar: 'DJ', avatarColor: 'from-purple-500 to-pink-500',
      firstSeen: '19/05/2026', lastSeen: '19/05/2026', totalComments: 1, videosCommented: 1,
      videoNames: ['YouTube API Comment Fetch Demo'], likesReceived: 7, topCommentLikes: 7,
      status: 'New User', joinedAt: '19/05/2026'
    },
    {
      id: 'yt-code-1', channelId: 'UC_code001', name: 'Code Explorer 1', avatar: 'CE', avatarColor: 'from-amber-500 to-orange-500',
      firstSeen: '22/05/2026', lastSeen: '22/05/2026', totalComments: 1, videosCommented: 1,
      videoNames: ['TypeScript for Admin Panels'], likesReceived: 1, topCommentLikes: 1,
      status: 'New User', joinedAt: '22/05/2026'
    },
  ];
  
  // User Management State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', amount: '' });
  const [userFilter, setUserFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all'); // all, top, active, old
  const [userSearch, setUserSearch] = useState('');
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Transaction Management State
  const [txnSearch, setTxnSearch] = useState('');
  const [txnFilter, setTxnFilter] = useState('all');
  const [txnTypeFilter, setTxnTypeFilter] = useState('all');
  const [txnPage, setTxnPage] = useState(1);
  const txnPerPage = 10;
  const [showAddTxnModal, setShowAddTxnModal] = useState(false);
  const [addTxnForm, setAddTxnForm] = useState({ userId: '', userName: '', amount: '', fundType: 'Support', isNewUser: false });
  
  // Edit Giveaway Handlers
  const handleOpenEdit = (giveaway: GiveawayEvent) => {
    setEditingGiveaway(giveaway);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingGiveaway) return;
    setGiveaways(giveaways.map(g => g.id === editingGiveaway.id ? editingGiveaway : g));
    setShowEditModal(false);
    setEditingGiveaway(null);
  };

  const handleAddTransaction = () => {
    if (!addTxnForm.amount || !addTxnForm.userName) return;
    const amount = parseFloat(addTxnForm.amount);
    let finalUserId = addTxnForm.userId;
    
    // If new user, create them first
    if (addTxnForm.isNewUser) {
      const newUser: User = {
        id: String(users.length + 1),
        name: addTxnForm.userName,
        email: `${addTxnForm.userName.toLowerCase().replace(/ /g, '.')}@example.com`,
        avatar: addTxnForm.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        totalPaid: amount,
        totalWins: 0,
        totalWon: 0,
        totalSent: 0,
        totalDonated: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        paymentCount: 1,
        lastPaymentDate: new Date().toISOString().split('T')[0],
        isActive: true,
        rank: 0
      };
      setUsers([...users, newUser]);
      finalUserId = newUser.id;
    } else if (finalUserId) {
      // Update existing user's total paid, payment count, and last payment date
      setUsers(users.map(u => u.id === finalUserId ? { 
        ...u, 
        totalPaid: u.totalPaid + amount,
        paymentCount: u.paymentCount + 1,
        lastPaymentDate: new Date().toISOString().split('T')[0]
      } : u));
    }
    
    // Add new transaction
    const newTxn = {
      id: String(transactions.length + 1),
      userName: addTxnForm.userName,
      amount: amount,
      fundType: addTxnForm.fundType,
      date: new Date().toLocaleString(),
      status: 'Success' as 'Success'
    };
    setTransactions([newTxn, ...transactions]);
    setShowAddTxnModal(false);
    setAddTxnForm({ userId: '', userName: '', amount: '', fundType: 'Support', isNewUser: false });
  };
  
  // YouTube Logic
  const mockFetchYoutubeVideos = () => {
    if (!youtubeChannelUrl) return;
    setIsFetchingYoutube(true);
    setTimeout(() => {
      const mockVideos: YouTubeVideo[] = [
        { 
          id: 'v1', 
          title: 'TypeScript for Admin Panels', 
          channelId: 'SCMzIvxBSi4', 
          channelName: 'TechMaster Pro',
          thumbnail: 'https://placehold.co/120x90/1e293b/white?text=TS', 
          views: 9300, 
          likes: 610, 
          commentCount: 8, 
          fetchedCount: 2, 
          publishedAt: '2024-05-22', 
          status: 'Syncing',
          description: 'Practical TypeScript patterns for building scalable dashboard interfaces and typed data tables.',
          tags: ['#typescript', '#react', '#admin']
        },
        { 
          id: 'v2', 
          title: 'React Dashboard Setup Guide', 
          channelId: 'dQw4w9WgXcQ', 
          channelName: 'Code Explorer',
          thumbnail: 'https://placehold.co/120x90/1e293b/white?text=React', 
          views: 12400, 
          likes: 850, 
          commentCount: 12, 
          fetchedCount: 3, 
          publishedAt: '2024-05-22', 
          status: 'Completed',
          description: 'Complete guide to setting up a React dashboard with Vite and Tailwind.',
          tags: ['#react', '#vite', '#tailwind']
        },
        { 
          id: 'v3', 
          title: 'Tailwind Dashboard Components', 
          channelId: 'pfaSUyAsgr0', 
          channelName: 'UI Master',
          thumbnail: 'https://placehold.co/120x90/1e293b/white?text=UI', 
          views: 15400, 
          likes: 1200, 
          commentCount: 17, 
          fetchedCount: 2, 
          publishedAt: '2024-05-21', 
          status: 'Completed',
          description: 'Building beautiful dashboard components with Tailwind CSS.',
          tags: ['#tailwind', '#css', '#ui']
        },
      ];
      setYoutubeVideos(mockVideos);
      setIsFetchingYoutube(false);
    }, 1500);
  };

  const mockFetchVideoComments = (videoId: string) => {
    const mockComments: YouTubeComment[] = [
      {
        id: 'c1',
        videoId,
        userName: 'Alex Johnson',
        userId: 'yt-alex-1',
        text: 'Nice explanation of typed table rows and sorting.',
        likes: 9,
        date: '2024-05-22 04:30 PM',
        isTopComment: true
      },
      {
        id: 'c2',
        videoId,
        userName: 'Code Explorer 1',
        userId: 'yt-code-1',
        text: 'Great video on typescript. Very useful overview.',
        likes: 1,
        date: '2024-05-22 04:30 PM',
        isTopComment: false
      },
      {
        id: 'c3',
        videoId,
        userName: 'Sarah Dev',
        userId: 'yt-sarah-1',
        text: 'Can you make a video on Next.js integration?',
        likes: 15,
        date: '2024-05-21 10:15 AM',
        isTopComment: true
      }
    ];
    setVideoComments(mockComments);
  };

  const handleVideoClick = (videoId: string) => {
    setSelectedVideoId(videoId);
    mockFetchVideoComments(videoId);
    setCurrentPage('youtube-video');
  };
  
  // State
  const [users, setUsers] = useState(initialUsers);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [funds, setFunds] = useState(initialFunds);
  const [giveaways, setGiveaways] = useState(initialGiveaways);
  const [winners, setWinners] = useState(initialWinners);
  
  // Current logged in user (for profile page)
  const currentUser = {
    name: 'Aminesh Verma',
    email: 'aminesh@example.com',
    avatar: 'AV',
    totalContribution: 110500,
    walletBalance: 2480,
    funds: { giveaway: 39000, donation: 22500, trading: 31800, support: 17200 }
  };

  // Calculations
  const totalReceived = useMemo(() => transactions.reduce((sum, t) => sum + t.amount, 0), [transactions]);
  const totalGiveaway = useMemo(() => winners.reduce((sum, w) => sum + w.amount, 0), [winners]);
  const totalDonation = useMemo(() => funds.find(f => f.name === 'Donation Fund')?.total || 0, [funds]);

  // Handlers
  const handleMarkAsPaid = () => {
    if (!paymentForm.name || !paymentForm.amount) return;
    setShowVerification(true);
  };

  const handleSubmitVerification = () => {
    if (!verificationForm.name || !verificationForm.transactionId) return;
    
    const existingUser = users.find(u => u.name.toLowerCase() === verificationForm.name.toLowerCase());
    const amount = parseFloat(paymentForm.amount);
    
    if (existingUser) {
      setUsers(users.map(u => 
        u.id === existingUser.id 
          ? { ...u, totalPaid: u.totalPaid + amount }
          : u
      ));
    } else {
      const newUser: User = {
        id: String(users.length + 1),
        name: verificationForm.name,
        email: `${verificationForm.name.toLowerCase().replace(' ', '.')}@example.com`,
        avatar: verificationForm.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        totalPaid: amount,
        totalWins: 0,
        totalWon: 0,
        totalSent: 0,
        totalDonated: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        paymentCount: 1,
        lastPaymentDate: new Date().toISOString().split('T')[0],
        isActive: true,
        rank: 0
      };
      setUsers([...users, newUser]);
    }
    
    const newTransaction: Transaction = {
      id: String(transactions.length + 1),
      userName: verificationForm.name,
      amount: amount,
      fundType: paymentForm.fund.charAt(0).toUpperCase() + paymentForm.fund.slice(1),
      date: new Date().toLocaleString(),
      status: 'Success'
    };
    setTransactions([newTransaction, ...transactions]);
    
    setFunds(funds.map(f => {
      if (f.name.toLowerCase().includes(paymentForm.fund)) {
        return { ...f, total: f.total + amount };
      }
      return f;
    }));
    
    setShowVerification(false);
    setPaymentForm({ name: '', amount: '', fund: 'giveaway' });
    setVerificationForm({ name: '', transactionId: '', screenshot: '' });
    setCurrentPage('dashboard');
  };

  const getEligibleUsers = () => {
    let eligible = [...users];
    
    // Filter by join date
    const today = new Date();
    if (giveawayForm.joinFilter === 'today') {
      const todayStr = today.toISOString().split('T')[0];
      eligible = eligible.filter(u => u.joinedDate === todayStr);
    } else if (giveawayForm.joinFilter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      eligible = eligible.filter(u => new Date(u.joinedDate) >= weekAgo);
    } else if (giveawayForm.joinFilter === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      eligible = eligible.filter(u => new Date(u.joinedDate) >= monthAgo);
    }
    
    // Filter by minimum contribution
    if (giveawayForm.minContribution) {
      const minAmount = parseFloat(giveawayForm.minContribution);
      eligible = eligible.filter(u => u.totalPaid >= minAmount);
    }
    
    // Filter by fund type
    if (giveawayForm.fundFilter !== 'all') {
      // For simplicity, we'll filter based on transaction history
      const fundMap: {[key: string]: string} = {
        'Giveaway': 'Giveaway',
        'Donation': 'Donation',
        'Trading': 'Trading',
        'Support': 'Support'
      };
      eligible = eligible.filter(u => {
        const userTxns = transactions.filter(t => t.userName === u.name);
        if (giveawayForm.fundFilter === 'all') return true;
        return userTxns.some(t => t.fundType === fundMap[giveawayForm.fundFilter]);
      });
    }
    
    // Filter by status
    if (giveawayForm.statusFilter === 'active') {
      eligible = eligible.filter(u => {
        const userTxns = transactions.filter(t => t.userName === u.name);
        return userTxns.length > 0;
      });
    } else if (giveawayForm.statusFilter === 'new') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      eligible = eligible.filter(u => new Date(u.joinedDate) >= weekAgo);
    }
    
    return eligible;
  };

  const previewEligibleUsers = () => {
    const eligible = getEligibleUsers();
    setEligibleUsers(eligible);
    setShowEligiblePreview(true);
  };

  const createGiveawayEvent = () => {
    if (!giveawayForm.amount || !giveawayForm.winners) return;

    const eventType = giveawayForm.type.charAt(0).toUpperCase() + giveawayForm.type.slice(1) as 'Daily' | 'Weekly' | 'Monthly';
    const eventName = `${eventType} Giveaway - ${new Date().toLocaleDateString()}`;

    const newGiveaway: GiveawayEvent = {
      id: String(giveaways.length + 1),
      name: eventName,
      type: eventType,
      amount: parseFloat(giveawayForm.amount),
      winnersCount: parseInt(giveawayForm.winners),
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
      winnerType: giveawayForm.winnerType,
      participantMode:
        giveawayForm.joinFilter === 'today'
          ? 'daily'
          : giveawayForm.joinFilter === 'week'
          ? 'weekly'
          : giveawayForm.joinFilter === 'month'
          ? 'monthly'
          : 'all',
      conditions: {
        joinFilter: giveawayForm.joinFilter,
        minContribution: giveawayForm.minContribution ? parseFloat(giveawayForm.minContribution) : 0,
        fundFilter: giveawayForm.fundFilter,
        statusFilter: giveawayForm.statusFilter,
      },
    };

    setGiveaways([newGiveaway, ...giveaways]);
    setSelectedGiveawayId(newGiveaway.id);
    setCurrentPage('giveaway-detail');
    setShowEligiblePreview(false);
  };

  const getEligibleUsersForEvent = (event: GiveawayEvent) => {
    let eligible = [...users];
    const today = new Date();

    if (event.conditions?.joinFilter === 'today') {
      const todayStr = today.toISOString().split('T')[0];
      eligible = eligible.filter((u) => u.joinedDate === todayStr);
    } else if (event.conditions?.joinFilter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      eligible = eligible.filter((u) => new Date(u.joinedDate) >= weekAgo);
    } else if (event.conditions?.joinFilter === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      eligible = eligible.filter((u) => new Date(u.joinedDate) >= monthAgo);
    }

    if (event.conditions?.minContribution) {
      eligible = eligible.filter((u) => u.totalPaid >= event.conditions!.minContribution);
    }

    if (event.conditions?.fundFilter && event.conditions.fundFilter !== 'all') {
      eligible = eligible.filter((u) => {
        const userTxns = transactions.filter((t) => t.userName === u.name);
        return userTxns.some((t) => t.fundType === event.conditions!.fundFilter);
      });
    }

    if (event.conditions?.statusFilter === 'active') {
      eligible = eligible.filter((u) => transactions.some((t) => t.userName === u.name));
    } else if (event.conditions?.statusFilter === 'new') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      eligible = eligible.filter((u) => new Date(u.joinedDate) >= weekAgo);
    }

    return eligible;
  };

  const handleRunGiveaway = () => {
    if (!selectedGiveawayId) return;

    const event = giveaways.find((g) => g.id === selectedGiveawayId);
    if (!event) return;

    const eligible = getEligibleUsersForEvent(event);
    if (eligible.length === 0) {
      alert('No eligible users found for this giveaway!');
      return;
    }

    setEligibleUsers(eligible);
    setIsRunningGiveaway(true);

    const rollingNames = eligible.map((u) => u.name);
    let tick = 0;
    const interval = window.setInterval(() => {
      setRollingWinnerName(rollingNames[tick % rollingNames.length]);
      tick += 1;
    }, 120);

    window.setTimeout(() => {
      clearInterval(interval);

      const numWinners = Math.min(event.winnersCount, eligible.length);
      const shuffled = [...eligible].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, numWinners);
      const amountPerWinner = event.winnerType === 'single' ? event.amount : Math.floor(event.amount / numWinners);

      const newWinners: Winner[] = selected.map((user, idx) => ({
        id: String(winners.length + idx + 1),
        userName: user.name,
        amount: event.winnerType === 'single' && idx > 0 ? 0 : amountPerWinner,
        date: new Date().toISOString().split('T')[0],
        giveawayName: event.name,
      })).filter((w) => w.amount > 0);

      setUsers(users.map((user) => {
        const match = newWinners.find((w) => w.userName === user.name);
        if (!match) return user;
        return {
          ...user,
          totalWins: user.totalWins + 1,
          totalWon: user.totalWon + match.amount,
        };
      }));

      setWinners([...newWinners, ...winners]);
      setRecentWinners(newWinners);
      setGiveaways(giveaways.map((g) => g.id === event.id ? { ...g, status: 'Completed' } : g));
      setRollingWinnerName('');
      setIsRunningGiveaway(false);
      setWinnerModalOpen(true);
      setCurrentPage('winners');
    }, 2400);
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">Daily Contributions</span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">Transparent Fund Tracking</span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">Giveaway Rewards</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support, Donate & Win Daily Giveaways</h1>
          <p className="text-lg text-white/80 mb-8 max-w-2xl">A single platform for community donations, giveaway participation, creator support, and fund-driven growth — with clear allocation, activity tracking, and a delightful SaaS experience.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <p className="text-white/70 text-sm mb-2">Giveaway Pool</p>
              <p className="text-3xl font-bold">₹{totalGiveaway.toLocaleString()}</p>
              <p className="text-white/60 text-xs mt-2">Live daily rewards from verified contributions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <p className="text-white/70 text-sm mb-2">Community Donations</p>
              <p className="text-3xl font-bold">₹{totalDonation.toLocaleString()}</p>
              <p className="text-white/60 text-xs mt-2">Helping people in need with visible fund growth</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <p className="text-white/70 text-sm mb-2">Fund Allocation Engine</p>
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-400 to-purple-400" style={{ width: '35%' }}></div>
                  </div>
                  <span className="text-xs text-white/80">Giveaway 35%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: '20%' }}></div>
                  </div>
                  <span className="text-xs text-white/80">Donation 20%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-amber-400" style={{ width: '29%' }}></div>
                  </div>
                  <span className="text-xs text-white/80">Trading 29%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-400 to-rose-400" style={{ width: '16%' }}></div>
                  </div>
                  <span className="text-xs text-white/80">Support 16%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-white text-purple-900 rounded-xl font-bold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl">
              Contribute Now
            </button>
            <button className="px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
              Explore Funds
            </button>
          </div>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">Total Amount Received</h3>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">💰</div>
          </div>
          <p className="text-4xl font-bold">₹{totalReceived.toLocaleString()}</p>
          <p className="text-sm opacity-75 mt-2">All contributions combined</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">Total Giveaway Distributed</h3>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🎁</div>
          </div>
          <p className="text-4xl font-bold">₹{totalGiveaway.toLocaleString()}</p>
          <p className="text-sm opacity-75 mt-2">Won by lucky participants</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">Total Donation Amount</h3>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">💚</div>
          </div>
          <p className="text-4xl font-bold">₹{totalDonation.toLocaleString()}</p>
          <p className="text-sm opacity-75 mt-2">Helping those in need</p>
        </div>
      </div>

      {/* Fund Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Fund</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {funds.map((fund) => (
            <div key={fund.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${fund.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {fund.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{fund.name}</h3>
                  <p className="text-sm text-gray-500">{fund.description}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Current Total</p>
                <p className="text-3xl font-bold text-gray-900">₹{fund.total.toLocaleString()}</p>
              </div>
              <button 
                onClick={() => {
                  setPaymentForm({ ...paymentForm, fund: fund.name.split(' ')[0].toLowerCase() });
                  setShowVerification(false);
                }}
                className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${fund.color} hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg`}
              >
                Contribute
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Contribution</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
              <input 
                type="text"
                value={paymentForm.name}
                onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
              <input 
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fund Type (Optional)</label>
              <select
                value={paymentForm.fund}
                onChange={(e) => setPaymentForm({ ...paymentForm, fund: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="giveaway">Giveaway Fund</option>
                <option value="donation">Donation Fund</option>
                <option value="trading">Trading Fund</option>
                <option value="support">Support Fund</option>
              </select>
            </div>
            <button 
              onClick={handleMarkAsPaid}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              I Have Paid
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4 mb-4">
              <button 
                onClick={() => setShowPaymentMethod('upi')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${showPaymentMethod === 'upi' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                UPI ID
              </button>
              <button 
                onClick={() => setShowPaymentMethod('qr')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${showPaymentMethod === 'qr' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                QR Code
              </button>
            </div>
            
            {showPaymentMethod === 'upi' ? (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">UPI Payment</h3>
                <div className="bg-white rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">UPI ID</p>
                  <p className="text-2xl font-bold text-indigo-600">aminesh@upi</p>
                </div>
                <p className="text-sm text-gray-600">Scan or use the UPI ID above to make payment</p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">QR Code Payment</h3>
                <div className="bg-white rounded-xl p-6 flex items-center justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-2">📱</div>
                      <p className="text-sm font-semibold">QR Code</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center">Scan this QR code to make payment</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Verification</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                <input 
                  type="text"
                  value={verificationForm.name}
                  onChange={(e) => setVerificationForm({ ...verificationForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction ID</label>
                <input 
                  type="text"
                  value={verificationForm.transactionId}
                  onChange={(e) => setVerificationForm({ ...verificationForm, transactionId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="Enter transaction ID"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Screenshot (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm text-gray-600">Click to upload screenshot</p>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowVerification(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitVerification}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Next Giveaways / Coming Soon */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🚀 Next Giveaways</h2>
            <p className="text-gray-500 text-sm">Upcoming events and winner announcements</p>
          </div>
          <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
            Coming Soon
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {giveaways.filter(g => g.status === 'Active').map((g) => (
            <div key={g.id} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/10">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold uppercase tracking-wider">{g.type}</span>
                  <span className="px-3 py-1 bg-yellow-400/90 text-yellow-900 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-yellow-700 rounded-full animate-ping"></span>
                    Coming Soon
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{g.name}</h3>
                <p className="text-white/60 text-sm mb-6">Get ready! Winners will be selected randomly from eligible users.</p>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 uppercase tracking-wide font-bold">Winner Announcement</p>
                      <p className="font-bold text-sm">{g.date} at 08:00 PM IST</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-wide font-bold">Prize Pool</p>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">₹{g.amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/50 uppercase tracking-wide font-bold">Winners</p>
                    <p className="text-2xl font-bold">{g.winnersCount}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {giveaways.filter(g => g.status === 'Active').length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-gray-500 font-medium">No upcoming giveaways. Stay tuned!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Payments</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider rounded-tl-xl">User Name</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider rounded-tr-xl">Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 8).map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-indigo-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">{transaction.userName}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-lg font-bold text-indigo-600">₹{transaction.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">{transaction.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => {
    const today = new Date().toISOString().split('T')[0];
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthAgoStr = monthAgo.toISOString().split('T')[0];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0];

    let filteredUsers = users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
      if (userFilter === 'daily') return matchesSearch && u.joinedDate === today;
      if (userFilter === 'monthly') return matchesSearch && u.joinedDate >= monthAgoStr;
      return matchesSearch;
    });

    // Apply Type Filter
    if (userTypeFilter === 'top') {
      filteredUsers = filteredUsers.filter(u => u.totalPaid > 10000).sort((a, b) => b.totalPaid - a.totalPaid);
    } else if (userTypeFilter === 'active') {
      filteredUsers = filteredUsers.filter(u => u.paymentCount >= 3).sort((a, b) => b.paymentCount - a.paymentCount);
    } else if (userTypeFilter === 'recent') {
      filteredUsers = filteredUsers.filter(u => u.lastPaymentDate && u.lastPaymentDate >= monthAgoStr).sort((a, b) => (b.lastPaymentDate || '').localeCompare(a.lastPaymentDate || ''));
    } else if (userTypeFilter === 'old') {
      filteredUsers = filteredUsers.filter(u => u.joinedDate < sixMonthsAgoStr);
    }

    // Sort by total paid descending for ranking
    filteredUsers = [...filteredUsers].sort((a, b) => b.totalPaid - a.totalPaid);

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add User
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Search users..." 
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="flex bg-gray-100 rounded-xl p-1">
              {['all', 'daily', 'monthly'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setUserFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    userFilter === filter 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* User Type Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All Users', icon: null },
              { id: 'top', label: 'Top Payers', icon: '👑' },
              { id: 'active', label: 'Most Active', icon: '⚡' },
              { id: 'recent', label: 'Recent Paid', icon: '🕒' },
              { id: 'old', label: 'Old / Loyal', icon: '🏛️' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setUserTypeFilter(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  userTypeFilter === type.id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {type.icon && <span>{type.icon}</span>}
                {type.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider rounded-tl-xl">Rank</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">User</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">Total Paid</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">Total Won</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">Total Donated</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">Payments</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">Recent Paid</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => {
                  const rank = index + 1;
                  const displayRank = user.rank > 0 ? user.rank : rank; // admin override or auto
                  const joinedDays = Math.max(1, Math.floor((Date.now() - new Date(user.joinedDate).getTime()) / (1000 * 60 * 60 * 24)));
                  const isTop = displayRank === 1;

                  return (
                  <tr key={user.id} className={`border-b border-gray-100 hover:bg-indigo-50 transition-colors group ${isTop && userTypeFilter !== 'all' ? '' : ''}`}>
                    {/* Rank */}
                    <td className="py-3 px-4">
                      {displayRank <= 3 ? (
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          displayRank === 1 ? 'bg-yellow-100 text-yellow-700' :
                          displayRank === 2 ? 'bg-gray-200 text-gray-700' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          #{displayRank}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm font-medium pl-2">#{displayRank}</span>
                      )}
                    </td>
                    {/* User */}
                    <td className="py-3 px-4">
                      <div className="flex items-center cursor-pointer" onClick={() => setSelectedUserId(user.id)}>
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors">{user.name}</p>
                          <p className="text-[10px] text-gray-400">{joinedDays} days ago</p>
                        </div>
                      </div>
                    </td>
                    {/* Total Paid */}
                    <td className="py-3 px-4">
                      <span className="text-sm font-bold text-indigo-600">₹{user.totalPaid.toLocaleString()}</span>
                    </td>
                    {/* Total Won */}
                    <td className="py-3 px-4">
                      <span className="text-sm font-bold text-purple-600">₹{user.totalWon.toLocaleString()}</span>
                    </td>
                    {/* Total Donated */}
                    <td className="py-3 px-4">
                      <span className="text-sm font-bold text-orange-600">₹{user.totalDonated.toLocaleString()}</span>
                    </td>
                    {/* Payments Count */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="text-sm font-bold text-gray-900">{user.paymentCount}</span>
                        <span className="text-[10px] text-gray-400 ml-1">txns</span>
                      </div>
                    </td>
                    {/* Recent Paid */}
                    <td className="py-3 px-4">
                      <span className="text-xs text-gray-600">{user.lastPaymentDate || '-'}</span>
                    </td>
                    {/* Status */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {!user.isActive && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-bold">🚫 Inactive</span>}
                        {user.isActive && displayRank <= 3 && <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${displayRank === 1 ? 'bg-yellow-100 text-yellow-700' : displayRank === 2 ? 'bg-gray-200 text-gray-700' : 'bg-orange-100 text-orange-700'}`}>🏆 #{displayRank}</span>}
                        {user.isActive && user.paymentCount >= 5 && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">⚡ Active</span>}
                        {user.isActive && joinedDays > 180 && <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[10px] font-bold">🏛️ Loyal</span>}
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setUsers(users.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u)); }}
                          className={`p-1.5 rounded-lg transition-colors ${user.isActive ? 'text-green-600 hover:bg-green-50' : 'text-red-500 hover:bg-red-50'}`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                          )}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingUser(user); setShowEditUserModal(true); }}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setAddTxnForm({ userId: user.id, userName: user.name, amount: '', fundType: 'Support', isNewUser: false }); setShowAddTxnModal(true); }}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Add Payment"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">No users found matching your criteria.</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderUserDetail = () => {
    if (!selectedUserId) return null;
    const user = users.find(u => u.id === selectedUserId);
    if (!user) return null;
    
    // Calculate Top User for Status Badges
    const topUserByPaid = users.reduce((prev, current) => (prev.totalPaid > current.totalPaid) ? prev : current, users[0] || {});
    
    const userTransactions = transactions.filter(t => t.userName === user.name);
    const userWins = winners.filter(w => w.userName === user.name);
    
    return (
      <div className="space-y-6">
        {/* Back Button & Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedUserId(null)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            <Icons.ChevronLeft />
            Back to Users
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => { setAddTxnForm({ userId: user.id, userName: user.name, amount: '', fundType: 'Support', isNewUser: false }); setShowAddTxnModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Add Payment
            </button>
            <button
              onClick={() => { setEditingUser(user); setShowEditUserModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-8 md:p-12">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl font-bold text-white border-4 border-white/30 shadow-xl">
              {user.avatar}
            </div>
            <div className="text-center md:text-left text-white">
              <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
              <p className="text-white/80 text-lg mb-4">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                  <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Total Paid</p>
                  <p className="text-xl font-bold">₹{user.totalPaid.toLocaleString()}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                  <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Total Won</p>
                  <p className="text-xl font-bold">₹{user.totalWon.toLocaleString()}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                  <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Total Sent</p>
                  <p className="text-xl font-bold">₹{user.totalSent.toLocaleString()}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                  <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Member Since</p>
                  <p className="text-xl font-bold">{user.joinedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {/* Main Financial Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl">💰</div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Paid</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{user.totalPaid.toLocaleString()}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl">🎉</div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Won</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{user.totalWon.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-xl">📤</div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Sent</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{user.totalSent.toLocaleString()}</p>
          </div>
        </div>

        {/* Activity & Status Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">💳</div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Payment Count</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{user.paymentCount} Transactions</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl">🏆</div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Current Status</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.id === topUserByPaid.id && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">🏆 #1 Top Payer</span>}
              {user.paymentCount >= 3 && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">⚡ Active</span>}
              {user.joinedDate < '2024-06-01' && <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">🏛️ Old User</span>}
              {user.lastPaymentDate && user.lastPaymentDate >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] && <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">🕒 Recent</span>}
              {user.id !== topUserByPaid.id && user.paymentCount < 3 && user.joinedDate >= '2024-06-01' && (!user.lastPaymentDate || user.lastPaymentDate < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) && (
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">👤 Standard</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transaction History */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider rounded-tl-xl">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">Fund</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider rounded-tr-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {userTransactions.length > 0 ? (
                    userTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-xs text-gray-600">{transaction.date.split(' ')[0]}</span>
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-indigo-600">₹{transaction.amount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold uppercase tracking-tight">{transaction.fundType}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-md text-[10px] font-bold">{transaction.status}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="py-8 text-center text-xs text-gray-400 italic">No payments recorded.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Win History */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Winning History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-emerald-50">
                    <th className="text-left py-3 px-4 text-xs font-bold text-emerald-900 uppercase tracking-wider rounded-tl-xl">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-emerald-900 uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-emerald-900 uppercase tracking-wider rounded-tr-xl">Giveaway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {userWins.length > 0 ? (
                    userWins.map((win) => (
                      <tr key={win.id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-xs text-gray-600">{win.date}</span>
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-emerald-600">₹{win.amount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold text-gray-700">{win.giveawayName}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="py-8 text-center text-xs text-gray-400 italic">No wins yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTransactions = () => {
    const totalPaidAmount = users.reduce((sum, u) => sum + u.totalPaid, 0);
    const totalWonAmount = users.reduce((sum, u) => sum + u.totalWon, 0);
    const totalDonatedAmount = users.reduce((sum, u) => sum + u.totalDonated, 0);

    const today = new Date().toISOString().split('T')[0];
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthAgoStr = monthAgo.toISOString().split('T')[0];

    let filteredTxns = transactions.filter(t => {
      const matchesSearch = t.userName.toLowerCase().includes(txnSearch.toLowerCase());
      if (txnFilter === 'daily') return matchesSearch && t.date.startsWith(today.split(' ')[0]);
      if (txnFilter === 'monthly') return matchesSearch && t.date >= monthAgoStr;
      return matchesSearch;
    });

    if (txnTypeFilter !== 'all') {
      filteredTxns = filteredTxns.filter(t => {
        if (txnTypeFilter === 'paid') return t.fundType === 'Support' || t.fundType === 'Giveaway' || t.fundType === 'Trading';
        if (txnTypeFilter === 'won') return t.fundType === 'Won' || t.fundType === 'Giveaway Won';
        if (txnTypeFilter === 'donated') return t.fundType === 'Donation';
        return true;
      });
    }

    const totalPages = Math.ceil(filteredTxns.length / txnPerPage);
    const paginatedTxns = filteredTxns.slice((txnPage - 1) * txnPerPage, txnPage * txnPerPage);

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">All Transactions</h2>
          <button 
            onClick={() => { setAddTxnForm({ userId: '', userName: '', amount: '', fundType: 'Support', isNewUser: false }); setShowAddTxnModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Transaction
          </button>
        </div>
        
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-indigo-100 text-sm font-medium mb-1">Total Transactions</p>
            <p className="text-3xl font-bold">{transactions.length}</p>
            <p className="text-indigo-200 text-xs mt-1">All records</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-emerald-100 text-sm font-medium mb-1">Total Paid</p>
            <p className="text-3xl font-bold">₹{totalPaidAmount.toLocaleString()}</p>
            <p className="text-emerald-200 text-xs mt-1">All user contributions</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-purple-100 text-sm font-medium mb-1">Total Won</p>
            <p className="text-3xl font-bold">₹{totalWonAmount.toLocaleString()}</p>
            <p className="text-purple-200 text-xs mt-1">Giveaway winnings distributed</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-amber-100 text-sm font-medium mb-1">Total Donated</p>
            <p className="text-3xl font-bold">₹{totalDonatedAmount.toLocaleString()}</p>
            <p className="text-amber-200 text-xs mt-1">Charity & support funds</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          {/* Search + Date Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Search by user name..." 
                value={txnSearch}
                onChange={(e) => { setTxnSearch(e.target.value); setTxnPage(1); }}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="flex bg-gray-100 rounded-xl p-1">
              {['all', 'daily', 'monthly'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => { setTxnFilter(filter); setTxnPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    txnFilter === filter 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter Pills */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'paid', label: 'Total Paid (Support/Giveaway/Trading)' },
              { id: 'won', label: 'Total Won (Giveaway Wins)' },
              { id: 'donated', label: 'Total Donated (Charity)' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => { setTxnTypeFilter(type.id); setTxnPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  txnTypeFilter === type.id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
            <span>{filteredTxns.length} transactions found</span>
            <span>Page {txnPage} of {Math.max(1, totalPages)}</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider rounded-tl-xl">User</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">Fund Type</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">User Total Paid</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider rounded-tr-xl">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTxns.map((transaction) => {
                  const txnUser = users.find(u => u.name === transaction.userName);
                  return (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-indigo-50 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center cursor-pointer" onClick={() => { if (txnUser) setSelectedUserId(txnUser.id); }}>
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">
                          {transaction.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors">{transaction.userName}</p>
                          {txnUser && <p className="text-[10px] text-gray-400">{txnUser.paymentCount} total payments</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-bold text-indigo-600">₹{transaction.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        transaction.fundType === 'Support' ? 'bg-blue-50 text-blue-700' :
                        transaction.fundType === 'Donation' ? 'bg-amber-50 text-amber-700' :
                        transaction.fundType === 'Giveaway' ? 'bg-purple-50 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {transaction.fundType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {txnUser ? (
                        <span className="text-sm font-bold text-emerald-600">₹{txnUser.totalPaid.toLocaleString()}</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-gray-600">{transaction.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        transaction.status === 'Success' ? 'bg-green-100 text-green-700' :
                        transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
            {filteredTxns.length === 0 && (
              <div className="text-center py-12 text-gray-500">No transactions found matching your criteria.</div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setTxnPage(Math.max(1, txnPage - 1))}
                disabled={txnPage === 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setTxnPage(page)}
                    className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                      txnPage === page 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setTxnPage(Math.min(totalPages, txnPage + 1))}
                disabled={txnPage === totalPages}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFunds = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {funds.map((fund) => (
          <div key={fund.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${fund.color} flex items-center justify-center text-3xl shadow-lg`}>
                {fund.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{fund.name}</h3>
                <p className="text-sm text-gray-500">{fund.description}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">₹{fund.total.toLocaleString()}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${fund.color}`} style={{ width: `${(fund.total / totalReceived) * 100}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{((fund.total / totalReceived) * 100).toFixed(1)}% of total</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGiveaways = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">🎁 Create New Giveaway</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Giveaway Type</label>
            <select
              className="w-full px-4 py-3 rounded-xl border-2 border-white/30 bg-white/20 text-white focus:outline-none focus:border-white"
              value={giveawayForm.type}
              onChange={(e) => setGiveawayForm({ ...giveawayForm, type: e.target.value })}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total Amount (₹)</label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl border-2 border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:border-white"
              placeholder="10000"
              value={giveawayForm.amount}
              onChange={(e) => setGiveawayForm({ ...giveawayForm, amount: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Number of Winners</label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl border-2 border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:border-white"
              placeholder="5"
              value={giveawayForm.winners}
              onChange={(e) => setGiveawayForm({ ...giveawayForm, winners: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Winner Selection Type</label>
          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="winnerType"
                value="single"
                checked={giveawayForm.winnerType === 'single'}
                onChange={(e) => setGiveawayForm({ ...giveawayForm, winnerType: e.target.value as 'single' | 'multiple' })}
              />
              <span>Single win</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="winnerType"
                value="multiple"
                checked={giveawayForm.winnerType === 'multiple'}
                onChange={(e) => setGiveawayForm({ ...giveawayForm, winnerType: e.target.value as 'single' | 'multiple' })}
              />
              <span>Multiple win</span>
            </label>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1">Join Users</label>
            <select
              className="w-full px-3 py-2 rounded-lg border-2 border-white/30 bg-white/20 text-white text-sm focus:outline-none focus:border-white"
              value={giveawayForm.joinFilter}
              onChange={(e) => setGiveawayForm({ ...giveawayForm, joinFilter: e.target.value })}
            >
              <option value="all">All Users</option>
              <option value="today">Daily Join Users</option>
              <option value="week">Weekly Join Users</option>
              <option value="month">Monthly Join Users</option>
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">Minimum Contribution (₹)</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded-lg border-2 border-white/30 bg-white/20 text-white text-sm placeholder-white/70 focus:outline-none focus:border-white"
              placeholder="Optional"
              value={giveawayForm.minContribution}
              onChange={(e) => setGiveawayForm({ ...giveawayForm, minContribution: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Fund Type</label>
            <select
              className="w-full px-3 py-2 rounded-lg border-2 border-white/30 bg-white/20 text-white text-sm focus:outline-none focus:border-white"
              value={giveawayForm.fundFilter}
              onChange={(e) => setGiveawayForm({ ...giveawayForm, fundFilter: e.target.value })}
            >
              <option value="all">All Funds</option>
              <option value="Giveaway">Giveaway Fund Only</option>
              <option value="Donation">Donation Fund Only</option>
              <option value="Trading">Trading Fund Only</option>
              <option value="Support">Support Fund Only</option>
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">User Status</label>
            <select
              className="w-full px-3 py-2 rounded-lg border-2 border-white/30 bg-white/20 text-white text-sm focus:outline-none focus:border-white"
              value={giveawayForm.statusFilter}
              onChange={(e) => setGiveawayForm({ ...giveawayForm, statusFilter: e.target.value })}
            >
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="new">New Users</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={previewEligibleUsers}
            className="flex-1 bg-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors border-2 border-white/30"
          >
            👁 Preview Users
          </button>
          <button
            onClick={createGiveawayEvent}
            className="flex-1 bg-white text-indigo-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            ➕ Create Giveaway
          </button>
        </div>
      </div>

      {/* Eligible Users Preview */}
      {showEligiblePreview && eligibleUsers.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">📋 Eligible Users Preview</h3>
            <button 
              onClick={() => setShowEligiblePreview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 mb-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Total Eligible</p>
                <p className="text-2xl font-bold text-indigo-600">{eligibleUsers.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Selected Winners</p>
                <p className="text-2xl font-bold text-purple-600">{giveawayForm.winners || 1}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Win Chance</p>
                <p className="text-2xl font-bold text-pink-600">{((Number(giveawayForm.winners) || 1) / eligibleUsers.length * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Paid</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fund</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {eligibleUsers.slice(0, 10).map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                          {user.avatar}
                        </div>
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-indigo-600 font-semibold">₹{user.totalPaid.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">{user.joinedDate}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                        Giveaway
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {eligibleUsers.length > 10 && (
              <p className="text-center text-gray-500 text-sm py-4">
                + {eligibleUsers.length - 10} more eligible users
              </p>
            )}
          </div>
        </div>
      )}

      {/* Active Giveaways */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Giveaways</h2>
        {giveaways.filter(g => g.status === 'Active').length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {giveaways.filter(g => g.status === 'Active').map((giveaway) => (
              <div
                key={giveaway.id}
                className="group relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-100 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 text-left overflow-hidden flex flex-col"
              >
                <div 
                  onClick={() => {
                    setSelectedGiveawayId(giveaway.id);
                    setCurrentPage('giveaway-detail');
                  }}
                  className="cursor-pointer flex-1"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Icons.ChevronRight />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-wider">{giveaway.type}</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Active</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{giveaway.name}</h3>
                  <div className="space-y-3 bg-white/50 rounded-xl p-4 border border-indigo-50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Prize Pool</span>
                      <span className="text-lg font-bold text-indigo-600">₹{giveaway.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-indigo-100/50 pt-2">
                      <span className="text-sm text-gray-500">Winners</span>
                      <span className="text-lg font-bold text-purple-600">{giveaway.winnersCount} {giveaway.winnerType === 'single' ? ' (Single)' : ' (Split)'}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400 font-medium">
                    <span>Created {giveaway.date}</span>
                    <span className="text-indigo-500 font-bold group-hover:translate-x-1 transition-transform">Click to Run →</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-indigo-100 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(giveaway);
                    }}
                    className="flex-1 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500 font-medium">No active giveaways. Create one above to get started!</p>
          </div>
        )}
      </div>

      {/* Giveaway History */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Giveaway History</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:outline-none text-sm"
            />
            <div className="flex bg-gray-100 rounded-xl p-1">
              {['All', 'Daily', 'Weekly', 'Monthly'].map((type) => (
                <button
                  key={type}
                  onClick={() => setHistoryTypeFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    historyTypeFilter === type 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {(() => {
          const filteredHistory = giveaways
            .filter(g => g.status === 'Completed')
            .filter(g => historyTypeFilter === 'All' || g.type === historyTypeFilter)
            .filter(g => g.name.toLowerCase().includes(historySearch.toLowerCase()));

          return filteredHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHistory.map((giveaway) => (
                <button
                  key={giveaway.id}
                  onClick={() => {
                    setSelectedGiveawayId(giveaway.id);
                    setCurrentPage('giveaway-detail');
                  }}
                  className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Icons.ChevronRight />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider">{giveaway.type}</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">Completed</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{giveaway.name}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
                      <span className="text-sm text-gray-500">Prize Pool</span>
                      <span className="text-lg font-bold text-indigo-600">₹{giveaway.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                      <span className="text-sm text-gray-500">Winners</span>
                      <span className="text-lg font-bold text-emerald-600">{giveaway.winnersCount}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400 font-medium">
                    <span>Completed {giveaway.date}</span>
                    <span className="text-emerald-500 font-bold">View Results →</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-500 font-medium">No history found matching your filters.</p>
            </div>
          );
        })()}
      </div>
    </div>
  );

  const renderGiveawayDetail = () => {
    if (!selectedGiveawayId) return null;
    const event = giveaways.find((g) => g.id === selectedGiveawayId);
    if (!event) return null;
    const previewUsers = getEligibleUsersForEvent(event);

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedGiveawayId(null)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          <Icons.ChevronLeft />
          Back to Giveaways
        </button>

        <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-white/70 text-sm mb-2">Active Giveaway Preview</p>
              <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-white/15">{event.type}</span>
                <span className="px-3 py-1 rounded-full bg-white/15">{event.winnerType === 'single' ? 'Single win' : 'Multiple win'}</span>
                <span className="px-3 py-1 rounded-full bg-white/15">{event.participantMode || 'all'} users</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-4 min-w-[140px]">
                <p className="text-white/70 text-sm">Prize Pool</p>
                <p className="text-2xl font-bold">₹{event.amount.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 min-w-[140px]">
                <p className="text-white/70 text-sm">Eligible Users</p>
                <p className="text-2xl font-bold">{previewUsers.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Preview Users</h2>
                <p className="text-sm text-gray-500">These users can join this giveaway based on selected conditions.</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-semibold">
                {previewUsers.length} Users
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase">User</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase">Paid</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase">Wins</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {previewUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-indigo-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-indigo-600">₹{user.totalPaid.toLocaleString()}</td>
                      <td className="py-4 px-6"><span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">{user.totalWins}</span></td>
                      <td className="py-4 px-6 text-sm text-gray-600">{user.joinedDate}</td>
                    </tr>
                  ))}
                  {previewUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-gray-500">No eligible users for this giveaway.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Conditions</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Join filter</span><span className="font-semibold text-gray-900">{event.conditions?.joinFilter || 'all'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Min contribution</span><span className="font-semibold text-gray-900">₹{(event.conditions?.minContribution || 0).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Fund</span><span className="font-semibold text-gray-900">{event.conditions?.fundFilter || 'all'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-semibold text-gray-900">{event.conditions?.statusFilter || 'all'}</span></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-2">Run Giveaway</h3>
              <p className="text-white/80 text-sm mb-4">Randomly select winner users from the preview list.</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-white/70 text-xs">Winner option</p>
                  <p className="font-bold">{event.winnerType === 'single' ? 'Single' : 'Multiple'}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-white/70 text-xs">Winner count</p>
                  <p className="font-bold">{event.winnersCount}</p>
                </div>
              </div>
              <button
                onClick={handleRunGiveaway}
                disabled={isRunningGiveaway || previewUsers.length === 0 || event.status === 'Completed'}
                className="w-full py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isRunningGiveaway ? 'Selecting Winners...' : event.status === 'Completed' ? 'Giveaway Completed' : '🎉 Run Random Giveaway'}
              </button>
              {isRunningGiveaway && (
                <div className="mt-4 rounded-2xl bg-white/10 border border-white/20 p-4 text-center animate-pulse">
                  <p className="text-white/70 text-sm mb-1">Rolling through users...</p>
                  <p className="text-2xl font-bold">{rollingWinnerName}</p>
                </div>
              )}
            </div>

            {event.status === 'Completed' && (
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">🏆</div>
                  <h3 className="text-lg font-bold text-gray-900">Giveaway Winners</h3>
                </div>
                <div className="space-y-3">
                  {winners.filter(w => w.giveawayName === event.name).map((winner) => (
                    <div key={winner.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div>
                        <p className="font-bold text-gray-900">{winner.userName}</p>
                        <p className="text-xs text-gray-500">{winner.date}</p>
                      </div>
                      <p className="text-lg font-bold text-emerald-600">₹{winner.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderWinners = () => (
    <div className="space-y-6">
      {winners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {winners.slice(0, 3).map((winner, idx) => (
            <div key={winner.id} className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🎉</div>
                  <div>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Recent Winner</p>
                    <h3 className="text-lg font-bold">{winner.userName}</h3>
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1">₹{winner.amount.toLocaleString()}</p>
                <p className="text-white/70 text-xs">{winner.giveawayName}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Winner Leaderboard</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider rounded-tl-xl">User</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider">Total Wins</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider">Total Won</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider">Winning History</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider rounded-tr-xl">Last Win</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.totalWins > 0).map((user) => {
                const userWins = winners.filter(w => w.userName === user.name);
                const totalWon = userWins.reduce((sum, w) => sum + w.amount, 0);
                const lastWin = userWins[0];
                return (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-indigo-50 transition-colors cursor-pointer" onClick={() => setSelectedUserId(user.id)}>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {user.avatar}
                        </div>
                        <span className="font-semibold text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">{user.totalWins}</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-indigo-600">
                      ₹{totalWon.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-[300px]">
                        {userWins.slice(0, 3).map(win => (
                          <span key={win.id} className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 whitespace-nowrap">
                            {win.giveawayName}
                          </span>
                        ))}
                        {userWins.length > 3 && <span className="text-[10px] text-indigo-500">+{userWins.length - 3} more</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {lastWin && (
                        <div>
                          <p className="text-sm font-semibold text-gray-900">₹{lastWin.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{lastWin.date}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Giveaway History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider rounded-tl-xl">Event</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider">Type</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider">Winners</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider">Total Amount</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider rounded-tr-xl">Date</th>
              </tr>
            </thead>
            <tbody>
              {giveaways.filter(g => g.status === 'Completed').map((giveaway) => (
                <tr 
                  key={giveaway.id} 
                  className="border-b border-gray-100 hover:bg-indigo-50 transition-colors cursor-pointer group"
                  onClick={() => {
                    setSelectedGiveawayId(giveaway.id);
                    setCurrentPage('giveaway-detail');
                  }}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-indigo-600 group-hover:underline">
                      <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{giveaway.name}</span>
                      <Icons.ChevronRight />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider">{giveaway.type}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-lg font-bold text-purple-600">{giveaway.winnersCount}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-lg font-bold text-emerald-600">₹{giveaway.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">{giveaway.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-8 md:p-12">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl font-bold text-white border-4 border-white/30 shadow-xl">
            {currentUser.avatar}
          </div>
          <div className="text-center md:text-left text-white">
            <h1 className="text-4xl font-bold mb-2">{currentUser.name}</h1>
            <p className="text-white/80 text-lg mb-4">{currentUser.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <p className="text-white/80 text-sm">Total Contribution</p>
                <p className="text-2xl font-bold">₹{currentUser.totalContribution.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <p className="text-white/80 text-sm">Wallet Balance</p>
                <p className="text-2xl font-bold">₹{currentUser.walletBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fund Breakdown */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Fund Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg">
                🎁
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Giveaway</p>
                <p className="text-2xl font-bold text-gray-900">₹{currentUser.funds.giveaway.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl shadow-lg">
                💚
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Donation</p>
                <p className="text-2xl font-bold text-gray-900">₹{currentUser.funds.donation.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-2xl shadow-lg">
                📈
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Trading</p>
                <p className="text-2xl font-bold text-gray-900">{currentUser.funds.trading.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-2xl shadow-lg">
                ☕
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Support</p>
                <p className="text-2xl font-bold text-gray-900">₹{currentUser.funds.support.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider rounded-tl-xl">Date</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider">Fund</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider">Transaction ID</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-indigo-900 uppercase tracking-wider rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.filter(t => t.userName === currentUser.name).map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-indigo-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">{transaction.date.split(' ')[0]}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-lg font-bold text-indigo-600">₹{transaction.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">{transaction.fundType}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600 font-mono">TXN{transaction.id.padStart(3, '0')}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">{transaction.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setSettingsTab('import')}
            className={`px-6 py-4 text-sm font-semibold transition-colors ${settingsTab === 'import' ? 'text-red-600 border-b-2 border-red-600 bg-red-50/50' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Video Import
          </button>
          <button 
            onClick={() => setSettingsTab('api')}
            className={`px-6 py-4 text-sm font-semibold transition-colors ${settingsTab === 'api' ? 'text-red-600 border-b-2 border-red-600 bg-red-50/50' : 'text-gray-500 hover:text-gray-900'}`}
          >
            API Configuration
          </button>
        </div>

        <div className="p-6">
          {settingsTab === 'import' && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center"><Icons.Youtube /></div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Video Import Panel</h3>
                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">YouTube Data API v3</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      Fetch Channel Videos
                    </h4>
                    <div className="flex gap-2 mb-3">
                      <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></div>
                        <input 
                          type="text" 
                          placeholder="Channel ID (e.g. UCxxxxxx)" 
                          value={youtubeChannelUrl}
                          onChange={(e) => setYoutubeChannelUrl(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <button 
                        onClick={mockFetchYoutubeVideos}
                        disabled={isFetchingYoutube}
                        className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Fetch Channel
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Fetches all public videos from the specified YouTube channel</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      Add Single Video
                    </h4>
                    <div className="flex gap-2 mb-3">
                      <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></div>
                        <input 
                          type="text" 
                          placeholder="YouTube URL or Video ID" 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <button className="px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 whitespace-nowrap">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Video
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Add a specific video by URL (youtube.com/watch?v=...) or Video ID</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {settingsTab === 'api' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">YouTube Data API v3 Configuration</h3>
                <p className="text-sm text-gray-500 mb-6">Enter your API key to enable real-time fetching of YouTube videos and comments.</p>
                
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 mb-2">API Key</label>
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy..." 
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none font-mono"
                    />
                    <button className="px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                      Save Key
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Your API key is stored locally and never shared.</p>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h4 className="text-sm font-bold text-blue-900 mb-2">How to get an API Key?</h4>
                <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
                  <li>Go to <a href="#" className="underline">Google Cloud Console</a></li>
                  <li>Create a new project or select an existing one.</li>
                  <li>Enable "YouTube Data API v3".</li>
                  <li>Go to "Credentials" and create an API Key.</li>
                  <li>Copy and paste it above.</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderYouTubeHome = () => {
    const totalViews = youtubeVideos.reduce((sum, v) => sum + v.views, 0);
    const totalComments = youtubeVideos.reduce((sum, v) => sum + v.commentCount, 0);
    const totalFetched = youtubeVideos.reduce((sum, v) => sum + v.fetchedCount, 0);

    return (
      <div className="space-y-6">
        {youtubeVideos.length > 0 && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-4">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center"><Icons.Youtube /></div>
                <div><p className="text-2xl font-bold text-gray-900">{youtubeVideos.length}</p><p className="text-xs text-gray-500">Total Videos</p></div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></div>
                <div><p className="text-2xl font-bold text-gray-900">{(totalViews / 1000).toFixed(1)}K</p><p className="text-xs text-gray-500">Total Views</p></div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></div>
                <div><p className="text-2xl font-bold text-gray-900">{totalComments}</p><p className="text-xs text-gray-500">Total Comments</p></div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
                <div><p className="text-2xl font-bold text-gray-900">{totalFetched}</p><p className="text-xs text-gray-500">Comments Fetched</p></div>
              </div>
            </div>

            {/* Video Table */}
            {(() => {
              const today = new Date().toISOString().split('T')[0];
              const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              
              const todayVideos = youtubeVideos.filter(v => v.publishedAt === today);
              const weekVideos = youtubeVideos.filter(v => v.publishedAt >= weekAgo && v.publishedAt !== today);
              
              let displayedVideos = youtubeVideos;
              if (ytVideoTab === 'today') displayedVideos = todayVideos;
              else if (ytVideoTab === 'week') displayedVideos = weekVideos;
              else if (ytVideoTab === 'older') displayedVideos = youtubeVideos.filter(v => v.publishedAt < weekAgo);

              if (ytVideoSearch) {
                displayedVideos = displayedVideos.filter(v => v.title.toLowerCase().includes(ytVideoSearch.toLowerCase()));
              }

              return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-6 text-sm font-semibold text-gray-500">
                  {[
                    { id: 'all', label: 'All Videos', count: youtubeVideos.length },
                    { id: 'today', label: "Today's Videos", count: todayVideos.length },
                    { id: 'week', label: 'This Week', count: weekVideos.length },
                    { id: 'older', label: 'Older', count: youtubeVideos.filter(v => v.publishedAt < weekAgo).length },
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setYtVideoTab(tab.id)}
                      className={`pb-3 -mb-4 transition-colors ${ytVideoTab === tab.id ? 'text-red-600 border-b-2 border-red-600' : 'hover:text-gray-900'}`}
                    >
                      {tab.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${ytVideoTab === tab.id ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{tab.count}</span>
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input type="text" value={ytVideoSearch} onChange={(e) => setYtVideoSearch(e.target.value)} placeholder="Search videos..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>

              <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                {displayedVideos.length} videos found
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Thumbnail</th>
                      <th className="py-3 px-4">Video Title</th>
                      <th className="py-3 px-4">Published</th>
                      <th className="py-3 px-4">Views</th>
                      <th className="py-3 px-4">Total Comments</th>
                      <th className="py-3 px-4">Fetched</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayedVideos.map((video) => (
                      <tr key={video.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4"><div className="w-16 h-12 bg-gray-200 rounded overflow-hidden"><img src={video.thumbnail} alt="" className="w-full h-full object-cover" /></div></td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-gray-900">{video.title}</p>
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{video.channelId}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {video.publishedAt}</td>
                        <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-1"><svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> {(video.views/1000).toFixed(1)}K</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 font-bold text-gray-900"><svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> {video.commentCount}</div>
                          <p className="text-[10px] text-gray-400">YouTube total comments</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-gray-900">{video.fetchedCount}</span>
                            <span className="text-gray-500">of {video.commentCount} • {Math.round((video.fetchedCount/video.commentCount)*100)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(video.fetchedCount/video.commentCount)*100}%` }}></div>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">Comments fetched into app</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit ${video.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : video.status === 'Syncing' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${video.status === 'Completed' ? 'bg-emerald-500' : video.status === 'Syncing' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`}></span>
                            {video.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                              Fetch
                            </button>
                            <button onClick={() => handleVideoClick(video.id)} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
              );
            })()}
          </>
        )}
      </div>
    );
  };

  const renderYTUserDetail = () => {
    const user = ytUsers.find(u => u.id === selectedYTUserId);
    if (!user) return null;

    const allUserComments = user.videoNames.map((vname, idx) => ({
      id: `uc-${user.id}-${idx}`,
      videoName: vname,
      videoId: idx === 0 ? 'ScMzIvxBSi4' : 'dQw4w9WgXcQ',
      date: '22/05/2026, 16:30:00',
      text: idx === 0 ? 'Nice explanation of typed table rows and sorting.' : 'Very clean dashboard demo. The reusable card layout was my favorite part.',
      likes: idx === 0 ? 9 : 18
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => { setCurrentPage('youtube-users'); setSelectedYTUserId(null); }} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors">
            <Icons.ChevronLeft /> Back
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            User comment profile
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex items-start gap-4 lg:w-1/3">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}>
                {user.avatar}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
                <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded font-mono">{user.channelId}</span>
                <div className="mt-2">
                  {user.status === 'Repeat User' && (
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      Repeat commenter
                    </span>
                  )}
                </div>
                <div className="mt-3 text-xs text-gray-500 space-y-1">
                  <p className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> Joined: {user.joinedAt}</p>
                  <p className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Last: {user.lastSeen}</p>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> Total Comments</div>
                <p className="text-2xl font-bold text-gray-900">{user.totalComments}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Videos Commented</div>
                <p className="text-2xl font-bold text-gray-900">{user.videosCommented}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><svg className="w-3 h-3 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> Comment Likes</div>
                <p className="text-2xl font-bold text-gray-900">{user.likesReceived}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg> Top Comment Likes</div>
                <p className="text-2xl font-bold text-gray-900">{user.topCommentLikes}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Commented Videos & Top Comment */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-1">Commented Videos</h3>
              <p className="text-xs text-gray-500 mb-4">Which videos this user commented on</p>
              <div className="space-y-3">
                {user.videoNames.map((vname, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{vname}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1 text-red-500"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> 1 comments</span>
                          <span className="flex items-center gap-1 text-pink-500"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> {idx === 0 ? 9 : 18} likes</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        View Video
                      </button>
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        YouTube
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {user.topComment && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-1">Top Comment</h3>
                <p className="text-xs text-gray-500 mb-4">Most liked comment by this user</p>
                <div className="border-l-4 border-amber-400 bg-amber-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 italic mb-3">"{user.topComment.text}"</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-pink-600 font-bold"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> {user.topComment.likes} likes</span>
                    <span className="text-gray-500 font-medium">{user.topComment.videoName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - User Comments */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-1">User Comments</h3>
            <p className="text-xs text-gray-500 mb-6">Complete comment history for this user across fetched videos</p>
            
            <div className="space-y-4">
              {allUserComments.map((comment) => (
                <div key={comment.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{comment.videoName}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{comment.videoId}</span>
                            <span>•</span>
                            <span>{comment.date}</span>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-pink-500 text-xs font-bold bg-pink-50 px-2 py-1 rounded-full">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                          {comment.likes} likes
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">{comment.text}</p>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          Open Video Details
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          Watch on YouTube
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderYouTubeUsers = () => {
    const uniqueUsersCount = ytUsers.length;
    const repeatCommentersCount = ytUsers.filter(u => u.status === 'Repeat User').length;
    const newUsersCount = ytUsers.filter(u => u.status === 'New User').length;
    const totalUserComments = ytUsers.reduce((sum, u) => sum + u.totalComments, 0);
    const totalLikes = ytUsers.reduce((sum, u) => sum + u.likesReceived, 0);

    const filteredUsers = ytUsers.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(ytUserSearch.toLowerCase()) || u.channelId.toLowerCase().includes(ytUserSearch.toLowerCase());
      const matchesVideo = ytUserVideoFilter ? u.videoNames.includes(ytUserVideoFilter) : true;
      if (!matchesVideo) return false;
      if (ytUserFilter === 'repeat') return matchesSearch && u.status === 'Repeat User';
      if (ytUserFilter === 'new') return matchesSearch && u.status === 'New User';
      return matchesSearch;
    });

    return (
      <div className="space-y-6">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Icons.Users /></div>
            <div><p className="text-2xl font-bold text-gray-900">{uniqueUsersCount}</p><p className="text-xs text-gray-500">Unique Users</p></div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div>
            <div><p className="text-2xl font-bold text-gray-900">{repeatCommentersCount}</p><p className="text-xs text-gray-500">Repeat Comment Users</p></div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg></div>
            <div><p className="text-2xl font-bold text-gray-900">{totalUserComments}</p><p className="text-xs text-gray-500">Total User Comments</p></div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-4">
            <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div>
            <div><p className="text-2xl font-bold text-gray-900">{totalLikes}</p><p className="text-xs text-gray-500">Total Likes on Comments</p></div>
          </div>
        </div>

        {/* Recent Users Joined */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Recent Users Joined</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ytUsers.slice(0, 4).map((user) => (
              <button 
                key={user.id} 
                onClick={() => { setSelectedYTUserId(user.id); setCurrentPage('youtube-user-detail'); }}
                className="border border-gray-200 rounded-xl p-4 hover:border-red-300 hover:shadow-md transition-all text-left flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{user.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      {user.totalComments} comment{user.totalComments !== 1 ? 's' : ''}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      {user.videosCommented} video{user.videosCommented !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Joined {user.joinedAt.split(' ')[0]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-6 text-sm font-bold text-gray-500">
                <button 
                  onClick={() => setYTUserFilter('all')}
                  className={`pb-2 ${ytUserFilter === 'all' ? 'text-red-600 border-b-2 border-red-600' : 'hover:text-gray-900'}`}
                >
                  All Users <span className="ml-1 bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full text-xs">{uniqueUsersCount}</span>
                </button>
                <button 
                  onClick={() => setYTUserFilter('repeat')}
                  className={`pb-2 ${ytUserFilter === 'repeat' ? 'text-red-600 border-b-2 border-red-600' : 'hover:text-gray-900'}`}
                >
                  Repeat Commenters <span className="ml-1 bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full text-xs">{repeatCommentersCount}</span>
                </button>
                <button 
                  onClick={() => setYTUserFilter('new')}
                  className={`pb-2 ${ytUserFilter === 'new' ? 'text-red-600 border-b-2 border-red-600' : 'hover:text-gray-900'}`}
                >
                  New Users <span className="ml-1 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full text-xs">{newUsersCount}</span>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                {filteredUsers.length} users found
              </span>
              <div className="flex items-center gap-3">
                <select 
                  value={ytUserVideoFilter}
                  onChange={(e) => setYtUserVideoFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Videos</option>
                  {[...new Set(ytUsers.flatMap(u => u.videoNames))].map((videoName) => (
                    <option key={videoName} value={videoName}>{videoName}</option>
                  ))}
                </select>
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input 
                    type="text" 
                    value={ytUserSearch}
                    onChange={(e) => setYTUserSearch(e.target.value)}
                    placeholder="Search by user, channel ID, or video title" 
                    className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-80" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 text-xs uppercase">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Channel ID</th>
                  <th className="py-3 px-4">Total Comments</th>
                  <th className="py-3 px-4">Videos Commented</th>
                  <th className="py-3 px-4">Likes Received</th>
                  <th className="py-3 px-4">Last Seen</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">First seen {user.firstSeen}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-mono">{user.channelId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-red-500 font-bold"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> {user.totalComments}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900">{user.videosCommented}</p>
                      <p className="text-[10px] text-gray-500 truncate max-w-[180px]">{user.videoNames.join(', ')}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-pink-500 font-bold"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> {user.likesReceived}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {user.firstSeen}</span>
                    </td>
                    <td className="py-3 px-4">
                      {user.status === 'Repeat User' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 flex items-center gap-1 w-fit">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          Repeat User
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 flex items-center gap-1 w-fit">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                          New User
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedYTUserId(user.id); setCurrentPage('youtube-user-detail'); }}
                          className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          User Details
                        </button>
                        <button className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          View Video
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          YouTube
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderYouTubeVideoDetail = () => {
    const video = youtubeVideos.find(v => v.id === selectedVideoId);
    if (!video) return null;

    const uniqueUsersCount = new Set(videoComments.map(c => c.userId)).size;
    const totalCommentLikes = videoComments.reduce((sum, c) => sum + c.likes, 0);

    return (
      <div className="space-y-6">
        <button onClick={() => { setCurrentPage('youtube'); setSelectedVideoId(null); }} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium text-sm">
          <Icons.ChevronLeft /> Back to Videos
        </button>

        {/* Video Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3 relative group">
              <img src={video.thumbnail.replace('120x90', '600x400')} alt={video.title} className="w-full rounded-xl shadow-md" />
              <button className="absolute top-4 left-4 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-bold flex items-center gap-1 hover:bg-red-700 transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Watch
              </button>
            </div>
            
            <div className="lg:w-1/3 space-y-3">
              <h2 className="text-xl font-bold text-gray-900">{video.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-semibold text-gray-700">{video.channelName}</span>
                <span>•</span>
                <span>{video.publishedAt}</span>
                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">{video.channelId}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{video.description}</p>
              <button className="text-red-600 text-sm font-bold hover:underline">See More</button>
              
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Fetched from YouTube comments</span>
                  <span className="text-emerald-500 font-bold">{video.fetchedCount} / {video.commentCount} • {Math.round((video.fetchedCount/video.commentCount)*100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(video.fetchedCount/video.commentCount)*100}%` }}></div>
                </div>
                <div className="flex gap-2 mt-3">
                  {video.tags.map(tag => <span key={tag} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{tag}</span>)}
                </div>
              </div>
            </div>

            <div className="lg:w-1/3 grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> Views</div>
                <p className="text-sm font-bold text-gray-900">{(video.views/1000).toFixed(1)}K</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg> Likes</div>
                <p className="text-sm font-bold text-gray-900">{video.likes}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> Comments</div>
                <p className="text-sm font-bold text-gray-900">{video.commentCount}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> Fetched</div>
                <p className="text-sm font-bold text-gray-900">{video.fetchedCount}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> Unique Users</div>
                <p className="text-sm font-bold text-gray-900">{uniqueUsersCount}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg> Comment Likes</div>
                <p className="text-sm font-bold text-gray-900">{totalCommentLikes}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 col-span-1">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> Repeat Users</div>
                <p className="text-sm font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              Fetched Comments ({videoComments.length})
            </h3>
            <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Fetch More Comments
            </button>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-6 text-sm font-bold text-gray-500 mb-4">
              {[
                { id: 'all', label: 'All Comments', count: video.commentCount },
                { id: 'top', label: 'Top Comments', count: videoComments.filter(c => c.isTopComment).length },
                { id: 'unique', label: 'Unique Users', count: uniqueUsersCount },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setYtCommentTab(tab.id)}
                  className={`pb-2 -mb-4 transition-colors ${ytCommentTab === tab.id ? 'text-red-600 border-b-2 border-red-600' : 'hover:text-gray-900'}`}
                >
                  {tab.label} <span className="ml-1 text-gray-400 font-normal">{tab.count}</span>
                </button>
              ))}
            </div>
            
            <div className="relative mb-4">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" value={commentSearch} onChange={(e) => setCommentSearch(e.target.value)} placeholder="Search users to filter and highlight their comments..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            <div className="flex items-center justify-between">
              <select className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Most Liked</option>
              </select>
              <div className="px-3 py-2 text-xs text-gray-500">
                Showing {ytCommentTab === 'all' ? videoComments.length : ytCommentTab === 'top' ? videoComments.filter(c => c.isTopComment).length : uniqueUsersCount} results
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {(() => {
              let displayedComments = videoComments;
              if (ytCommentTab === 'top') displayedComments = videoComments.filter(c => c.isTopComment);
              if (ytCommentTab === 'unique') {
                const seen = new Set<string>();
                displayedComments = videoComments.filter(c => {
                  if (seen.has(c.userId)) return false;
                  seen.add(c.userId);
                  return true;
                });
              }
              if (commentSearch) {
                displayedComments = displayedComments.filter(c => 
                  c.userName.toLowerCase().includes(commentSearch.toLowerCase()) || 
                  c.text.toLowerCase().includes(commentSearch.toLowerCase())
                );
              }
              return displayedComments.map((comment) => (
              <div key={comment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {comment.userName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{comment.userName}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {comment.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{comment.text}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <button className="flex items-center gap-1 hover:text-gray-900">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                        {comment.likes}
                      </button>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                        #{comment.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ));
            })()}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    // YouTube specific pages first
    if (currentPage === 'youtube') {
      return renderYouTubeHome();
    }
    
    if (currentPage === 'youtube-video') {
      return renderYouTubeVideoDetail();
    }
    
    if (currentPage === 'youtube-users') {
      return renderYouTubeUsers();
    }
    
    if (currentPage === 'youtube-user-detail') {
      return renderYTUserDetail();
    }

    if (currentPage === 'settings') {
      return renderSettings();
    }

    if (currentPage === 'giveaway-detail') {
      return renderGiveawayDetail();
    }

    // User detail check (works from Users, Winners, or Dashboard)
    if (selectedUserId) {
      return renderUserDetail();
    }
    
    switch (currentPage) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'transactions':
        return renderTransactions();
      case 'funds':
        return renderFunds();
      case 'giveaways':
        return renderGiveaways();
      case 'winners':
        return renderWinners();
      case 'history':
        return renderHistory();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <Icons.Close /> : <Icons.Menu />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                ✨
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Multi-Fund Platform</h1>
                <p className="text-xs text-gray-500">Donate, contribute & run giveaways</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => {
                  setCurrentPage('dashboard');
                  setSelectedUserId(null);
                }}
                className={`font-medium transition-colors ${currentPage === 'dashboard' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Home
              </button>
              <button 
                onClick={() => {
                  setCurrentPage('giveaways');
                  setSelectedUserId(null);
                }}
                className={`font-medium transition-colors ${currentPage === 'giveaways' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Giveaways
              </button>
              <button 
                onClick={() => {
                  setCurrentPage('profile');
                  setSelectedUserId(null);
                }}
                className={`font-medium transition-colors ${currentPage === 'profile' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Profile
              </button>
            </nav>
            
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl px-4 py-2 border border-emerald-200">
                <p className="text-xs text-emerald-700 font-semibold">WALLET BALANCE</p>
                <p className="text-lg font-bold text-emerald-600">₹{currentUser.walletBalance.toLocaleString()}</p>
              </div>
              
              <button 
                onClick={() => {
                  setCurrentPage('profile');
                  setSelectedUserId(null);
                }}
                className="flex items-center gap-3 bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl px-4 py-2 hover:from-violet-200 hover:to-purple-200 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {currentUser.avatar}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">Profile</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {winnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Giveaway completed</p>
                  <h2 className="text-2xl font-bold">🎉 Winners Announced</h2>
                </div>
                <button
                  onClick={() => setWinnerModalOpen(false)}
                  className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-indigo-50 p-4 text-center">
                  <p className="text-sm text-gray-500">Winners</p>
                  <p className="text-2xl font-bold text-indigo-600">{recentWinners.length}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                  <p className="text-sm text-gray-500">Distributed</p>
                  <p className="text-2xl font-bold text-emerald-600">₹{recentWinners.reduce((sum, w) => sum + w.amount, 0).toLocaleString()}</p>
                </div>
                <div className="rounded-2xl bg-purple-50 p-4 text-center">
                  <p className="text-sm text-gray-500">Selection</p>
                  <p className="text-2xl font-bold text-purple-600">Random</p>
                </div>
              </div>

              <div className="space-y-3">
                {recentWinners.map((winner) => (
                  <div key={winner.id} className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 bg-gray-50">
                    <div>
                      <p className="font-bold text-gray-900">{winner.userName}</p>
                      <p className="text-sm text-gray-500">{winner.giveawayName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-indigo-600">₹{winner.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Winner</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setWinnerModalOpen(false)}
                  className="flex-1 rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setWinnerModalOpen(false);
                    setCurrentPage('winners');
                  }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white hover:opacity-90"
                >
                  View Winner List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Giveaway Modal */}
      {showEditModal && editingGiveaway && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Giveaway</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Icons.Close />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giveaway Type</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    value={editingGiveaway.type.toLowerCase()}
                    onChange={(e) => setEditingGiveaway({ ...editingGiveaway, type: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) as 'Daily' | 'Weekly' | 'Monthly' })}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount (₹)</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    value={editingGiveaway.amount}
                    onChange={(e) => setEditingGiveaway({ ...editingGiveaway, amount: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Winners</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    value={editingGiveaway.winnersCount}
                    onChange={(e) => setEditingGiveaway({ ...editingGiveaway, winnersCount: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Winner Selection Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="editWinnerType" 
                      value="single"
                      checked={editingGiveaway.winnerType === 'single'}
                      onChange={(e) => setEditingGiveaway({ ...editingGiveaway, winnerType: e.target.value as 'single' | 'multiple' })}
                      className="w-4 h-4"
                    />
                    <span>Single Winner (One person gets full amount)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="editWinnerType" 
                      value="multiple"
                      checked={editingGiveaway.winnerType === 'multiple'}
                      onChange={(e) => setEditingGiveaway({ ...editingGiveaway, winnerType: e.target.value as 'single' | 'multiple' })}
                      className="w-4 h-4"
                    />
                    <span>Multiple Winners (Amount split equally)</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Join Date Filter</label>
                  <select 
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm focus:border-indigo-500 focus:outline-none"
                    value={editingGiveaway.conditions?.joinFilter || 'all'}
                    onChange={(e) => setEditingGiveaway({ ...editingGiveaway, conditions: { ...editingGiveaway.conditions!, joinFilter: e.target.value } })}
                  >
                    <option value="all">All Users</option>
                    <option value="today">Joined Today</option>
                    <option value="week">Joined This Week</option>
                    <option value="month">Joined This Month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Minimum Contribution (₹)</label>
                  <input 
                    type="number"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm focus:border-indigo-500 focus:outline-none"
                    value={editingGiveaway.conditions?.minContribution || 0}
                    onChange={(e) => setEditingGiveaway({ ...editingGiveaway, conditions: { ...editingGiveaway.conditions!, minContribution: parseFloat(e.target.value) } })}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
              <button onClick={() => setShowAddUserModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Icons.Close /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" value={newUserForm.name} onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" placeholder="User Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={newUserForm.email} onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" placeholder="user@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Initial Amount (₹)</label>
                <input type="number" value={newUserForm.amount} onChange={(e) => setNewUserForm({...newUserForm, amount: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" placeholder="0" />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAddUserModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={() => {
                  if(!newUserForm.name) return;
                  const newUser: User = {
                    id: String(users.length + 1),
                    name: newUserForm.name,
                    email: newUserForm.email || `${newUserForm.name.toLowerCase().replace(' ', '.')}@example.com`,
                    avatar: newUserForm.name.split(' ').map(n => n[0]).join('').toUpperCase(),
                    totalPaid: parseFloat(newUserForm.amount) || 0,
                    totalWins: 0,
                    totalWon: 0,
                    totalSent: 0,
                    totalDonated: 0,
                    joinedDate: new Date().toISOString().split('T')[0],
                    paymentCount: parseFloat(newUserForm.amount) > 0 ? 1 : 0,
                    lastPaymentDate: parseFloat(newUserForm.amount) > 0 ? new Date().toISOString().split('T')[0] : undefined,
                    isActive: true,
                    rank: 0
                  };
                  setUsers([...users, newUser]);
                  setShowAddUserModal(false);
                  setNewUserForm({ name: '', email: '', amount: '' });
                }} className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg">Add User</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit User Profile</h2>
              <button onClick={() => setShowEditUserModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Icons.Close /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" value={editingUser.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Paid (₹)</label>
                <input type="number" value={editingUser.totalPaid} onChange={(e) => setEditingUser({...editingUser, totalPaid: parseFloat(e.target.value)})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Won (₹)</label>
                <input type="number" value={editingUser.totalWon} onChange={(e) => setEditingUser({...editingUser, totalWon: parseFloat(e.target.value)})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Sent (₹)</label>
                <input type="number" value={editingUser.totalSent} onChange={(e) => setEditingUser({...editingUser, totalSent: parseFloat(e.target.value)})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Count</label>
                  <input type="number" value={editingUser.paymentCount} onChange={(e) => setEditingUser({...editingUser, paymentCount: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Rank (0 = auto)</label>
                  <input type="number" min="0" value={editingUser.rank} onChange={(e) => setEditingUser({...editingUser, rank: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditingUser({...editingUser, isActive: true})} className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${editingUser.isActive ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>
                    ✓ Active
                  </button>
                  <button type="button" onClick={() => setEditingUser({...editingUser, isActive: false})} className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${!editingUser.isActive ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>
                    ✗ Deactivated
                  </button>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowEditUserModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={() => {
                  setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
                  setShowEditUserModal(false);
                  setEditingUser(null);
                }} className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 h-[calc(100vh-73px)] transition-all duration-300 overflow-hidden sticky top-[73px] flex-shrink-0 flex flex-col`}>
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            {/* Main Section */}
            <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Main Menu</p>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Icons.Home },
              { id: 'users', label: 'Users', icon: Icons.Users },
              { id: 'transactions', label: 'Transactions', icon: Icons.Transactions },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSelectedUserId(null);
                  setSelectedGiveawayId(null);
                  setSelectedVideoId(null);
                  setSelectedYTUserId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}

            {/* Giveaways Section */}
            <p className="px-4 py-2 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Giveaways</p>
            {[
              { id: 'giveaways', label: 'Giveaways', icon: Icons.Giveaways },
              { id: 'winners', label: 'Winners', icon: Icons.Trophy },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSelectedUserId(null);
                  setSelectedGiveawayId(null);
                  setSelectedVideoId(null);
                  setSelectedYTUserId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}

            {/* YouTube Section */}
            <p className="px-4 py-2 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">YouTube Integration</p>
            {[
              { id: 'youtube', label: 'YouTube Videos', icon: Icons.Youtube },
              { id: 'youtube-users', label: 'Comment Users', icon: Icons.Users },
              { id: 'settings', label: 'Settings', icon: Icons.Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSelectedUserId(null);
                  setSelectedGiveawayId(null);
                  setSelectedVideoId(null);
                  setSelectedYTUserId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  (currentPage === item.id) || 
                  (item.id === 'youtube' && (currentPage === 'youtube-video')) ||
                  (item.id === 'youtube-users' && (currentPage === 'youtube-user-detail'))
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile at Bottom */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                AV
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@example.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Add Transaction Modal */}
      {showAddTxnModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Payment / Transaction</h2>
              <button onClick={() => setShowAddTxnModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Icons.Close /></button>
            </div>
            
            <div className="space-y-4">
              {/* User Mode Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAddTxnForm({ ...addTxnForm, isNewUser: false, userId: '', userName: '' })}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    !addTxnForm.isNewUser 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Existing User
                </button>
                <button
                  onClick={() => setAddTxnForm({ ...addTxnForm, isNewUser: true, userId: '', userName: '' })}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    addTxnForm.isNewUser 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  New User
                </button>
              </div>

              {/* User Selection / New User Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {addTxnForm.isNewUser ? 'New User Name' : 'Select User'}
                </label>
                {addTxnForm.isNewUser ? (
                  <input
                    type="text"
                    value={addTxnForm.userName}
                    onChange={(e) => setAddTxnForm({ ...addTxnForm, userName: e.target.value })}
                    placeholder="Enter new user's name..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                  />
                ) : !addTxnForm.userId ? (
                  <select 
                    value=""
                    onChange={(e) => {
                      const user = users.find(u => u.id === e.target.value);
                      if (user) setAddTxnForm({ ...addTxnForm, userId: user.id, userName: user.name });
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="">Select a user...</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                      {users.find(u => u.id === addTxnForm.userId)?.avatar}
                    </div>
                    <span className="font-semibold text-gray-900 flex-1">{addTxnForm.userName}</span>
                    <button
                      onClick={() => setAddTxnForm({ ...addTxnForm, userId: '', userName: '' })}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <input 
                  type="number" 
                  value={addTxnForm.amount}
                  onChange={(e) => setAddTxnForm({ ...addTxnForm, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              {/* Fund Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fund Type</label>
                <select 
                  value={addTxnForm.fundType}
                  onChange={(e) => setAddTxnForm({ ...addTxnForm, fundType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none bg-white"
                >
                  <option value="Support">Support</option>
                  <option value="Donation">Donation</option>
                  <option value="Giveaway">Giveaway</option>
                  <option value="Trading">Trading</option>
                </select>
              </div>

              {addTxnForm.isNewUser && (
                <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 border border-blue-200">
                  <strong>Note:</strong> A new user account will be created automatically with this payment. The user's total paid will start with this amount.
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowAddTxnModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddTransaction}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg"
                >
                  Add Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


