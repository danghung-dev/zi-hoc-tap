"use client";

import React, { useState, useEffect } from "react";
import { DocumentScanQuestion } from "@/lib/practice/types";
import { recordAnswer } from "@/lib/practice/progress";
import { 
  Sparkles, 
  Volume2, 
  Languages, 
  HelpCircle, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  CheckSquare,
  Square
} from "lucide-react";
import { cn } from "@/lib/utils";
import { speakJapanese } from "@/lib/tts";

interface DocumentScanCardProps {
  question: DocumentScanQuestion;
  onAnswered: (isCorrect: boolean) => void;
}

export function DocumentScanCard({ question, onAnswered }: DocumentScanCardProps) {
  const [checkedConditions, setCheckedConditions] = useState<Record<string, boolean>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showQuestionTranslation, setShowQuestionTranslation] = useState(false);

  // Reset states on question change
  useEffect(() => {
    setCheckedConditions({});
    setSelectedOptionId(null);
    setHasAnswered(false);
    setShowQuestionTranslation(false);
  }, [question.id]);

  // Note: speakJapanese is now imported from "@/lib/tts"

  const handleToggleCondition = (condId: string) => {
    if (hasAnswered) return;
    setCheckedConditions((prev) => ({
      ...prev,
      [condId]: !prev[condId],
    }));
  };

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return;

    setSelectedOptionId(optionId);
    setHasAnswered(true);

    const isCorrect = optionId === question.answer.correctOptionId;
    recordAnswer(question.id, isCorrect);
    onAnswered(isCorrect);

    // Speak question stem
    speakJapanese(question.question.text);
  };

  const getAssetUrl = (src: string) => {
    if (src.startsWith("http") || src.startsWith("/")) return src;
    return `/assets/levels/n4/${src}`;
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
            Tìm kiếm thông tin
          </span>
        </div>
      )}

      {/* Stacked Layout */}
      <div className="flex flex-col gap-6">
        
        {/* Top Panel: Document Panel (Full Width) */}
        <div className="w-full bg-slate-950/60 border border-slate-850 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h4 className="font-bold text-slate-100 flex items-center gap-2 text-sm sm:text-base">
              <FileText className="w-4.5 h-4.5 text-indigo-400" />
              {question.document.title}
            </h4>
            <button
              onClick={() => speakJapanese(question.document.text)}
              className="p-2.5 bg-slate-900 hover:bg-slate-850 text-indigo-400 rounded-xl border border-slate-800 transition active:scale-95 flex-shrink-0"
              title="Đọc tài liệu"
            >
              <Volume2 className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Optional Document image scan */}
          {question.document.image && (
            <div className="w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900/80 mb-2">
              <img
                src={getAssetUrl(question.document.image.src)}
                alt={question.document.image.alt}
                className="w-full object-cover max-h-[220px]"
              />
            </div>
          )}

          <p className="text-sm sm:text-base text-slate-200 leading-loose whitespace-pre-wrap font-sans">
            {question.document.text}
          </p>
        </div>

        {/* Bottom Panel: Checklist and Questions Panel (Full Width) */}
        <div className="w-full flex flex-col gap-4">
          
          {/* Conditions check list */}
          {question.question.conditions && question.question.conditions.length > 0 && (
            <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 flex flex-col gap-3">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 border-b border-slate-900 pb-2">
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                Bộ lọc tiêu chí cần tra cứu:
              </span>
              <div className="flex flex-col gap-2">
                {question.question.conditions.map((cond) => {
                  const isChecked = !!checkedConditions[cond.id];
                  return (
                    <button
                      key={cond.id}
                      disabled={hasAnswered}
                      onClick={() => handleToggleCondition(cond.id)}
                      className={cn(
                        "w-full p-2.5 rounded-xl border text-left text-xs font-medium transition-all duration-150 flex items-start gap-2.5 cursor-pointer active:scale-[0.99]",
                        isChecked
                          ? "bg-indigo-950/30 border-indigo-500/40 text-slate-200"
                          : "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800"
                      )}
                    >
                      <span className="mt-0.5 flex-shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </span>
                      <div className="flex-1">
                        <span className={cn(isChecked && "line-through text-slate-500")}>
                          {cond.labelVi}
                        </span>
                        {cond.keywordJa && (
                          <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                            Từ khóa Nhật: {cond.keywordJa}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question Stem Card */}
          <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                {question.question.text}
              </div>
              <button
                onClick={() => speakJapanese(question.question.text)}
                className="p-2 bg-slate-900 hover:bg-slate-850 text-indigo-400 rounded-lg border border-slate-800 transition active:scale-95 flex-shrink-0"
                title="Đọc câu hỏi"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Translation of question */}
            {question.question.translationVi && (
              <div>
                <button
                  onClick={() => setShowQuestionTranslation(!showQuestionTranslation)}
                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-355 transition cursor-pointer"
                >
                  <Languages className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{showQuestionTranslation ? "Ẩn dịch nghĩa câu hỏi" : "Dịch nghĩa câu hỏi"}</span>
                </button>
                {showQuestionTranslation && (
                  <p className="mt-1 text-xs text-slate-400 italic">
                    "{question.question.translationVi}"
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="flex flex-col gap-2.5">
            {question.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrectAnswer = opt.isCorrect;

              let btnClass = "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900";
              
              if (hasAnswered) {
                if (isCorrectAnswer) {
                  btnClass = "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-semibold";
                } else if (isSelected) {
                  btnClass = "border-rose-500 bg-rose-950/20 text-rose-300 font-semibold";
                } else {
                  btnClass = "border-slate-900 bg-slate-950/40 text-slate-500 opacity-60";
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(opt.id)}
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

          {/* Detailed explanation box */}
          {hasAnswered && (
            <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-2xl p-5 flex flex-col gap-3 animate-in fade-in duration-200 text-xs sm:text-sm">
              <div className="flex items-center justify-between border-b border-indigo-900/30 pb-2">
                <span className="text-indigo-300 font-bold flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                  Đối chiếu đáp án chi tiết
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold",
                  selectedOptionId === question.answer.correctOptionId
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-900/50"
                    : "bg-rose-950 text-rose-400 border border-rose-900/50"
                )}>
                  {selectedOptionId === question.answer.correctOptionId ? "Đúng" : "Chưa đúng"}
                </span>
              </div>
              
              {question.answer.evidenceTexts && question.answer.evidenceTexts.length > 0 && (
                <div className="flex flex-col gap-1.5 text-slate-300">
                  <strong className="text-indigo-400">Thông tin dẫn chứng trong tài liệu:</strong>
                  <ul className="list-disc pl-4 grid grid-cols-1 gap-1">
                    {question.answer.evidenceTexts.map((ev, i) => (
                      <li key={i} className="leading-relaxed">"{ev}"</li>
                    ))}
                  </ul>
                </div>
              )}

              {question.answer.logicVi && (
                <p className="text-slate-300">
                  <strong className="text-indigo-400">Lập luận đối chiếu:</strong> {question.answer.logicVi}
                </p>
              )}

              <div className="flex flex-col gap-1.5 mt-1 pt-2.5 border-t border-slate-900">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Giải thích chi tiết các đáp án:</span>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  {question.options.map((o) => (
                    <div key={o.id} className="flex gap-2">
                      <span className={cn(
                        "font-mono font-bold px-1.5 rounded h-fit text-[11px]",
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
          )}

        </div>

      </div>

    </div>
  );
}
