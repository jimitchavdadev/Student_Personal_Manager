import React from 'react';
import { 
  ListTodo, 
  BookOpen, 
  Calendar, 
  Search, 
  Users, 
  HelpCircle, 
  Settings,
  Bookmark
} from 'lucide-react';
import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen }) => {
  const navItems = [
    { id: 'todo' as Page, label: 'To-Do', icon: <ListTodo size={20} /> },
    { id: 'notes' as Page, label: 'Notes', icon: <BookOpen size={20} /> },
    { id: 'assignments' as Page, label: 'Assignments & Exams', icon: <Calendar size={20} /> },
    { id: 'study' as Page, label: 'Study Material', icon: <Search size={20} /> },
    { id: 'collaborate' as Page, label: 'Collaborate', icon: <Users size={20} /> },
    { id: 'doubt' as Page, label: 'Doubt', icon: <HelpCircle size={20} /> },
    { id: 'settings' as Page, label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside 
      className={`${
        isOpen ? 'w-64' : 'w-0 md:w-16'
      } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex-shrink-0 overflow-hidden`}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        {isOpen ? (
          <div className="flex items-center px-4">
            <Bookmark className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold">StudyPro</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Bookmark className="h-8 w-8 text-blue-600" />
          </div>
        )}
      </div>
      
      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="mb-1 px-2">
              <button
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="ml-3 whitespace-nowrap">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;