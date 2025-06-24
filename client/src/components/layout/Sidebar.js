import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  BarChart3, 
  User, 
  Settings,
  Plus
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="flex items-center mb-8">
        <Target className="h-8 w-8 text-primary-400" />
        <h1 className="ml-3 text-xl font-bold">Goal Tracker</h1>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        <Link
          to="/goals?new=true"
          className="flex items-center justify-center w-full px-4 py-3 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Goal
        </Link>
      </div>

      <div className="mt-auto pt-8">
        <div className="border-t border-gray-700 pt-4">
          <Link
            to="/settings"
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
