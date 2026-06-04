"use client";

import React, { useState, useEffect } from "react";
import { SentenceScrambleQuestion } from "@/lib/practice/types";
import { recordAnswer } from "@/lib/practice/progress";
import { 
  Sparkles, 
  Volume2, 
  Languages, 
  HelpCircle, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SentenceScrambleCardProps {
  question: SentenceScrambleQuestion;
  onAnswered: (isCorrect: boolean) => void;
}

export function SentenceScrambleCard({ question, onAnswered }: SentenceScrambleCardProps) {
  const [slots, setSlots] = useState<(string | null)[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Find index positions of blanks ("____" and "★") in fixedParts
  const blankPositions = question.question.fixedParts
    .map((part, index) => (part === "____" || part === "★" ? index : -1))
    .filter((index) => index !== -1);

  // Find index of the star slot in the blanks array
  const starFixedPartsIdx = question.question.fixedParts.indexOf("★");
  const starBlankIdx = blankPositions.indexOf(starFixedPartsIdx);

  // Initialize slots state on question change
  useEffect(() => {
    setSlots(new Array(blankPositions.length).fill(null));
    setHasSubmitted(false);
    setShowTranslation(false);
  }, [question.id]);

  const speakJapanese = (text: string) => {
    if ("speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      const plainText = text.replace(/<[^>]*>/g, "");
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Add fragment to the first empty slot
  const handleSelectFragment = (fragId: string) => {
    if (hasSubmitted) return;
    const nextSlots = [...slots];
    const firstEmptyIdx = nextSlots.findIndex((s) => s === null);
    if (firstEmptyIdx !== -1) {
      nextSlots[firstEmptyIdx] = fragId;
      setSlots(nextSlots);
    }
  };

  // Remove fragment from a slot to return it to the bank
  const handleRemoveFromSlot = (slotIdx: number) => {
    if (hasSubmitted) return;
    const nextSlots = [...slots];
    nextSlots[slotIdx] = null;
    setSlots(nextSlots);
  };

  const handleCheckAnswer = () => {
    if (hasSubmitted || slots.includes(null)) return;

    setHasSubmitted(true);

    // Verify star fragment correctness
    const placedStarFragId = slots[starBlankIdx];
    const isCorrect = placedStarFragId === question.answer.correctStarFragmentId;

    recordAnswer(question.id, isCorrect);
    onAnswered(isCorrect);

    // Speak the completed sentence automatically
    speakJapanese(question.answer.completedSentence);
  };

  const handleResetSlots = () => {
    if (hasSubmitted) return;
    setSlots(new Array(blankPositions.length).fill(null));
  };

  const allFilled = slots.every((s) => s !== null);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header Tags */}
      {question.customClassification?.showOnCard && (
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-900/40 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-500/20">
            {question.customClassification.displayLabel}
          </span>
          <span className="px-2 py-0.5 bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 rounded-md text-[10px] font-bold uppercase">
            Xếp câu ★
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

      {/* Sentence Slots Display Area */}
      <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-850 flex flex-wrap items-center gap-3 justify-center min-h-[90px] leading-relaxed">
        {question.question.fixedParts.map((part, index) => {
          const isBlank = blankPositions.includes(index);
          if (!isBlank) {
            // Static text part
            return (
              <span key={index} className="text-base sm:text-lg font-bold text-slate-200 py-1">
                {part}
              </span>
            );
          }

          // It's a blank slot
          const blankIdx = blankPositions.indexOf(index);
          const assignedFragId = slots[blankIdx];
          const isStar = index === starFixedPartsIdx;

          if (assignedFragId === null) {
            // Empty placeholder
            return (
              <button
                key={index}
                disabled={hasSubmitted}
                onClick={() => {}}
                className={cn(
                  "h-10 min-w-16 px-3 border-2 border-dashed rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200 select-none",
                  isStar
                    ? "border-indigo-500/50 bg-indigo-950/10 text-indigo-400 ring-1 ring-indigo-500/20"
                    : "border-slate-800 text-slate-600 hover:border-slate-700"
                )}
              >
                {isStar ? "★" : blankIdx + 1}
              </button>
            );
          }

          // Filled slot with fragment capsule
          const fragText = question.question.fragments.find(f => f.id === assignedFragId)?.text || "";
          
          let capsuleBorder = "border-indigo-500 bg-indigo-950/30 text-indigo-300";
          let statusIcon = null;

          if (hasSubmitted) {
            if (isStar) {
              const isCorrectStar = assignedFragId === question.answer.correctStarFragmentId;
              capsuleBorder = isCorrectStar
                ? "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-semibold"
                : "border-rose-500 bg-rose-950/20 text-rose-300 font-semibold";
              statusIcon = isCorrectStar 
                ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1 flex-shrink-0" />
                : <XCircle className="w-3.5 h-3.5 text-rose-400 ml-1 flex-shrink-0" />;
            } else {
              // Check if in correct overall order
              const isCorrectOrder = slots[blankIdx] === question.answer.correctOrder[blankIdx];
              capsuleBorder = isCorrectOrder
                ? "border-emerald-500/40 bg-emerald-950/10 text-emerald-400/90"
                : "border-slate-800 bg-slate-950 text-slate-500 opacity-60";
            }
          }

          return (
            <button
              key={index}
              disabled={hasSubmitted}
              onClick={() => handleRemoveFromSlot(blankIdx)}
              className={cn(
                "h-10 px-4 border rounded-xl flex items-center justify-center font-bold text-sm active:scale-95 transition-all duration-200 cursor-pointer shadow-md",
                capsuleBorder
              )}
              title={hasSubmitted ? undefined : "Click để gỡ bỏ mảnh ghép"}
            >
              <span className="text-[10px] text-slate-500 mr-1.5 font-mono">({assignedFragId})</span>
              <span>{fragText}</span>
              {statusIcon}
            </button>
          );
        })}
      </div>

      {/* Control Buttons (Check & Reset) */}
      {!hasSubmitted && (
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleResetSlots}
            disabled={slots.every(s => s === null)}
            className="px-4 py-2 border border-slate-800 hover:bg-slate-850 bg-slate-950 rounded-xl text-xs font-semibold transition text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Làm lại
          </button>
          <button
            onClick={handleCheckAnswer}
            disabled={!allFilled}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-500 text-xs font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-indigo-500/10"
          >
            Kiểm tra đáp án
          </button>
        </div>
      )}

      {/* Fragment Selection Bank */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-400">Chọn các mảnh ghép từ vựng:</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {question.question.fragments.map((frag) => {
            const isAssigned = slots.includes(frag.id);
            return (
              <button
                key={frag.id}
                disabled={isAssigned || hasSubmitted}
                onClick={() => handleSelectFragment(frag.id)}
                className={cn(
                  "py-3 px-4 border text-center text-sm font-semibold rounded-xl transition duration-150 flex items-center justify-center gap-2",
                  isAssigned
                    ? "bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed select-none opacity-40"
                    : hasSubmitted
                    ? "bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed"
                    : "bg-slate-950 border-slate-800 hover:bg-slate-850 text-slate-200 cursor-pointer active:scale-98"
                )}
              >
                <span className="text-[10px] text-slate-500 font-mono">({frag.id})</span>
                <span>{frag.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Box */}
      {hasSubmitted && (
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
                slots[starBlankIdx] === question.answer.correctStarFragmentId
                  ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/50"
                  : "bg-rose-950/50 text-rose-400 border border-rose-900/50"
              )}>
                {slots[starBlankIdx] === question.answer.correctStarFragmentId ? "Chính xác ★" : "Chưa đúng ★"}
              </span>
            </div>

            {/* Completed Sentence Display */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-indigo-400 font-bold block mb-1">CÂU HOÀN CHỈNH:</span>
                <p className="text-base font-bold text-slate-100">{question.answer.completedSentence}</p>
              </div>
              <button
                onClick={() => speakJapanese(question.answer.completedSentence)}
                className="p-2 bg-slate-900 hover:bg-slate-850 text-indigo-400 rounded-lg border border-slate-800 transition active:scale-95 flex-shrink-0"
              >
                <Volume2 className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Explanations */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold text-slate-200">
                Cấu trúc: <span className="text-indigo-300 font-mono">{question.answer.shortExplanationVi}</span>
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

            {/* Fragment Details */}
            {question.answer.fragmentExplanationsVi && (
              <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-indigo-900/20">
                <span className="text-xs font-semibold text-slate-400">Giải thích từng bộ phận câu:</span>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(question.answer.fragmentExplanationsVi).map(([id, explanation]) => {
                    const text = question.question.fragments.find(f => f.id === id)?.text || "";
                    return (
                      <div key={id} className="text-xs flex gap-2">
                        <span className="font-bold font-mono px-1 rounded h-fit text-indigo-400 bg-indigo-950/40">
                          {id}
                        </span>
                        <span className="text-slate-300">
                          <strong className="text-slate-200">"{text}"</strong>: {explanation}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Translation toggle */}
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
