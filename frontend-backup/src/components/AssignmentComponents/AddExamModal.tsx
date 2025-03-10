import React, { useState } from 'react';
import { Exam } from '/home/totoro/Roger/Projects/Student_Personal_Manager/testing/frontend/src/types/assignmentTypes.ts';

interface AddExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exam: Omit<Exam, 'id' | 'resources'> & { resources: string }) => void;
}

const AddExamModal: React.FC<AddExamModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [newExam, setNewExam] = useState({
    subject: '',
    date: '',
    toStudy: '',
    resources: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExam(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(newExam);
    onClose();
    setNewExam({
      subject: '',
      date: '',
      toStudy: '',
      resources: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Exam</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject Name
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              value={newExam.subject}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Exam Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={newExam.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="toStudy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              What to Study
            </label>
            <textarea
              name="toStudy"
              id="toStudy"
              value={newExam.toStudy}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="resources" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Resources
            </label>
            <textarea
              name="resources"
              id="resources"
              value={newExam.resources}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Add Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExamModal;