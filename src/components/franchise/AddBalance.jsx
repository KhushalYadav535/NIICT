import React, { useState } from 'react';
import { CreditCard, Wallet, AlertCircle, ArrowRight } from 'lucide-react';

const AddBalance = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const handleAddBalance = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) < 100) {
      alert("Minimum amount to add is ₹100");
      return;
    }
    // Simulate payment gateway opening
    alert(`Initiating payment of ₹${amount} via ${paymentMethod.toUpperCase()}...`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <CreditCard className="text-indigo-600" size={28} />
          Add Wallet Balance
        </h2>
        <p className="text-slate-500 mt-1">Recharge your wallet to process student registrations and orders.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Current Balance & Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-white opacity-5 blur-2xl"></div>
            
            <div className="flex justify-between items-start mb-12 relative z-10">
              <Wallet className="text-indigo-400" size={32} />
              <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">Active</span>
            </div>
            
            <div className="relative z-10">
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Available Balance</p>
              <h3 className="text-5xl font-black tracking-tight">₹ 80</h3>
            </div>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
            <div className="flex gap-3 mb-3">
              <AlertCircle className="text-indigo-600 flex-shrink-0" size={20} />
              <h4 className="font-bold text-indigo-900">Why Add Balance?</h4>
            </div>
            <p className="text-indigo-800/80 text-sm leading-relaxed mb-4">
              Your wallet balance is used instantly for student registrations, physical certificate orders, and other center activities without needing to enter payment details every time.
            </p>
            <ul className="text-sm text-indigo-800/70 space-y-2 font-medium">
              <li>• Instant student approval</li>
              <li>• Seamless certificate ordering</li>
              <li>• No transaction failures</li>
            </ul>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Recharge Details</h3>
          
          <form onSubmit={handleAddBalance} className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Amount to Add (₹)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₹</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0" 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-3xl font-black text-slate-800 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                {[500, 1000, 2000, 5000].map(val => (
                  <button 
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl transition-colors text-sm"
                  >
                    + ₹{val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod('upi')}
                  className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 absolute top-3 left-3 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-indigo-600' : 'border-slate-300'}`}>
                    {paymentMethod === 'upi' && <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>}
                  </div>
                  <div className="font-black text-indigo-900 text-xl tracking-tighter italic">UPI</div>
                  <span className="text-xs font-bold text-slate-500">Google Pay, PhonePe</span>
                </div>
                
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 absolute top-3 left-3 flex items-center justify-center ${paymentMethod === 'card' ? 'border-indigo-600' : 'border-slate-300'}`}>
                    {paymentMethod === 'card' && <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>}
                  </div>
                  <CreditCard size={24} className={paymentMethod === 'card' ? 'text-indigo-600' : 'text-slate-400'} />
                  <span className="text-xs font-bold text-slate-500">Debit / Credit Card</span>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-5 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
            >
              Proceed to Pay {amount ? `₹${amount}` : ''}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBalance;
