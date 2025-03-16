import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TodoPage from './pages/TodoPage';
import NotesPage from './pages/NotesPage';
import AssignmentsPage from './pages/AssignmentsPage';
import StudyMaterialPage from './pages/StudyMaterialPage';
import CollaboratePage from './pages/CollaboratePage';
import DoubtPage from './pages/DoubtPage';
import RelaxPage from './pages/RelaxPage';
import SettingsPage from './pages/SettingsPage';
import { Auth } from './components/Auth';
import { AuthProvider, useAuth } from './contexts/AuthContext';

export type Page = 'todo' | 'notes' | 'assignments' | 'study' | 'collaborate' | 'doubt' | 'relax' | 'settings';
export type Theme = 'light' | 'dark';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('todo');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');

  // Close sidebar by default on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

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
      case 'relax':
        return <RelaxPage />;
      case 'settings':
        return <SettingsPage theme={theme} toggleTheme={toggleTheme} />;
      default:
        return <TodoPage />;
    }
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200`}>
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-30 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={(page) => {
            setCurrentPage(page);
            // Close sidebar on mobile after navigation
            if (window.innerWidth < 768) {
              setIsSidebarOpen(false);
            }
          }}
          isOpen={isSidebarOpen} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header 
          toggleSidebar={toggleSidebar} 
          theme={theme} 
          toggleTheme={toggleTheme}
          user={user}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;