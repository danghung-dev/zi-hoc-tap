"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Swords,
  Layers,
  HelpCircle,
  Volume2,
  AlertTriangle,
  X,
  Check,
  BarChart2,
  Trash2,
  BookOpenCheck,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";

// Import data
import { setNames, flashcards, KanjiCard } from "@/data/kanji";
import { grammarGroups, grammarQuestions, GrammarQuestion } from "@/data/grammar";
import { speakJapanese } from "@/lib/tts";

export default function Page() {
  // Navigation
  const [selectedTab, setSelectedTab] = useState<"kanji" | "grammar">("kanji");

  // Custom Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Thông báo");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"info" | "warning" | "success">("info");

  // Kanji States
  const [selectedSetIds, setSelectedSetIds] = useState<Set<number>>(new Set());
  const [activeDeck, setActiveDeck] = useState<KanjiCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mistakeStats, setMistakeStats] = useState<Record<string, { wrong: number; correct: number }>>({});

  // Grammar States
  const [currentGrammarGroupId, setCurrentGrammarGroupId] = useState<number | "all">("all");
  const [activeGrammarQuestions, setActiveGrammarQuestions] = useState<GrammarQuestion[]>([]);
  const [currentGrammarIndex, setCurrentGrammarIndex] = useState(0);
  const [grammarMistakeStats, setGrammarMistakeStats] = useState<Record<number, number>>({});
  const [hasAnsweredCurrentGrammar, setHasAnsweredCurrentGrammar] = useState(false);
  const [grammarRunStats, setGrammarRunStats] = useState({ total: 0, correct: 0 });
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  // References for scrolling
  const cheatSheetPanelRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    // 1. Initial selection is all 40 sets
    const initialSets = new Set<number>();
    for (let i = 1; i <= 40; i++) {
      initialSets.add(i);
    }
    setSelectedSetIds(initialSets);

    // 2. Load Local Storage
    const savedKanjiMistakes = localStorage.getItem("n4_kanji_mistakes_stats");
    if (savedKanjiMistakes) {
      try {
        setMistakeStats(JSON.parse(savedKanjiMistakes));
      } catch (e) {
        setMistakeStats({});
      }
    }

    const savedGrammarMistakes = localStorage.getItem("n4_grammar_mistakes_stats");
    if (savedGrammarMistakes) {
      try {
        setGrammarMistakeStats(JSON.parse(savedGrammarMistakes));
      } catch (e) {
        setGrammarMistakeStats({});
      }
    }

    const savedGrammarRunStats = localStorage.getItem("n4_grammar_run_stats");
    if (savedGrammarRunStats) {
      try {
        setGrammarRunStats(JSON.parse(savedGrammarRunStats));
      } catch (e) {
        setGrammarRunStats({ total: 0, correct: 0 });
      }
    }

    // 3. Load Active Deck based on the initial sets selection
    const initialDeck = flashcards.filter((card) => initialSets.has(card.setId));
    setActiveDeck(initialDeck);
  }, []);

  // Sync active deck whenever selectedSetIds changes
  const updateActiveDeck = (sets: Set<number>) => {
    const deck = flashcards.filter((card) => sets.has(card.setId));
    setActiveDeck(deck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    return deck;
  };

  // Keyboard controls for Kanji Tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedTab !== "kanji" || activeDeck.length === 0) return;
      if (e.code === "Space") {
        e.preventDefault();
        flipCard();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handleAnswer(false);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleAnswer(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTab, activeDeck, currentCardIndex, isFlipped, mistakeStats]);

  // Initial load for Grammar Questions when switching tab or group ID
  useEffect(() => {
    let questions = [];
    if (currentGrammarGroupId === "all") {
      questions = [...grammarQuestions];
    } else {
      questions = grammarQuestions.filter((q) => q.groupId === currentGrammarGroupId);
    }
    // Shuffle
    questions.sort(() => Math.random() - 0.5);
    setActiveGrammarQuestions(questions);
    setCurrentGrammarIndex(0);
    setHasAnsweredCurrentGrammar(false);
    setSelectedOptionIdx(null);
    setShowTranslation(false);
  }, [currentGrammarGroupId]);

  // Show Modal Helper
  const showModal = (title: string, msg: string, type: "info" | "warning" | "success" = "info") => {
    setModalTitle(title);
    setModalMessage(msg);
    setModalType(type);
    setModalOpen(true);
  };

  // --- TTS Pronunciation ---
  // Note: speakJapanese is now imported from "@/lib/tts"

  // --- Kanji logic ---
  const handleCheckboxChange = (id: number, checked: boolean) => {
    const newSets = new Set(selectedSetIds);
    if (checked) {
      newSets.add(id);
    } else {
      newSets.delete(id);
    }
    setSelectedSetIds(newSets);
  };

  const handleSelectAll = () => {
    const newSets = new Set<number>();
    for (let i = 1; i <= 40; i++) {
      newSets.add(i);
    }
    setSelectedSetIds(newSets);
  };

  const handleDeselectAll = () => {
    setSelectedSetIds(new Set());
  };

  const handleStartLearning = () => {
    let setsToUse = selectedSetIds;
    if (setsToUse.size === 0) {
      // Auto select all if none is selected
      const allSets = new Set<number>();
      for (let i = 1; i <= 40; i++) {
        allSets.add(i);
      }
      setSelectedSetIds(allSets);
      setsToUse = allSets;
    }
    const deck = updateActiveDeck(setsToUse);
    if (deck.length === 0) {
      showModal("Cảnh báo", "Vui lòng chọn ít nhất một bộ Kanji để học!", "warning");
      return;
    }
    showModal("Bắt đầu học", `Đã tải ${deck.length} thẻ Kanji.`, "success");
  };

  const handleShuffleDeck = () => {
    if (activeDeck.length <= 1) return;
    const shuffled = [...activeDeck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setActiveDeck(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    showModal("Trộn thành công", "Các thẻ trong bộ được chọn đã được tráo đổi ngẫu nhiên!", "success");
  };

  const flipCard = () => {
    if (activeDeck.length === 0) return;
    const nextFlippedState = !isFlipped;
    setIsFlipped(nextFlippedState);
    if (nextFlippedState) {
      speakJapanese(activeDeck[currentCardIndex].hiragana);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (activeDeck.length === 0) return;
    const card = activeDeck[currentCardIndex];

    const currentStats = { ...mistakeStats };
    if (!currentStats[card.id]) {
      currentStats[card.id] = { wrong: 0, correct: 0 };
    }

    if (isCorrect) {
      currentStats[card.id].correct += 1;
    } else {
      currentStats[card.id].wrong += 1;
    }

    setMistakeStats(currentStats);
    localStorage.setItem("n4_kanji_mistakes_stats", JSON.stringify(currentStats));

    if (currentCardIndex < activeDeck.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      showModal(
        "Hoàn thành!",
        `Đã học hết ${activeDeck.length} từ. Xem kết quả sai bên dưới để ôn tập tốt hơn!`,
        "success"
      );
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  const clearKanjiMistakes = () => {
    const check = confirm("Xóa toàn bộ lịch sử trả lời sai Kanji?");
    if (check) {
      setMistakeStats({});
      localStorage.removeItem("n4_kanji_mistakes_stats");
      showModal("Đã xóa sạch", "Mọi lịch sử lỗi sai Kanji đã được làm mới!", "success");
    }
  };

  const studyMistakesOnly = () => {
    const wrongIds = Object.keys(mistakeStats).filter((id) => mistakeStats[id].wrong > 0);
    if (wrongIds.length === 0) {
      showModal("Thông báo", "Bạn chưa có lỗi sai nào. Hãy tiếp tục phát huy!", "info");
      return;
    }
    const filteredDeck = flashcards.filter((card) => wrongIds.includes(card.id));
    filteredDeck.sort((a, b) => (mistakeStats[b.id]?.wrong || 0) - (mistakeStats[a.id]?.wrong || 0));

    setActiveDeck(filteredDeck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    showModal("Ôn tập lỗi sai", `Đã tạo bộ ${filteredDeck.length} thẻ Kanji hay sai.`, "success");
  };

  // Get mistake stats array sorted by wrong count descending
  const getSortedMistakes = () => {
    const list: (KanjiCard & { wrongCount: number })[] = [];
    Object.keys(mistakeStats).forEach((id) => {
      const stat = mistakeStats[id];
      if (stat.wrong > 0) {
        const card = flashcards.find((c) => c.id === id);
        if (card) {
          list.push({ ...card, wrongCount: stat.wrong });
        }
      }
    });
    return list.sort((a, b) => b.wrongCount - a.wrongCount);
  };

  const globalCorrectCount = Object.values(mistakeStats).reduce((sum, s) => sum + s.correct, 0);
  const globalWrongCount = Object.values(mistakeStats).reduce((sum, s) => sum + s.wrong, 0);
  const globalTotalUnique = Object.values(mistakeStats).filter((s) => s.correct > 0 || s.wrong > 0).length;

  // --- Grammar logic ---
  const handleGrammarAnswer = (selectedIdx: number) => {
    if (hasAnsweredCurrentGrammar || activeGrammarQuestions.length === 0) return;

    setHasAnsweredCurrentGrammar(true);
    setSelectedOptionIdx(selectedIdx);

    const q = activeGrammarQuestions[currentGrammarIndex];
    const newRunStats = { ...grammarRunStats };
    newRunStats.total += 1;

    const newMistakes = { ...grammarMistakeStats };
    if (!newMistakes[q.groupId]) {
      newMistakes[q.groupId] = 0;
    }

    if (selectedIdx === q.answer) {
      newRunStats.correct += 1;
    } else {
      newMistakes[q.groupId] += 1;
      setGrammarMistakeStats(newMistakes);
      localStorage.setItem("n4_grammar_mistakes_stats", JSON.stringify(newMistakes));
    }

    setGrammarRunStats(newRunStats);
    localStorage.setItem("n4_grammar_run_stats", JSON.stringify(newRunStats));
  };

  const handleGrammarNext = () => {
    if (activeGrammarQuestions.length === 0) return;
    if (!hasAnsweredCurrentGrammar) {
      const skip = confirm("Bạn chưa trả lời câu hỏi này. Bạn có muốn bỏ qua không?");
      if (!skip) return;
    }

    if (currentGrammarIndex < activeGrammarQuestions.length - 1) {
      setCurrentGrammarIndex(currentGrammarIndex + 1);
      setHasAnsweredCurrentGrammar(false);
      setSelectedOptionIdx(null);
      setShowTranslation(false);
    } else {
      showModal(
        "Đã hoàn thành lượt!",
        "Chúc mừng bạn đã hoàn thành bộ câu hỏi hiện tại. Tiếp tục rèn luyện để vững bước đi thi nhé!",
        "success"
      );
      setCurrentGrammarIndex(0);
      setHasAnsweredCurrentGrammar(false);
      setSelectedOptionIdx(null);
      setShowTranslation(false);
    }
  };

  const targetTrain = (groupId: number) => {
    setCurrentGrammarGroupId(groupId);
    // Smooth scroll to the cheat sheet / quiz panel
    if (cheatSheetPanelRef.current) {
      cheatSheetPanelRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get Weakness Leaderboard (Top 3 grammar mistakes)
  const getWeaknessLeaderboard = () => {
    const list: { id: number; name: string; wrong: number }[] = [];
    Object.keys(grammarMistakeStats).forEach((groupIdStr) => {
      const gid = parseInt(groupIdStr);
      const wrong = grammarMistakeStats[gid];
      if (wrong > 0) {
        const group = grammarGroups.find((g) => g.id === gid);
        if (group) {
          list.push({ id: gid, name: group.name, wrong });
        }
      }
    });
    return list.sort((a, b) => b.wrong - a.wrong);
  };

  const weaknesses = getWeaknessLeaderboard();
  const weakestGroupName = weaknesses.length > 0 ? weaknesses[0].name : "Chưa có dữ liệu";
  const grammarAccuracy =
    grammarRunStats.total > 0 ? Math.round((grammarRunStats.correct / grammarRunStats.total) * 100) : 0;

  // Selected Group helper
  const selectedGroup = grammarGroups.find(
    (g) => g.id === (currentGrammarGroupId === "all" ? 1 : currentGrammarGroupId)
  );

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                日本語 N4 総合学習
              </h1>
              <p className="text-xs text-slate-400">Học Kanji & Grammar Arena N4: 170 câu bài tập</p>
            </div>
          </div>

          {/* Main Tabs Navigation */}
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setSelectedTab("kanji")}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                  selectedTab === "kanji"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                漢字 / Kanji Flashcard
              </button>
              <button
                onClick={() => {
                  setSelectedTab("grammar");
                  // On initial load, load the first cheat sheet
                  if (currentGrammarGroupId === "all") {
                    setCurrentGrammarGroupId(1);
                  }
                }}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                  selectedTab === "grammar"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Swords className="w-4 h-4" />
                文法 / Ngữ Pháp Arena
              </button>
            </div>
            
            <Link
              href="/practice"
              className="px-4 py-2 text-xs sm:text-sm font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpenCheck className="w-4 h-4" />
              Luyện Tập Mode
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== TAB 1: KANJI FLASHCARDS CONTAINER ==================== */}
      {selectedTab === "kanji" && (
        <div className="contents">
          {/* Overall Stats Kanji */}
          <div className="max-w-6xl mx-auto w-full px-4 pt-4">
            <div className="flex items-center justify-end gap-4 text-xs bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-800/80 w-fit ml-auto">
              <span className="text-slate-400 font-medium">Tiến trình Kanji:</span>
              <div className="flex items-center gap-1">
                <span className="text-emerald-400 font-semibold">{globalCorrectCount}</span>
                <span className="text-slate-500">Đúng</span>
              </div>
              <div className="h-4 w-px bg-slate-800"></div>
              <div className="flex items-center gap-1">
                <span className="text-rose-400 font-semibold">{globalWrongCount}</span>
                <span className="text-slate-500">Sai</span>
              </div>
              <div className="h-4 w-px bg-slate-800"></div>
              <div className="flex items-center gap-1">
                <span className="text-indigo-400 font-semibold">{globalTotalUnique}</span>
                <span className="text-slate-500">/ {flashcards.length} Đã học</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-end gap-2 text-[11px]">
              <span className="bg-emerald-950/70 text-emerald-300 border border-emerald-800/70 px-2.5 py-1 rounded-full font-semibold">
                Flashcard: 481 từ / 40 bộ
              </span>
              <span className="bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-full font-mono">
                Markdown rows: 481 · Exact duplicates removed: 0
              </span>
            </div>
          </div>

          <main className="flex-1 max-w-6xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Side Control Panel */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* Set Selector */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold flex items-center gap-2 text-slate-200">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    学習範囲 / Chọn Bộ Kanji
                  </h2>
                  <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-400 font-mono">
                    {selectedSetIds.size}/40
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="flex-1 py-1.5 bg-slate-850 hover:bg-slate-800 text-xs font-medium rounded-lg transition border border-slate-800"
                  >
                    Chọn tất cả
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    className="flex-1 py-1.5 bg-slate-850 hover:bg-slate-800 text-xs font-medium rounded-lg transition border border-slate-800"
                  >
                    Bỏ chọn hết
                  </button>
                </div>

                {/* List of sets */}
                <div className="max-h-[250px] overflow-y-auto pr-1 flex flex-col gap-1 border border-slate-800 rounded-xl p-2 bg-slate-950/50">
                  {Object.keys(setNames).map((idStr) => {
                    const id = parseInt(idStr);
                    const name = setNames[id];
                    const count = flashcards.filter((c) => c.setId === id).length;
                    const isChecked = selectedSetIds.has(id);
                    return (
                      <label
                        key={id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 cursor-pointer text-xs transition border border-transparent hover:border-slate-700/50"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleCheckboxChange(id, e.target.checked)}
                            className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                          />
                          <span className="text-slate-300 font-medium">{name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{count} từ</span>
                      </label>
                    );
                  })}
                </div>

                {/* Study Mode Operations */}
                <div className="pt-3 border-t border-slate-850 flex flex-col gap-2">
                  <button
                    onClick={handleStartLearning}
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 transition transform active:scale-[0.98]"
                  >
                    <PlayIcon className="w-5 h-5 fill-current" />
                    <span>学習を開始 / Bắt đầu học</span>
                  </button>
                  <button
                    onClick={handleShuffleDeck}
                    className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium rounded-xl flex items-center justify-center gap-2 transition border border-slate-700/50"
                  >
                    <ShuffleIcon className="w-4 h-4" />
                    <span>シャッフル / Trộn thẻ</span>
                  </button>
                </div>
              </div>

              {/* Operations Guide */}
              <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/60 text-xs text-slate-400">
                <h3 className="font-semibold text-slate-300 mb-2 flex items-center gap-1">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  操作ガイド / Hướng dẫn nhanh
                </h3>
                <ul className="space-y-1.5 list-disc pl-4">
                  <li>
                    Lật thẻ bằng cách Click vào thẻ hoặc phím{" "}
                    <kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono">Space</kbd>.
                  </li>
                  <li>
                    Đánh dấu <span className="text-rose-400 font-medium">Sai</span> bằng phím{" "}
                    <kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono">←</kbd>.
                  </li>
                  <li>
                    Đánh dấu <span className="text-emerald-400 font-medium">Đúng</span> bằng phím{" "}
                    <kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono">→</kbd>.
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side Flashcards & Mistakes Report */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Main Study Screen */}
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col items-center gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Deck Progress */}
                <div className="w-full flex items-center justify-between text-xs text-slate-400 z-10">
                  <span className="bg-indigo-950/80 text-indigo-400 px-2.5 py-1 rounded-full font-semibold border border-indigo-900/50">
                    {activeDeck.length > 0 ? activeDeck[currentCardIndex].setName : "Không có thẻ nào được tải"}
                  </span>
                  <div className="font-mono text-slate-300">
                    {activeDeck.length > 0 ? `${currentCardIndex + 1} / ${activeDeck.length}` : "0 / 0"}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden z-10">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                    style={{
                      width: activeDeck.length > 0 ? `${((currentCardIndex + 1) / activeDeck.length) * 100}%` : "0%",
                    }}
                  ></div>
                </div>

                {/* 3D Flashcard */}
                <div
                  onClick={flipCard}
                  className="w-full max-w-md h-72 card-perspective cursor-pointer z-10"
                >
                  <div className={`w-full h-full card-inner relative shadow-2xl rounded-2xl ${isFlipped ? "flipped" : ""}`}>
                    {/* Front side (Kanji) */}
                    <div className="card-front bg-slate-800 border border-slate-700/85 rounded-2xl flex flex-col items-center justify-between p-6">
                      <div className="w-full flex justify-end">
                        <span className="text-xs text-indigo-400 uppercase tracking-widest font-bold font-mono">Kanji</span>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-3">
                        <span className="text-6xl font-bold tracking-wider text-slate-100 font-sans">
                          {activeDeck.length > 0 ? activeDeck[currentCardIndex].kanji : "--"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Rotate3dIcon className="w-4 h-4 text-indigo-500 animate-pulse" />
                        <span>Nhấp để xem Hiragana & Nghĩa</span>
                      </div>
                    </div>

                    {/* Back side (Hiragana & Meaning) */}
                    <div className="card-back bg-slate-800 border-2 border-indigo-500/40 rounded-2xl flex flex-col items-center justify-between p-6">
                      <div className="w-full flex justify-between items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeDeck.length > 0) speakJapanese(activeDeck[currentCardIndex].hiragana);
                          }}
                          className="p-1.5 hover:bg-slate-700 rounded-lg text-indigo-400 transition"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                        <span className="text-xs text-emerald-400 uppercase tracking-widest font-bold font-mono">Answer</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center gap-2.5 my-auto w-full px-4">
                        <span className="text-2xl font-bold text-indigo-300 font-sans">
                          {activeDeck.length > 0 ? activeDeck[currentCardIndex].hiragana : "--"}
                        </span>
                        <div className="w-12 h-0.5 bg-slate-700 rounded"></div>
                        <span className="text-lg font-medium text-slate-100">
                          {activeDeck.length > 0 ? activeDeck[currentCardIndex].meaning : "--"}
                        </span>

                        {/* Extra examples / warning */}
                        {activeDeck.length > 0 &&
                          (activeDeck[currentCardIndex].example || activeDeck[currentCardIndex].warning) && (
                            <div className="w-full mt-2">
                              <div className="bg-slate-900/90 px-3 py-2 rounded-xl text-left border border-slate-700/40 text-xs">
                                {activeDeck[currentCardIndex].example && (
                                  <div>
                                    <span className="text-slate-400 font-semibold block mb-0.5">例句 / Câu mẫu:</span>
                                    <p className="text-emerald-300 font-medium">
                                      {activeDeck[currentCardIndex].example}
                                    </p>
                                  </div>
                                )}
                                {activeDeck[currentCardIndex].warning && (
                                  <div className="mt-1 text-rose-300 font-medium flex items-start gap-1">
                                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                    <span>{activeDeck[currentCardIndex].warning}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Rotate3dIcon className="w-4 h-4" />
                        <span>Nhấp để quay lại mặt Kanji</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions buttons */}
                <div className="w-full max-w-sm grid grid-cols-2 gap-4 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnswer(false);
                    }}
                    className="py-3 px-5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 font-semibold rounded-2xl border border-rose-500/30 transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                    <span>Sai rồi (←)</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnswer(true);
                    }}
                    className="py-3 px-5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 font-semibold rounded-2xl border border-emerald-500/30 transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Check className="w-5 h-5" />
                    <span>Đã thuộc (→)</span>
                  </button>
                </div>
              </div>

              {/* Mistakes report */}
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col gap-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
                      <BarChart2 className="w-5 h-5 text-indigo-400" />
                      間違いレポート / Kanji hay sai nhất
                    </h2>
                    <p className="text-xs text-slate-400">Sắp xếp theo thứ tự số lần trả lời sai giảm dần</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={studyMistakesOnly}
                      className="py-2 px-3 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Chỉ ôn từ sai
                    </button>
                    <button
                      onClick={clearKanjiMistakes}
                      className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 hover:text-slate-200 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa lịch sử sai
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/40">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                        <th className="py-3 px-4">Chữ Hán / Kanji</th>
                        <th className="py-3 px-4">Cách đọc</th>
                        <th className="py-3 px-4">Ý nghĩa</th>
                        <th className="py-3 px-4">Nhóm</th>
                        <th className="py-3 px-4 text-right">Số lần sai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedMistakes().length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-500">
                            <div className="flex flex-col items-center gap-2">
                              <CheckCircle className="w-8 h-8 text-slate-600" />
                              <span>Chưa có lỗi sai nào. Học rất tốt!</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        getSortedMistakes().map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-slate-800/60 hover:bg-slate-900/40 transition-colors"
                          >
                            <td className="py-3 px-4 font-bold text-slate-200 text-sm font-sans">{item.kanji}</td>
                            <td className="py-3 px-4 text-slate-300 font-sans">{item.hiragana}</td>
                            <td className="py-3 px-4 text-slate-400 font-medium">{item.meaning}</td>
                            <td className="py-3 px-4 text-slate-500 text-[11px]">{item.setName}</td>
                            <td className="py-3 px-4 text-right font-bold text-rose-400 font-mono text-sm">
                              {item.wrongCount}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ==================== TAB 2: GRAMMAR ARENA CONTAINER ==================== */}
      {selectedTab === "grammar" && (
        <div className="contents">
          {/* Grammar sub-header */}
          <div className="max-w-6xl mx-auto w-full px-4 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Luyện tập ngữ pháp</span>
              <span className="text-sm font-bold text-indigo-400 font-mono">{grammarRunStats.total} lượt</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Tỷ lệ chính xác</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{grammarAccuracy}%</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Nhóm yếu nhất hiện tại</span>
              <span className="text-xs font-bold text-rose-400 truncate max-w-[180px]" title={weakestGroupName}>
                {weakestGroupName}
              </span>
            </div>
          </div>

          <main className="flex-1 max-w-6xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left side: groups & cheatsheet */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* 15 Grammar groups */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold flex items-center gap-2 text-slate-200 text-sm sm:text-base">
                    <BookOpenCheck className="w-5 h-5 text-indigo-400" />
                    Bản Đồ Ngữ Pháp / 15 Nhóm N4
                  </h2>
                  <button
                    onClick={() => setCurrentGrammarGroupId("all")}
                    className="text-xs text-indigo-400 hover:underline cursor-pointer"
                  >
                    Xem tất cả
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[250px] overflow-y-auto pr-1 bg-slate-950/50 p-2 rounded-xl border border-slate-800/80">
                  {grammarGroups.map((group) => {
                    const isActive = currentGrammarGroupId === group.id;
                    return (
                      <button
                        key={group.id}
                        onClick={() => setCurrentGrammarGroupId(group.id)}
                        className={`flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition active:scale-95 border cursor-pointer ${
                          isActive
                            ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-200"
                            : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-indigo-400" : "bg-indigo-500"}`}></span>
                          <span className="font-medium truncate">{group.name}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theory notebook & comparison (Cheat sheet card) */}
              <div
                ref={cheatSheetPanelRef}
                id="cheat-sheet-panel"
                className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col gap-4 shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <h3 className="font-bold flex items-center gap-2 text-indigo-300 text-sm sm:text-base">
                    <BookOpenCheck className="w-5 h-5 text-indigo-400" />
                    {selectedGroup ? selectedGroup.name : "Sổ Tay Điểm Chí Mạng"}
                  </h3>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                    N4 Highly Recommended
                  </span>
                </div>

                <div className="text-sm flex flex-col gap-4">
                  {selectedGroup && (
                    <div className="space-y-3 leading-relaxed">
                      <p className="text-xs bg-slate-950 p-2 rounded-lg text-slate-400 italic">
                        {selectedGroup.summary}
                      </p>
                      <div
                        className="border-t border-slate-800/80 pt-3 text-slate-200"
                        dangerouslySetInnerHTML={{ __html: selectedGroup.details }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Quiz Arena */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-slate-900 rounded-3xl p-6 border-2 border-indigo-500/30 flex flex-col gap-5 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>

                {/* Quiz header */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-indigo-400 tracking-wider uppercase font-mono truncate max-w-[200px]">
                    {currentGrammarGroupId === "all"
                      ? "BÀI TẬP TỔNG HỢP N4"
                      : `BÀI TẬP: ${selectedGroup?.name.toUpperCase()}`}
                  </span>
                  <span className="font-mono bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                    {activeGrammarQuestions.length > 0
                      ? `${currentGrammarIndex + 1} / ${activeGrammarQuestions.length}`
                      : "0 / 0"}
                  </span>
                </div>

                {/* Question box */}
                <div className="flex flex-col gap-3 min-h-[140px] justify-center">
                  <div className="text-slate-300 text-xs sm:text-sm font-semibold text-center">
                    {activeGrammarQuestions.length > 0 && (
                      <div>
                        {!showTranslation ? (
                          <span
                            onClick={() => setShowTranslation(true)}
                            className="cursor-pointer text-indigo-400 hover:text-indigo-300 transition inline-flex items-center gap-1.5 justify-center py-1 px-3 bg-indigo-950/20 hover:bg-indigo-950/40 rounded-xl border border-indigo-900/30 select-none font-medium text-[11px] mx-auto"
                          >
                            👁 Hiện nghĩa ngữ cảnh
                          </span>
                        ) : (
                          <span>
                            Nghĩa ngữ cảnh: <span className="text-slate-200">"{activeGrammarQuestions[currentGrammarIndex].translation}"</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 text-base sm:text-lg font-semibold tracking-wide text-center">
                    {activeGrammarQuestions.length > 0
                      ? activeGrammarQuestions[currentGrammarIndex].question
                      : "Không tìm thấy câu hỏi cho nhóm này."}
                  </div>
                </div>

                {/* Options list */}
                <div className="flex flex-col gap-2">
                  {activeGrammarQuestions.length > 0 &&
                    activeGrammarQuestions[currentGrammarIndex].options.map((opt, idx) => {
                      const isSelected = selectedOptionIdx === idx;
                      const isCorrectAnswer = activeGrammarQuestions[currentGrammarIndex].answer === idx;
                      let btnClass = "bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300";
                      let iconChar = "✔";
                      let iconClass = "text-transparent border-slate-700";

                      if (hasAnsweredCurrentGrammar) {
                        if (isCorrectAnswer) {
                          // Correct option
                          btnClass = "border-emerald-500 bg-emerald-950/20 text-emerald-300";
                          iconClass = "text-emerald-400 border-emerald-500/50";
                        } else if (isSelected) {
                          // Selected wrong option
                          btnClass = "border-rose-500 bg-rose-950/20 text-rose-300";
                          iconChar = "✘";
                          iconClass = "text-rose-400 border-rose-500/50";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={hasAnsweredCurrentGrammar}
                          onClick={() => handleGrammarAnswer(idx)}
                          className={`w-full py-2.5 px-4 border text-left text-xs sm:text-sm font-medium rounded-xl transition flex items-center justify-between active:scale-[0.99] cursor-pointer ${btnClass}`}
                        >
                          <span>{opt}</span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${iconClass}`}
                          >
                            {iconChar}
                          </span>
                        </button>
                      );
                    })}
                </div>

                {/* Explanation box */}
                {hasAnsweredCurrentGrammar && activeGrammarQuestions.length > 0 && (
                  <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-2xl p-4 flex flex-col gap-2 transition-all duration-300">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      BÀI HỌC
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeGrammarQuestions[currentGrammarIndex].explanation}
                    </p>
                  </div>
                )}

                {/* Next button */}
                <button
                  onClick={handleGrammarNext}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-200 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Weakest Leaderboard */}
              <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 flex flex-col gap-3.5">
                <div>
                  <h3 className="font-bold flex items-center gap-2 text-slate-200 text-sm">
                    <AlertCircle className="w-4.5 h-4.5 text-rose-400" />
                    Top 3 Nhóm Ngữ Pháp Hay Sai Nhất
                  </h3>
                  <p className="text-[10px] text-slate-400">Dữ liệu tính dựa trên câu trắc nghiệm trả lời sai của bạn</p>
                </div>
                <div className="flex flex-col gap-2">
                  {weaknesses.length === 0 ? (
                    <div className="text-xs text-slate-500 py-4 text-center">
                      Bạn chưa làm sai câu ngữ pháp nào. Quá tuyệt vời!
                    </div>
                  ) : (
                    weaknesses.slice(0, 3).map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-850 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold text-rose-400 font-mono">#{index + 1}</span>
                          <span className="text-slate-300 font-medium truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-rose-400 font-bold font-mono">{item.wrong} lần sai</span>
                          <button
                            onClick={() => targetTrain(item.id)}
                            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded text-[10px] cursor-pointer"
                          >
                            Luyện ngay
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Custom Dialog Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl border ${
                  modalType === "warning"
                    ? "bg-rose-950 text-rose-400 border-rose-800"
                    : modalType === "success"
                    ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                    : "bg-indigo-950 text-indigo-400 border-indigo-800"
                }`}
              >
                {modalType === "warning" ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : modalType === "success" ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Info className="w-6 h-6" />
                )}
              </div>
              <h3 className="font-bold text-lg text-slate-100">{modalTitle}</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{modalMessage}</p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="py-2 px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition active:scale-95 cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900/60 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Nihongo N4 Kanji & Grammar Study App - Đột phá 2 tuần thi cử.</p>
          <p className="text-indigo-400/80 font-semibold">Tự học thông minh</p>
        </div>
      </footer>
    </div>
  );
}

// Inline Icon Components mapping standard HTML patterns
function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  );
}

function ShuffleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="16 3 21 3 21 8"></polyline>
      <line x1="4" y1="20" x2="21" y2="3"></line>
      <polyline points="21 16 21 21 16 21"></polyline>
      <line x1="15" y1="15" x2="21" y2="21"></line>
      <line x1="4" y1="4" x2="9" y2="9"></line>
    </svg>
  );
}

function Rotate3dIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
    </svg>
  );
}
