import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { MapPin, IndianRupee, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Trips = () => {
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    driverId: '',
    pickupPoint: '',
    destination: '',
    battaAmount: '',
    salaryAmount: '',
    totalAmount: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [driversRes, tripsRes] = await Promise.all([
        client.get('/drivers'),
        client.get('/trips')
      ]);
      setDrivers(driversRes.data);
      setTrips(tripsRes.data.reverse()); // Show newest first
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const selectedDriver = drivers.find(d => d.id === formData.driverId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/trips', formData);
      toast.success('Trip logged successfully');
      setFormData({
        driverId: '',
        pickupPoint: '',
        destination: '',
        battaAmount: '',
        salaryAmount: '',
        totalAmount: '',
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to log trip');
    }
  };

  return (
    <div className="p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Trip Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Log Trip Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            Log New Trip
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Driver</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                  value={formData.driverId}
                  onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                >
                  <option value="">Select a driver...</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.paymentPreference})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Point</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Hyderabad"
                    value={formData.pickupPoint}
                    onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Tirupathi"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {selectedDriver && selectedDriver.paymentPreference === 'BOTH' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batta Amount</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="500"
                      value={formData.battaAmount}
                      onChange={(e) => setFormData({ ...formData, battaAmount: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Amount</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="700"
                      value={formData.salaryAmount}
                      onChange={(e) => setFormData({ ...formData, salaryAmount: e.target.value })}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Trip Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="1200"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  />
                </div>
                {selectedDriver && (
                  <p className="text-xs text-gray-500 mt-1">
                    Will be treated as {selectedDriver.paymentPreference}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Log Trip
            </button>
          </form>
        </div>

        {/* Recent Trips List */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Trips</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-4">
              {trips.map((trip) => (
                <div key={trip.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{trip.driverName}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {trip.route}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(trip.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-50">
                      <p className="text-lg font-bold text-gray-900">₹{trip.totalAmount}</p>
                      <div className="flex gap-2 mt-1 justify-start sm:justify-end">
                        {trip.battaAmount > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Batta: ₹{trip.battaAmount}
                          </span>
                        )}
                        {trip.salaryAmount > 0 && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            Salary: ₹{trip.salaryAmount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {trips.length === 0 && (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No trips logged yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trips;
