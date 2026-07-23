import React, { useState } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, Search, FileText } from 'lucide-react';

const WalletLedger = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock transactions for UI implementation
  const transactions = [
    { id: 'TXN-001', date: '2023-10-25 14:30', type: 'credit', amount: 5000, description: 'Added via UPI', status: 'Success' },
    { id: 'TXN-002', date: '2023-10-26 10:15', type: 'debit', amount: 1500, description: 'Student Registration (3 Students)', status: 'Success' },
    { id: 'TXN-003', date: '2023-11-02 09:45', type: 'debit', amount: 500, description: 'Certificate Order #402', status: 'Success' },
    { id: 'TXN-004', date: '2023-11-15 16:20', type: 'credit', amount: 2000, description: 'Added via NetBanking', status: 'Success' }
  ];

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Wallet className="text-indigo-600" size={28} />
            Wallet Transactions
          </h2>
          <p className="text-slate-500 mt-1">View your wallet top-ups and deductions.</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search TXN ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-xl"></div>
          <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-2">Current Balance</p>
          <h3 className="text-4xl font-black">₹ 80</h3>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <ArrowDownRight size={16} />
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Added</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 pl-11">₹ 7,000</h3>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <ArrowUpRight size={16} />
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Spent</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 pl-11">₹ 2,000</h3>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Date & Time</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Transaction ID</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Description</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Amount</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm text-center">Status</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm text-center">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">No transactions found.</td>
                </tr>
              ) : (
                filteredTransactions.map((txn, index) => (
                  <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-500 font-medium">{txn.date}</td>
                    <td className="py-4 px-6 font-bold text-slate-700">{txn.id}</td>
                    <td className="py-4 px-6 text-slate-600">{txn.description}</td>
                    <td className="py-4 px-6">
                      <span className={`font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                        {txn.type === 'credit' ? '+' : '-'} ₹{txn.amount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-3 py-1 rounded-full inline-block">
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => alert(`Receipt for ${txn.id} is being generated. Please wait...`)}
                        className="text-indigo-500 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                      >
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalletLedger;
