import { apiClient } from './apiClient';
import { Assignment } from '../types/assignmentTypes';

export const assignmentService = {
  getAssignments: async (userId: string) => {
    return apiClient.get(`/assignments?userId=${userId}`);
  },

  createAssignment: async (assignment: Omit<Assignment, '_id'>) => {
    return apiClient.post('/assignments', assignment);
  },

  updateAssignment: async (id: string, assignment: Partial<Assignment>) => {
    return apiClient.patch(`/assignments/${id}`, assignment);
  },

  deleteAssignment: async (id: string, userId: string) => {
    return apiClient.delete(`/assignments/${id}?userId=${userId}`);
  }
};