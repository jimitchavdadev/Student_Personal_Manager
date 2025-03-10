import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Exam } from '../../types/assignmentTypes';

interface ExamCardProps {
  exam: Exam;
  isExpanded: boolean;
  onToggleDetails: () => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, isExpanded, onToggleDetails }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <span>{exam.subject}</span>
        <div className="flex items-center space-x-4">
          <span>{new Date(exam.date).toLocaleDateString()}</span>
          <button onClick={onToggleDetails}>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-2">
          <p><strong>Topics to Study:</strong> {exam.toStudy}</p>
          <div>
            <strong>Resources:</strong>
            <ul className="mt-2 space-y-1">
              {exam.resources.map(resource => (
                <li key={resource.id}>
                  <a href={resource.url} className="text-blue-600 hover:underline">
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamCard;