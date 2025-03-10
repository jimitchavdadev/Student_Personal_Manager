import React, { useState } from 'react';
import { Assignment, Exam } from '/home/totoro/Roger/Projects/Student_Personal_Manager/testing/frontend/src/types/assignmentTypes.ts'; // Adjust the import path as necessary
import AssignmentCard from '/home/totoro/Roger/Projects/Student_Personal_Manager/testing/frontend/src/components/AssignmentComponents/AssignmentCard.tsx'; // Adjust the import path as necessary
import AddAssignmentModal from '/home/totoro/Roger/Projects/Student_Personal_Manager/testing/frontend/src/components/AssignmentComponents/AddAssignmentModal.tsx'; // Adjust the import path as necessary
import AddExamModal from '/home/totoro/Roger/Projects/Student_Personal_Manager/testing/frontend/src/components/AssignmentComponents/AddExamModal.tsx'; // Adjust the import path as necessary

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assignments' | 'exams'>('assignments');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleAssignmentDetails = (id: string): void => {
    setExpandedAssignmentId(prevId => (prevId === id ? null : id));
  };

  const createAssignment = (newAssignment: Omit<Assignment, 'id' | 'completed' | 'attachments'>) => {
    const assignmentWithId: Assignment = {
      ...newAssignment,
      id: Date.now().toString(),
      completed: false,
      attachments: []
    };
    setAssignments(prevAssignments => [...prevAssignments, assignmentWithId]);
  };

  const createExam = (newExam: Omit<Exam, 'id'>) => {
    const examWithId: Exam = {
      ...newExam,
      id: Date.now().toString(),
    };
    setExams(prevExams => [...prevExams, examWithId]);
  };

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
                    key={assignment.id}
                    assignment={assignment}
                    isExpanded={expandedAssignmentId === assignment.id}
                    onToggleDetails={() => toggleAssignmentDetails(assignment.id)}
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

      <AddExamModal
        isOpen={showAddExamModal}
        onClose={() => setShowAddExamModal(false)}
        onSubmit={createExam}
      />
    </div>
  );
};

export default AssignmentsPage;