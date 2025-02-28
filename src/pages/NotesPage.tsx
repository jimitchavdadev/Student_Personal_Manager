import React, { useState } from 'react';
import { BookOpen, Plus, Folder, File, ChevronRight, ChevronDown, MoreVertical, X } from 'lucide-react';

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
    
    // Find the page content
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
        {/* Notebooks Sidebar */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-[calc(100vh-180px)] overflow-y-auto">
          <h2 className="font-semibold mb-4 text-lg">Notebooks</h2>
          <ul className="space-y-2">
            {notebooks.map(notebook => (
              <li key={notebook.id} className="text-sm">
                <div 
                  className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-200"
                  onClick={() => toggleNotebookExpand(notebook.id)}
                >
                  <div className="flex items-center">
                    {notebook.expanded ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
                    <Folder size={16} className="mr-2 text-blue-500" />
                    <span>{notebook.name}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openCreateSectionModal(notebook.id);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                {notebook.expanded && (
                  <ul className="pl-6 mt-1 space-y-1">
                    {notebook.sections.map(section => (
                      <li key={section.id}>
                        <div 
                          className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-200"
                          onClick={() => toggleSectionExpand(notebook.id, section.id)}
                        >
                          <div className="flex items-center">
                            {section.expanded ? <ChevronDown size={14} className="mr-1" /> : <ChevronRight size={14} className="mr-1" />}
                            <BookOpen size={14} className="mr-2 text-purple-500" />
                            <span>{section.name}</span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openCreatePageModal(notebook.id, section.id);
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        
                        {section.expanded && (
                          <ul className="pl-6 mt-1 space-y-1">
                            {section.pages.map(page => (
                              <li 
                                key={page.id}
                                className={`flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-200 ${
                                  selectedPageId === page.id ? 'bg-blue-100 dark:bg-blue-900' : ''
                                }`}
                                onClick={() => selectPage(notebook.id, section.id, page.id)}
                              >
                                <File size={14} className="mr-2 text-gray-500" />
                                <span>{page.title}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Note Editor */}
        <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md h-[calc(100vh-180px)] flex flex-col">
          {selectedPageId ? (
            <>
              <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <input
                  type="text"
                  value={activeNoteTitle}
                  onChange={(e) => setActiveNoteTitle(e.target.value)}
                  onBlur={updateNoteContent}
                  className="w-full text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0"
                  placeholder="Note Title"
                />
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <textarea
                  value={activeNoteContent}
                  onChange={(e) => setActiveNoteContent(e.target.value)}
                  onBlur={updateNoteContent}
                  className="w-full h-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none"
                  placeholder="Start typing your note here..."
                ></textarea>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <BookOpen size={64} className="mb-4" />
              <p className="text-lg font-medium">Select a note to view or edit</p>
              <p className="text-sm">Or create a new notebook, section, or page</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Notebook Modal */}
      {showCreateNotebookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Create New Notebook</h3>
              <button 
                onClick={() => setShowCreateNotebookModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notebook Name
                </label>
                <input
                  type="text"
                  value={newNotebookName}
                  onChange={(e) => setNewNotebookName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter notebook name"
                />
              </div>
            </div>
            
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowCreateNotebookModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mr-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={createNotebook}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors duration-200"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Section Modal */}
      {showCreateSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Create New Section</h3>
              <button 
                onClick={() => setShowCreateSectionModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Section Name
                </label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter section name"
                />
              </div>
            </div>
            
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowCreateSectionModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mr-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={createSection}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors duration-200"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Page Modal */}
      {showCreatePageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Create New Page</h3>
              <button 
                onClick={() => setShowCreatePageModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter page title"
                />
              </div>
            </div>
            
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowCreatePageModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mr-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={createPage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors duration-200"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;