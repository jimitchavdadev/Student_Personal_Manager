import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import NotebookList from '../components/NotesComponents/NotebookList';
import NoteEditor from '../components/NotesComponents/NoteEditor';
import CreateModal from '../components/NotesComponents/CreateModal';
import { noteService } from '../services/noteService';
import type { Notebook, Section, Page } from '../types/notesTypes';

const NotesPage: React.FC = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  
  const [showCreateNotebookModal, setShowCreateNotebookModal] = useState(false);
  const [showCreateSectionModal, setShowCreateSectionModal] = useState(false);
  const [showCreatePageModal, setShowCreatePageModal] = useState(false);
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [activeNoteContent, setActiveNoteContent] = useState('');
  const [activeNoteTitle, setActiveNoteTitle] = useState('');

  const toggleNotebookExpand = (notebookId: string) => {
    setNotebooks(notebooks.map(notebook => 
      notebook.id === notebookId 
        ? { ...notebook, expanded: !notebook.expanded } 
        : notebook
    ));
  };

  const toggleSectionExpand = (notebookId: string, sectionId: string) => {
    setNotebooks(notebooks.map(notebook => 
      notebook.id === notebookId 
        ? { 
            ...notebook, 
            sections: notebook.sections.map(section => 
              section.id === sectionId 
                ? { ...section, expanded: !section.expanded } 
                : section
            ) 
          } 
        : notebook
    ));
  };

  const selectPage = (notebookId: string, sectionId: string, pageId: string) => {
    setSelectedNotebookId(notebookId);
    setSelectedSectionId(sectionId);
    setSelectedPageId(pageId);
    
    const notebook = notebooks.find(n => n.id === notebookId);
    if (notebook) {
      const section = notebook.sections.find(s => s.id === sectionId);
      if (section) {
        const page = section.pages.find(p => p.id === pageId);
        if (page) {
          setActiveNoteContent(page.content);
          setActiveNoteTitle(page.title);
        }
      }
    }
  };

  // Replace the static notebooks data with API call
  useEffect(() => {
    const fetchNotebooks = async () => {
      try {
        // Replace 'user123' with actual userId from auth context
        const fetchedNotebooks = await noteService.getAllNotebooksWithContent('user123');
        setNotebooks(fetchedNotebooks);
      } catch (error) {
        console.error('Error fetching notebooks:', error);
        // Handle error (show notification, etc.)
      }
    };

    fetchNotebooks();
  }, []);

  // Update createNotebook function
  const createNotebook = async () => {
    if (!newNotebookName) return;
    
    try {
      const newNotebook = await noteService.createNotebook('user123', newNotebookName);
      setNotebooks([...notebooks, newNotebook]);
      setShowCreateNotebookModal(false);
      setNewNotebookName('');
    } catch (error) {
      console.error('Error creating notebook:', error);
      // Handle error
    }
  };

  // Update createSection function
  const createSection = async () => {
    if (!newSectionName || !selectedNotebookId) return;
    
    try {
      const newSection = await noteService.createSection(selectedNotebookId, newSectionName);
      setNotebooks(notebooks.map(notebook => 
        notebook.id === selectedNotebookId 
          ? { ...notebook, sections: [...notebook.sections, newSection] } 
          : notebook
      ));
      setShowCreateSectionModal(false);
      setNewSectionName('');
    } catch (error) {
      console.error('Error creating section:', error);
      // Handle error
    }
  };

  // Update createPage function
  const createPage = async () => {
    if (!newPageTitle || !selectedNotebookId || !selectedSectionId) return;
    
    try {
      const newPage = await noteService.createPage(selectedSectionId, newPageTitle);

      setNotebooks(notebooks.map(notebook => 
        notebook.id === selectedNotebookId 
          ? { 
              ...notebook, 
              sections: notebook.sections.map(section => 
                section.id === selectedSectionId 
                  ? { ...section, pages: [...section.pages, newPage] } 
                  : section
              ) 
            } 
          : notebook
      ));
      setShowCreatePageModal(false);
      setNewPageTitle('');
    } catch (error) {
      console.error('Error creating page:', error);
      // Handle error
    }
  };

  // Update updateNoteContent function
  const updateNoteContent = async () => {
    if (!selectedPageId) return;
    
    try {
      const updatedPage = await noteService.updatePage(selectedPageId, activeNoteTitle, activeNoteContent);
      setNotebooks(notebooks.map(notebook => 
        notebook.id === selectedNotebookId 
          ? { 
              ...notebook, 
              sections: notebook.sections.map(section => 
                section.id === selectedSectionId 
                  ? { 
                      ...section, 
                      pages: section.pages.map(page => 
                        page.id === selectedPageId 
                          ? { ...page, content: updatedPage.content, title: updatedPage.title } 
                          : page
                      ) 
                    } 
                  : section
              ) 
            } 
          : notebook
      ));
    } catch (error) {
      console.error('Error updating page:', error);
      throw error; // Propagate error to handle in the editor
    }
  };

  const openCreateSectionModal = (notebookId: string) => {
    setSelectedNotebookId(notebookId);
    setShowCreateSectionModal(true);
  };

  const openCreatePageModal = (notebookId: string, sectionId: string) => {
    setSelectedNotebookId(notebookId);
    setSelectedSectionId(sectionId);
    setShowCreatePageModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notes</h1>
        <button
          onClick={() => setShowCreateNotebookModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus size={18} className="mr-1" />
          Create Notebook
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <NotebookList
          notebooks={notebooks}
          selectedPageId={selectedPageId}
          toggleNotebookExpand={toggleNotebookExpand}
          toggleSectionExpand={toggleSectionExpand}
          selectPage={selectPage}
          openCreateSectionModal={openCreateSectionModal}
          openCreatePageModal={openCreatePageModal}
        />
        
        <NoteEditor
          selectedPageId={selectedPageId}
          activeNoteTitle={activeNoteTitle}
          activeNoteContent={activeNoteContent}
          setActiveNoteTitle={setActiveNoteTitle}
          setActiveNoteContent={setActiveNoteContent}
          updateNoteContent={updateNoteContent}
        />
      </div>

      <CreateModal
        isOpen={showCreateNotebookModal}
        onClose={() => setShowCreateNotebookModal(false)}
        title="Create New Notebook"
        inputLabel="Notebook Name"
        inputValue={newNotebookName}
        onInputChange={setNewNotebookName}
        onCreate={createNotebook}
      />

      <CreateModal
        isOpen={showCreateSectionModal}
        onClose={() => setShowCreateSectionModal(false)}
        title="Create New Section"
        inputLabel="Section Name"
        inputValue={newSectionName}
        onInputChange={setNewSectionName}
        onCreate={createSection}
      />

      <CreateModal
        isOpen={showCreatePageModal}
        onClose={() => setShowCreatePageModal(false)}
        title="Create New Page"
        inputLabel="Page Title"
        inputValue={newPageTitle}
        onInputChange={setNewPageTitle}
        onCreate={createPage}
      />
    </div>
  );
};

export default NotesPage;