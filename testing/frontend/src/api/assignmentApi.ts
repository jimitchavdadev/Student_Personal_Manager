import axios from 'axios';
import { Assignment, Exam } from '../types/assignmentTypes';

// Define the base URL for the API
const API_BASE_URL =  'http://localhost:5000/api/assignments';

// Types for API responses
interface ApiResponse<T> {
  message: string;
  [key: string]: any;
}

// Fetch all assignments
export const fetchAssignments = async (): Promise<Assignment[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  };
  
  // Add a new assignment
  export const addAssignment = async (assignment: Omit<Assignment, 'id' | 'completed' | 'attachments'>): Promise<Assignment> => {
    try {
      const response = await axios.post(`${API_BASE_URL}`, assignment);
      return response.data;
    } catch (error) {
      console.error('Error adding assignment:', error);
      throw error;
    }
  };
  
  // Delete an assignment
  export const deleteAssignment = async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  };
  

// Assignment API service
export const AssignmentService = {
  // Get all assignments
  getAllAssignments: async (): Promise<Assignment[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/assignments`);
      // Transform the MongoDB data to match frontend Assignment type
      return response.data.map((item: any) => ({
        id: item._id,
        title: item.assignment_name,
        description: item.what_to_submit,
        course: item.submit_to,
        dueDate: item.due_date,
        completed: item.status === 'completed',
        location: item.where_to_submit,
        submissionMethod: item.how_to_submit,
        attachments: []
      }));
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  // Create a new assignment
  createAssignment: async (assignment: Omit<Assignment, 'id' | 'completed' | 'attachments'>): Promise<Assignment> => {
    try {
      // Transform frontend data to match MongoDB schema
      const assignmentData = {
        assignment_name: assignment.title,
        due_date: assignment.dueDate,
        submit_to: assignment.course,
        where_to_submit: assignment.location,
        what_to_submit: assignment.description,
        how_to_submit: assignment.submissionMethod,
        status: 'pending'
      };

      const response = await axios.post<ApiResponse<any>>(`${API_BASE_URL}/assignments`, assignmentData);
      
      // Transform the response back to frontend Assignment type
      return {
        id: response.data.newAssignment._id,
        title: response.data.newAssignment.assignment_name,
        description: response.data.newAssignment.what_to_submit,
        course: response.data.newAssignment.submit_to,
        dueDate: response.data.newAssignment.due_date,
        completed: response.data.newAssignment.status === 'completed',
        location: response.data.newAssignment.where_to_submit,
        submissionMethod: response.data.newAssignment.how_to_submit,
        attachments: []
      };
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  },

  // Update an assignment
  updateAssignment: async (id: string, updates: Partial<Assignment>): Promise<Assignment> => {
    try {
      // Update each field individually using the API's PATCH endpoints
      let updatedAssignment: any = { _id: id };
      
      if (updates.title !== undefined) {
        const response = await axios.patch<ApiResponse<any>>(
          `${API_BASE_URL}/assignments/${id}/name`,
          { assignment_name: updates.title }
        );
        updatedAssignment = { ...updatedAssignment, ...response.data.updatedAssignment };
      }
      
      if (updates.dueDate !== undefined) {
        const response = await axios.patch<ApiResponse<any>>(
          `${API_BASE_URL}/assignments/${id}/due_date`,
          { due_date: updates.dueDate }
        );
        updatedAssignment = { ...updatedAssignment, ...response.data.updatedAssignment };
      }
      
      if (updates.course !== undefined) {
        const response = await axios.patch<ApiResponse<any>>(
          `${API_BASE_URL}/assignments/${id}/submit_to`,
          { submit_to: updates.course }
        );
        updatedAssignment = { ...updatedAssignment, ...response.data.updatedAssignment };
      }
      
      if (updates.location !== undefined) {
        const response = await axios.patch<ApiResponse<any>>(
          `${API_BASE_URL}/assignments/${id}/where_to_submit`,
          { where_to_submit: updates.location }
        );
        updatedAssignment = { ...updatedAssignment, ...response.data.updatedAssignment };
      }
      
      if (updates.description !== undefined) {
        const response = await axios.patch<ApiResponse<any>>(
          `${API_BASE_URL}/assignments/${id}/what_to_submit`,
          { what_to_submit: updates.description }
        );
        updatedAssignment = { ...updatedAssignment, ...response.data.updatedAssignment };
      }
      
      if (updates.submissionMethod !== undefined) {
        const response = await axios.patch<ApiResponse<any>>(
          `${API_BASE_URL}/assignments/${id}/how_to_submit`,
          { how_to_submit: updates.submissionMethod }
        );
        updatedAssignment = { ...updatedAssignment, ...response.data.updatedAssignment };
      }
      
      if (updates.completed !== undefined) {
        const response = await axios.patch<ApiResponse<any>>(
          `${API_BASE_URL}/assignments/${id}/status`,
          { status: updates.completed ? 'completed' : 'pending' }
        );
        updatedAssignment = { ...updatedAssignment, ...response.data.updatedAssignment };
      }
      
      // Transform the response to frontend Assignment type
      return {
        id: updatedAssignment._id,
        title: updatedAssignment.assignment_name,
        description: updatedAssignment.what_to_submit,
        course: updatedAssignment.submit_to,
        dueDate: updatedAssignment.due_date,
        completed: updatedAssignment.status === 'completed',
        location: updatedAssignment.where_to_submit,
        submissionMethod: updatedAssignment.how_to_submit,
        attachments: []
      };
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw error;
    }
  },

  // Delete an assignment
  deleteAssignment: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/assignments/${id}`);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  },

  // Toggle assignment completion status
  toggleAssignmentCompletion: async (id: string, completed: boolean): Promise<void> => {
    try {
      await axios.patch<ApiResponse<any>>(
        `${API_BASE_URL}/assignments/${id}/status`,
        { status: completed ? 'completed' : 'pending' }
      );
    } catch (error) {
      console.error('Error toggling assignment completion:', error);
      throw error;
    }
  }
};

// Placeholder for the ExamService - would need to create similar backend endpoints for exams
export const ExamService = {
  // Implementation would be similar to AssignmentService
  // You would need to create corresponding backend endpoints for exams
};