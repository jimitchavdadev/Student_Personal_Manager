import React, { useState, useEffect } from 'react';
import { Assignment, Exam } from '../types/assignmentTypes'; // Adjust the import path as necessary
import AssignmentCard from '../components/AssignmentComponents/AssignmentCard'; // Adjust the import path as necessary
import AddAssignmentModal from '../components/AssignmentComponents/AddAssignmentModal'; // Adjust the import path as necessary
import AddExamModal from '../components/AssignmentComponents/AddExamModal'; // Adjust the import path as necessary
import { useAuth } from '../contexts/AuthContext';
import { assignmentService } from '../services/assignmentService';
import { examService } from '../services/examService';
import ExamCard from '../components/AssignmentComponents/ExamCard';

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assignments' | 'exams'>('assignments');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { user } = useAuth();
  const toggleAssignmentDetails = (id: string): void => {
    setExpandedAssignmentId(prevId => (prevId === id ? null : id));
  };

  useEffect(() => {
    if (user) {
      loadAssignments();
      loadExams();
    }
  }, [user]);

  const loadAssignments = async () => {
    try {
      const data = await assignmentService.getAssignments(user!.id);
      setAssignments(data);
    } catch (error) {
      console.error('Failed to load assignments:', error);
      // Add error handling/notification here
    }
  };

  const createAssignment = async (newAssignment: Omit<Assignment, '_id' | 'completed' | 'attachments'>) => {
    try {
      const assignmentData = {
        ...newAssignment,
        userId: user!.id,
        completed: false,
        attachments: []
      };
      
      const createdAssignment = await assignmentService.createAssignment(assignmentData);
      setAssignments(prevAssignments => [...prevAssignments, createdAssignment]);
      setShowAddAssignmentModal(false);
    } catch (error) {
      console.error('Failed to create assignment:', error);
      // Add error handling/notification here
    }
  };

  const handleUpdateAssignment = async (id: string, updates: Partial<Assignment>) => {
    try {
      const updatedAssignment = await assignmentService.updateAssignment(id, {
        ...updates,
        userId: user!.id
      });
      setAssignments(prevAssignments =>
        prevAssignments.map(assignment =>
          assignment._id === id ? updatedAssignment : assignment
        )
      );
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    try {
      await assignmentService.deleteAssignment(id, user!.id);
      setAssignments(prevAssignments =>
        prevAssignments.filter(assignment => assignment._id !== id)
      );
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      // Add error handling/notification here
    }
  };

  const createExam = async (newExam: Omit<Exam, 'id'>) => {
    try {
      const examData = {
        ...newExam,
        userId: user!.id,
      };
      const createdExam = await examService.createExam(examData);
      setExams(prevExams => [...prevExams, createdExam]);
      setShowAddExamModal(false);
    } catch (error) {
      console.error('Failed to create exam:', error);
    }
  };

  const loadExams = async () => {
    try {
      const data = await examService.getExams(user!.id);
      setExams(data);
    } catch (error) {
      console.error('Failed to load exams:', error);
    }
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    const dateA = new Date(a.due_date).getTime();
    const dateB = new Date(b.due_date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const sortedExams = [...exams].sort((a, b) => {
    const dateA = new Date(a.exam_date).getTime();
    const dateB = new Date(b.exam_date).getTime();
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
          >
            Add Assignment
          </button>
          <button
            onClick={() => setShowAddExamModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Add Exam
          </button>
        </div>
      </div>

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
          {activeTab === 'assignments' ? (
            <div className="space-y-4">
              {sortedAssignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No assignments yet. Click "Add Assignment" to create one!
                </div>
              ) : (
                sortedAssignments.map(assignment => (
                  <AssignmentCard
                    key={assignment._id}
                    assignment={assignment}
                    isExpanded={expandedAssignmentId === assignment._id}
                    onToggleDetails={() => toggleAssignmentDetails(assignment._id)}
                    onUpdate={handleUpdateAssignment}
                    onDelete={handleDeleteAssignment}
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
                // Replace the existing exam rendering with ExamCard component
                // In the render section, update the ExamCard usage:
                sortedExams.map(exam => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                  />
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

      <AddExamModal
        isOpen={showAddExamModal}
        onClose={() => setShowAddExamModal(false)}
        onSubmit={createExam}
      />
    </div>
  );
};

export default AssignmentsPage;