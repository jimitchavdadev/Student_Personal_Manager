import React, { useState } from 'react';
import { Plus, MoreVertical, X, Calendar, Clock, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  type: 'Study' | 'Personal';
  dueDate: string;
  description: string;
  completed: boolean;
  substeps: { id: string; text: string; completed: boolean }[];
}

const TodoPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: 'Physics Assignment',
      type: 'Study',
      dueDate: '2025-05-15',
      description: 'Complete problems 1-10 from Chapter 5',
      completed: false,
      substeps: [
        { id: '1-1', text: 'Read Chapter 5', completed: true },
        { id: '1-2', text: 'Solve problems 1-5', completed: false },
        { id: '1-3', text: 'Solve problems 6-10', completed: false },
      ]
    },
    {
      id: '2',
      name: 'Math Quiz Preparation',
      type: 'Study',
      dueDate: '2025-05-10',
      description: 'Review calculus concepts for upcoming quiz',
      completed: false,
      substeps: [
        { id: '2-1', text: 'Review derivatives', completed: false },
        { id: '2-2', text: 'Practice integration problems', completed: false },
      ]
    },
    {
      id: '3',
      name: 'Buy Groceries',
      type: 'Personal',
      dueDate: '2025-05-08',
      description: 'Get essentials from the store',
      completed: false,
      substeps: [
        { id: '3-1', text: 'Make shopping list', completed: true },
        { id: '3-2', text: 'Visit grocery store', completed: false },
      ]
    },
    {
      id: '4',
      name: 'Complete Lab Report',
      type: 'Study',
      dueDate: '2025-05-20',
      description: 'Write up results from chemistry experiment',
      completed: true,
      substeps: [
        { id: '4-1', text: 'Analyze data', completed: true },
        { id: '4-2', text: 'Create graphs', completed: true },
        { id: '4-3', text: 'Write conclusion', completed: true },
      ]
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'completed'>>({
    name: '',
    type: 'Study',
    dueDate: '',
    description: '',
    substeps: []
  });
  const [newSubstep, setNewSubstep] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [activeTaskOptions, setActiveTaskOptions] = useState<string | null>(null);

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleSubstepCompletion = (taskId: string, substepId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            substeps: task.substeps.map(substep => 
              substep.id === substepId 
                ? { ...substep, completed: !substep.completed } 
                : substep
            ) 
          } 
        : task
    ));
  };

  const addTask = () => {
    if (!newTask.name || !newTask.dueDate) return;
    
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false
    };
    
    setTasks([...tasks, task]);
    setShowAddModal(false);
    setNewTask({
      name: '',
      type: 'Study',
      dueDate: '',
      description: '',
      substeps: []
    });
  };

  const addSubstep = () => {
    if (!newSubstep) return;
    
    setNewTask({
      ...newTask,
      substeps: [
        ...newTask.substeps,
        { id: Date.now().toString(), text: newSubstep, completed: false }
      ]
    });
    
    setNewSubstep('');
  };

  const removeSubstep = (id: string) => {
    setNewTask({
      ...newTask,
      substeps: newTask.substeps.filter(substep => substep.id !== id)
    });
  };

  const toggleTaskDetails = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    setActiveTaskOptions(null);
  };

  const toggleTaskOptions = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTaskOptions(activeTaskOptions === taskId ? null : taskId);
  };

  const calculateDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">To-Do List</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          Add Task
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="font-semibold">Tasks</h2>
          <button 
            onClick={toggleSortOrder}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            Sort by due date
            {sortOrder === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
          </button>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Days Left</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedTasks.map(task => (
                <React.Fragment key={task.id}>
                  <tr 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer ${
                      task.completed ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500' : ''
                    }`}
                    onClick={() => toggleTaskDetails(task.id)}
                  >
                    <td className="px-6 py-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskCompletion(task.id);
                        }}
                        className="focus:outline-none"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={task.completed ? 'line-through' : ''}>{task.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.type === 'Study' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                      }`}>
                        {task.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${
                        calculateDaysRemaining(task.dueDate) < 0
                          ? 'text-red-600 dark:text-red-400'
                          : calculateDaysRemaining(task.dueDate) <= 2
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {calculateDaysRemaining(task.dueDate) < 0
                          ? `${Math.abs(calculateDaysRemaining(task.dueDate))} days overdue`
                          : calculateDaysRemaining(task.dueDate) === 0
                          ? 'Due today'
                          : `${calculateDaysRemaining(task.dueDate)} days`}
                      </span>
                    </td>
                    <td className="px-6 py-4 relative">
                      <button 
                        onClick={(e) => toggleTaskOptions(task.id, e)}
                        className="focus:outline-none"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      </button>
                      
                      {activeTaskOptions === task.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Edit Task
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Set Priority
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Delete Task
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  
                  {expandedTaskId === task.id && (
                    <tr className="bg-gray-50 dark:bg-gray-750">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium mb-2">Description:</p>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">{task.description}</p>
                          
                          {task.substeps.length > 0 && (
                            <div>
                              <p className="font-medium mb-2">Substeps:</p>
                              <ul className="space-y-2">
                                {task.substeps.map(substep => (
                                  <li key={substep.id} className="flex items-start">
                                    <button 
                                      onClick={() => toggleSubstepCompletion(task.id, substep.id)}
                                      className="mt-0.5 focus:outline-none"
                                    >
                                      {substep.completed ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                      ) : (
                                        <Circle className="h-4 w-4 text-gray-400 hover:text-gray-600 mr-2" />
                                      )}
                                    </button>
                                    <span className={substep.completed ? 'line-through text-gray-500' : ''}>
                                      {substep.text}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedTasks.map(task => (
              <li key={task.id} className="px-4 py-3">
                <div className="flex items-start">
                  <button 
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="mt-1 focus:outline-none"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <span className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                        {task.name}
                      </span>
                      <div className="relative">
                        <button 
                          onClick={(e) => toggleTaskOptions(task.id, e)}
                          className="focus:outline-none"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-400" />
                        </button>
                        
                        {activeTaskOptions === task.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Edit Task
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Set Priority
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Delete Task
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className={`px-2 py-0.5 rounded-full ${
                        task.type === 'Study' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                      }`}>
                        {task.type}
                      </span>
                      <span className="mx-2">•</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span className={`${
                        calculateDaysRemaining(task.dueDate) < 0
                          ? 'text-red-600 dark:text-red-400'
                          : calculateDaysRemaining(task.dueDate) <= 2
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {calculateDaysRemaining(task.dueDate) < 0
                          ? `${Math.abs(calculateDaysRemaining(task.dueDate))} days overdue`
                          : calculateDaysRemaining(task.dueDate) === 0
                          ? 'Due today'
                          : `${calculateDaysRemaining(task.dueDate)} days left`}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => toggleTaskDetails(task.id)}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
                    >
                      {expandedTaskId === task.id ? 'Hide details' : 'Show details'}
                    </button>
                    
                    {expandedTaskId === task.id && (
                      <div className="mt-3 text-sm">
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                        
                        {task.substeps.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium mb-1">Substeps:</p>
                            <ul className="space-y-1">
                              {task.substeps.map(substep => (
                                <li key={substep.id} className="flex items-start">
                                  <button 
                                    onClick={() => toggleSubstepCompletion(task.id, substep.id)}
                                    className="mt-0.5 focus:outline-none"
                                  >
                                    {substep.completed ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-gray-400 hover:text-gray-600 mr-2" />
                                    )}
                                  </button>
                                  <span className={substep.completed ? 'line-through text-gray-500' : ''}>
                                    {substep.text}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Add New Task</h3>
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
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
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
                
                {newTask.substeps.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {newTask.substeps.map(substep => (
                      <li key={substep.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                        <span className="text-sm">{substep.text}</span>
                        <button
                          onClick={() => removeSubstep(substep.id)}
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
      )}
    </div>
  );
};

export default TodoPage;