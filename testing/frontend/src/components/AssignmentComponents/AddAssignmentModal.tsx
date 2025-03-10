import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addAssignment } from '../../api/assignmentApi';

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshAssignments: () => void; // Fetch assignments after adding
}

const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({ isOpen, onClose, refreshAssignments }) => {
  const [newAssignment, setNewAssignment] = useState({
    name: '',
    dueDate: '',
    whom: '',
    where: '',
    what: '',
    how: '',
    details: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await addAssignment(newAssignment);
      refreshAssignments(); // Refresh list after adding
      onClose();
      setNewAssignment({
        name: '',
        dueDate: '',
        whom: '',
        where: '',
        what: '',
        how: '',
        details: '',
      });
    } catch (error) {
      console.error('Failed to add assignment', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Assignment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={newAssignment.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              value={newAssignment.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Details
            </label>
            <textarea
              name="details"
              id="details"
              value={newAssignment.details}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            Add Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssignmentModal;
