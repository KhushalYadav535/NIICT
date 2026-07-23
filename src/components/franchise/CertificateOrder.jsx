import React, { useState } from 'react';
import { FileCheck, Search, Plus } from 'lucide-react';

const CertificateOrder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockOrders = [
    { id: 'ORD-2023-01', date: '2023-11-01', quantity: 15, status: 'Shipped', amount: 750, trackingNo: 'DEL123456789' },
    { id: 'ORD-2023-02', date: '2023-11-20', quantity: 2, status: 'Processing', amount: 170, trackingNo: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl">
        <p className="text-orange-800 font-medium">
          <strong className="font-black">Notice:</strong> No Courier Charge Minimum 3 Marksheet Order. Otherwise, for Single/Double Marksheet Order, a Courier Charge of Rs.70/- is Applicable.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <FileCheck className="text-indigo-600" size={28} />
            Certificate Orders
          </h2>
          <p className="text-slate-500 mt-1">Request physical certificates and marksheets for passed students.</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          </div>
          <button 
            onClick={() => alert('New Order Form will open here. Please ensure you have sufficient wallet balance before proceeding.')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-indigo-200 flex-shrink-0"
          >
            <Plus size={18} /> New Order
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Order ID</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Order Date</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Quantity (Students)</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Amount Paid</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Status</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Tracking No.</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-800">{order.id}</td>
                  <td className="py-4 px-6 text-slate-500 font-medium">{order.date}</td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{order.quantity}</span>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-700">₹{order.amount}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block ${order.status === 'Shipped' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {order.trackingNo}
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

export default CertificateOrder;
