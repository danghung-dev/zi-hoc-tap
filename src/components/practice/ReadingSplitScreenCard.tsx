"use client";

import React, { useState, useEffect } from "react";
import { ReadingSplitScreenQuestion } from "@/lib/practice/types";
import { recordAnswer } from "@/lib/practice/progress";
import { 
  Sparkles, 
  Volume2, 
  Languages, 
  HelpCircle, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReadingSplitScreenCardProps {
  question: ReadingSplitScreenQuestion;
  onAnswered: (isCorrect: boolean) => void;
}

export function ReadingSplitScreenCard({ question, onAnswered }: ReadingSplitScreenCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [activeQIdx, setActiveQIdx] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showQuestionTranslation, setShowQuestionTranslation] = useState<Record<string, boolean>>({});

  // Reset states on question change
  useEffect(() => {
    setSelectedAnswers({});
    setActiveQIdx(0);
    setHasSubmitted(false);
    setShowTranslation(false);
    setShowQuestionTranslation({});
  }, [question.id]);

  const speakJapanese = (text: string) => {
    if ("speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = (qId: string, optionId: string) => {
    if (hasSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionId }));
  };

  const handleCheckAnswer = () => {
    if (hasSubmitted) return;

    // Check if all questions are answered
    const allAnswered = question.questions.every((q) => selectedAnswers[q.id]);
    if (!allAnswered) return;

    setHasSubmitted(true);

    // Score: all reading questions in the set must be correct
    const isAllCorrect = question.questions.every(
      (q) => selectedAnswers[q.id] === q.answer.correctOptionId
    );

    recordAnswer(question.id, isAllCorrect);
    onAnswered(isAllCorrect);
  };

  const handleReset = () => {
    if (hasSubmitted) return;
    setSelectedAnswers({});
    setActiveQIdx(0);
  };

  const activeQuestion = question.questions[activeQIdx] || question.questions[0];
  const allAnswered = question.questions.every((q) => selectedAnswers[q.id]);
  const numQuestions = question.questions.length;

  const toggleQuestionTranslation = (qId: string) => {
    setShowQuestionTranslation(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header tags */}
      {question.customClassification?.showOnCard && (
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-900/40 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-500/20">
            {question.customClassification.displayLabel}
          </span>
          <span className="px-2 py-0.5 bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 rounded-md text-[10px] font-bold uppercase">
            Đọc hiểu bài đọc
          </span>
        </div>
      )}

      {/* Main Stacked Area */}
      <div className="flex flex-col gap-6">
        
        {/* Top: Passage Panel (Full Width) */}
        <div className="w-full bg-slate-950/60 border border-slate-850 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h4 className="font-bold text-slate-100 flex items-center gap-2 text-sm sm:text-base">
              <BookOpen className="w-4.5 h-4.5 text-indigo-400" />
              {question.passage.title}
            </h4>
            <button
              onClick={() => speakJapanese(question.passage.text)}
              className="p-2.5 bg-slate-900 hover:bg-slate-850 text-indigo-400 rounded-xl border border-slate-800 transition active:scale-95 flex-shrink-0"
              title="Đọc toàn bài viết"
            >
              <Volume2 className="w-4.5 h-4.5" />
            </button>
          </div>

          <p className="text-sm sm:text-base text-slate-200 leading-loose whitespace-pre-wrap font-sans">
            {question.passage.text}
          </p>

          {/* Translation section */}
          {question.passage.translationVi && (
            <div className="mt-2 pt-3 border-t border-slate-900">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                <Languages className="w-4 h-4 text-indigo-400" />
                <span>{showTranslation ? "Ẩn dịch tiếng Việt bài đọc" : "Hiện dịch tiếng Việt bài đọc"}</span>
              </button>
              {showTranslation && (
                <p className="mt-3 p-3.5 bg-slate-900/60 border border-slate-850 rounded-xl text-xs sm:text-sm text-slate-300 italic whitespace-pre-wrap leading-relaxed">
                  {question.passage.translationVi}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom: Questions Panel (Full Width) */}
        <div className="w-full flex flex-col gap-4">
          
          {/* Question selection navigator (if multiple questions in this passage) */}
          {numQuestions > 1 && (
            <div className="flex items-center justify-between bg-slate-950 p-2.5 border border-slate-850 rounded-xl">
              <button
                onClick={() => setActiveQIdx(Math.max(0, activeQIdx - 1))}
                disabled={activeQIdx === 0}
                className="p-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded-lg text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-300 font-mono">
                Câu hỏi {activeQIdx + 1} / {numQuestions}
              </span>
              <button
                onClick={() => setActiveQIdx(Math.min(numQuestions - 1, activeQIdx + 1))}
                disabled={activeQIdx === numQuestions - 1}
                className="p-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded-lg text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Active Question Render */}
          {activeQuestion && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              
              {/* Question Text */}
              <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                    Q{activeQIdx + 1}. {activeQuestion.questionText}
                  </div>
                  <button
                    onClick={() => speakJapanese(activeQuestion.questionText)}
                    className="p-2 bg-slate-900 hover:bg-slate-850 text-indigo-400 rounded-lg border border-slate-800 transition active:scale-95 flex-shrink-0"
                    title="Đọc câu hỏi"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Translation of question */}
                {activeQuestion.questionTranslationVi && (
                  <div>
                    <button
                      onClick={() => toggleQuestionTranslation(activeQuestion.id)}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition cursor-pointer"
                    >
                      <Languages className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{showQuestionTranslation[activeQuestion.id] ? "Ẩn dịch câu hỏi" : "Dịch nghĩa câu hỏi"}</span>
                    </button>
                    {showQuestionTranslation[activeQuestion.id] && (
                      <p className="mt-1 text-xs text-slate-400 italic">
                        "{activeQuestion.questionTranslationVi}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="flex flex-col gap-2.5">
                {activeQuestion.options.map((opt) => {
                  const isSelected = selectedAnswers[activeQuestion.id] === opt.id;
                  const isCorrectAnswer = opt.isCorrect;

                  let btnClass = "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900";
                  
                  if (hasSubmitted) {
                    if (isCorrectAnswer) {
                      btnClass = "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-semibold";
                    } else if (isSelected) {
                      btnClass = "border-rose-500 bg-rose-950/20 text-rose-300 font-semibold";
                    } else {
                      btnClass = "border-slate-900 bg-slate-950/40 text-slate-500 opacity-60";
                    }
                  } else if (isSelected) {
                    btnClass = "border-indigo-500 bg-indigo-950/20 text-indigo-300 font-semibold";
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={hasSubmitted}
                      onClick={() => handleSelectOption(activeQuestion.id, opt.id)}
                      className={cn(
                        "w-full py-3 px-4 border text-left text-xs sm:text-sm font-medium rounded-xl transition-all duration-150 flex items-center justify-between active:scale-[0.99] cursor-pointer",
                        btnClass
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border",
                          isSelected ? "bg-slate-100 text-slate-950 border-slate-200" : "bg-slate-900 text-slate-500 border-slate-800"
                        )}>
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation panel for current active question */}
              {hasSubmitted && (
                <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-2xl p-5 flex flex-col gap-3 animate-in fade-in duration-200 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 text-indigo-300 font-bold border-b border-indigo-900/30 pb-2 uppercase tracking-wide">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                    Giải thích câu Q{activeQIdx + 1}
                  </div>
                  
                  {activeQuestion.answer.evidenceText && (
                    <p className="text-slate-300">
                      <strong className="text-indigo-400">Dẫn chứng bài đọc:</strong> "{activeQuestion.answer.evidenceText}"
                    </p>
                  )}

                  {activeQuestion.answer.strategyVi && (
                    <p className="text-slate-300">
                      <strong className="text-indigo-400">Chiến lược đọc hiểu:</strong> {activeQuestion.answer.strategyVi}
                    </p>
                  )}

                  <div className="flex flex-col gap-1.5 mt-1 pt-2.5 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Giải thích chi tiết các đáp án:</span>
                    <div className="grid grid-cols-1 gap-1.5 text-xs">
                      {activeQuestion.options.map((o) => (
                        <div key={o.id} className="flex gap-2">
                          <span className={cn(
                            "font-mono font-bold px-1.5 rounded h-fit text-[11px]",
                            o.isCorrect ? "text-emerald-400 bg-emerald-950/40" : "text-slate-400 bg-slate-800"
                          )}>
                            {o.id}
                          </span>
                          <span className="text-slate-300">
                            <strong>{o.text}</strong>: {o.explanationVi}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Verification buttons */}
          {!hasSubmitted && (
            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={handleReset}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="px-4 py-2.5 border border-slate-800 hover:bg-slate-850 bg-slate-950 rounded-xl text-xs font-semibold transition text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Làm lại
              </button>
              <button
                onClick={handleCheckAnswer}
                disabled={!allAnswered}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-500 text-xs font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
              >
                Kiểm tra đáp án
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
