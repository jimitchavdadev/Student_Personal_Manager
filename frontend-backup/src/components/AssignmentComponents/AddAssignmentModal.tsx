import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Assignment } from '../../types/assignmentTypes';

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignment: Omit<Assignment, 'id' | 'completed' | 'attachments'>) => void;
}

const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [newAssignment, setNewAssignment] = useState({
    assignment_name: '',
    due_date: '',
    submit_to: '',
    where_to_submit: '',
    what_to_submit: '',
    how_to_submit: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(newAssignment);
    onClose();
    setNewAssignment({
      assignment_name: '',
      due_date: '',
      submit_to: '',
      where_to_submit: '',
      what_to_submit: '',
      how_to_submit: '',
    });
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
            <label htmlFor="assignment_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Assignment Name
            </label>
            <input
              type="text"
              name="assignment_name"
              id="assignment_name"
              value={newAssignment.assignment_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due Date
            </label>
            <input
              type="date"
              name="due_date"
              id="due_date"
              value={newAssignment.due_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="submit_to" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Submit To
            </label>
            <input
              type="text"
              name="submit_to"
              id="submit_to"
              value={newAssignment.submit_to}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="where_to_submit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Where to Submit
            </label>
            <input
              type="text"
              name="where_to_submit"
              id="where_to_submit"
              value={newAssignment.where_to_submit}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="what_to_submit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              What to Submit
            </label>
            <input
              type="text"
              name="what_to_submit"
              id="what_to_submit"
              value={newAssignment.what_to_submit}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="how_to_submit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              How to Submit
            </label>
            <input
              type="text"
              name="how_to_submit"
              id="how_to_submit"
              value={newAssignment.how_to_submit}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Add Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssignmentModal;