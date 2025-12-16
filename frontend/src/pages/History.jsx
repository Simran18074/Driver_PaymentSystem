import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { History as HistoryIcon, Search, Download, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const History = () => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await client.get('/history');
      console.log('History data:', response.data);
      if (Array.isArray(response.data)) {
        setSettlements(response.data.reverse());
      } else {
        console.error('Expected array but got:', response.data);
        setSettlements([]);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const filteredSettlements = settlements.filter(s => 
    s.driverName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Payment History</h1>
        <div className="flex gap-4">
          <button 
            onClick={fetchHistory}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
          >
            <HistoryIcon className="w-4 h-4" />
            Refresh
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search driver..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Driver Name</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Amount</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Type</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Date Paid</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading history...</td>
                </tr>
              ) : filteredSettlements.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No payment history found.</td>
                </tr>
              ) : (
                filteredSettlements.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.driverName}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{item.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.type === 'BATTA' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(item.paidAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Paid
                      </span>
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

export default History;
