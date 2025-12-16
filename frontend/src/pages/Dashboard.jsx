import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Users, Map, IndianRupee, Activity, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await client.get('/dashboard');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading dashboard...</div>;
  if (!stats) return <div className="p-6 text-center text-red-500">Failed to load data</div>;

  return (
    <div className="p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Drivers"
          value={stats.totalDrivers}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Trips"
          value={stats.totalTrips}
          icon={Map}
          color="bg-indigo-500"
        />
        <StatCard
          title="Pending Payments"
          value={`₹${stats.totalPendingAmount}`}
          icon={Activity}
          color="bg-orange-500"
          subtext="Needs settlement"
        />
        <StatCard
          title="Total Paid"
          value={`₹${stats.totalPaidAmount}`}
          icon={IndianRupee}
          color="bg-green-500"
          subtext="Lifetime earnings"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Recent Trips
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {stats.recentTrips.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No recent activity</div>
          ) : (
            stats.recentTrips.map((trip) => (
              <div key={trip.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900">{trip.driverName}</p>
                  <p className="text-sm text-gray-500">{trip.route}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{trip.totalAmount}</p>
                  <p className="text-xs text-gray-400">{new Date(trip.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
