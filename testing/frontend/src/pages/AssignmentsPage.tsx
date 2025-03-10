import React, { useState, useEffect } from 'react';
import { Assignment, Exam } from '../types/assignmentTypes';
import AssignmentCard from '../components/AssignmentComponents/AssignmentCard';
import AddAssignmentModal from '../components/AssignmentComponents/AddAssignmentModal';
import AddExamModal from '../components/AssignmentComponents/AddExamModal';
import { AssignmentService } from '../api/assignmentApi';
import EditAssignmentModal from '../components/AssignmentComponents/EditAssignmentModal'; // You'll need to create this

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showEditAssignmentModal, setShowEditAssignmentModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assignments' | 'exams'>('assignments');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch assignments when component mounts
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await AssignmentService.getAllAssignments();
      setAssignments(data);
    } catch (err) {
      setError('Failed to load assignments. Please try again.');
      console.error('Error fetching assignments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAssignmentDetails = (id: string): void => {
    setExpandedAssignmentId(prevId => (prevId === id ? null : id));
  };

  const createAssignment = async (newAssignment: Omit<Assignment, 'id' | 'completed' | 'attachments'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const createdAssignment = await AssignmentService.createAssignment(newAssignment);
      setAssignments(prevAssignments => [...prevAssignments, createdAssignment]);
      setShowAddAssignmentModal(false);
    } catch (err) {
      setError('Failed to create assignment. Please try again.');
      console.error('Error creating assignment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAssignment = async (updatedAssignment: Assignment) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await AssignmentService.updateAssignment(updatedAssignment.id, updatedAssignment);
      
      setAssignments(prevAssignments => 
        prevAssignments.map(assignment => 
          assignment.id === updatedAssignment.id ? result : assignment
        )
      );
      
      setShowEditAssignmentModal(false);
      setCurrentAssignment(null);
    } catch (err) {
      setError('Failed to update assignment. Please try again.');
      console.error('Error updating assignment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await AssignmentService.deleteAssignment(id);
      setAssignments(prevAssignments => 
        prevAssignments.filter(assignment => assignment.id !== id)
      );
    } catch (err) {
      setError('Failed to delete assignment. Please try again.');
      console.error('Error deleting assignment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAssignmentCompletion = async (id: string, completed: boolean) => {
    try {
      setError(null);
      await AssignmentService.toggleAssignmentCompletion(id, completed);
      
      setAssignments(prevAssignments => 
        prevAssignments.map(assignment => 
          assignment.id === id ? { ...assignment, completed } : assignment
        )
      );
    } catch (err) {
      setError('Failed to update assignment status. Please try again.');
      console.error('Error updating assignment status:', err);
    }
  };

  const handleEditClick = (assignment: Assignment) => {
    setCurrentAssignment(assignment);
    setShowEditAssignmentModal(true);
  };

  // For exams - implementation would be similar with ExamService

  const sortedAssignments = [...assignments].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const sortedExams = [...exams].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments & Exams</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddAssignmentModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            Add Assignment
          </button>
          <button
            onClick={() => setShowAddExamModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            disabled={isLoading}
          >
            Add Exam
          </button>
          <button
            onClick={() => setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Sort {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'assignments'
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'exams'
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Exams
            </button>
          </div>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : activeTab === 'assignments' ? (
            <div className="space-y-4">
              {sortedAssignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No assignments yet. Click "Add Assignment" to create one!
                </div>
              ) : (
                sortedAssignments.map(assignment => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    isExpanded={expandedAssignmentId === assignment.id}
                    onToggleDetails={() => toggleAssignmentDetails(assignment.id)}
                    onDelete={() => deleteAssignment(assignment.id)}
                    onEdit={() => handleEditClick(assignment)}
                    onToggleCompletion={(completed) => toggleAssignmentCompletion(assignment.id, completed)}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedExams.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No exams yet. Click "Add Exam" to create one!
                </div>
              ) : (
                sortedExams.map(exam => (
                  <div key={exam.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exam.subject}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Date: {new Date(exam.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">What to Study: {exam.toStudy}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Resources: {exam.resources}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <AddAssignmentModal
        isOpen={showAddAssignmentModal}
        onClose={() => setShowAddAssignmentModal(false)}
        onSubmit={createAssignment}
      />

      {currentAssignment && (
        <EditAssignmentModal
          isOpen={showEditAssignmentModal}
          onClose={() => {
            setShowEditAssignmentModal(false);
            setCurrentAssignment(null);
          }}
          onSubmit={updateAssignment}
          assignment={currentAssignment}
        />
      )}

      <AddExamModal
        isOpen={showAddExamModal}
        onClose={() => setShowAddExamModal(false)}
        onSubmit={(examData) => {
          // Would use ExamService.createExam once implemented
          const examWithId: Exam = {
            ...examData,
            id: Date.now().toString(),
          };
          setExams(prevExams => [...prevExams, examWithId]);
        }}
      />
    </div>
  );
};

export default AssignmentsPage;