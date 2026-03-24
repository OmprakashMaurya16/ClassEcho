// ─────────────────────────────────────────────────────────────────────────────
// FacultyAnalytics.jsx — Performance Analytics dashboard
//
// API INTEGRATION POINTS:
//   GET /api/faculty/subjects
//     → { subjects: [{ _id, name, code }] }
//
//   GET /api/faculty/analytics?subjectId=<id|"overall">&filter=<weekly|monthly|semesterly>
//     → {
//         overallScore: number (out of 10),
//         trend: [{ label, score, deptAvg }],
//         parameters: [{ label, score, max }],
//         sentiment: { positive, neutral, negative },  // percentages
//         comments: [{ _id, text, sentiment, date, initials }]
//       }
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Star,
  MessageSquare,
  TrendingUp,
  BarChart2,
  LogOut,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import Footer from "../components/Footer";
import TimelineChart from "../components/TimelineChart";
import HBar from "../components/HBar";
import PieChart from "../components/PieChart";
import CommentCard from "../components/CommentCard";
import logo from "../assets/vit.png"

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_SUBJECTS = [
  { _id: "overall", name: "Overall", code: "" },
  { _id: "sub1", name: "Thermodynamics II", code: "ME401" },
  { _id: "sub2", name: "Heat Transfer", code: "ME402" },
  { _id: "sub3", name: "Project Management", code: "ME403" },
];

const MOCK_ANALYTICS = {
  overall: {
    overallScore: 8.4,
    trend: [
      { label: "Week 1", score: 3.2, deptAvg: 3.0 },
      { label: "Week 3", score: 4.1, deptAvg: 3.5 },
      { label: "Week 5", score: 4.0, deptAvg: 3.7 },
      { label: "Week 7", score: 4.3, deptAvg: 3.8 },
      { label: "Week 9", score: 4.6, deptAvg: 4.0 },
      { label: "Week 12", score: 4.8, deptAvg: 4.1 },
    ],
    parameters: [
      { label: "Concept Clarity", score: 4.7, max: 5 },
      { label: "Lecture Structure", score: 4.3, max: 5 },
      { label: "Subject Mastery", score: 4.8, max: 5 },
      { label: "Practical Understanding", score: 4.2, max: 5 },
      { label: "Student Engagement", score: 4.0, max: 5 },
      { label: "Lecture Pace", score: 3.9, max: 5 },
      { label: "Learning Outcome Impact", score: 4.5, max: 5 },
    ],
    sentiment: { positive: 68, neutral: 22, negative: 10 },
    comments: [
      {
        _id: "c1",
        initials: "JD",
        text: "Dr. Sharma explains thermodynamics concepts very clearly. The practical examples help a lot in understanding.",
        sentiment: "Positive",
        date: "2 days ago",
      },
      {
        _id: "c2",
        initials: "AS",
        text: "The derivations are done a bit too quickly on the board. Would appreciate if we could slow down a bit.",
        sentiment: "Constructive",
        date: "4 days ago",
      },
      {
        _id: "c3",
        initials: "RK",
        text: "The PDF notes provided after class are excellent for revision.",
        sentiment: "Positive",
        date: "1 week ago",
      },
      {
        _id: "c4",
        initials: "PK",
        text: "Real-world examples make the concepts easy to relate to.",
        sentiment: "Positive",
        date: "1 week ago",
      },
      {
        _id: "c5",
        initials: "MM",
        text: "Sometimes the lecture runs over time. Better time management would help.",
        sentiment: "Constructive",
        date: "2 weeks ago",
      },
    ],
  },
  sub1: {
    overallScore: 9.1,
    trend: [
      { label: "Week 1", score: 4.0, deptAvg: 3.2 },
      { label: "Week 3", score: 4.4, deptAvg: 3.6 },
      { label: "Week 5", score: 4.5, deptAvg: 3.8 },
      { label: "Week 7", score: 4.7, deptAvg: 4.0 },
      { label: "Week 9", score: 4.8, deptAvg: 4.1 },
      { label: "Week 12", score: 4.9, deptAvg: 4.2 },
    ],
    parameters: [
      { label: "Concept Clarity", score: 4.9, max: 5 },
      { label: "Lecture Structure", score: 4.6, max: 5 },
      { label: "Subject Mastery", score: 5.0, max: 5 },
      { label: "Practical Understanding", score: 4.5, max: 5 },
      { label: "Student Engagement", score: 4.3, max: 5 },
      { label: "Lecture Pace", score: 4.1, max: 5 },
      { label: "Learning Outcome Impact", score: 4.7, max: 5 },
    ],
    sentiment: { positive: 78, neutral: 16, negative: 6 },
    comments: [
      {
        _id: "c1",
        initials: "JD",
        text: "Best thermodynamics lectures I've had. Very clear and methodical.",
        sentiment: "Positive",
        date: "1 day ago",
      },
      {
        _id: "c2",
        initials: "MN",
        text: "The worked examples really help to consolidate understanding.",
        sentiment: "Positive",
        date: "3 days ago",
      },
      {
        _id: "c3",
        initials: "AS",
        text: "Would love more practice problems in class.",
        sentiment: "Constructive",
        date: "5 days ago",
      },
      {
        _id: "c4",
        initials: "RR",
        text: "Excellent use of visual aids on the board.",
        sentiment: "Positive",
        date: "1 week ago",
      },
      {
        _id: "c5",
        initials: "LK",
        text: "Very approachable for questions after class.",
        sentiment: "Positive",
        date: "2 weeks ago",
      },
    ],
  },
};
// Fill in missing subjects with overall data as fallback
["sub2", "sub3"].forEach((id) => {
  MOCK_ANALYTICS[id] = MOCK_ANALYTICS.overall;
});

