import React, { useState } from 'react';
import { Search, BookOpen, Video, FileText, BookMarked, Bookmark, ExternalLink, Filter, SortAsc, SortDesc } from 'lucide-react';

interface StudyResource {
  id: string;
  title: string;
  type: 'Video' | 'PDF' | 'Article' | 'Research Paper' | 'Notes';
  source: string;
  url: string;
  date: string;
  rating: number;
  saved: boolean;
}

const StudyMaterialPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceType, setResourceType] = useState<string>('');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'rating'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<StudyResource[]>([
    {
      id: '1',
      title: "Newton's Laws of Motion Explained",
      type: 'Video',
      source: 'YouTube - Khan Academy',
      url: 'https://www.youtube.com/watch?v=kKKM8Y-u7ds',
      date: '2023-05-15',
      rating: 4.8,
      saved: true
    },
    {
      id: '2',
      title: "Introduction to Calculus",
      type: 'PDF',
      source: 'MIT OpenCourseWare',
      url: '#',
      date: '2022-09-10',
      rating: 4.5,
      saved: false
    },
    {
      id: '3',
      title: "Quantum Mechanics for Beginners",
      type: 'Article',
      source: 'Science Daily',
      url: '#',
      date: '2024-01-22',
      rating: 4.2,
      saved: false
    },
    {
      id: '4',
      title: "Machine Learning Fundamentals",
      type: 'Research Paper',
      source: 'ArXiv',
      url: '#',
      date: '2023-11-05',
      rating: 4.7,
      saved: true
    },
    {
      id: '5',
      title: "Organic Chemistry Reaction Mechanisms",
      type: 'Notes',
      source: 'Professor Smith - University',
      url: '#',
      date: '2024-02-18',
      rating: 4.9,
      saved: false
    },
    {
      id: '6',
      title: "World History: The Renaissance",
      type: 'Video',
      source: 'Crash Course',
      url: 'https://www.youtube.com/watch?v=Vufba_ZcoR0',
      date: '2022-12-03',
      rating: 4.6,
      saved: false
    }
  ]);

  const toggleSaved = (resourceId: string) => {
    setSearchResults(searchResults.map(resource => 
      resource.id === resourceId ? { ...resource, saved: !resource.saved } : resource
    ));
  };

  const handleSearch = () => {
    // In a real app, this would make an API call to search for resources
    console.log(`Searching for: ${searchQuery}, Type: ${resourceType}`);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'PDF':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'Article':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'Research Paper':
        return <BookMarked className="h-5 w-5 text-purple-500" />;
      case 'Notes':
        return <FileText className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const sortedResults = [...searchResults].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'rating') {
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    } else {
      // Sort by relevance (default)
      return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
    }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Study Material</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Query
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                placeholder="e.g., Newton's Laws, Calculus, etc."
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Resource Type
            </label>
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            >
              <option value="">All Types</option>
              <option value="Video">Video</option>
              <option value="PDF">PDF</option>
              <option value="Article">Article</option>
              <option value="Research Paper">Research Paper</option>
              <option value="Notes">Notes</option>
            </select>
          </div>
          
          <div className="md:w-auto self-end">
            <button
              onClick={handleSearch}
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <Filter size={16} className="mr-1" />
              Filters
            </button>
            
            <div className="h-4 border-r border-gray-300 dark:border-gray-600"></div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'rating')}
                className="text-sm border-none bg-transparent focus:outline-none focus:ring-0 text-gray-600 dark:text-gray-400 py-0"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date</option>
                <option value="rating">Rating</option>
              </select>
              
              <button
                onClick={toggleSortOrder}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {searchResults.length} results found
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-750 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                >
                  <option value="">All Sources</option>
                  <option value="youtube">YouTube</option>
                  <option value="khan">Khan Academy</option>
                  <option value="mit">MIT OpenCourseWare</option>
                  <option value="arxiv">ArXiv</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date Range
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                >
                  <option value="">Any Time</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                  <option value="year">Past Year</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rating
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold">Search Results</h2>
        </div>
        
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedResults.map(resource => (
            <li key={resource.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200">
              <div className="flex items-start">
                <div className="mt-1 mr-3">
                  {getResourceIcon(resource.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                      {resource.title}
                    </a>
                    <button
                      onClick={() => toggleSaved(resource.id)}
                      className={`p-1 rounded-full ${
                        resource.saved 
                          ? 'text-yellow-500 hover:text-yellow-600' 
                          : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400'
                      } transition-colors duration-200`}
                    >
                      <Bookmark size={18} fill={resource.saved ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 mr-2">
                      {resource.type}
                    </span>
                    <span>{resource.source}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(resource.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <svg className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {resource.rating.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                      <ExternalLink size={14} className="mr-1" />
                      View Resource
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudyMaterialPage;