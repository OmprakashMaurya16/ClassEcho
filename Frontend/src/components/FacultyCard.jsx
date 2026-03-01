import React from "react";
import { BookOpen, Star, ArrowRight } from "lucide-react";
import Avatar from "./Avatar";

const FacultyCard = ({ faculty, onViewDetails }) => {
  const calculateAvgScore = () => {
    
    
    const scores = [4.2, 4.5, 4.8, 4.1, 3.9, 4.7, 4.6, 4.3];
    return scores[Math.floor(Math.random() * scores.length)];
  };

  const avgScore = calculateAvgScore();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={faculty.name} color={faculty.avatarColor} size="lg" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-sm">
            {faculty.name}
          </h3>
          <p className="text-xs text-gray-500">{faculty.designation}</p>
        </div>
      </div>

      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BookOpen size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Subjects</p>
            <p className="text-sm font-semibold text-gray-800">
              {Array.isArray(faculty.subjectsTaught)
                ? faculty.subjectsTaught.length
                : 1}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Star size={16} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Avg Score</p>
            <p className="text-sm font-semibold text-gray-800">
              {avgScore.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      
      <button
        onClick={() => onViewDetails(faculty)}
        className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        View Details
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default FacultyCard;
