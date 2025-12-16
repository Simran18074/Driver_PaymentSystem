import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, MapPin, Wallet, History, IndianRupee, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/drivers', icon: Users, label: 'Drivers' },
    { path: '/trips', icon: MapPin, label: 'Trips' },
    { path: '/settlements', icon: IndianRupee, label: 'Settlements' },
    { path: '/history', icon: History, label: 'History' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-screen
      `}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Wallet className="w-8 h-8" />
            DriverPay
          </h1>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose && onClose()} // Close sidebar on mobile when link clicked
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
