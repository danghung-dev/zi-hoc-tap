"use client";

import React, { useState, useEffect } from "react";
import { StandardQuizQuestion } from "@/lib/practice/types";
import { recordAnswer } from "@/lib/practice/progress";
import { 
  Sparkles, 
  Volume2, 
  Languages, 
  HelpCircle, 
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { speakJapanese } from "@/lib/tts";

interface StandardQuizCardProps {
  question: StandardQuizQuestion;
  onAnswered: (isCorrect: boolean) => void;
}

export function StandardQuizCard({ question, onAnswered }: StandardQuizCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Reset local state when the question changes
  useEffect(() => {
    setSelectedOptionId(null);
    setHasAnswered(false);
    setShowTranslation(false);
  }, [question.id]);

  // Note: speakJapanese is now imported from "@/lib/tts"

  const handleSelect = (optionId: string) => {
    if (hasAnswered) return;

    setSelectedOptionId(optionId);
    setHasAnswered(true);

    const isCorrect = optionId === question.answer.correctOptionId;
    recordAnswer(question.id, isCorrect);
    onAnswered(isCorrect);

    // Speak stem automatically upon answering to reinforce listening/reading
    speakJapanese(question.question.stem);
  };

  const showOnCard = question.customClassification?.showOnCard;
  const displayLabel = question.customClassification?.displayLabel;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header tags / badge */}
      {showOnCard && displayLabel && (
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-900/40 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-500/20">
            {displayLabel}
          </span>
          <span className={cn(
            "px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase",
            question.difficulty === 1 ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20" :
            question.difficulty === 2 ? "bg-amber-950/40 text-amber-400 border border-amber-500/20" :
            "bg-rose-950/40 text-rose-400 border border-rose-500/20"
          )}>
            {question.difficulty === 1 ? "Dễ" : question.difficulty === 2 ? "Trung bình" : "Khó"}
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
          {question.question.instruction}
        </p>
      </div>

      {/* Stem/Question body */}
      <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-850 flex items-center justify-between gap-4">
        <div 
          className="text-base sm:text-lg font-semibold tracking-wide text-slate-100 flex-1 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: question.question.stem }}
        />
        <button
          onClick={() => speakJapanese(question.question.stem)}
          className="p-2.5 bg-slate-900 hover:bg-slate-850 text-indigo-400 hover:text-indigo-300 rounded-xl transition border border-slate-800 active:scale-95 flex-shrink-0"
          title="Phát âm tiếng Nhật"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Options List */}
      <div className="flex flex-col gap-2.5">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrectAnswer = option.isCorrect;
          
          let btnClass = "bg-slate-950 hover:bg-slate-850/80 border-slate-800 text-slate-300";
          let icon = null;

          if (hasAnswered) {
            if (isCorrectAnswer) {
              btnClass = "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-semibold";
              icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />;
            } else if (isSelected) {
              btnClass = "border-rose-500 bg-rose-950/20 text-rose-300 font-semibold";
              icon = <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />;
            } else {
              btnClass = "border-slate-900 bg-slate-950/40 text-slate-500 opacity-60";
            }
          }

          return (
            <button
              key={option.id}
              disabled={hasAnswered}
              onClick={() => handleSelect(option.id)}
              className={cn(
                "w-full py-3 px-4 border text-left text-sm sm:text-base font-medium rounded-xl transition-all duration-200 flex items-center justify-between active:scale-[0.99] cursor-pointer",
                btnClass
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold border",
                  isSelected ? "bg-slate-100 text-slate-950 border-slate-200" : "bg-slate-900 text-slate-400 border-slate-800"
                )}>
                  {option.id}
                </span>
                <span>{option.text}</span>
              </div>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {hasAnswered && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-2xl p-5 flex flex-col gap-4">
            
            {/* Title / Summary */}
            <div className="flex items-center justify-between pb-3 border-b border-indigo-900/30">
              <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                GIẢI THÍCH CHI TIẾT
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold",
                selectedOptionId === question.answer.correctOptionId
                  ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/50"
                  : "bg-rose-950/50 text-rose-400 border border-rose-900/50"
              )}>
                {selectedOptionId === question.answer.correctOptionId ? "Chính xác" : "Chưa đúng"}
              </span>
            </div>

            {/* Short & Full Explanation */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold text-slate-200">
                Ý chính: <span className="text-indigo-300 font-mono">{question.answer.shortExplanationVi}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {question.answer.fullExplanationVi}
              </p>
            </div>

            {/* Trap Info */}
            {question.answer.trapVi && (
              <div className="p-3 bg-amber-950/20 border border-amber-900/30 rounded-xl flex items-start gap-2 text-xs text-amber-300">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Lưu ý bẫy: </span>
                  {question.answer.trapVi}
                </div>
              </div>
            )}

            {/* Option Explanations */}
            <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-indigo-900/20">
              <span className="text-xs font-semibold text-slate-400">Giải thích từng đáp án:</span>
              <div className="grid grid-cols-1 gap-1.5">
                {question.options.map((opt) => (
                  <div key={opt.id} className="text-xs flex gap-2">
                    <span className={cn(
                      "font-bold font-mono px-1 rounded h-fit",
                      opt.isCorrect 
                        ? "text-emerald-400 bg-emerald-950/30" 
                        : "text-slate-400 bg-slate-800"
                    )}>
                      {opt.id}
                    </span>
                    <span className="text-slate-300">
                      <strong className="text-slate-200">{opt.text}</strong>: {opt.explanationVi}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Translation Box */}
            {question.answer.translationVi && (
              <div className="mt-2 pt-3 border-t border-indigo-900/20">
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  <Languages className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{showTranslation ? "Ẩn dịch nghĩa tiếng Việt" : "Hiện dịch nghĩa tiếng Việt"}</span>
                </button>
                {showTranslation && (
                  <div className="mt-2 p-3 bg-slate-950/60 rounded-xl border border-slate-850 text-xs sm:text-sm text-slate-300 italic animate-in fade-in duration-200">
                    "{question.answer.translationVi}"
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
