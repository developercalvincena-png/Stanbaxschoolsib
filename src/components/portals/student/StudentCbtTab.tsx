import React, { useState, useEffect } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { CbtExam, CbtAttempt } from '../../../types';
import { 
  GraduationCap, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  ArrowLeft, 
  RotateCcw, 
  ChevronRight, 
  BookOpen, 
  Check, 
  X,
  HelpCircle,
  BarChart3,
  Trophy,
  Users,
  Flame,
  Star,
  Medal
} from '../../RealIcons';

export const StudentCbtTab: React.FC = () => {
  const { student, cbtExams, cbtAttempts, recordCbtAttempt, students, classes } = useSchool();

  const [activeMainTab, setActiveMainTab] = useState<'exams' | 'leaderboard'>('exams');
  const [leaderboardScope, setLeaderboardScope] = useState<'class' | 'general' | 'subject'>('class');
  const [selectedLeaderboardSubject, setSelectedLeaderboardSubject] = useState<string>('All');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>(student.grade || 'SSS 2 Science');

  const [selectedExam, setSelectedExam] = useState<CbtExam | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [isExamRunning, setIsExamRunning] = useState(false);
  const [latestAttempt, setLatestAttempt] = useState<CbtAttempt | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('All');

  // Filter exams relevant to this student's grade or open practice
  const gradeLower = (student.grade || '').toLowerCase();
  const isSenior = gradeLower.includes('sss') || gradeLower.includes('senior secondary');
  const isJunior = gradeLower.includes('jss') || gradeLower.includes('junior secondary');
  const relevantExams = cbtExams.filter(exam => {
    const target = (exam.targetClass || '').toLowerCase().trim();
    let matchesGrade: boolean;
    if (exam.targetClassId) {
      matchesGrade = !student.classId || exam.targetClassId === student.classId;
    } else if (!target || target === 'all' || target.includes('all classes') || target === 'all students') {
      matchesGrade = true;
    } else if (target === gradeLower || target.includes(gradeLower)) {
      matchesGrade = true;                       // e.g. "SSS 2 Science"
    } else if (target.includes('senior secondary') && !/\d/.test(target)) {
      matchesGrade = isSenior;                   // e.g. "All Senior Secondary"
    } else if (target.includes('junior secondary') && !/\d/.test(target)) {
      matchesGrade = isJunior;                   // e.g. "All Junior Secondary"
    } else if (/sss\s*1?\s*[-–—]\s*sss\s*3|jss\s*1?\s*[-–—]\s*jss\s*3/i.test(target)) {
      matchesGrade = target.toLowerCase().includes('sss') ? isSenior : isJunior; // e.g. "SSS 1 - SSS 3"
    } else {
      matchesGrade = false;
    }
    const matchesSubject = filterSubject === 'All' || exam.subject === filterSubject;
    return matchesGrade && matchesSubject;
  });

  const subjectsList = ['All', ...Array.from(new Set(cbtExams.map(e => e.subject)))];

  // My attempts
  const myAttempts = cbtAttempts.filter(a => a.studentId === student.id);

  // Timer countdown
  useEffect(() => {
    if (!isExamRunning || !selectedExam) return;

    if (timeLeftSeconds <= 0) {
      handleFinishExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamRunning, timeLeftSeconds]);

  const handleStartExam = (exam: CbtExam) => {
    setSelectedExam(exam);
    setActiveQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeftSeconds(exam.durationMinutes * 60);
    setIsExamRunning(true);
    setLatestAttempt(null);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (!isExamRunning) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleFinishExam = () => {
    if (!selectedExam) return;
    setIsExamRunning(false);

    let correctCount = 0;
    selectedExam.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const totalQuestions = selectedExam.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = percentage >= selectedExam.passPercentage;

    const attempt = recordCbtAttempt({
      examId: selectedExam.id,
      examTitle: selectedExam.title,
      subject: selectedExam.subject,
      studentId: student.id,
      studentName: student.name,
      score: correctCount,
      totalQuestions,
      percentage,
      passed,
      answers: selectedAnswers
    });

    setLatestAttempt(attempt);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 1. If currently taking an exam
  if (isExamRunning && selectedExam) {
    const currentQ = selectedExam.questions[activeQuestionIndex];
    const answeredCount = Object.keys(selectedAnswers).length;
    const isLowTime = timeLeftSeconds < 120;

    return (
      <div className="space-y-6 animate-fade-in" id="cbt-active-exam-container">
        {/* Exam Header Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border-2 border-amber-400">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-neutral-950">
              {selectedExam.examType} Mock Mode
            </span>
            <h2 className="text-base sm:text-lg font-black text-white">{selectedExam.title}</h2>
            <p className="text-xs text-neutral-400">
              Candidate: <strong className="text-neutral-200">{student.name}</strong> ({student.regNumber})
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border font-mono text-base sm:text-lg font-black ${
              isLowTime ? 'bg-red-950 text-red-300 border-red-500 animate-pulse' : 'bg-neutral-800 text-amber-300 border-neutral-700'
            }`}>
              <Clock className="w-5 h-5 text-amber-400" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>

            <button
              onClick={handleFinishExam}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black transition shadow-md active:scale-95 cursor-pointer"
              id="btn-cbt-submit-exam"
            >
              Finish & Submit
            </button>
          </div>
        </div>

        {/* Question Progress Navigation Pills */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#EAE2CE] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-600">
              Question Navigator: Answered {answeredCount} of {selectedExam.questions.length}
            </span>
            <span className="text-xs font-bold text-amber-700">
              {Math.round((answeredCount / selectedExam.questions.length) * 100)}% Completed
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedExam.questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = idx === activeQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestionIndex(idx)}
                  className={`w-9 h-9 rounded-xl font-black text-xs transition cursor-pointer flex items-center justify-center border ${
                    isCurrent
                      ? 'bg-amber-400 text-neutral-950 border-neutral-950 shadow-md ring-2 ring-amber-400/50'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Question Box */}
        {currentQ && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE2CE] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                Question {activeQuestionIndex + 1} of {selectedExam.questions.length}
              </span>
              {currentQ.topic && (
                <span className="text-xs text-neutral-500 font-semibold">
                  Topic: {currentQ.topic}
                </span>
              )}
            </div>

            <p className="text-base sm:text-lg font-bold text-neutral-900 leading-relaxed">
              {currentQ.question}
            </p>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, optIndex) => {
                const isSelected = selectedAnswers[currentQ.id] === optIndex;
                const letter = String.fromCharCode(65 + optIndex);

                return (
                  <button
                    key={optIndex}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, optIndex)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 shadow-md ring-1 ring-amber-400'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 bg-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-amber-400 text-neutral-950 border-amber-500'
                        : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                    }`}>
                      {letter}
                    </div>
                    <span className="text-sm font-semibold text-neutral-800 flex-1">{opt}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Prev / Next controls */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <button
                type="button"
                disabled={activeQuestionIndex === 0}
                onClick={() => setActiveQuestionIndex(prev => prev - 1)}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 disabled:opacity-40 text-xs font-bold text-neutral-700 transition cursor-pointer"
              >
                Previous Question
              </button>

              {activeQuestionIndex < selectedExam.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishExam}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition active:scale-95 cursor-pointer"
                >
                  Submit Final Assessment
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. If just submitted and viewing Result Report
  if (latestAttempt && selectedExam) {
    return (
      <div className="space-y-6 animate-fade-in" id="cbt-result-screen">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE2CE] shadow-sm text-center space-y-4">
          <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center font-black shadow-lg ${
            latestAttempt.passed ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400' : 'bg-red-100 text-red-800 border-2 border-red-400'
          }`}>
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              latestAttempt.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}>
              {latestAttempt.passed ? 'Assessment Passed' : 'Needs Practice Improvement'}
            </span>
            <h2 className="text-2xl font-black text-neutral-900">{selectedExam.title}</h2>
            <p className="text-xs text-neutral-500">
              Exam Completed on {new Date(latestAttempt.dateAttempted).toLocaleString()}
            </p>
          </div>

          {/* Key Metrics Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Score</span>
              <p className="text-xl font-black text-neutral-900">{latestAttempt.score} / {latestAttempt.totalQuestions}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Percentage</span>
              <p className={`text-xl font-black ${latestAttempt.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                {latestAttempt.percentage}%
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Benchmark</span>
              <p className="text-xl font-black text-neutral-900">{selectedExam.passPercentage}%</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Standard</span>
              <p className="text-xl font-black text-amber-700">{selectedExam.examType}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => handleStartExam(selectedExam)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Mock Exam</span>
            </button>
            <button
              onClick={() => {
                setSelectedExam(null);
                setLatestAttempt(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition cursor-pointer"
            >
              Return to CBT Practice Hall
            </button>
          </div>
        </div>

        {/* Detailed Question Review & Step-by-Step Explanations */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE2CE] shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-black text-neutral-900">Post-Exam Review & Solution Key</h3>
          </div>

          <div className="space-y-4">
            {selectedExam.questions.map((q, idx) => {
              const studentChoice = latestAttempt.answers[q.id];
              const isCorrect = studentChoice === q.correctOptionIndex;

              return (
                <div key={q.id} className={`p-4 sm:p-5 rounded-2xl border ${
                  isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/30 border-red-200'
                } space-y-3`}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-black text-xs text-neutral-700">
                      Q{idx + 1}. {q.question}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide shrink-0 ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isOptionCorrect = optIdx === q.correctOptionIndex;
                      const isOptionStudentChoice = optIdx === studentChoice;

                      return (
                        <div key={optIdx} className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                          isOptionCorrect 
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold'
                            : isOptionStudentChoice && !isOptionCorrect
                            ? 'bg-red-100 text-red-950 border-red-400 line-through'
                            : 'bg-white text-neutral-600 border-neutral-200'
                        }`}>
                          <span className="w-5 h-5 rounded-md bg-black/5 text-center text-[10px] font-black leading-5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isOptionCorrect && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                      <strong>Tutor Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 3. Default Overview: List of Available Practice Exams & History
  // Compute leaderboard entries based on scope and subject filters
  const computeLeaderboard = () => {
    // Collect all attempts
    const validAttempts = cbtAttempts.filter(a => {
      if (leaderboardScope === 'subject' && selectedLeaderboardSubject !== 'All') {
        return a.subject.toLowerCase() === selectedLeaderboardSubject.toLowerCase();
      }
      return true;
    });

    // Group by student
    const studentStats: Record<string, {
      studentId: string;
      studentName: string;
      studentGrade: string;
      totalPoints: number;
      testsTaken: number;
      averagePercent: number;
      passedCount: number;
      perfectScores: number;
      bestPercentage: number;
    }> = {};

    validAttempts.forEach(att => {
      const std = students.find(s => s.id === att.studentId);
      const studentGrade = std?.grade || 'General';

      // Check class scope
      if (leaderboardScope === 'class') {
        const matchesClass = selectedClassFilter === 'All' || 
          studentGrade.toLowerCase().includes(selectedClassFilter.toLowerCase()) ||
          selectedClassFilter.toLowerCase().includes(studentGrade.toLowerCase());
        if (!matchesClass) return;
      }

      if (!studentStats[att.studentId]) {
        studentStats[att.studentId] = {
          studentId: att.studentId,
          studentName: att.studentName || std?.name || 'Scholar',
          studentGrade,
          totalPoints: 0,
          testsTaken: 0,
          averagePercent: 0,
          passedCount: 0,
          perfectScores: 0,
          bestPercentage: 0
        };
      }

      const st = studentStats[att.studentId];
      st.testsTaken += 1;
      st.totalPoints += att.score * 10 + (att.passed ? 20 : 0) + (att.percentage === 100 ? 50 : 0);
      if (att.passed) st.passedCount += 1;
      if (att.percentage === 100) st.perfectScores += 1;
      if (att.percentage > st.bestPercentage) st.bestPercentage = att.percentage;
    });

    // Compute averages
    const list = Object.values(studentStats).map(s => {
      const studentAtts = validAttempts.filter(a => a.studentId === s.studentId);
      const avg = studentAtts.length > 0 
        ? Math.round(studentAtts.reduce((acc, curr) => acc + curr.percentage, 0) / studentAtts.length)
        : 0;
      return { ...s, averagePercent: avg };
    });

    // Sort descending by points, then by average percentage
    list.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      return b.averagePercent - a.averagePercent;
    });

    return list;
  };

  const leaderboardList = computeLeaderboard();
  const availableClasses = ['All', ...classes.map(c => c.name)];
  const leaderboardSubjects = ['All', ...Array.from(new Set(cbtExams.map(e => e.subject)))];

  return (
    <div className="space-y-6" id="cbt-hub-container">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-[#450A0A] text-white shadow-md relative overflow-hidden border border-neutral-800">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
            <Award className="w-3.5 h-3.5" />
            Stanbax CBT Simulation Vault
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Timed Mock Exams & Scholar Quiz Leaderboard
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Practice with genuine WAEC, NECO, and JAMB-styled multiple-choice question sets. Compete on academic leaderboards by class, subject, and general points!
          </p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-neutral-200/70 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveMainTab('exams')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeMainTab === 'exams'
              ? 'bg-white text-neutral-900 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-red-600" />
          <span>Available Mock Exams ({relevantExams.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMainTab('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeMainTab === 'leaderboard'
              ? 'bg-amber-400 text-neutral-950 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-700" />
          <span>Quiz Leaderboard ({leaderboardList.length} Ranked)</span>
        </button>
      </div>

      {activeMainTab === 'leaderboard' ? (
        <div className="space-y-6">
          {/* Controls & Filter Panel */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2CE] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div>
                <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Stanbax Scholar Quiz & CBT Ranking</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Points awarded for questions correctly answered (10 pts), passing marks (20 pts bonus), and 100% mastery runs (50 pts bonus).
                </p>
              </div>

              {/* Scope Switcher: Class by Class, General, Subject */}
              <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setLeaderboardScope('class')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    leaderboardScope === 'class' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Class by Class
                </button>
                <button
                  type="button"
                  onClick={() => setLeaderboardScope('general')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    leaderboardScope === 'general' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  General (All School)
                </button>
                <button
                  type="button"
                  onClick={() => setLeaderboardScope('subject')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    leaderboardScope === 'subject' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Subject Based
                </button>
              </div>
            </div>

            {/* Scope Specific Secondary Filters */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium pt-1">
              {leaderboardScope === 'class' && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-neutral-700">Select Class:</span>
                  <select
                    value={selectedClassFilter}
                    onChange={(e) => setSelectedClassFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-neutral-300 font-bold bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {availableClasses.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {leaderboardScope === 'subject' && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-neutral-700">Select Subject:</span>
                  <select
                    value={selectedLeaderboardSubject}
                    onChange={(e) => setSelectedLeaderboardSubject(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-neutral-300 font-bold bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {leaderboardSubjects.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="ml-auto text-xs text-neutral-500 font-semibold">
                Showing rankings for: <strong className="text-neutral-900">{leaderboardScope === 'class' ? selectedClassFilter : leaderboardScope === 'subject' ? selectedLeaderboardSubject : 'Entire School'}</strong>
              </div>
            </div>
          </div>

          {/* Top 3 Podium Cards */}
          {leaderboardList.length >= 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Silver #2 */}
              <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between items-center text-center space-y-2 order-2 sm:order-1">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-black text-sm">
                  #2
                </div>
                <div>
                  <h4 className="font-black text-sm text-neutral-900">{leaderboardList[1].studentName}</h4>
                  <span className="text-[11px] text-neutral-500 font-bold">{leaderboardList[1].studentGrade}</span>
                </div>
                <div className="bg-slate-50 px-3 py-1 rounded-xl text-xs font-black text-slate-700">
                  {leaderboardList[1].totalPoints.toLocaleString()} Points
                </div>
                <div className="text-[10px] text-neutral-500 font-medium">
                  {leaderboardList[1].testsTaken} Quizzes • {leaderboardList[1].averagePercent}% Avg
                </div>
              </div>

              {/* Gold #1 */}
              <div className="bg-gradient-to-b from-amber-500/10 to-amber-500/20 p-6 rounded-3xl border-2 border-amber-400 shadow-md flex flex-col justify-between items-center text-center space-y-3 order-1 sm:order-2 relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black text-xl shadow-md border-2 border-white">
                  👑 #1
                </div>
                <div>
                  <h4 className="font-black text-base text-neutral-900">{leaderboardList[0].studentName}</h4>
                  <span className="text-xs text-amber-900 font-bold">{leaderboardList[0].studentGrade}</span>
                </div>
                <div className="bg-amber-400 text-neutral-950 px-4 py-1.5 rounded-xl text-sm font-black shadow-xs">
                  {leaderboardList[0].totalPoints.toLocaleString()} Points
                </div>
                <div className="text-xs text-amber-900 font-bold">
                  {leaderboardList[0].testsTaken} Quizzes • {leaderboardList[0].averagePercent}% Avg • {leaderboardList[0].perfectScores} Perfect Scores
                </div>
              </div>

              {/* Bronze #3 */}
              <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between items-center text-center space-y-2 order-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-black text-sm">
                  #3
                </div>
                <div>
                  <h4 className="font-black text-sm text-neutral-900">{leaderboardList[2].studentName}</h4>
                  <span className="text-[11px] text-neutral-500 font-bold">{leaderboardList[2].studentGrade}</span>
                </div>
                <div className="bg-amber-50 px-3 py-1 rounded-xl text-xs font-black text-amber-800">
                  {leaderboardList[2].totalPoints.toLocaleString()} Points
                </div>
                <div className="text-[10px] text-neutral-500 font-medium">
                  {leaderboardList[2].testsTaken} Quizzes • {leaderboardList[2].averagePercent}% Avg
                </div>
              </div>
            </div>
          )}

          {/* Full Ranked Table */}
          <div className="p-6 rounded-3xl bg-white border border-[#EAE2CE] shadow-sm space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-600 uppercase font-bold text-[10px] tracking-wider border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">Scholar</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3 text-center">Quizzes Taken</th>
                    <th className="py-3 px-3 text-center">Passed</th>
                    <th className="py-3 px-3 text-center">Avg %</th>
                    <th className="py-3 px-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {leaderboardList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-neutral-500">
                        No quiz attempts recorded yet for this filter. Complete practice drills to climb the leaderboard!
                      </td>
                    </tr>
                  ) : (
                    leaderboardList.map((entry, idx) => {
                      const isMe = entry.studentId === student.id;

                      return (
                        <tr key={entry.studentId} className={`hover:bg-neutral-50 transition-colors ${
                          isMe ? 'bg-amber-50/60 font-bold' : ''
                        }`}>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                              idx === 0 ? 'bg-amber-400 text-neutral-950' :
                              idx === 1 ? 'bg-slate-300 text-neutral-900' :
                              idx === 2 ? 'bg-amber-200 text-amber-950' :
                              'bg-neutral-100 text-neutral-600'
                            }`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-neutral-900">{entry.studentName}</span>
                              {isMe && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-neutral-900 text-white">
                                  You
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-neutral-600">{entry.studentGrade}</td>
                          <td className="py-3 px-3 text-center font-bold text-neutral-800">{entry.testsTaken}</td>
                          <td className="py-3 px-3 text-center text-emerald-700 font-bold">{entry.passedCount}</td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-neutral-800">{entry.averagePercent}%</td>
                          <td className="py-3 px-3 text-right">
                            <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 font-black font-mono text-xs">
                              {entry.totalPoints.toLocaleString()} pts
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#EAE2CE]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-neutral-700">Filter by Subject:</span>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-bold bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {subjectsList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <span className="text-xs text-neutral-500 font-semibold">
          Showing {relevantExams.length} Available Mock Exam{relevantExams.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Available Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {relevantExams.map(exam => {
          const pastAttempt = myAttempts.find(a => a.examId === exam.id);

          return (
            <div
              key={exam.id}
              className="p-6 rounded-3xl bg-white border border-[#EAE2CE] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-wider border border-red-200">
                    {exam.examType}
                  </span>
                  <span className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    {exam.durationMinutes} Mins
                  </span>
                </div>

                <h3 className="text-base font-black text-neutral-900 leading-snug">
                  {exam.title}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-2">
                  {exam.instructions}
                </p>

                <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                  <span>Subject: <strong className="text-neutral-800">{exam.subject}</strong></span>
                  <span>Questions: <strong className="text-neutral-800">{exam.questions.length}</strong></span>
                </div>

                {pastAttempt && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs">
                    <span className="text-neutral-600 font-medium">Last Score:</span>
                    <span className={`font-black ${pastAttempt.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                      {pastAttempt.score}/{pastAttempt.totalQuestions} ({pastAttempt.percentage}%)
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleStartExam(exam)}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                id={`btn-start-exam-${exam.id}`}
              >
                <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{pastAttempt ? 'Retake Timed Exam' : 'Start Timed Exam'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Past Exam History Log */}
      {myAttempts.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE2CE] shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-black text-neutral-900">Your Recent CBT Attempt Log</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 uppercase font-bold text-[10px] tracking-wider border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3">Exam Title</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Percentage</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium">
                {myAttempts.map(att => (
                  <tr key={att.id} className="hover:bg-neutral-50">
                    <td className="py-3 px-3 font-bold text-neutral-900">{att.examTitle}</td>
                    <td className="py-3 px-3 text-neutral-700">{att.subject}</td>
                    <td className="py-3 px-3 text-neutral-500">
                      {new Date(att.dateAttempted).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-bold text-neutral-900">
                      {att.score} / {att.totalQuestions}
                    </td>
                    <td className="py-3 px-3 font-bold text-neutral-900">
                      {att.percentage}%
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        att.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {att.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
};
