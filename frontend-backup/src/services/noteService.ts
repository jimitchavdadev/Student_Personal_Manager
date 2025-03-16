import { apiClient } from './apiClient';
import { 
  Notebook, 
  Section, 
  Page, 
  ApiNotebook, 
  ApiSection, 
  ApiPage 
} from '../types/notesTypes';

class NoteService {
  // Transform API response to frontend format
  private transformToNotebook(apiNotebook: ApiNotebook, sections: Section[] = []): Notebook {
    return {
      id: apiNotebook._id,
      name: apiNotebook.name,
      sections,
      expanded: false
    };
  }

  private transformToSection(apiSection: ApiSection, pages: Page[] = []): Section {
    return {
      id: apiSection._id,
      name: apiSection.title,
      pages,
      expanded: false
    };
  }

  private transformToPage(apiPage: ApiPage): Page {
    return {
      id: apiPage._id,
      title: apiPage.title,
      content: apiPage.content
    };
  }

  async getAllNotebooksWithContent(userId: string): Promise<Notebook[]> {
    try {
      // Get all notebooks
      const notebooks: ApiNotebook[] = await apiClient.get(`/notebooks?userId=${userId}`);
      
      // Get sections and pages for each notebook
      const notebooksWithContent = await Promise.all(
        notebooks.map(async (notebook) => {
          const sections: ApiSection[] = await apiClient.get(`/sections?notebookId=${notebook._id}`);
          
          const sectionsWithPages = await Promise.all(
            sections.map(async (section) => {
              const pages: ApiPage[] = await apiClient.get(`/pages?sectionId=${section._id}`);
              return this.transformToSection(section, pages.map(this.transformToPage));
            })
          );
          
          return this.transformToNotebook(notebook, sectionsWithPages);
        })
      );
      
      return notebooksWithContent;
    } catch (error) {
      console.error('Error fetching notebooks:', error);
      throw error;
    }
  }

  async createNotebook(userId: string, name: string): Promise<Notebook> {
    const notebook = await apiClient.post('/notebooks', { userId, name });
    return this.transformToNotebook(notebook);
  }

  async createSection(notebookId: string, title: string): Promise<Section> {
    const section = await apiClient.post('/sections', { notebookId, title });
    return this.transformToSection(section);
  }

  async createPage(sectionId: string, title: string, content: string = ''): Promise<Page> {
    const page = await apiClient.post('/pages', { sectionId, title, content });
    return this.transformToPage(page);
  }

  async updatePage(pageId: string, title: string, content: string): Promise<Page> {
    const page = await apiClient.patch(`/pages/${pageId}`, { title, content });
    return this.transformToPage(page);
  }

  async deleteNotebook(notebookId: string, userId: string): Promise<void> {
    await apiClient.delete(`/notebooks/${notebookId}?userId=${userId}`);
  }

  async deleteSection(sectionId: string): Promise<void> {
    await apiClient.delete(`/sections/${sectionId}`);
  }

  async deletePage(pageId: string): Promise<void> {
    await apiClient.delete(`/pages/${pageId}`);
  }
}

export const noteService = new NoteService();
export type { Notebook, Section, Page };