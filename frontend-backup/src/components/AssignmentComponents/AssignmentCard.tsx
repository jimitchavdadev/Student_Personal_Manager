import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Assignment } from '../../types/assignmentTypes';

interface AssignmentCardProps {
  assignment: Assignment;
  isExpanded: boolean;
  onToggleDetails: () => void;
  onUpdate: (id: string, updates: Partial<Assignment>) => void;
  onDelete: (id: string) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  isExpanded,
  onToggleDetails,
  onUpdate,
  onDelete
}) => {
  const handleStatusUpdate = async () => {
    const newStatus = assignment.status === 'pending' ? 'completed' : 'pending';
    onUpdate(assignment._id, { status: newStatus });
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{assignment.assignment_name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleStatusUpdate}
            className={`px-3 py-1 rounded ${
              assignment.status === 'completed'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {assignment.status === 'completed' ? 'Completed' : 'Mark Complete'}
          </button>
          <button
            onClick={onToggleDetails}
            className="text-blue-600 hover:text-blue-800"
          >
            {isExpanded ? 'Less' : 'More'}
          </button>
          <button
            onClick={() => onDelete(assignment._id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-2">
          <p>Due Date: {new Date(assignment.due_date).toLocaleDateString()}</p>
          <p>Submit To: {assignment.submit_to}</p>
          <p>Where to Submit: {assignment.where_to_submit}</p>
          <p>What to Submit: {assignment.what_to_submit}</p>
          <p>How to Submit: {assignment.how_to_submit}</p>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;