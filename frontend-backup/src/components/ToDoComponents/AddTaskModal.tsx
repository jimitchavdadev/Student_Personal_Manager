import React from 'react';
import { Plus, X } from 'lucide-react';
import { Task, Substep } from '../../types/todoTypes';

interface AddTaskModalProps {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  newTask: Omit<Task, 'id' | 'created_at' | 'user_id'>;
  setNewTask: (task: Omit<Task, 'id' | 'created_at' | 'user_id'>) => void;
  newSubstep: string;
  setNewSubstep: (substep: string) => void;
  tempSubsteps: Omit<Substep, 'id' | 'created_at' | 'task_id'>[];
  setTempSubsteps: (substeps: Omit<Substep, 'id' | 'created_at' | 'task_id'>[]) => void;
  addTask: () => void;
  addSubstep: () => void;
  removeSubstep: (index: number) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  showAddModal,
  setShowAddModal,
  newTask,
  setNewTask,
  newSubstep,
  setNewSubstep,
  tempSubsteps,
  setTempSubsteps,
  addTask,
  addSubstep,
  removeSubstep,
}) => {
  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Task</h3>
          <button 
            onClick={() => setShowAddModal(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Task Name
            </label>
            <input
              type="text"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter task name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Task Type
            </label>
            <select
              value={newTask.type}
              onChange={(e) => setNewTask({ ...newTask, type: e.target.value as 'Study' | 'Personal' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Study">Study</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter task description"
              rows={3}
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Substeps
            </label>
            <div className="flex">
              <input
                type="text"
                value={newSubstep}
                onChange={(e) => setNewSubstep(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Add a substep"
              />
              <button
                onClick={addSubstep}
                className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
              >
                <Plus size={18} />
              </button>
            </div>
            
            {tempSubsteps.length > 0 && (
              <ul className="mt-2 space-y-1">
                {tempSubsteps.map((substep, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                    <span className="text-sm text-gray-900 dark:text-gray-100">{substep.text}</span>
                    <button
                      onClick={() => removeSubstep(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;