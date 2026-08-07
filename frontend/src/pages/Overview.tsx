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
  const [currentPage, setCurrentPage] = useState('transactions');

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  


  


  // Transaction Management State
  const [txnSearch, setTxnSearch] = useState('');
  const [txnFilter, setTxnFilter] = useState('all');
  const [txnTypeFilter, setTxnTypeFilter] = useState('all');
  const [txnPage, setTxnPage] = useState(1);
  const txnPerPage = 10;
  const [showAddTxnModal, setShowAddTxnModal] = useState(false);
  const [addTxnForm, setAddTxnForm] = useState({ userId: '', userName: '', amount: '', fundType: 'Support', isNewUser: false });
  


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
  
  
  // State
  const [users, setUsers] = useState(initialUsers);
  const [transactions, setTransactions] = useState(initialTransactions);
  





  const renderTransactions = () => {
    const totalPaidAmount = users.reduce((sum, u) => sum + u.totalPaid, 0);
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
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">recent Amount paid</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">Fund Type</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-indigo-900 uppercase tracking-wider">total amount Paid</th>
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

  const renderContent = () => {
 


    
    switch (currentPage) {

 
      case 'transactions':
        return renderTransactions();


 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
   

     
    



      <div className="flex flex-1">
        {/* Sidebar */}
   
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