// ── SENTIMENT COLOURS ────────────────────────────────────────────────────────
const SENT_COLOUR = {
  Positive: "bg-green-100 text-green-700",
  Constructive: "bg-yellow-100 text-yellow-700",
  Negative: "bg-red-100 text-red-600",
};
const SENT_PIE = {
  positive: "#22c55e",
  neutral: "#facc15",
  negative: "#ef4444",
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
const FacultyAnalytics = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState(MOCK_SUBJECTS);
  const [activeSubj, setActiveSubj] = useState("overall");
  const [filter, setFilter] = useState("weekly");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // ── Fetch analytics when subject or filter changes ──────────────────────
  // API INTEGRATION: replace mock lookup with:
  //   const token = JSON.parse(sessionStorage.getItem("vit_user") ?? "{}")?.token;
  //   fetch(`/api/faculty/analytics?subjectId=${activeSubj}&filter=${filter}`, { headers: { Authorization: `Bearer ${token}` } })
  //     .then(r => r.json()).then(setAnalytics);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAnalytics(MOCK_ANALYTICS[activeSubj] ?? MOCK_ANALYTICS.overall);
      setLoading(false);
    }, 400); // simulate network
  }, [activeSubj, filter]);

  // useEffect(() => {
  //   const token = JSON.parse(sessionStorage.getItem("vit_user") ?? "{}")?.token;
  //   fetch("/api/faculty/subjects", { headers: { Authorization: `Bearer ${token}` } })
  //     .then(r => r.json()).then(d => setSubjects([{ _id:"overall", name:"Overall", code:"" }, ...d.subjects]));
  // }, []);

  const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(word => word && !["Dr.", "Prof.", "Mr.", "Mrs.", "Ms."].includes(word))
    .map(word => word[0])
    .join("")
    .toUpperCase();
};

