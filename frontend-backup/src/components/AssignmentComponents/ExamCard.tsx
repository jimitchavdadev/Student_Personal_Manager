import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Exam } from '../../types/assignmentTypes';

interface ExamCardProps {
  exam: Exam;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">{exam.subject_name}</span>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {new Date(exam.exam_date).toLocaleDateString()}
          </span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-2">
          <p className="text-gray-700"><strong>Topics to Study:</strong> {exam.what_to_study}</p>
          <div>
            <strong>Resources:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              {exam.resources.map((resource, index) => (
                <li key={index} className="text-gray-600">
                  {resource}
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