import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import NotebookList from '../components/NotesComponents/NotebookList';
import NoteEditor from '../components/NotesComponents/NoteEditor';
import CreateModal from '../components/NotesComponents/CreateModal';

interface Notebook {
  id: string;
  name: string;
  sections: Section[];
  expanded: boolean;
}

interface Section {
  id: string;
  name: string;
  pages: Page[];
  expanded: boolean;
}

interface Page {
  id: string;
  title: string;
  content: string;
}

const NotesPage: React.FC = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([
    {
      id: '1',
      name: 'Mathematics',
      expanded: false,
      sections: [
        {
          id: '1-1',
          name: 'Calculus',
          expanded: false,
          pages: [
            {
              id: '1-1-1',
              title: 'Derivatives',
              content: 'Notes about derivatives and their applications...'
            },
            {
              id: '1-1-2',
              title: 'Integrals',
              content: 'Notes about integration techniques...'
            }
          ]
        },
        {
          id: '1-2',
          name: 'Linear Algebra',
          expanded: false,
          pages: [
            {
              id: '1-2-1',
              title: 'Matrices',
              content: 'Notes about matrix operations...'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Physics',
      expanded: false,
      sections: [
        {
          id: '2-1',
          name: 'Mechanics',
          expanded: false,
          pages: [
            {
              id: '2-1-1',
              title: 'Newton\'s Laws',
              content: 'First Law: An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.\n\nSecond Law: The acceleration of an object depends on the mass of the object and the amount of force applied.\n\nThird Law: For every action, there is an equal and opposite reaction.'
            }
          ]
        }
      ]
    }
  ]);

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

  const createNotebook = () => {
    if (!newNotebookName) return;
    
    const newNotebook: Notebook = {
      id: Date.now().toString(),
      name: newNotebookName,
      expanded: false,
      sections: []
    };
    
    setNotebooks([...notebooks, newNotebook]);
    setShowCreateNotebookModal(false);
    setNewNotebookName('');
  };

  const createSection = () => {
    if (!newSectionName || !selectedNotebookId) return;
    
    const newSection: Section = {
      id: Date.now().toString(),
      name: newSectionName,
      expanded: false,
      pages: []
    };
    
    setNotebooks(notebooks.map(notebook => 
      notebook.id === selectedNotebookId 
        ? { ...notebook, sections: [...notebook.sections, newSection] } 
        : notebook
    ));
    
    setShowCreateSectionModal(false);
    setNewSectionName('');
  };

  const createPage = () => {
    if (!newPageTitle || !selectedNotebookId || !selectedSectionId) return;
    
    const newPage: Page = {
      id: Date.now().toString(),
      title: newPageTitle,
      content: ''
    };
    
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
  };

  const updateNoteContent = () => {
    if (!selectedNotebookId || !selectedSectionId || !selectedPageId) return;
    
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
                        ? { ...page, content: activeNoteContent, title: activeNoteTitle } 
                        : page
                    ) 
                  } 
                : section
            ) 
          } 
        : notebook
    ));
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