import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Assignment } from '../../types/assignmentTypes';

interface AssignmentCardProps {
  assignment: Assignment;
  isExpanded: boolean;
  onToggleDetails: () => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  isExpanded,
  onToggleDetails,
}) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {assignment.name}
          </h3>
          <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>Submit to: {assignment.whom}</span>
          </div>
        </div>
        <button
          onClick={onToggleDetails}
          className="ml-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <strong className="text-gray-700 dark:text-gray-200">Where:</strong> {assignment.where}
          </div>
          <div>
            <strong className="text-gray-700 dark:text-gray-200">What:</strong> {assignment.what}
          </div>
          <div>
            <strong className="text-gray-700 dark:text-gray-200">How:</strong> {assignment.how}
          </div>
          {assignment.details && (
            <div>
              <strong className="text-gray-700 dark:text-gray-200">Details:</strong>
              <p className="mt-1 whitespace-pre-wrap">{assignment.details}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;