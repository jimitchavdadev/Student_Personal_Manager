import React, { useEffect, useState } from 'react';
import { fetchAssignments, deleteAssignment } from '/home/totoro/Roger/Projects/Student_Personal_Manager/testing/frontend/src/api/assignmentApi.ts';
import { Assignment } from '../../types/assignmentTypes';

const AssignmentList: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const loadAssignments = async () => {
    try {
      const data = await fetchAssignments();
      setAssignments(data);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteAssignment(id);
      loadAssignments(); // Refresh after delete
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Assignments</h2>
      <ul>
        {assignments.map(assignment => (
          <li key={assignment.id} className="p-2 border-b flex justify-between">
            <span>{assignment.name} - {assignment.dueDate}</span>
            <button onClick={() => handleDelete(assignment.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;
