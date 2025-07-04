import React from 'react';
import { NavLink } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'BarChart3' },
    { name: 'Inventory', href: '/inventory', icon: 'Package' },
    { name: 'Receive Vaccines', href: '/receive', icon: 'PackagePlus' },
    { name: 'Administer', href: '/administer', icon: 'Syringe' },
    { name: 'Reports', href: '/reports', icon: 'FileText' },
    { name: 'Vaccine Loss', href: '/loss', icon: 'AlertTriangle' },
    { name: 'Settings', href: '/settings', icon: 'Settings' }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64">
        <div className="flex flex-col h-full bg-white shadow-lg">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Shield" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">VaxTrack Pro</h1>
                <p className="text-xs text-gray-500">Vaccine Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">System Status</p>
                <p className="text-xs text-green-600">All systems operational</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
          <div className="relative flex flex-col w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Shield" className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">VaxTrack Pro</h1>
                  <p className="text-xs text-gray-500">Vaccine Management</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">System Status</p>
                  <p className="text-xs text-green-600">All systems operational</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;