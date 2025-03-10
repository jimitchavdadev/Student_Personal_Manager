import React from 'react';
import { X } from 'lucide-react';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  inputLabel: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onCreate: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  title,
  inputLabel,
  inputValue,
  onInputChange,
  onCreate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {inputLabel}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              placeholder={`Enter ${inputLabel.toLowerCase()}`}
            />
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mr-2 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors duration-200"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;