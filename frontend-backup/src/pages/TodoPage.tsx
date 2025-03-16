import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import TaskItem from '../components/ToDoComponents/TaskItem';
import AddTaskModal from '../components/ToDoComponents/AddTaskModal';
import { Substep, Task, TaskWithSubsteps } from '../types/todoTypes';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';

const TodoPage: React.FC = () => {
  const { user } = useAuth();
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

  // Add useEffect here, right after state declarations
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      try {
        const fetchedTasks = await apiClient.get(`/tasks?userId=${user.id}`);
        setTasks(fetchedTasks.map((task: any) => ({
          id: task._id,
          name: task.task_name,
          type: task.task_type,
          due_date: task.due_date,
          description: task.description,
          completed: task.status === 'completed',
          created_at: task.createdAt,
          user_id: task.userId,
          substeps: task.subtasks.map((sub: any) => ({
            id: sub._id,
            text: sub.step,
            completed: sub.status === 'completed',
            task_id: task._id,
            created_at: sub.createdAt
          }))
        })));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [user]);


  const addTask = async () => {
    if (!newTask.name || !newTask.due_date || !user) return;
    
    try {
      const taskData = {
        userId: user.id,
        task_name: newTask.name,
        task_type: newTask.type,
        due_date: new Date(newTask.due_date).toISOString(),
        description: newTask.description,
      };
  
      const taskResponse = await apiClient.post('/tasks', taskData);
      let finalTask = taskResponse;
  
      // Create subtasks if any
      if (tempSubsteps.length > 0) {
        for (const substep of tempSubsteps) {
          const subtaskResponse = await apiClient.post(`/tasks/${taskResponse._id}/subtasks`, {
            step: substep.text,
            status: 'pending'
          });
          finalTask = subtaskResponse.task; // Use the updated task from the subtask response
        }
      }
  
      setTasks(prevTasks => [...prevTasks, {
        id: finalTask._id,
        name: finalTask.task_name,
        type: finalTask.task_type,
        due_date: finalTask.due_date,
        description: finalTask.description,
        completed: finalTask.status === 'completed',
        created_at: finalTask.createdAt,
        user_id: finalTask.userId,
        substeps: finalTask.subtasks.map((sub: any) => ({
          id: sub._id,
          text: sub.step,
          completed: sub.status === 'completed',
          task_id: finalTask._id,
          created_at: finalTask.createdAt
        }))
      }]);
      
      setShowAddModal(false);
      setNewTask({
        name: '',
        type: 'Study',
        due_date: '',
        description: '',
        completed: false
      });
      setTempSubsteps([]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task || !user) return;

      const newStatus = task.completed ? 'pending' : 'completed';
      await apiClient.patch(`/tasks/${taskId}`, {
        userId: user.id,
        status: newStatus
      });

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const toggleSubstepCompletion = async (taskId: string, substepId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const substep = task?.substeps.find(s => s.id === substepId);
      if (!task || !substep) return;

      const newStatus = substep.completed ? 'pending' : 'completed';
      await apiClient.patch(`/tasks/${taskId}/subtasks/${substepId}`, {
        status: newStatus
      });

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
    } catch (error) {
      console.error('Error updating subtask status:', error);
    }
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