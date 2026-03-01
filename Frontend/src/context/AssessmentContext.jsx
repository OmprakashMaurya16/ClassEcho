import React, { createContext, useContext, useState } from "react";

const AssessmentContext = createContext();

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within AssessmentProvider");
  }
  return context;
};

export const AssessmentProvider = ({ children }) => {
  const [assessments, setAssessments] = useState([]);

  const createAssessment = (assessmentData) => {
    const newAssessment = {
      id: Date.now().toString(),
      ...assessmentData,
      createdAt: new Date().toISOString(),
      status: "active",
      results: [],
    };

    setAssessments((prev) => [...prev, newAssessment]);
    return newAssessment.id;
  };

  const getAssessment = (assessmentId) => {
    return assessments.find((a) => a.id === assessmentId);
  };

  const getFacultyAssessments = (facultyId) => {
    return assessments.filter((a) => a.facultyId === facultyId);
  };

  const submitStudentResult = (assessmentId, studentResult) => {
    setAssessments((prev) =>
      prev.map((assessment) => {
        if (assessment.id === assessmentId) {
          return {
            ...assessment,
            results: [
              ...assessment.results,
              {
                ...studentResult,
                submittedAt: new Date().toISOString(),
              },
            ],
          };
        }
        return assessment;
      }),
    );
  };

  const analyzeAssessment = (assessmentId) => {
    const assessment = getAssessment(assessmentId);
    if (!assessment || assessment.results.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        topicAnalysis: [],
        weakConcepts: [],
        strongConcepts: [],
      };
    }

    const results = assessment.results;
    const totalStudents = results.length;

    const averageScore =
      results.reduce((sum, r) => sum + r.score, 0) / totalStudents;

    const topicScores = {};

    results.forEach((result) => {
      result.answers.forEach((answer, qIndex) => {
        const question = assessment.questions[qIndex];
        if (!question) return;

        const topic = question.topic;
        if (!topicScores[topic]) {
          topicScores[topic] = {
            correct: 0,
            total: 0,
            studentCount: new Set(),
          };
        }

        topicScores[topic].total++;
        topicScores[topic].studentCount.add(
          result.studentName || result.studentId,
        );
        if (answer === question.correctAnswer) {
          topicScores[topic].correct++;
        }
      });
    });

    const topicAnalysis = Object.entries(topicScores)
      .map(([topic, scores]) => ({
        topic,
        correct: scores.correct,
        total: scores.total,
        percentage: ((scores.correct / scores.total) * 100).toFixed(1),
        studentsAttempted: scores.studentCount.size,
      }))
      .sort((a, b) => parseFloat(a.percentage) - parseFloat(b.percentage));

    const weakConcepts = topicAnalysis
      .filter((t) => parseFloat(t.percentage) < 60)
      .map((t) => ({
        ...t,
        severity: parseFloat(t.percentage) < 40 ? "critical" : "moderate",
      }));

    const strongConcepts = topicAnalysis.filter(
      (t) => parseFloat(t.percentage) >= 80,
    );

    return {
      totalStudents,
      averageScore: averageScore.toFixed(1),
      topicAnalysis,
      weakConcepts,
      strongConcepts,
    };
  };

  const closeAssessment = (assessmentId) => {
    setAssessments((prev) =>
      prev.map((assessment) => {
        if (assessment.id === assessmentId) {
          return { ...assessment, status: "closed" };
        }
        return assessment;
      }),
    );
  };

  const deleteAssessment = (assessmentId) => {
    setAssessments((prev) => prev.filter((a) => a.id !== assessmentId));
  };

  const value = {
    assessments,
    createAssessment,
    getAssessment,
    getFacultyAssessments,
    submitStudentResult,
    analyzeAssessment,
    closeAssessment,
    deleteAssessment,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};
