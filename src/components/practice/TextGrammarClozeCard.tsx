"use client";

import React, { useState, useEffect } from "react";
import { TextGrammarClozeQuestion } from "@/lib/practice/types";
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
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { speakJapanese } from "@/lib/tts";

interface TextGrammarClozeCardProps {
  question: TextGrammarClozeQuestion;
  onAnswered: (isCorrect: boolean) => void;
}

export function TextGrammarClozeCard({ question, onAnswered }: TextGrammarClozeCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [focusedQuestionId, setFocusedQuestionId] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Initialize state on question change
  useEffect(() => {
    setSelectedAnswers({});
    setFocusedQuestionId(question.questions[0]?.id || "");
    setHasSubmitted(false);
    setShowTranslation(false);
  }, [question.id]);

  const speakText = (text: string) => {
    const plainText = text.replace(/\[blank_\d+\]/g, " ___ ");
    speakJapanese(plainText);
  };

  const handleSelectOption = (qId: string, optionId: string) => {
    if (hasSubmitted) return;

    const nextAnswers = { ...selectedAnswers, [qId]: optionId };
    setSelectedAnswers(nextAnswers);

    // Auto-focus next empty blank
    const nextUnanswered = question.questions.find(
      (q) => q.id !== qId && !nextAnswers[q.id]
    );
    if (nextUnanswered) {
      setFocusedQuestionId(nextUnanswered.id);
    }
  };

  const handleCheckAnswer = () => {
    if (hasSubmitted) return;

    // Check if all questions are answered
    const allAnswered = question.questions.every((q) => selectedAnswers[q.id]);
    if (!allAnswered) return;

    setHasSubmitted(true);

    // Score: all blanks must be answered correctly
    const isAllCorrect = question.questions.every(
      (q) => selectedAnswers[q.id] === q.answer.correctOptionId
    );

    recordAnswer(question.id, isAllCorrect);
    onAnswered(isAllCorrect);
  };

  const handleReset = () => {
    if (hasSubmitted) return;
    setSelectedAnswers({});
    setFocusedQuestionId(question.questions[0]?.id || "");
  };

  const activeQuestion = question.questions.find((q) => q.id === focusedQuestionId) || question.questions[0];
  const allAnswered = question.questions.every((q) => selectedAnswers[q.id]);
  const activeBlankNum = activeQuestion?.blankId.replace(/[^\d]/g, "") || "1";

  // Split passage text by blank tags to render inline buttons
  const passageParts = question.passage.text.split(/(\[blank_\d+\])/g);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header tags */}
      {question.customClassification?.showOnCard && (
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-900/40 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-500/20">
            {question.customClassification.displayLabel}
          </span>
          <span className="px-2 py-0.5 bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 rounded-md text-[10px] font-bold uppercase">
            Điền từ đoạn văn
          </span>
        </div>
      )}

      {/* Instruction */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          Yêu cầu:
        </h3>
        <p className="text-sm sm:text-base text-slate-200 font-medium">
          Đọc đoạn văn dưới đây và điền từ thích hợp vào các ô trống.
        </p>
      </div>

      {/* Passage Display Container */}
      <div className="p-6 bg-slate-950/80 border border-slate-850 rounded-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <h4 className="font-bold text-slate-100 flex items-center gap-2 text-sm sm:text-base">
            <BookOpen className="w-4.5 h-4.5 text-indigo-400" />
            {question.passage.title}
          </h4>
          <button
            onClick={() => speakText(question.passage.text)}
            className="p-2 bg-slate-900 hover:bg-slate-850 text-indigo-400 rounded-lg border border-slate-800 transition active:scale-95 flex-shrink-0"
            title="Đọc đoạn văn"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic passage with inline buttons */}
        <p className="text-sm sm:text-base text-slate-200 leading-loose whitespace-pre-wrap">
          {passageParts.map((part, idx) => {
            const isBlankTag = /\[blank_\d+\]/.test(part);
            if (!isBlankTag) {
              return <span key={idx}>{part}</span>;
            }

            const qItem = question.questions.find((q) => q.blankId === part);
            if (!qItem) return <span key={idx} className="text-slate-500">{part}</span>;

            const blankNum = part.replace(/[^\d]/g, "");
            const isFocused = focusedQuestionId === qItem.id;
            const selectedOpt = selectedAnswers[qItem.id];

            let btnClass = "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200";
            if (isFocused) {
              btnClass = "border-indigo-500 bg-indigo-950/30 text-indigo-300 ring-2 ring-indigo-500/20";
            }

            if (hasSubmitted) {
              const isCorrect = selectedOpt === qItem.answer.correctOptionId;
              btnClass = isCorrect
                ? "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-semibold"
                : "border-rose-500 bg-rose-950/20 text-rose-300 font-semibold";
            }

            return (
              <button
                key={idx}
                disabled={hasSubmitted}
                onClick={() => setFocusedQuestionId(qItem.id)}
                className={cn(
                  "mx-1.5 px-3 py-1 border text-xs sm:text-sm font-bold rounded-lg transition active:scale-95 cursor-pointer font-mono inline-flex items-center justify-center min-w-[50px] shadow-sm",
                  btnClass
                )}
              >
                {blankNum}
                {selectedOpt ? `. ${selectedOpt}` : " ▾"}
              </button>
            );
          })}
        </p>
      </div>

      {/* Answer selection for the focused blank */}
      {activeQuestion && (
        <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Chọn đáp án cho ô trống [{activeBlankNum}]
            </span>
            {hasSubmitted && (
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold",
                selectedAnswers[activeQuestion.id] === activeQuestion.answer.correctOptionId
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-900/50"
                  : "bg-rose-950 text-rose-400 border border-rose-900/50"
              )}>
                {selectedAnswers[activeQuestion.id] === activeQuestion.answer.correctOptionId ? "Đúng" : "Sai"}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    "w-full py-3 px-4 border text-left text-xs sm:text-sm font-medium rounded-xl transition duration-150 flex items-center justify-between active:scale-[0.99] cursor-pointer",
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
        </div>
      )}

      {/* Submit / Reset Controls */}
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

      {/* Explanations drawer */}
      {hasSubmitted && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-2xl p-5 flex flex-col gap-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-indigo-900/30">
              <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                GIẢI THÍCH CHI TIẾT ĐOẠN VĂN
              </div>
            </div>

            {/* Questions explanations summary */}
            <div className="flex flex-col gap-3">
              {question.questions.map((q) => {
                const blankNum = q.blankId.replace(/[^\d]/g, "");
                const isCorrect = selectedAnswers[q.id] === q.answer.correctOptionId;
                const correctOptText = q.options.find(o => o.id === q.answer.correctOptionId)?.text || "";

                return (
                  <div key={q.id} className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <span className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white",
                          isCorrect ? "bg-emerald-600" : "bg-rose-600"
                        )}>
                          {blankNum}
                        </span>
                        Chỗ trống [{blankNum}] (Đáp án: <strong className="text-emerald-400 font-mono">{q.answer.correctOptionId}</strong>)
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 flex flex-col gap-1.5">
                      <div className="font-semibold text-slate-200">
                        Cụm từ đúng: <span className="text-indigo-300 font-mono">"{correctOptText}"</span>
                      </div>
                      {q.answer.logicVi && (
                        <p className="leading-relaxed">
                          <strong className="text-indigo-400">Lập luận:</strong> {q.answer.logicVi}
                        </p>
                      )}
                      
                      {/* Evidence */}
                      {(q.answer.evidenceBefore || q.answer.evidenceAfter) && (
                        <div className="text-[11px] p-2.5 bg-slate-900/60 rounded border border-slate-850/50 text-slate-400 italic flex flex-col gap-1 leading-relaxed">
                          {q.answer.evidenceBefore && <div>• Trước chỗ trống: "{q.answer.evidenceBefore}"</div>}
                          {q.answer.evidenceAfter && <div>• Sau chỗ trống: "{q.answer.evidenceAfter}"</div>}
                        </div>
                      )}

                      {/* Options explanation */}
                      <div className="flex flex-col gap-1 mt-1 pt-2 border-t border-slate-900">
                        <span className="text-[10px] text-slate-500 font-bold">Giải thích đáp án lựa chọn:</span>
                        <div className="grid grid-cols-1 gap-1">
                          {q.options.map(o => (
                            <div key={o.id} className="text-[11px] flex gap-2">
                              <span className={cn(
                                "font-mono font-bold px-1 rounded h-fit",
                                o.isCorrect ? "text-emerald-400 bg-emerald-950/40" : "text-slate-400 bg-slate-850"
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
                  </div>
                );
              })}
            </div>

            {/* Translation block */}
            {question.passage.translationVi && (
              <div className="mt-2 pt-3 border-t border-indigo-900/20">
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  <Languages className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{showTranslation ? "Ẩn bản dịch toàn văn" : "Hiện bản dịch toàn văn"}</span>
                </button>
                {showTranslation && (
                  <div className="mt-2 p-4 bg-slate-950/60 rounded-xl border border-slate-850 text-xs sm:text-sm text-slate-300 italic whitespace-pre-wrap leading-relaxed">
                    {question.passage.translationVi}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
