import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { CheckCircle, Clock, Calendar, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const Settlements = () => {
  const [activeTab, setActiveTab] = useState('BATTA'); // 'BATTA' or 'SALARY'
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettlements();
  }, [activeTab]);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const response = await client.get(`/settlements?type=${activeTab}&status=PENDING`);
      setSettlements(response.data);
    } catch (error) {
      toast.error('Failed to fetch settlements');
    } finally {
      setLoading(false);
    }
  };

  const handleSettle = async (id) => {
    try {
      await client.put(`/settlements/${id}/pay`);
      toast.success('Payment settled successfully');
      fetchSettlements();
    } catch (error) {
      toast.error('Failed to settle payment');
    }
  };

  // Group settlements by driver
  const groupedSettlements = settlements.reduce((acc, curr) => {
    if (!acc[curr.driverId]) {
      acc[curr.driverId] = {
        driverName: curr.driverName,
        totalAmount: 0,
        items: []
      };
    }
    acc[curr.driverId].totalAmount += curr.amount;
    acc[curr.driverId].items.push(curr);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Settlements</h1>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('BATTA')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center sm:justify-start gap-2 ${
            activeTab === 'BATTA'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Clock className="w-5 h-5" />
          Weekly Settlements (Batta)
        </button>
        <button
          onClick={() => setActiveTab('SALARY')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center sm:justify-start gap-2 ${
            activeTab === 'SALARY'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Calendar className="w-5 h-5" />
          Monthly Settlements (Salary)
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading settlements...</div>
      ) : (
        <div className="grid gap-6">
          {Object.keys(groupedSettlements).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
              <p className="text-gray-500">No pending {activeTab.toLowerCase()} payments.</p>
            </div>
          ) : (
            Object.values(groupedSettlements).map((group) => (
              <div key={group.driverName} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{group.driverName}</h3>
                    <p className="text-sm text-gray-500">{group.items.length} pending trip(s)</p>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="text-2xl font-bold text-gray-900">₹{group.totalAmount}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total Pending</p>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {group.items.map((item) => (
                    <div key={item.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                          <IndianRupee className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Trip Payment</p>
                          <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4 pl-14 sm:pl-0">
                        <span className="font-semibold text-gray-900">₹{item.amount}</span>
                        <button
                          onClick={() => handleSettle(item.id)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          Settle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Settlements;
