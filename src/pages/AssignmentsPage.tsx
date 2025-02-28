import React, { useState } from 'react';
import { Calendar, Plus, MoreVertical, X, ChevronDown, ChevronUp, Clock, File, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';

interface Assignment {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
  details: {
    whom: string;
    where: string;
    what: string;
    how: string;
  };
  attachments: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

interface Exam {
  id: string;
  subject: string;
  date: string;
  toStudy: string;
  resources: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      name: 'Physics Lab Report',
      dueDate: '2025-05-15',
      completed: false,
      details: {
        whom: 'Prof. Johnson',
        where: 'Canvas LMS',
        what: 'Complete lab report with data analysis and conclusions',
        how: 'PDF upload'
      },
      attachments: [
        {
          id: '1-1',
          name: 'Lab Instructions',
          type: 'PDF',
          url: '#'
        },
        {
          id: '1-2',
          name: 'Data Spreadsheet',
          type: 'Excel',
          url: '#'
        }
      ]
    },
    {
      id: '2',
      name: 'Literature Essay',
      dueDate: '2025-05-20',
      completed: false,
      details: {
        whom: 'Prof. Smith',
        where: 'Email submission',
        what: '5-page analysis of Hamlet',
        how: 'Word document with proper citations'
      },
      attachments: [
        {
          id: '2-1',
          name: 'Essay Guidelines',
          type: 'PDF',
          url: '#'
        }
      ]
    },
    {
      id: '3',
      name: 'Programming Project',
      dueDate: '2025-05-10',
      completed: true,
      details: {
        whom: 'Prof. Lee',
        where: 'GitHub repository',
        what: 'Web application with React',
        how: 'Pull request to main branch'
      },
      attachments: [
        {
          id: '3-1',
          name: 'Project Requirements',
          type: 'PDF',
          url: '#'
        }
      ]
    }
  ]);

  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      subject: 'Calculus II',
      date: '2025-06-05',
      toStudy: 'Integration techniques, series, and polar coordinates',
      resources: [
        {
          id: '1-1',
          name: 'Lecture Notes',
          type: 'PDF',
          url: '#'
        },
        {
          id: '1-2',
          name: 'Practice Problems',
          type: 'PDF',
          url: '#'
        },
        {
          id: '1-3',
          name: 'Khan Academy: Integration',
          type: 'Video',
          url: 'https://www.khanacademy.org/math/calculus-2/integration-techniques'
        }
      ]
    },
    {
      id: '2',
      subject: 'Organic Chemistry',
      date: '2025-06-10',
      toStudy: 'Reaction mechanisms, stereochemistry, and spectroscopy',
      resources: [
        {
          id: '2-1',
          name: 'Textbook Chapters 5-8',
          type: 'Book',
          url: '#'
        },
        {
          id: '2-2',
          name: 'Lab Manual',
          type: 'PDF',
          url: '#'
        }
      ]
    },
    {
      id: '3',
      subject: 'World History',
      date: '2025-06-15',
      toStudy: 'Post-WWII era, Cold War, and decolonization',
      resources: [
        {
          id: '3-1',
          name: 'Course Reader',
          type: 'PDF',
          url: '#'
        },
        {
          id: '3-2',
          name: 'Documentary: Cold War',
          type: 'Video',
          url: '#'
        }
      ]
    }
  ]);

  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);
  const [expandedExamId, setExpandedExamId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assignments' | 'exams'>('assignments');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleAssignmentDetails = (assignmentId: string) => {
    setExpandedAssignmentId(expandedAssignmentId === assignmentId ? null : assignmentId);
  };

  const toggleExamDetails = (examId: string) => {
    setExpandedExamId(expandedExamId === examId ? null : examId);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const calculateDaysRemaining = (date: string) => {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const sortedExams = [...exams].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleAssignmentCompletion = (assignmentId: string) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === assignmentId ? { ...assignment, completed: !assignment.completed } : assignment
    ));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assignments & Exams</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddAssignmentModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus size={18} className="mr-1" />
            Add Assignment
          </button>
          <button
            onClick={() => setShowAddExamModal(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
          >
            <Plus size={18} className="mr-1" />
            Add Exam
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'assignments'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'exams'
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Exams
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="font-semibold">{activeTab === 'assignments' ? 'Assignments' : 'Exams'}</h2>
          <button 
            onClick={toggleSortOrder}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
          >
            Sort by due date
            {sortOrder === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
          </button>
        </div>

        {activeTab === 'assignments' ? (
          <div>
            {/* Desktop View for Assignments */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 text-left">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assignment</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Days Left</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedAssignments.map(assignment => (
                    <React.Fragment key={assignment.id}>
                      <tr 
                        className={`hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer ${
                          assignment.completed ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500' : ''
                        }`}
                        onClick={() => toggleAssignmentDetails(assignment.id)}
                      >
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            checked={assignment.completed}
                            onChange={() => toggleAssignmentCompletion(assignment.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className={assignment.completed ? 'line-through' : ''}>{assignment.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`${
                            calculateDaysRemaining(assignment.dueDate) < 0
                              ? 'text-red-600 dark:text-red-400'
                              : calculateDaysRemaining(assignment.dueDate) <= 2
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-green-600 dark:text-green-400'
                          }`}>
                            {calculateDaysRemaining(assignment.dueDate) < 0
                              ? `${Math.abs(calculateDaysRemaining(assignment.dueDate))} days overdue`
                              : calculateDaysRemaining(assignment.dueDate) === 0
                              ? 'Due today'
                              : `${calculateDaysRemaining(assignment.dueDate)} days`}
                          </span>
                        </td>
                        <td className="px-6 py-4 relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="focus:outline-none transition-colors duration-200"
                          >
                            <MoreVertical className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          </button>
                        </td>
                      </tr>
                      
                      {expandedAssignmentId === assignment.id && (
                        <tr className="bg-gray-50 dark:bg-gray-750">
                          <td colSpan={5} className="px-6 py-4">
                            <div className="text-sm">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="font-medium mb-1">Submit to:</p>
                                  <p className="text-gray-600 dark:text-gray-400">{assignment.details.whom}</p>
                                </div>
                                <div>
                                  <p className="font-medium mb-1">Where to submit:</p>
                                  <p className="text-gray-600 dark:text-gray-400">{assignment.details.where}</p>
                                </div>
                                <div>
                                  <p className="font-medium mb-1">What to submit:</p>
                                  <p className="text-gray-600 dark:text-gray-400">{assignment.details.what}</p>
                                </div>
                                <div>
                                  <p className="font-medium mb-1">How to submit:</p>
                                  <p className="text-gray-600 dark:text-gray-400">{assignment.details.how}</p>
                                </div>
                              </div>
                              
                              {assignment.attachments.length > 0 && (
                                <div>
                                  <p className="font-medium mb-2">Attachments:</p>
                                  <ul className="space-y-2">
                                    {assignment.attachments.map(attachment => (
                                      <li key={attachment.id} className="flex items-center">
                                        <File className="h-4 w-4 text-gray-500 mr-2" />
                                        <a href={attachment.url} className="text-blue-600 hover:underline transition-colors duration-200">
                                          {attachment.name} ({attachment.type})
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View for Assignments */}
            <div className="md:hidden">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedAssignments.map(assignment => (
                  <li key={assignment.id} className="px-4 py-3">
                    <div className="flex items-start">
                      <input 
                        type="checkbox" 
                        checked={assignment.completed}
                        onChange={() => toggleAssignmentCompletion(assignment.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                      />
                      
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <span className={`font-medium ${assignment.completed ? 'line-through text-gray-400' : ''}`}>
                            {assignment.name}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAssignmentDetails(assignment.id);
                            }}
                            className="focus:outline-none transition-colors duration-200"
                          >
                            <MoreVertical className="h-5 w-5 text-gray-400" />
                          </button>
                        </div>
                        
                        <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span className={`${
                            calculateDaysRemaining(assignment.dueDate) < 0
                              ? 'text-red-600 dark:text-red-400'
                              : calculateDaysRemaining(assignment.dueDate) <= 2
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-green-600 dark:text-green-400'
                          }`}>
                            {calculateDaysRemaining(assignment.dueDate) < 0
                              ? `${Math.abs(calculateDaysRemaining(assignment.dueDate))} days overdue`
                              : calculateDaysRemaining(assignment.dueDate) === 0
                              ? 'Due today'
                              : `${calculateDaysRemaining(assignment.dueDate)} days left`}
                          </span>
                        </div>
                        
                        {expandedAssignmentId === assignment.id && (
                          <div className="mt-3 text-sm">
                            <div className="grid grid-cols-1 gap-2 mb-3">
                              <div>
                                <p className="font-medium mb-1">Submit to:</p>
                                <p className="text-gray-600 dark:text-gray-400">{assignment.details.whom}</p>
                              </div>
                              <div>
                                <p className="font-medium mb-1">Where to submit:</p>
                                <p className="text-gray-600 dark:text-gray-400">{assignment.details.where}</p>
                              </div>
                              <div>
                                <p className="font-medium mb-1">What to submit:</p>
                                <p className="text-gray-600 dark:text-gray-400">{assignment.details.what}</p>
                              </div>
                              <div>
                                <p className="font-medium mb-1">How to submit:</p>
                                <p className="text-gray-600 dark:text-gray-400">{assignment.details.how}</p>
                              </div>
                            </div>
                            
                            {assignment.attachments.length > 0 && (
                              <div>
                                <p className="font-medium mb-1">Attachments:</p>
                                <ul className="space-y-1">
                                  {assignment.attachments.map(attachment => (
                                    <li key={attachment.id} className="flex items-center">
                                      <File className="h-4 w-4 text-gray-500 mr-2" />
                                      <a href={attachment.url} className="text-blue-600 hover:underline transition-colors duration-200">
                                        {attachment.name} ({attachment.type})
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            {/* Desktop View for Exams */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 text-left">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exam Date</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Countdown</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedExams.map(exam => (
                    <React.Fragment key={exam.id}>
                      <tr 
                        className="hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors duration-200"
                        onClick={() => toggleExamDetails(exam.id)}
                      >
                        <td className="px-6 py-4 font-medium">
                          {exam.subject}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(exam.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`${
                            calculateDaysRemaining(exam.date) <= 3
                              ? 'text-red-600 dark:text-red-400'
                              : calculateDaysRemaining(exam.date) <= 7
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-green-600 dark:text-green-400'
                          }`}>
                            {calculateDaysRemaining(exam.date)} days
                          </span>
                        </td>
                        <td className="px-6 py-4 relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="focus:outline-none transition-colors duration-200"
                          >
                            <MoreVertical className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          </button>
                        </td>
                      </tr>
                      
                      {expandedExamId === exam.id && (
                        <tr className="bg-gray-50 dark:bg-gray-750">
                          <td colSpan={4} className="px-6 py-4">
                            <div className="text-sm">
                              <div className="mb-4">
                                <p className="font-medium mb-1">What to Study:</p>
                                <p className="text-gray-600 dark:text-gray-400">{exam.toStudy}</p>
                              </div>
                              
                              {exam.resources.length > 0 && (
                                <div>
                                  <p className="font-medium mb-2">Resources:</p>
                                  <ul className="space-y-2">
                                    {exam.resources.map(resource => (
                                      <li key={resource.id} className="flex items-center">
                                        {resource.type === 'Video' ? (
                                          <ExternalLink className="h-4 w-4 text-gray-500 mr-2" />
                                        ) : (
                                          <File className="h-4 w-4 text-gray-500 mr-2" />
                                        )}
                                        <a href={resource.url} className="text-blue-600 hover:underline transition-colors duration-200">
                                          {resource.name} ({resource.type})
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                                <p className="font-medium mb-1">Study Plan Suggestion:</p>
                                <p className="text-gray-600 dark:text-gray-400">
                                  With {calculateDaysRemaining(exam.date)} days left, try to study {Math.ceil(exam.toStudy.split(',').length / calculateDaysRemaining(exam.date))} topics per day.
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View for Exams */}
            <div className="md:hidden">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedExams.map(exam => (
                  <li key={exam.id} className="px-4 py-3">
                    <div className="flex items-start">
                      <CalendarIcon className="mt-1 h-5 w-5 text-purple-500" />
                      
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {exam.subject}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExamDetails(exam.id);
                            }}
                            className="focus:outline-none transition-colors duration-200"
                          >
                            <MoreVertical className="h-5 w-5 text-gray-400" />
                          </button>
                        </div>
                        
                        <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(exam.date).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span className={`${
                            calculateDaysRemaining(exam.date) <= 3
                              ? 'text-red-600 dark:text-red-400'
                              : calculateDaysRemaining(exam.date) <= 7
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-green-600 dark:text-green-400'
                          }`}>
                            {calculateDaysRemaining(exam.date)} days left
                          </span>
                        </div>
                        
                        {expandedExamId === exam.id && (
                          <div className="mt-3 text-sm">
                            <div className="mb-3">
                              <p className="font-medium mb-1">What to Study:</p>
                              <p className="text-gray-600 dark:text-gray-400">{exam.toStudy}</p>
                            </div>
                            
                            {exam.resources.length > 0 && (
                              <div className="mb-3">
                                <p className="font-medium mb-1">Resources:</p>
                                <ul className="space-y-1">
                                  {exam.resources.map(resource => (
                                    <li key={resource.id} className="flex items-center">
                                      {resource.type === 'Video' ? (
                                        <ExternalLink className="h-4 w-4 text-gray-500 mr-2" />
                                      ) : (
                                        <File className="h-4 w-4 text-gray-500 mr-2" />
                                      )}
                                      <a href={resource.url} className="text-blue-600 hover:underline transition-colors duration-200">
                                        {resource.name}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                              <p className="font-medium mb-1">Study Plan Suggestion:</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                With {calculateDaysRemaining(exam.date)} days left, try to study {Math.ceil(exam.toStudy.split(',').length / calculateDaysRemaining(exam.date))} topics per day.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Add Assignment Modal */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Add New Assignment</h3>
              <button 
                onClick={() => setShowAddAssignmentModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assignment Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter assignment name"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Submit To
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Professor name"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Where to Submit
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Canvas, Email, etc."
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  What to Submit
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Description of what needs to be submitted"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  How to Submit
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="PDF, Word document, etc."
                />
              </div>
            </div>
            
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddAssignmentModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mr-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddAssignmentModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors duration-200"
              >
                Add Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showAddExamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Add New Exam</h3>
              <button 
                onClick={() => setShowAddExamModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter subject name"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Exam Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  What to Study
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Topics to study for this exam"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resources
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="List resources for studying (textbooks, videos, etc.)"
                  rows={3}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddExamModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mr-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddExamModal(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none transition-colors duration-200"
              >
                Add Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;