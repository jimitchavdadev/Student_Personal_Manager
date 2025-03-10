import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import NotebookList from '../components/NotesComponents/NotebookList';
import NoteEditor from '../components/NotesComponents/NoteEditor';
import CreateModal from '../components/NotesComponents/CreateModal';
import { api, Notebook, Section, Page } from '../api/notesApi';

const NotesPage: React.FC = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch notebooks when component mounts
  useEffect(() => {
    fetchNotebooks();
  }, []);

  const fetchNotebooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedNotebooks = await api.getNotebooks();
      setNotebooks(fetchedNotebooks);
    } catch (err) {
      setError('Failed to load notebooks');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNotebookContents = async (notebookId: string) => {
    try {
      setIsLoading(true);
      const fullNotebook = await api.getNotebookWithContents(notebookId);
      
      // Update the notebooks array with the fully loaded notebook
      setNotebooks(prev => 
        prev.map(nb => 
          nb._id === notebookId ? fullNotebook : nb
        )
      );
    } catch (err) {
      console.error(`Error loading notebook ${notebookId} contents:`, err);
      setError('Failed to load notebook contents');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotebookExpand = async (notebookId: string) => {
    // Find the notebook to toggle
    const notebook = notebooks.find(nb => nb._id === notebookId);
    
    // If it doesn't have sections loaded yet, load them now
    if (notebook && (!notebook.sections || notebook.sections.length === 0)) {
      await loadNotebookContents(notebookId);
    }
    
    // Toggle the expanded state
    setNotebooks(notebooks.map(notebook => 
      notebook._id === notebookId 
        ? { ...notebook, expanded: !notebook.expanded } 
        : notebook
    ));
  };

  const toggleSectionExpand = (notebookId: string, sectionId: string) => {
    setNotebooks(notebooks.map((notebook: Notebook) => 
      notebook._id === notebookId 
      ? { 
        ...notebook, 
        sections: notebook.sections?.map((section: Section) => 
          section._id === sectionId 
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
    
    const notebook = notebooks.find(n => n._id === notebookId);
    if (notebook) {
      const section: Section | undefined = notebook.sections?.find((s: Section) => s._id === sectionId);
      if (section) {
        const page: Page | undefined = section.pages?.find((p: Page) => p._id === pageId);
        if (page) {
          setActiveNoteContent(page.content);
          setActiveNoteTitle(page.title);
        }
      }
    }
  };

  const createNotebook = async () => {
    if (!newNotebookName) return;
    
    try {
      const newNotebook = await api.createNotebook(newNotebookName);
      setNotebooks([...notebooks, newNotebook]);
      setShowCreateNotebookModal(false);
      setNewNotebookName('');
    } catch (err) {
      setError('Failed to create notebook');
      console.error(err);
    }
  };

  const createSection = async () => {
    if (!newSectionName || !selectedNotebookId) return;
    
    try {
      const newSection = await api.createSection(selectedNotebookId, newSectionName);
      
      setNotebooks(notebooks.map(notebook => 
        notebook._id === selectedNotebookId 
          ? { 
              ...notebook, 
              sections: [...(notebook.sections || []), newSection] 
            } 
          : notebook
      ));
      
      setShowCreateSectionModal(false);
      setNewSectionName('');
    } catch (err) {
      setError('Failed to create section');
      console.error(err);
    }
  };

  const createPage = async () => {
    if (!newPageTitle || !selectedNotebookId || !selectedSectionId) return;
    
    try {
      const newPage = await api.createPage(selectedSectionId, newPageTitle);
      
      setNotebooks(notebooks.map((notebook: Notebook) => 
        notebook._id === selectedNotebookId 
          ? { 
          ...notebook, 
          sections: notebook.sections?.map((section: Section) => 
            section._id === selectedSectionId 
          ? { ...section, pages: [...(section.pages || []), newPage] } 
          : section
          ) 
        } 
          : notebook
      ));
      
      setShowCreatePageModal(false);
      setNewPageTitle('');
    } catch (err) {
      setError('Failed to create page');
      console.error(err);
    }
  };

  const updateNoteContent = async () => {
    if (!selectedNotebookId || !selectedSectionId || !selectedPageId) return;
    
    try {
      await api.updatePage(selectedPageId, activeNoteTitle, activeNoteContent);
      
      // Update local state
      setNotebooks(notebooks.map((notebook: Notebook) => 
        notebook._id === selectedNotebookId 
          ? { 
          ...notebook, 
          sections: notebook.sections?.map((section: Section) => 
            section._id === selectedSectionId 
          ? { 
              ...section, 
              pages: section.pages?.map((page: Page) => 
            page._id === selectedPageId 
              ? { ...page, content: activeNoteContent, title: activeNoteTitle } 
              : page
              ) 
            } 
          : section
          ) 
        } 
          : notebook
      ));
    } catch (err) {
      setError('Failed to update page');
      console.error(err);
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
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {isLoading && !notebooks.length ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
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
      )}

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