"use client";

import React, { useState, useEffect, useRef } from "react";
import { ListeningPlayerQuestion } from "@/lib/practice/types";
import { recordAnswer } from "@/lib/practice/progress";
import { 
  Play, 
  Pause, 
  Sparkles, 
  Volume2, 
  Languages, 
  HelpCircle, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { speakJapanese } from "@/lib/tts";

interface ListeningPlayerCardProps {
  question: ListeningPlayerQuestion;
  onAnswered: (isCorrect: boolean) => void;
}

export function ListeningPlayerCard({ question, onAnswered }: ListeningPlayerCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showQuestionTranslation, setShowQuestionTranslation] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Initialize and load new audio when question changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasPlayedOnce(false);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setShowQuestionTranslation(false);
    setShowTranslation(false);

    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [question.id]);

  // Cleanup audio playback on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const getAssetUrl = (src: string) => {
    if (src.startsWith("http") || src.startsWith("/")) return src;
    return `/assets/levels/n4/${src}`;
  };

  // Note: speakJapanese is now imported from "@/lib/tts"

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setHasPlayedOnce(true);
      }).catch(err => {
        console.error("Playback failed: ", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || question.media.audio.durationSec || 0);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const targetTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return;

    setSelectedOptionId(optionId);
    setHasAnswered(true);

    const option = question.options.find(o => o.id === optionId);
    const isCorrect = !!option?.isCorrect;

    recordAnswer(question.id, isCorrect);
    onAnswered(isCorrect);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const isButtonMode = !!question.question.buttonMode;
  const isTextVisible = question.question.textVisibleBeforeAudio || hasPlayedOnce || hasAnswered;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasOptionImages = question.options.some(opt => !!opt.imageSrc);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Hidden HTML5 Audio tag */}
      <audio
        ref={audioRef}
        src={getAssetUrl(question.media.audio.src)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        preload="metadata"
      />

      {/* Header tags */}
      {question.customClassification?.showOnCard && (
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-900/40 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-500/20">
            {question.customClassification.displayLabel}
          </span>
          <span className="px-2 py-0.5 bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 rounded-md text-[10px] font-bold uppercase">
            Nghe hiểu bài nghe
          </span>
        </div>
      )}

      {/* Audio Controller Panel (Premium Dark Theme Styling) */}
      <div className="p-5 bg-slate-950/95 border border-slate-850 rounded-2xl flex flex-col gap-4 shadow-inner">
        <div className="flex items-center gap-4">
          
          {/* Circular Play Button */}
          <button
            onClick={handlePlayPause}
            className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition active:scale-90 flex-shrink-0 cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Time & Name Info */}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Trình phát âm thanh</span>
            <span className="text-xs text-slate-400 font-semibold truncate block mt-0.5">
              {question.media.audio.src.split("/").pop()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(currentTime)}</span>
            <span className="text-slate-600">/</span>
            <span>{formatTime(duration)}</span>
          </div>

        </div>

        {/* Custom Progress Bar Slider */}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progressPercent}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
            style={{
              background: `linear-gradient(to right, rgb(79, 70, 229) 0%, rgb(79, 70, 229) ${progressPercent}%, rgb(30, 41, 59) ${progressPercent}%, rgb(30, 41, 59) 100%)`
            }}
          />
        </div>
      </div>

      {/* Conditional visibility statement */}
      {!isTextVisible ? (
        <div className="p-8 bg-slate-950/40 border border-slate-850 rounded-2xl text-center flex flex-col items-center gap-3">
          <Volume2 className="w-8 h-8 text-indigo-500 animate-pulse" />
          <p className="text-sm font-semibold text-slate-300">Vui lòng nghe file âm thanh để xem câu hỏi và phương án trả lời.</p>
          <p className="text-xs text-slate-500">Mẫu thi phản xạ yêu cầu nghe trực tiếp trước khi hiển thị mặt chữ.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          
          {/* Instruction */}
          <div className="flex flex-col gap-1 px-1">
            <h3 className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              Yêu cầu bài nghe:
            </h3>
            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
              {question.question.instruction}
            </p>
            {showQuestionTranslation && question.question.instructionVi && (
              <p className="text-xs text-slate-400 italic">
                "{question.question.instructionVi}"
              </p>
            )}
          </div>

          {/* Question text / Stem */}
          {!isButtonMode && (question.question.stem || question.question.stemVi) && (
            <div className="flex flex-col gap-1.5 px-4 py-3.5 bg-slate-950/65 border border-slate-850 rounded-2xl">
              {question.question.stem && (
                <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                  {question.question.stem}
                </p>
              )}
              {showQuestionTranslation && question.question.stemVi && (
                <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                  {question.question.stemVi}
                </p>
              )}
            </div>
          )}

          {(question.question.instructionVi || question.question.stemVi) && (
            <button
              onClick={() => setShowQuestionTranslation(!showQuestionTranslation)}
              className="flex w-fit items-center gap-1.5 px-1 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              <Languages className="w-4 h-4 text-indigo-400" />
              <span>{showQuestionTranslation ? "Ẩn dịch tiếng Việt câu hỏi" : "Hiện dịch tiếng Việt câu hỏi"}</span>
            </button>
          )}

          {/* Situation Image */}
          {question.media.image && (
            <div className="w-full flex justify-center py-1">
              <div className="max-w-md w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/60 p-2 shadow-inner">
                <img
                  src={getAssetUrl(question.media.image.src)}
                  alt={question.media.image.alt || "Hình ảnh tình huống"}
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Options Display */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-400 px-1">
              {isButtonMode 
                ? "Lựa chọn phương án trả lời dựa theo thứ tự phát âm trong audio:"
                : "Chọn đáp án đúng dưới đây:"}
            </span>

            {isButtonMode ? (
              /* Button mode for quick response: big circle buttons */
              <div className="flex justify-center gap-6 py-4">
                {question.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrect = opt.isCorrect;

                  let btnStyle = "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200";
                  let statusIcon = null;

                  if (hasAnswered) {
                    if (isCorrect) {
                      btnStyle = "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-bold scale-105 ring-4 ring-emerald-500/10";
                      statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute -top-1.5 -right-1.5" />;
                    } else if (isSelected) {
                      btnStyle = "border-rose-500 bg-rose-950/20 text-rose-300 font-bold scale-105 ring-4 ring-rose-500/10";
                      statusIcon = <XCircle className="w-4 h-4 text-rose-400 absolute -top-1.5 -right-1.5" />;
                    } else {
                      btnStyle = "border-slate-900 bg-slate-950/40 text-slate-600 opacity-40 scale-95";
                    }
                  } else if (isSelected) {
                    btnStyle = "border-indigo-500 bg-indigo-950/20 text-indigo-300 font-bold";
                  }

                  return (
                    <div key={opt.id} className="relative flex flex-col items-center gap-2">
                      <button
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(opt.id)}
                        className={cn(
                          "w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-xl transition-all duration-200 active:scale-90 cursor-pointer shadow-md",
                          btnStyle
                        )}
                      >
                        {opt.id}
                      </button>
                      {statusIcon}
                      
                      {/* Show option text below if answered */}
                      {hasAnswered && opt.textAfterAnswer && (
                        <span className="text-xs font-semibold text-slate-300 bg-slate-950 border border-slate-850 px-2 py-1 rounded-md mt-1 animate-in fade-in duration-200">
                          {opt.textAfterAnswer}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : hasOptionImages ? (
              /* Option images grid layout */
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {question.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrect = opt.isCorrect;

                  let btnStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900";

                  if (hasAnswered) {
                    if (isCorrect) {
                      btnStyle = "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-semibold ring-2 ring-emerald-500/10";
                    } else if (isSelected) {
                      btnStyle = "border-rose-500 bg-rose-950/20 text-rose-300 font-semibold ring-2 ring-rose-500/10";
                    } else {
                      btnStyle = "border-slate-900 bg-slate-950/40 text-slate-500 opacity-40 scale-95";
                    }
                  } else if (isSelected) {
                    btnStyle = "border-indigo-500 bg-indigo-950/20 text-indigo-300 font-semibold scale-[1.02]";
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(opt.id)}
                      className={cn(
                        "p-4 border rounded-2xl flex flex-col items-center gap-3 transition-all duration-150 active:scale-[0.98] cursor-pointer text-center",
                        btnStyle
                      )}
                    >
                      <span className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border self-start",
                        isSelected ? "bg-slate-100 text-slate-950 border-slate-200" : "bg-slate-900 text-slate-500 border-slate-800"
                      )}>
                        {opt.id}
                      </span>
                      {opt.imageSrc && (
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-850 flex items-center justify-center relative">
                          <img
                            src={getAssetUrl(opt.imageSrc)}
                            alt={`Lựa chọn ${opt.id}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                      {(opt.text && opt.text !== opt.id) && (
                        <span className="text-xs font-semibold">{opt.text}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Standard text mode options */
              <div className="flex flex-col gap-2.5">
                {question.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrect = opt.isCorrect;

                  let btnStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900";

                  if (hasAnswered) {
                    if (isCorrect) {
                      btnStyle = "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-semibold";
                    } else if (isSelected) {
                      btnStyle = "border-rose-500 bg-rose-950/20 text-rose-300 font-semibold";
                    } else {
                      btnStyle = "border-slate-900 bg-slate-950/40 text-slate-500 opacity-60";
                    }
                  } else if (isSelected) {
                    btnStyle = "border-indigo-500 bg-indigo-950/20 text-indigo-300 font-semibold";
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(opt.id)}
                      className={cn(
                        "w-full py-3 px-4 border text-left text-xs sm:text-sm font-medium rounded-xl transition duration-150 flex items-center justify-between active:scale-[0.99] cursor-pointer",
                        btnStyle
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border",
                          isSelected ? "bg-slate-100 text-slate-950 border-slate-200" : "bg-slate-900 text-slate-500 border-slate-800"
                        )}>
                          {opt.id}
                        </span>
                        <span>{opt.text || opt.textAfterAnswer}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

          </div>

          {/* Explanation detailed box */}
          {hasAnswered && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-2xl p-5 flex flex-col gap-4 text-xs sm:text-sm">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-indigo-900/30">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-300">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    GIẢI THÍCH CHI TIẾT BÀI NGHE
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold",
                    selectedOptionId === question.answer.correctOptionId
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-900/50"
                      : "bg-rose-950 text-rose-400 border border-rose-900/50"
                  )}>
                    {selectedOptionId === question.answer.correctOptionId ? "Đúng" : "Sai"}
                  </span>
                </div>

                {/* Short explanation */}
                <div className="flex flex-col gap-1.5">
                  <div className="text-sm font-semibold text-slate-200">
                    Chốt ý nghe: <span className="text-indigo-300 font-mono">"{question.answer.shortExplanationVi}"</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {question.answer.fullExplanationVi}
                  </p>
                </div>

                {/* Strategy block */}
                {question.answer.listeningStrategyVi && (
                  <div className="p-3 bg-indigo-900/10 border border-indigo-800/20 rounded-xl flex items-start gap-2 text-xs text-indigo-300">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-400 flex-shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <span className="font-bold">Chiến lược nghe phản xạ: </span>
                      {question.answer.listeningStrategyVi}
                    </div>
                  </div>
                )}

                {/* Trap info */}
                {question.answer.trapVi && (
                  <div className="p-3 bg-amber-950/20 border border-amber-900/30 rounded-xl flex items-start gap-2 text-xs text-amber-300">
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Lưu ý bẫy nghe: </span>
                      {question.answer.trapVi}
                    </div>
                  </div>
                )}

                {/* Transcripts Japanese & translation */}
                {question.answer.transcriptJa && (
                  <div className="mt-2 pt-3 border-t border-indigo-900/20 flex flex-col gap-3">
                    
                    {/* Transcript title with speak button */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                        Nội dung Transcript hội thoại:
                      </span>
                      <button
                        onClick={() => speakJapanese(question.answer.transcriptJa || "")}
                        className="p-1.5 bg-slate-950 hover:bg-slate-850 text-indigo-400 rounded-lg border border-slate-850 transition active:scale-95 flex-shrink-0"
                        title="Đọc transcript"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Japanese lines */}
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850/80 leading-relaxed font-sans text-slate-200">
                      {question.answer.transcriptJa.split("\n").map((line, idx) => {
                        // Check if line needs to be highlighted
                        const isHighlighted = question.answer.highlightTranscript?.some(h => line.includes(h));
                        return (
                          <div 
                            key={idx} 
                            className={cn(
                              "py-0.5",
                              isHighlighted && "bg-indigo-950/50 border-l-2 border-indigo-500 pl-2 text-indigo-300 font-semibold"
                            )}
                          >
                            {line}
                          </div>
                        );
                      })}
                    </div>

                    {/* Vietnamese Translation Toggle */}
                    {question.answer.translationVi && (
                      <div>
                        <button
                          onClick={() => setShowTranslation(!showTranslation)}
                          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
                        >
                          <Languages className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{showTranslation ? "Ẩn bản dịch nghĩa transcript" : "Xem bản dịch nghĩa transcript"}</span>
                        </button>
                        {showTranslation && (
                          <div className="mt-2 p-3.5 bg-slate-950/60 rounded-xl border border-slate-850/50 text-xs text-slate-350 italic whitespace-pre-wrap leading-relaxed">
                            {question.answer.translationVi}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}

                {/* Option descriptions */}
                <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-indigo-900/20">
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
                          <strong>{o.text || o.textAfterAnswer}</strong>: {o.explanationVi}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
