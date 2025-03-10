// src/services/api.ts

import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Update this with your backend URL

// Types
export interface Notebook {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  sections?: Section[];
  expanded?: boolean;
}

export interface Section {
  _id: string;
  notebookId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  pages?: Page[];
  expanded?: boolean;
}

export interface Page {
  _id: string;
  sectionId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Functions
export const api = {
  // Notebooks
  async getNotebooks() {
    try {
      const response = await axios.get<Notebook[]>(`${API_URL}/notebooks`);
      // Add expanded property for UI state management
      return response.data.map(notebook => ({
        ...notebook,
        expanded: false
      }));
    } catch (error) {
      console.error('Error fetching notebooks:', error);
      throw error;
    }
  },

  async getNotebookWithContents(notebookId: string) {
    try {
      const response = await axios.get<Notebook>(`${API_URL}/notebooks/${notebookId}`);
      
      // Transform the response to match the frontend structure
      // Adding expanded properties for UI state management
      const notebook = {
        ...response.data,
        expanded: true, // Set to true since we're fetching it to expand
        sections: response.data.sections?.map(section => ({
          ...section,
          expanded: false
        })) || []
      };
      return notebook;
    } catch (error) {
      console.error(`Error fetching notebook ${notebookId}:`, error);
      throw error;
    }
  },

  async createNotebook(name: string) {
    try {
      const response = await axios.post<Notebook>(`${API_URL}/notebooks`, { name });
      return {
        ...response.data,
        expanded: false,
        sections: []
      };
    } catch (error) {
      console.error('Error creating notebook:', error);
      throw error;
    }
  },

  async updateNotebook(id: string, name: string) {
    try {
      const response = await axios.put<Notebook>(`${API_URL}/notebooks/${id}`, { name });
      return response.data;
    } catch (error) {
      console.error(`Error updating notebook ${id}:`, error);
      throw error;
    }
  },

  async deleteNotebook(id: string) {
    try {
      await axios.delete(`${API_URL}/notebooks/${id}`);
    } catch (error) {
      console.error(`Error deleting notebook ${id}:`, error);
      throw error;
    }
  },

  // Sections
  async createSection(notebookId: string, title: string) {
    try {
      const response = await axios.post<Section>(`${API_URL}/sections`, { notebookId, title });
      return {
        ...response.data,
        expanded: false,
        pages: []
      };
    } catch (error) {
      console.error('Error creating section:', error);
      throw error;
    }
  },

  async updateSection(id: string, title: string) {
    try {
      const response = await axios.put<Section>(`${API_URL}/sections/${id}`, { title });
      return response.data;
    } catch (error) {
      console.error(`Error updating section ${id}:`, error);
      throw error;
    }
  },

  async deleteSection(id: string) {
    try {
      await axios.delete(`${API_URL}/sections/${id}`);
    } catch (error) {
      console.error(`Error deleting section ${id}:`, error);
      throw error;
    }
  },

  // Pages
  async createPage(sectionId: string, title: string, content: string = '') {
    try {
      const response = await axios.post<Page>(`${API_URL}/pages`, { sectionId, title, content });
      return response.data;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  },

  async updatePage(id: string, title: string, content: string) {
    try {
      const response = await axios.put<Page>(`${API_URL}/pages/${id}`, { title, content });
      return response.data;
    } catch (error) {
      console.error(`Error updating page ${id}:`, error);
      throw error;
    }
  },

  async deletePage(id: string) {
    try {
      await axios.delete(`${API_URL}/pages/${id}`);
    } catch (error) {
      console.error(`Error deleting page ${id}:`, error);
      throw error;
    }
  }
};