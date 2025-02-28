import React from 'react';
import { Coffee } from 'lucide-react';

const RelaxPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Relax</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex flex-col items-center justify-center min-h-[400px]">
        <Coffee size={64} className="text-blue-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Relax Feature Coming Soon</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          The Relax feature is under development. Soon you'll be able to use the Pomodoro timer, listen to study music, and practice meditation exercises.
        </p>
      </div>
    </div>
  );
};

export default RelaxPage;