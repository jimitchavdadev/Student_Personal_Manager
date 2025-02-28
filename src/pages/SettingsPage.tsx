import React from 'react';
import { Settings } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex flex-col items-center justify-center min-h-[400px]">
        <Settings size={64} className="text-blue-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Settings Feature Coming Soon</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          The Settings feature is under development. Soon you'll be able to customize your profile, toggle dark mode, manage notifications, and more.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;