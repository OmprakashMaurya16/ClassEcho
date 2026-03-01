import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAssessment } from "../context/AssessmentContext";
import Sidebar from "../components/Sidebar";
import {
  GraduationCap,
  CheckCircle,
  Circle,
  ChevronRight,
  ChevronLeft,
  Send,
  User,
} from "lucide-react";

const ConductOralAssessment = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { getAssessment, submitStudentResult } = useAssessment();

  const [assessment, setAssessment] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const foundAssessment = getAssessment(assessmentId);
    if (foundAssessment) {
      setAssessment(foundAssessment);
      setAnswers(new Array(foundAssessment.questions.length).fill(null));
    } else {
      navigate("/faculty/assessment/create");
    }
  }, [assessmentId, getAssessment, navigate]);

  if (!assessment) {
    return (
      <div className="flex">
        <Sidebar role="Faculty" />
        <div className="flex-1 ml-60 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Loading assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleStartAssessment = () => {
    if (!studentName.trim()) {
      alert("Please enter student name");
      return;
    }
    setHasStarted(true);
    setStartTime(Date.now());
  };

  const handleSelectAnswer = (answerIndex) => {
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

  const handleComplete = () => {
    const unanswered = answers.filter((a) => a === null).length;

    if (unanswered > 0) {
      if (
        !confirm(
          `${unanswered} question(s) not answered. Complete assessment anyway?`,
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
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);

    submitStudentResult(assessmentId, {
      studentName: studentName.trim(),
      answers,
      score: parseFloat(score),
      correctCount,
      totalQuestions: assessment.questions.length,
      timeElapsed,
    });

    navigate(`/faculty/assessment/${assessmentId}/results`);
  };

  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  const answeredCount = answers.filter((a) => a !== null).length;

  if (!hasStarted) {
    return (
      <div className="flex">
        <Sidebar role="Faculty" />
        <div className="flex-1 md:ml-60 min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 md:py-8">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                Conduct Oral Assessment
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                {assessment.title}
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-12">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-4 md:p-8">
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Name *
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student's full name"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleStartAssessment()
                  }
                />
              </div>

              <button
                onClick={handleStartAssessment}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = assessment.questions[currentQuestion];

  return (
    <div className="flex">
      <Sidebar role="Faculty" />
      <div className="flex-1 md:ml-60 min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 md:py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-bold text-gray-900">
                    {assessment.title}
                  </h2>
                  <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-600">
                    <User size={14} />
                    <span>{studentName}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs md:text-sm text-gray-600">Progress</p>
                <p className="text-base md:text-lg font-bold text-gray-900">
                  {answeredCount}/{assessment.questions.length} answered
                </p>
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

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 md:py-10">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-4 md:p-8 mb-4 md:mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
              <span className="px-2 md:px-3 py-1 bg-purple-100 text-purple-700 text-xs md:text-sm font-semibold rounded">
                {currentQ.topic}
              </span>
              <span className="text-xs md:text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {assessment.questions.length}
              </span>
            </div>

            <h3 className="text-lg md:text-2xl font-semibold text-gray-900 mb-2 md:mb-3">
              Ask the student:
            </h3>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 md:p-6 mb-6 md:mb-8 rounded-r-lg">
              <p className="text-base md:text-xl text-gray-900 font-medium">
                "{currentQ.question}"
              </p>
            </div>

            <p className="text-xs md:text-sm font-semibold text-gray-700 mb-3 md:mb-4">
              Record the student's oral answer by clicking their choice:
            </p>

            <div className="space-y-2 md:space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={`w-full text-left p-3 md:p-5 border-2 rounded-lg md:rounded-xl transition-all ${
                    answers[currentQuestion] === index
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 md:gap-4">
                    <div
                      className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        answers[currentQuestion] === index
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {answers[currentQuestion] === index ? (
                        <CheckCircle className="text-white" size={16} />
                      ) : (
                        <Circle className="text-gray-300" size={16} />
                      )}
                    </div>
                    <span
                      className={`text-sm md:text-lg ${
                        answers[currentQuestion] === index
                          ? "font-semibold text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-0 mb-4 md:mb-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-4 md:px-6 py-2 md:py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold text-sm md:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <div className="hidden lg:flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">
                Jump to question:
              </span>
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
                onClick={handleComplete}
                className="px-4 md:px-6 py-2 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm md:text-base transition-colors flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Complete & View Results
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm md:text-base transition-colors flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          {/* Quick Overview */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-4">
              Question Overview
            </h4>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {assessment.questions.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-all ${
                    index === currentQuestion
                      ? "bg-blue-600 text-white ring-2 ring-blue-300"
                      : answers[index] !== null
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-3 md:mt-4 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-600 rounded"></div>
                <span className="text-gray-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded"></div>
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded"></div>
                <span className="text-gray-600">Not Answered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConductOralAssessment;
