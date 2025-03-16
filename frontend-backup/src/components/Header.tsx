import React, { useState } from 'react';
import { Bell, User as UserIcon, Menu, X, Sun, Moon } from 'lucide-react';
import { Theme } from '../App';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  toggleSidebar: () => void;
  theme: Theme;
  toggleTheme: () => void;
  user: User;
}


const Header: React.FC<HeaderProps> = ({ toggleSidebar, theme, toggleTheme, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfile) setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    if (showNotifications) setShowNotifications(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-dropdown') && !target.closest('.notification-button')) {
        setShowNotifications(false);
      }
      if (!target.closest('.profile-dropdown') && !target.closest('.profile-button')) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10 transition-colors duration-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200"
          >
            <Menu size={24} />
          </button>
          <div className="ml-4">
            <h1 className="text-xl font-bold">StudyPro</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <div className="relative">
            <button 
              onClick={toggleNotifications}
              className="notification-button p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-semibold">Notifications</h3>
                  <button className="text-sm text-blue-500 hover:text-blue-700 transition-colors duration-200">Mark all as read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-blue-500 transition-colors duration-200">
                    <p className="text-sm font-medium">Assignment due tomorrow</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Physics Lab Report - 24 hours remaining</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <p className="text-sm font-medium">New study material available</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Calculus Chapter 5 - Added 2 hours ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <p className="text-sm font-medium">Team meeting scheduled</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Project Discussion - Tomorrow at 3:00 PM</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center">
                  <button className="text-sm text-blue-500 hover:text-blue-700 transition-colors duration-200">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={toggleProfile}
              className="profile-button flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <UserIcon size={16} />
              </div>
            </button>
            
            {showProfile && (
              <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  Profile
                </a>
                <button 
                  onClick={toggleTheme}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  Settings
                </a>
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;