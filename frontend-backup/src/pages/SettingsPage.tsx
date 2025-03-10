import React from 'react';
import { Settings, Sun, Moon } from 'lucide-react';
import { Theme } from '../App';

interface SettingsPageProps {
  theme: Theme;
  toggleTheme: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ theme, toggleTheme }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-500 dark:text-gray-400">More settings coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;