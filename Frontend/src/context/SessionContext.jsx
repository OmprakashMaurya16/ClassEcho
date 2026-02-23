import React, { createContext, useContext, useState } from "react";

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  // Store active sessions and feedback responses
  const [sessions, setSessions] = useState([]);
  const [feedbackResponses, setFeedbackResponses] = useState([]);

  // Create a new feedback session
  const createSession = (facultyId, facultyName, course, department) => {
    const sessionId = `SESSION-${Date.now()}`;
    const newSession = {
      id: sessionId,
      facultyId,
      facultyName,
      course,
      department,
      createdAt: new Date().toISOString(),
      responses: [],
      status: "active",
    };
    
    setSessions(prev => [...prev, newSession]);
    return sessionId;
  };

  // Submit feedback for a session
  const submitFeedback = (sessionId, feedbackData) => {
    const feedback = {
      id: `FB-${Date.now()}`,
      sessionId,
      submittedAt: new Date().toISOString(),
      ...feedbackData,
    };

    // Add to feedback responses
    setFeedbackResponses(prev => [...prev, feedback]);

    // Update session with new response
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, responses: [...session.responses, feedback] }
          : session
      )
    );

    return feedback.id;
  };

  // Get session by ID
  const getSession = (sessionId) => {
    return sessions.find(s => s.id === sessionId);
  };

  // Get all sessions for a faculty
  const getFacultySessions = (facultyId) => {
    return sessions.filter(s => s.facultyId === facultyId);
  };

  // Get feedback for a session
  const getSessionFeedback = (sessionId) => {
    return feedbackResponses.filter(f => f.sessionId === sessionId);
  };

  // Close/End a session
  const closeSession = (sessionId) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, status: "completed" }
          : session
      )
    );
  };

  // Calculate analytics for a faculty
  const getFacultyAnalytics = (facultyId) => {
    const facultySessions = getFacultySessions(facultyId);
    const allFeedback = feedbackResponses.filter(f => 
      facultySessions.some(s => s.id === f.sessionId)
    );

    if (allFeedback.length === 0) {
      return {
        totalResponses: 0,
        averageRating: 0,
        sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
        parameterAverages: {},
        recentFeedback: [],
      };
    }

    // Calculate average rating
    const totalRating = allFeedback.reduce((sum, f) => sum + f.overallRating, 0);
    const averageRating = totalRating / allFeedback.length;

    // Calculate parameter averages
    const parameters = ['teaching', 'clarity', 'engagement', 'knowledge', 'availability', 'helpfulness'];
    const parameterAverages = {};
    
    parameters.forEach(param => {
      const total = allFeedback.reduce((sum, f) => sum + (f.ratings?.[param] || 0), 0);
      parameterAverages[param] = total / allFeedback.length;
    });

    // Calculate sentiment distribution
    const positive = allFeedback.filter(f => f.overallRating >= 4).length;
    const neutral = allFeedback.filter(f => f.overallRating === 3).length;
    const negative = allFeedback.filter(f => f.overallRating < 3).length;

    return {
      totalResponses: allFeedback.length,
      averageRating: parseFloat(averageRating.toFixed(2)),
      sentimentDistribution: {
        positive: Math.round((positive / allFeedback.length) * 100),
        neutral: Math.round((neutral / allFeedback.length) * 100),
        negative: Math.round((negative / allFeedback.length) * 100),
      },
      parameterAverages,
      recentFeedback: allFeedback.slice(-10).reverse(),
    };
  };

  const value = {
    sessions,
    feedbackResponses,
    createSession,
    submitFeedback,
    getSession,
    getFacultySessions,
    getSessionFeedback,
    getFacultyAnalytics,
    closeSession,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};
