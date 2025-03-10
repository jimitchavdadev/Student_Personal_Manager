// src/services/api.ts
import axios from 'axios';
import { Task, TaskWithSubsteps, Substep } from '../types/todoTypes';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TaskPayload {
  task_name: string;
  task_type: 'Study' | 'Personal';
  due_date: string;
  description: string;
  status?: 'pending' | 'completed';
}

export interface TaskResponse {
  _id: string;
  task_name: string;
  task_type: 'Study' | 'Personal';
  due_date: string;
  description: string;
  status: 'pending' | 'completed';
  substeps: {
    step: string;
    completed: boolean;
  }[];
}

export interface SubstepPayload {
  step: string;
  completed: boolean;
}

// Transform backend response to frontend format
const transformTaskResponse = (task: TaskResponse): TaskWithSubsteps => {
  return {
    id: task._id,
    name: task.task_name,
    type: task.task_type,
    due_date: task.due_date,
    description: task.description,
    completed: task.status === 'completed',
    created_at: '', // The backend doesn't seem to return this
    user_id: '', // The backend doesn't seem to return this
    substeps: task.substeps.map((substep, index) => ({
      id: `${task._id}-substep-${index}`, // Creating a temporary ID
      task_id: task._id,
      text: substep.step,
      completed: substep.completed,
      created_at: '', // The backend doesn't seem to return this
    })),
  };
};

// Transform frontend task to backend format
const transformTaskForBackend = (task: Omit<Task, 'id' | 'created_at' | 'user_id'>): TaskPayload => {
  return {
    task_name: task.name,
    task_type: task.type,
    due_date: task.due_date,
    description: task.description,
    status: task.completed ? 'completed' : 'pending',
  };
};

// API Functions
export const todoApi = {
  // Get all tasks
  getTasks: async (): Promise<TaskWithSubsteps[]> => {
    try {
      const response = await api.get('/tasks');
      return response.data.map(transformTaskResponse);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (
    taskData: Omit<Task, 'id' | 'created_at' | 'user_id'>, 
    substeps: Omit<Substep, 'id' | 'created_at' | 'task_id'>[]
  ): Promise<TaskWithSubsteps> => {
    try {
      // Create the task first
      const taskPayload = transformTaskForBackend(taskData);
      const response = await api.post('/tasks', taskPayload);
      const taskId = response.data._id;
      
      // Add substeps to the created task
      if (substeps.length > 0) {
        for (const substep of substeps) {
          await api.post(`/tasks/${taskId}/substeps`, {
            step: substep.text,
            completed: substep.completed,
          });
        }
      }
      
      // Fetch the updated task with substeps
      const updatedTaskResponse = await api.get(`/tasks/${taskId}`);
      return transformTaskResponse(updatedTaskResponse.data);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (id: string, taskData: Partial<Task>): Promise<void> => {
    try {
      const payload: Partial<TaskPayload> = {};
      
      if (taskData.name) payload.task_name = taskData.name;
      if (taskData.type) payload.task_type = taskData.type;
      if (taskData.due_date) payload.due_date = taskData.due_date;
      if (taskData.description) payload.description = taskData.description;
      if (taskData.completed !== undefined) {
        payload.status = taskData.completed ? 'completed' : 'pending';
      }
      
      await api.put(`/tasks/${id}`, payload);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Add a substep to a task
  addSubstep: async (taskId: string, substep: SubstepPayload): Promise<void> => {
    try {
      await api.post(`/tasks/${taskId}/substeps`, substep);
    } catch (error) {
      console.error('Error adding substep:', error);
      throw error;
    }
  },

  // Update a substep
  updateSubstep: async (taskId: string, substepIndex: number, substep: Partial<SubstepPayload>): Promise<void> => {
    try {
      await api.put(`/tasks/${taskId}/substeps/${substepIndex}`, substep);
    } catch (error) {
      console.error('Error updating substep:', error);
      throw error;
    }
  },

  // Delete a substep
  deleteSubstep: async (taskId: string, substepIndex: number): Promise<void> => {
    try {
      await api.delete(`/tasks/${taskId}/substeps/${substepIndex}`);
    } catch (error) {
      console.error('Error deleting substep:', error);
      throw error;
    }
  },
};

export default todoApi;