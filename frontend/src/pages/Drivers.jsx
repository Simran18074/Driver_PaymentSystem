import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { User, Truck, CreditCard, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    vehicleNumber: '',
    paymentPreference: 'BATTA',
  });

  const [editingDriver, setEditingDriver] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await client.get('/drivers');
      setDrivers(response.data);
    } catch (error) {
      toast.error('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        await client.put(`/drivers/${editingDriver.id}`, {
          paymentPreference: formData.paymentPreference
        });
        toast.success('Driver updated successfully');
        setEditingDriver(null);
      } else {
        await client.post('/drivers', formData);
        toast.success('Driver added successfully');
      }
      setFormData({ name: '', vehicleNumber: '', paymentPreference: 'BATTA' });
      fetchDrivers();
    } catch (error) {
      toast.error(editingDriver ? 'Failed to update driver' : 'Failed to add driver');
    }
  };

  const startEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      vehicleNumber: driver.vehicleNumber,
      paymentPreference: driver.paymentPreference
    });
  };

  const cancelEdit = () => {
    setEditingDriver(null);
    setFormData({ name: '', vehicleNumber: '', paymentPreference: 'BATTA' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await client.delete(`/drivers/${id}`);
        toast.success('Driver deleted successfully');
        if (editingDriver && editingDriver.id === id) {
          cancelEdit();
        }
        fetchDrivers();
      } catch (error) {
        toast.error('Failed to delete driver');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Driver Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add/Edit Driver Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            {editingDriver ? 'Edit Driver' : 'Add New Driver'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  disabled={!!editingDriver}
                  className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${editingDriver ? 'bg-gray-100' : ''}`}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
              <div className="relative">
                <Truck className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  disabled={!!editingDriver}
                  className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${editingDriver ? 'bg-gray-100' : ''}`}
                  placeholder="AP39VD6284"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Preference</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                  value={formData.paymentPreference}
                  onChange={(e) => setFormData({ ...formData, paymentPreference: e.target.value })}
                >
                  <option value="BATTA">Batta Only (Weekly)</option>
                  <option value="SALARY">Salary Only (Monthly)</option>
                  <option value="BOTH">Batta + Salary</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                {editingDriver ? 'Update Preference' : 'Add Driver'}
              </button>
              {editingDriver && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Drivers List */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Registered Drivers</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <div className="grid gap-4">
              {drivers.map((driver) => (
                <div key={driver.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-md transition-shadow gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{driver.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Truck className="w-3 h-3" /> {driver.vehicleNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between sm:justify-start border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      driver.paymentPreference === 'BATTA' ? 'bg-green-100 text-green-700' :
                      driver.paymentPreference === 'SALARY' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {driver.paymentPreference}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(driver)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit Preference
                      </button>
                      <button
                        onClick={() => handleDelete(driver.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {drivers.length === 0 && (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No drivers found. Add one to get started.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drivers;
