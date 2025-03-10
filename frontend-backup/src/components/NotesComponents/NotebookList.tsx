import React from 'react';
import { Folder, ChevronRight, ChevronDown, Plus, BookOpen, File } from 'lucide-react';

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

interface NotebookListProps {
  notebooks: Notebook[];
  selectedPageId: string | null;
  toggleNotebookExpand: (notebookId: string) => void;
  toggleSectionExpand: (notebookId: string, sectionId: string) => void;
  selectPage: (notebookId: string, sectionId: string, pageId: string) => void;
  openCreateSectionModal: (notebookId: string) => void;
  openCreatePageModal: (notebookId: string, sectionId: string) => void;
}

const NotebookList: React.FC<NotebookListProps> = ({
  notebooks,
  selectedPageId,
  toggleNotebookExpand,
  toggleSectionExpand,
  selectPage,
  openCreateSectionModal,
  openCreatePageModal,
}) => {
  return (
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
  );
};

export default NotebookList;