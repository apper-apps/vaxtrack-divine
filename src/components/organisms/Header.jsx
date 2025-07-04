import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { AuthContext } from '../../App';

const Header = ({ onMenuToggle, alerts = [] }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const routes = {
      '/': 'Dashboard',
      '/inventory': 'Inventory Management',
      '/receive': 'Receive Vaccines',
      '/administer': 'Administer Vaccines',
      '/reports': 'Reports',
      '/loss': 'Vaccine Loss Reporting',
      '/settings': 'Settings'
    };
    return routes[location.pathname] || 'VaxTrack Pro';
  };

  const criticalAlerts = alerts.filter(alert => alert.daysUntilExpiry <= 7);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Alerts */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <ApperIcon name="Bell" className="h-6 w-6 text-gray-600" />
              {criticalAlerts.length > 0 && (
                <Badge 
                  variant="critical" 
                  size="xs"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center"
                >
                  {criticalAlerts.length}
                </Badge>
              )}
            </button>
          </div>
{/* User Profile */}
          <div className="flex items-center space-x-4">
            <UserProfile />
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
        <ApperIcon name="User" className="h-4 w-4 text-white" />
      </div>
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-gray-700">
          {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Healthcare Admin'}
        </p>
        <p className="text-xs text-gray-500">
          {user?.emailAddress || 'Vaccine Manager'}
        </p>
      </div>
    </div>
  );
};

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  
  return (
    <Button
      variant="ghost"
      size="sm"
      icon="LogOut"
      onClick={logout}
      className="text-gray-600 hover:text-gray-800"
    >
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
};
};

export default Header;