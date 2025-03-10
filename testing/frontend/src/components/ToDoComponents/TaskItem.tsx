import React from 'react';
import { MoreVertical, CheckCircle2, Circle, Calendar, Clock } from 'lucide-react';
import { TaskWithSubsteps, Substep } from '../../types/todoTypes';

type TaskItemProps = {
  task: TaskWithSubsteps;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  toggleSubstepCompletion: (taskId: string, substepId: string) => Promise<void>;
  toggleTaskDetails: (taskId: string) => void;
  toggleTaskOptions: (taskId: string, e: React.MouseEvent) => void;
  activeTaskOptions: string | null;
  expandedTaskId: string | null;
  calculateDaysRemaining: (dueDate: string) => number;
  deleteTask: (taskId: string) => Promise<void>;
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  toggleTaskCompletion,
  toggleSubstepCompletion,
  toggleTaskDetails,
  toggleTaskOptions,
  activeTaskOptions,
  expandedTaskId,
  calculateDaysRemaining,
}) => {
  return (
    <li className="px-4 py-3">
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
            <span className={`font-medium text-gray-900 dark:text-white ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
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
            <span>{new Date(task.due_date).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <Clock className="h-3 w-3 mr-1" />
            <span className={`${
              calculateDaysRemaining(task.due_date) < 0
                ? 'text-red-600 dark:text-red-400'
                : calculateDaysRemaining(task.due_date) <= 2
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-green-600 dark:text-green-400'
            }`}>
              {calculateDaysRemaining(task.due_date) < 0
                ? `${Math.abs(calculateDaysRemaining(task.due_date))} days overdue`
                : calculateDaysRemaining(task.due_date) === 0
                ? 'Due today'
                : `${calculateDaysRemaining(task.due_date)} days left`}
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
              
              {task.substeps?.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium mb-1 text-gray-900 dark:text-white">Substeps:</p>
                  <ul className="space-y-1">
                    {task.substeps.map((substep: Substep) => (
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
                        <span className={`text-gray-900 dark:text-white ${substep.completed ? 'line-through text-gray-500 dark:text-gray-500' : ''}`}>
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
  );
};

export default TaskItem;