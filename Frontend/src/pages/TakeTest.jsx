import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAssessment } from "../context/AssessmentContext";
import {
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
} from "lucide-react";

const TakeTest = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { getAssessment, submitStudentResult } = useAssessment();

  const [assessment, setAssessment] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const foundAssessment = getAssessment(assessmentId);
    if (foundAssessment) {
      setAssessment(foundAssessment);
      setAnswers(new Array(foundAssessment.questions.length).fill(null));
    }
  }, [assessmentId, getAssessment]);

  useEffect(() => {
    if (!hasStarted || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isSubmitted]);

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Assessment Not Found
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            This assessment may have been deleted or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  if (assessment.status === "closed") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Assessment Closed
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            This assessment is no longer accepting submissions.
          </p>
        </div>
      </div>
    );
  }

  const handleStart = () => {
    if (!studentName.trim()) {
      alert("Please enter your name");
      return;
    }
    setHasStarted(true);
  };

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const unanswered = answers.filter((a) => a === null).length;

    if (unanswered > 0) {
      if (
        !confirm(
          `You have ${unanswered} unanswered question(s). Submit anyway?`,
        )
      ) {
        return;
      }
    }

    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (answer === assessment.questions[index].correctAnswer) {
        correctCount++;
      }
    });

    const score = ((correctCount / assessment.questions.length) * 100).toFixed(
      1,
    );

    submitStudentResult(assessmentId, {
      studentName: studentName.trim(),
      answers,
      score: parseFloat(score),
      correctCount,
      totalQuestions: assessment.questions.length,
      timeElapsed,
    });

    setIsSubmitted(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  const answeredCount = answers.filter((a) => a !== null).length;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 md:p-6">
        <div className="max-w-md w-full bg-white rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
            Test Submitted!
          </h2>

          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
            Thank you, {studentName}! Your responses have been recorded.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
            <p className="text-xs md:text-sm text-gray-600 mb-2">Time Taken</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">
              {formatTime(timeElapsed)}
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Your faculty will analyze the results to identify areas for
            improvement in teaching.
          </p>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white" size={20} />
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900">
              ClassEcho Assessment
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-5 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {assessment.title}
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
              {assessment.subject}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2 md:mb-3">
                About This Assessment
              </h3>
              <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4">
                {assessment.description}
              </p>
              <ul className="space-y-2 text-sm md:text-base text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-blue-600" size={16} />
                  <span>{assessment.totalQuestions} questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-blue-600" size={16} />
                  <span>No time limit - take your time</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-blue-600" size={16} />
                  <span>Results help your faculty improve teaching</span>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
              />
            </div>

            <button
              onClick={handleStart}
              className="w-full px-4 md:px-6 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = assessment.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3 mb-2 md:mb-3">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <GraduationCap className="text-white" size={20} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm md:text-base font-bold text-gray-900 truncate">
                  {assessment.title}
                </h2>
                <p className="text-xs md:text-sm text-gray-600 truncate">
                  {studentName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <div className="flex items-center gap-1 md:gap-2 text-gray-600">
                <Clock size={16} />
                <span className="text-xs md:text-sm font-medium">
                  {formatTime(timeElapsed)}
                </span>
              </div>

              <div className="text-xs md:text-sm font-medium text-gray-600">
                {answeredCount}/{assessment.questions.length} answered
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-5 md:p-8 mb-4 md:mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded">
              {currentQ.topic}
            </span>
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {assessment.questions.length}
            </span>
          </div>

          <h3 className="text-lg md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
            {currentQ.question}
          </h3>

          <div className="space-y-2 md:space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-3 md:p-4 border-2 rounded-lg md:rounded-xl transition-all ${
                  answers[currentQuestion] === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div
                    className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      answers[currentQuestion] === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {answers[currentQuestion] === index && (
                      <CheckCircle className="text-white" size={14} />
                    )}
                  </div>
                  <span className="text-sm md:text-base text-gray-900">
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            Previous
          </button>

          <div className="hidden lg:flex gap-2">
            {assessment.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  index === currentQuestion
                    ? "bg-blue-600 text-white"
                    : answers[index] !== null
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-600 border border-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === assessment.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Send size={18} />
              Submit Test
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm md:text-base"
            >
              Next
            </button>
          )}
        </div>

        <div className="mt-4 md:mt-6 bg-gray-100 rounded-lg md:rounded-xl p-4 md:p-6">
          <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-2 md:mb-3">
            Question Overview
          </h4>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {assessment.questions.map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded flex items-center justify-center text-sm font-medium ${
                  answers[index] !== null
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeTest;
