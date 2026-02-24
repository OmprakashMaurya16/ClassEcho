import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { Star, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const FeedbackForm = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { getSession, submitFeedback } = useSession();
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [ratings, setRatings] = useState({
    teaching: 0,
    clarity: 0,
    engagement: 0,
    knowledge: 0,
    availability: 0,
    helpfulness: 0,
  });
  const [overallRating, setOverallRating] = useState(0);
  const [comments, setComments] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');

  // Load session data
  useEffect(() => {
    const sessionData = getSession(sessionId);
    if (sessionData) {
      setSession(sessionData);
      setLoading(false);
    } else {
      setError('Session not found or has expired');
      setLoading(false);
    }
  }, [sessionId, getSession]);

  const handleRatingChange = (parameter, value) => {
    setRatings(prev => ({ ...prev, [parameter]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate ratings
    const allRatingsProvided = Object.values(ratings).every(r => r > 0);
    if (!allRatingsProvided || overallRating === 0) {
      alert('Please provide all ratings before submitting');
      return;
    }

    // Submit feedback
    const feedbackData = {
      ratings,
      overallRating,
      comments: comments.trim(),
      strengths: strengths.trim(),
      improvements: improvements.trim(),
    };

    submitFeedback(sessionId, feedbackData);
    setSubmitted(true);

    // Redirect after 3 seconds
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const RatingStars = ({ value, onChange, label }) => {
    return (
      <div className="mb-5 md:mb-6">
        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="flex gap-1 md:gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={`md:w-8 md:h-8 ${
                  star <= value
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          ))}
          <span className="ml-1 md:ml-2 text-xs md:text-sm text-gray-600 self-center">
            {value > 0 ? `${value}/5` : 'Not rated'}
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Session Not Found</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8 max-w-md text-center">
          <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
            Your feedback has been submitted successfully.
          </p>
          <p className="text-sm text-gray-500">
            Your input helps improve the quality of education.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 py-6 md:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden mb-4 md:mb-6">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-5 md:px-8 py-4 md:py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
              Faculty Feedback Form
            </h1>
            <p className="text-sm md:text-base text-blue-100">
              Your anonymous feedback helps us improve
            </p>
          </div>
          
          <div className="px-5 md:px-8 py-4 md:py-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Faculty</p>
                <p className="text-sm md:text-base font-semibold text-gray-900">{session.facultyName}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Course</p>
                <p className="text-sm md:text-base font-semibold text-gray-900">{session.course}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Department</p>
                <p className="text-sm md:text-base font-semibold text-gray-900">{session.department}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Session</p>
                <p className="font-mono text-xs text-gray-600">{session.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl md:rounded-2xl shadow-xl p-5 md:p-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
            Rate the following parameters
          </h2>

          <RatingStars
            label="Teaching Quality"
            value={ratings.teaching}
            onChange={(val) => handleRatingChange('teaching', val)}
          />
          
          <RatingStars
            label="Clarity of Explanation"
            value={ratings.clarity}
            onChange={(val) => handleRatingChange('clarity', val)}
          />
          
          <RatingStars
            label="Student Engagement"
            value={ratings.engagement}
            onChange={(val) => handleRatingChange('engagement', val)}
          />
          
          <RatingStars
            label="Subject Knowledge"
            value={ratings.knowledge}
            onChange={(val) => handleRatingChange('knowledge', val)}
          />
          
          <RatingStars
            label="Availability for Doubts"
            value={ratings.availability}
            onChange={(val) => handleRatingChange('availability', val)}
          />
          
          <RatingStars
            label="Helpfulness"
            value={ratings.helpfulness}
            onChange={(val) => handleRatingChange('helpfulness', val)}
          />

          <div className="border-t border-gray-200 pt-5 md:pt-6 mt-5 md:mt-6">
            <RatingStars
              label="Overall Rating"
              value={overallRating}
              onChange={setOverallRating}
            />
          </div>

          {/* Text feedback */}
          <div className="mt-6 md:mt-8 space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What did you like most about this lecture? (Optional)
              </label>
              <textarea
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Share what worked well..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What could be improved? (Optional)
              </label>
              <textarea
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Suggestions for improvement..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Any other feedback you'd like to share..."
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-6 md:mt-8 flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm md:text-base">
              <Send size={18} />
              Submit Feedback
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            🔒 Your feedback is completely anonymous and will help improve the teaching quality
          </p>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
