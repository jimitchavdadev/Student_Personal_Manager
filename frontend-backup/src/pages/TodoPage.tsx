import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import TaskItem from '../components/ToDoComponents/TaskItem';
import AddTaskModal from '../components/ToDoComponents/AddTaskModal';
import { Substep, Task, TaskWithSubsteps } from '../types/todoTypes';

const TodoPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskWithSubsteps[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'created_at' | 'user_id'>>({
    name: '',
    type: 'Study',
    due_date: '',
    description: '',
    completed: false
  });
  const [newSubstep, setNewSubstep] = useState('');
  const [tempSubsteps, setTempSubsteps] = useState<Omit<Substep, 'id' | 'created_at' | 'task_id'>[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [activeTaskOptions, setActiveTaskOptions] = useState<string | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addTask = () => {
    if (!newTask.name || !newTask.due_date) return;
    
    const taskId = generateId();
    const newTaskWithSubsteps: TaskWithSubsteps = {
      ...newTask,
      id: taskId,
      created_at: new Date().toISOString(),
      user_id: 'user-id-placeholder',
      substeps: tempSubsteps.map(substep => ({
        ...substep,
        id: generateId(),
        task_id: taskId,
        created_at: new Date().toISOString(),
        completed: false
      }))
    };

    setTasks(prevTasks => [...prevTasks, newTaskWithSubsteps]);
    
    setShowAddModal(false);
    setNewTask({
      name: '',
      type: 'Study',
      due_date: '',
      description: '',
      completed: false
    });
    setTempSubsteps([]);
  };

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

  const addSubstep = () => {
    if (!newSubstep) return;
    
    setTempSubsteps([
      ...tempSubsteps,
      { text: newSubstep, completed: false }
    ]);
    
    setNewSubstep('');
  };

  const removeSubstep = (index: number) => {
    setTempSubsteps(tempSubsteps.filter((_, i) => i !== index));
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
    
    const dateA = new Date(a.due_date).getTime();
    const dateB = new Date(b.due_date).getTime();
    
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">To-Do List</h1>
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
          <h2 className="font-semibold text-gray-900 dark:text-white">Tasks</h2>
          <button 
            onClick={toggleSortOrder}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            Sort by due date
            {sortOrder === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
          </button>
        </div>

        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedTasks.length === 0 ? (
            <li className="p-4 text-center text-gray-500 dark:text-gray-400">
              No tasks yet. Click "Add Task" to create one!
            </li>
          ) : (
            sortedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                toggleTaskCompletion={toggleTaskCompletion}
                toggleSubstepCompletion={toggleSubstepCompletion}
                toggleTaskDetails={toggleTaskDetails}
                toggleTaskOptions={toggleTaskOptions}
                activeTaskOptions={activeTaskOptions}
                expandedTaskId={expandedTaskId}
                calculateDaysRemaining={calculateDaysRemaining}
              />
            ))
          )}
        </ul>
      </div>

      <AddTaskModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newTask={newTask}
        setNewTask={setNewTask}
        newSubstep={newSubstep}
        setNewSubstep={setNewSubstep}
        tempSubsteps={tempSubsteps}
        setTempSubsteps={setTempSubsteps}
        addTask={addTask}
        addSubstep={addSubstep}
        removeSubstep={removeSubstep}
      />
    </div>
  );
};

export default TodoPage;