const initials = getInitials(user?.name);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  const activeSubjectLabel =
    subjects.find((s) => s._id === activeSubj)?.name ?? "Overall";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                  {/* Left: Logo */}
                  <div className="flex items-center gap-0.5 sm:gap-1 min-w-0">
                    {/* Logo */}
                    <img
                      src={logo}
                      alt="College Logo"
                      className="h-7 sm:h-9 md:h-11 lg:h-12 w-auto object-contain shrink-0"
                    />
      
                    {/* Text */}
                    <span className="font-bold text-gray-800 text-sm sm:text-lg md:text-base lg:text-xl truncate">
                      ClassEcho
                    </span>
                  </div>
      
                  {/* Right: Profile + Logout */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs sm:text-sm">
                      {initials || "F"}
                    </div>
      
                    {/* Logout button */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-red-500 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page heading */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/faculty/dashboard")}
              className="flex items-center gap-1 text-gray-400 hover:text-blue-600 transition mb-2 cursor-pointer"
              style={{ fontSize: "clamp(0.72rem,1.4vw,0.8rem)" }}
            >
              <ChevronLeft size={14} /> Dashboard
            </button>
            <h1
              className="font-extrabold text-gray-900"
              style={{ fontSize: "clamp(1.3rem,3vw,1.75rem)" }}
            >
              Performance Analytics
            </h1>
            <p
              className="text-gray-400 mt-0.5"
              style={{ fontSize: "clamp(0.72rem,1.4vw,0.8rem)" }}
            >
              {user?.department} · {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* ── Subject filter — horizontal scroll ─────────────────────── */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 mb-6"
          style={{ scrollbarWidth: "none" }}
        >
          {subjects.map((s) => (
            <button
              key={s._id}
              onClick={() => setActiveSubj(s._id)}
              className={`shrink-0 px-4 py-2 rounded-full font-medium transition border cursor-pointer ${
                activeSubj === s._id
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
              style={{ fontSize: "clamp(0.75rem,1.4vw,0.875rem)" }}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* ── Content: 80% left + 20% right ─────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* ── LEFT COLUMN (80%) ─────────────────────────────────────── */}
          <div className="flex-1 space-y-5" style={{ minWidth: 0 }}>
            {/* Trend chart */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={17} className="text-blue-600" />
                  <h2
                    className="font-bold text-gray-800"
                    style={{ fontSize: "clamp(0.9rem,1.8vw,1.05rem)" }}
                  >
                    Weekly Performance Trend
                  </h2>
                </div>
                {/* Filter pills */}
                <div className="flex gap-1.5">
                  {["weekly", "monthly", "semesterly"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded-lg font-medium capitalize transition cursor-pointer ${
                        filter === f
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                      style={{ fontSize: "clamp(0.65rem,1.2vw,0.75rem)" }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              {/* Legend */}
              <div className="flex gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-blue-600" />
                  <span
                    className="text-gray-500"
                    style={{ fontSize: "clamp(0.65rem,1.2vw,0.75rem)" }}
                  >
                    You
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-0.5 bg-gray-300"
                    style={{ borderTop: "2px dashed #d1d5db", height: 0 }}
                  />
                  <div className="w-3 border-t-2 border-dashed border-gray-300" />
                  <span
                    className="text-gray-500"
                    style={{ fontSize: "clamp(0.65rem,1.2vw,0.75rem)" }}
                  >
                    Dept Avg
                  </span>
                </div>
              </div>
              {loading ? (
                <div className="h-32 bg-gray-50 rounded-xl animate-pulse" />
              ) : (
                <TimelineChart data={analytics?.trend} />
              )}
            </div>

            {/* Parameter bars + Sentiment donut — side by side on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Parameter Analysis */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 size={17} className="text-blue-600" />
                  <h2
                    className="font-bold text-gray-800"
                    style={{ fontSize: "clamp(0.9rem,1.8vw,1.05rem)" }}
                  >
                    Parameter Analysis
                  </h2>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div
                        key={i}
                        className="h-6 bg-gray-100 rounded animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  analytics?.parameters.map((p) => <HBar {...p} />)
                )}
              </div>

              {/* Sentiment Analysis */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={17} className="text-blue-600" />
                  <h2
                    className="font-bold text-gray-800"
                    style={{ fontSize: "clamp(0.9rem,1.8vw,1.05rem)" }}
                  >
                    Sentiment Analysis
                  </h2>
                </div>
                {loading ? (
                  <div className="h-40 bg-gray-50 rounded-xl animate-pulse" />
                ) : (
                  <div className="flex flex-col items-center gap-5">
                    <PieChart data={analytics?.sentiment} />

                    {/* Single correct legend */}
                    <div className="flex gap-4 flex-wrap justify-center">
                      {[
                        {
                          label: "Positive",
                          color: "bg-green-400",
                          val: analytics?.sentiment?.positive,
                        },
                        {
                          label: "Neutral",
                          color: "bg-yellow-400",
                          val: analytics?.sentiment?.neutral,
                        },
                        {
                          label: "Negative",
                          color: "bg-red-400",
                          val: analytics?.sentiment?.negative,
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-2"
                        >
                          <span
                            className={`w-3 h-3 rounded-full ${item.color}`}
                          />
                          <span className="text-sm text-gray-600">
                            {item.label} ({item.val ?? 0}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (20%) — Score + Comments ──────────────────── */}
          <div className="w-full lg:w-64 xl:w-72 shrink-0 space-y-4">
            {/* Overall Score */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <h3
                  className="font-bold text-gray-800"
                  style={{ fontSize: "clamp(0.85rem,1.6vw,0.95rem)" }}
                >
                  Overall Score
                </h3>
              </div>
              {loading ? (
                <div className="h-20 bg-gray-50 rounded-xl animate-pulse" />
              ) : (
                <div className="text-center py-3">
                  <div
                    className="font-extrabold text-blue-600 leading-none"
                    style={{ fontSize: "clamp(2.5rem,6vw,3.5rem)" }}
                  >
                    {analytics?.overallScore ?? "—"}
                  </div>
                  <div
                    className="text-gray-400 mt-1"
                    style={{ fontSize: "clamp(0.72rem,1.3vw,0.8rem)" }}
                  >
                    out of 10
                  </div>
                  <div
                    className="mt-3 w-full bg-gray-100 rounded-full overflow-hidden"
                    style={{ height: 8 }}
                  >
                    <div
                      className="h-full rounded-full bg-linear-to-r from-blue-400 to-blue-600 transition-all duration-700"
                      style={{
                        width: `${(analytics?.overallScore / 10) * 100}%`,
                      }}
                    />
                  </div>
                  <div
                    className="flex justify-between mt-1 text-gray-300"
                    style={{ fontSize: "clamp(0.6rem,1.1vw,0.68rem)" }}
                  >
                    <span>0</span>
                    <span>10</span>
                  </div>
                  <p
                    className="text-gray-500 mt-2"
                    style={{ fontSize: "clamp(0.68rem,1.2vw,0.75rem)" }}
                  >
                    {activeSubjectLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Student Comments */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-blue-600" />
                  <h3
                    className="font-bold text-gray-800"
                    style={{ fontSize: "clamp(0.85rem,1.6vw,0.95rem)" }}
                  >
                    Student Feedback
                  </h3>
                </div>
                <span
                  className="text-gray-400 font-medium"
                  style={{ fontSize: "clamp(0.65rem,1.2vw,0.72rem)" }}
                >
                  Latest
                </span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-50 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {(analytics?.comments ?? []).slice(0, 5).map((c, i) => (
                    <div key={c._id} className={i > 0 ? "pt-3 mt-3" : ""}>
                      <CommentCard {...c} />
                    </div>
                  ))}
                </div>
              )}

              {(analytics?.comments?.length ?? 0) > 5 && (
                <button
                  className="w-full mt-4 text-center text-blue-600 font-semibold hover:underline"
                  style={{ fontSize: "clamp(0.72rem,1.3vw,0.8rem)" }}
                >
                  View All Comments →
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FacultyAnalytics;
