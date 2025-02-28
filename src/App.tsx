import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  User, 
  Menu, 
  CheckCircle2, 
  ListTodo, 
  BookOpen, 
  Calendar, 
  Search, 
  Users, 
  HelpCircle, 
  Settings
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TodoPage from './pages/TodoPage';
import NotesPage from './pages/NotesPage';
import AssignmentsPage from './pages/AssignmentsPage';
import StudyMaterialPage from './pages/StudyMaterialPage';
import CollaboratePage from './pages/CollaboratePage';
import DoubtPage from './pages/DoubtPage';
import SettingsPage from './pages/SettingsPage';

export type Page = 'todo' | 'notes' | 'assignments' | 'study' | 'collaborate' | 'doubt' | 'settings';
export type Theme = 'light' | 'dark';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('todo');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check if user has a theme preference stored
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // If no preference is stored, use system preference
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'todo':
        return <TodoPage />;
      case 'notes':
        return <NotesPage />;
      case 'assignments':
        return <AssignmentsPage />;
      case 'study':
        return <StudyMaterialPage />;
      case 'collaborate':
        return <CollaboratePage />;
      case 'doubt':
        return <DoubtPage />;
      case 'settings':
        return <SettingsPage theme={theme} toggleTheme={toggleTheme} />;
      default:
        return <TodoPage />;
    }
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200`}>
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isOpen={isSidebarOpen} 
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;