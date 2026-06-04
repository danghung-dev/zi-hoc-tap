"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  loadAllQuestions, 
  loadLevelConfig 
} from "@/lib/practice/data-loader";
import { 
  getWrongIds, 
  clearMistakes, 
  loadMistakes,
  clearSingleMistake
} from "@/lib/practice/progress";
import { Question, LevelConfig } from "@/lib/practice/types";
import { QuestionRenderer } from "@/components/practice/QuestionRenderer";
import { 
  ArrowLeft, 
  Shuffle, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Sparkles, 
  RefreshCw,
  BookOpenCheck,
  CheckCircle2,
  XCircle,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEM_TYPE_LABELS: Record<string, string> = {
  // Từ vựng (Vocabulary)
  kanji_reading: "Cách đọc Kanji (漢字読み)",
  orthography: "Cách viết Kanji (表記)",
  contextually_defined_expressions: "Điền từ theo ngữ cảnh (文脈規定)",
  paraphrases: "Từ đồng nghĩa (言い換え類義語)",
  usage: "Cách dùng từ (用途)",
  
  // Ngữ pháp & Đọc hiểu (Grammar & Reading)
  sentential_grammar_1: "Ngữ pháp câu - Chọn đáp án (文の文法 1 - 選択)",
  sentential_grammar_2_sentence_composition: "Ngữ pháp câu - Sắp xếp từ dấu ★ (文の文法 2 - 順序)",
  text_grammar: "Ngữ pháp trong đoạn văn (文章 của 文法)",
  reading_short_passage: "Đọc hiểu - Đoạn văn ngắn (読解 短文)",
  reading_mid_size_passage: "Đọc hiểu - Đoạn văn dài (読解 中文)",
  information_retrieval: "Đọc hiểu - Tìm kiếm thông tin (情報検索)",
  
  // Nghe hiểu (Listening)
  task_based_comprehension: "Nghe hiểu - Nhiệm vụ (課題理解)",
  comprehension_of_key_points: "Nghe hiểu - Điểm cốt lõi (ポイント理解)",
  verbal_expressions: "Nghe hiểu - Diễn đạt hội thoại (発話表現)",
  quick_response: "Nghe hiểu - Phản xạ nhanh (即時応答)",
};

type SkillGroup = "all" | "vocabulary" | "grammar" | "reading" | "listening";

const getDisplayStem = (q: Question): string => {
  if (q.uiTemplate === "standard_quiz") {
    return q.question.stem;
  }
  if (q.uiTemplate === "sentence_scramble") {
    return q.answer.completedSentence;
  }
  if (q.uiTemplate === "text_grammar_cloze") {
    return `Đoạn văn: "${q.passage.title}"`;
  }
  if (q.uiTemplate === "reading_split_screen") {
    return `Đọc hiểu: "${q.passage.title}"`;
  }
  if (q.uiTemplate === "document_scan") {
    return `Tra cứu thông tin: "${q.document.title}"`;
  }
  if (q.uiTemplate === "listening_player") {
    return `Nghe hiểu: "${q.question.instruction}"`;
  }
  return "";
};

export default function PracticePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Skill Group State
  const [activeSkillGroup, setActiveSkillGroup] = useState<SkillGroup>("all");

  // Filter States
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterItemType, setFilterItemType] = useState<string>("all");
  const [onlyMistakes, setOnlyMistakes] = useState(false);
  
  // Progress states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakeIds, setMistakeIds] = useState<string[]>([]);
  
  // Tracking if current question is correct/incorrect
  const [answersState, setAnswersState] = useState<Record<string, boolean>>({});

  // 1. Initial Data Fetching
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [configData, questionData] = await Promise.all([
          loadLevelConfig("n4"),
          loadAllQuestions("n4")
        ]);
        setLevelConfig(configData);
        setQuestions(questionData);
        setMistakeIds(getWrongIds());
      } catch (err: any) {
        console.error(err);
        setError("Không thể nạp dữ liệu câu hỏi từ hệ thống. Hãy thử tải lại trang.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 2. Filter logic: De-coupled from mistakeIds state to prevent deck reset while answering
  useEffect(() => {
    let result = [...questions];

    // Filter by active skill group
    if (activeSkillGroup === "vocabulary") {
      result = result.filter(q => q.section === "vocabulary");
    } else if (activeSkillGroup === "grammar") {
      result = result.filter(q => 
        q.section === "grammar_reading" && 
        (q.jlptItemType.includes("grammar") || q.jlptItemType.includes("composition"))
      );
    } else if (activeSkillGroup === "reading") {
      result = result.filter(q => 
        q.section === "grammar_reading" && 
        (q.jlptItemType.includes("reading") || q.jlptItemType.includes("information") || q.jlptItemType.includes("retrieval"))
      );
    } else if (activeSkillGroup === "listening") {
      result = result.filter(q => q.section === "listening");
    }

    if (filterCategory !== "all") {
      result = result.filter(
        (q) => q.customClassification?.categoryId === filterCategory
      );
    }

    if (filterItemType !== "all") {
      result = result.filter((q) => q.jlptItemType === filterItemType);
    }

    if (onlyMistakes) {
      const activeMistakes = getWrongIds();
      result = result.filter((q) => activeMistakes.includes(q.id));
    }

    setFilteredQuestions(result);
    setCurrentIndex(0);
  }, [activeSkillGroup, filterCategory, filterItemType, onlyMistakes, questions]);

  // Handle answers completed inside cards
  const handleQuestionAnswered = (isCorrect: boolean) => {
    const currentQuestion = filteredQuestions[currentIndex];
    if (!currentQuestion) return;

    setAnswersState((prev) => ({
      ...prev,
      [currentQuestion.id]: isCorrect
    }));

    // Update mistake count lists in state
    setMistakeIds(getWrongIds());
  };

  // Jump to a specific question from the mistake book list
  const jumpToQuestion = (qId: string) => {
    const targetIdx = questions.findIndex(q => q.id === qId);
    if (targetIdx !== -1) {
      const targetQuestion = questions[targetIdx];
      
      // Determine what skill group this question belongs to
      let targetSkillGroup: SkillGroup = "all";
      if (targetQuestion.section === "vocabulary") {
        targetSkillGroup = "vocabulary";
      } else if (targetQuestion.section === "listening") {
        targetSkillGroup = "listening";
      } else if (targetQuestion.section === "grammar_reading") {
        const type = targetQuestion.jlptItemType;
        if (type.includes("grammar") || type.includes("composition")) {
          targetSkillGroup = "grammar";
        } else {
          targetSkillGroup = "reading";
        }
      }

      // Switch active group to match the target question's group
      setActiveSkillGroup(targetSkillGroup);
      setFilterCategory("all");
      setFilterItemType("all");

      // Compute filtered list to immediately query its index
      const resetFiltered = questions.filter((q) => {
        // Skill group filter
        if (targetSkillGroup === "vocabulary" && q.section !== "vocabulary") return false;
        if (targetSkillGroup === "listening" && q.section !== "listening") return false;
        if (targetSkillGroup === "grammar" && !(q.section === "grammar_reading" && (q.jlptItemType.includes("grammar") || q.jlptItemType.includes("composition")))) return false;
        if (targetSkillGroup === "reading" && !(q.section === "grammar_reading" && (q.jlptItemType.includes("reading") || q.jlptItemType.includes("information") || q.jlptItemType.includes("retrieval")))) return false;

        // Mistakes filter
        if (onlyMistakes && !getWrongIds().includes(q.id)) return false;
        return true;
      });

      setFilteredQuestions(resetFiltered);
      const idxInReset = resetFiltered.findIndex(q => q.id === qId);
      setCurrentIndex(idxInReset !== -1 ? idxInReset : 0);
      
      // Smooth scroll back to top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Shuffle Fisher-Yates
  const handleShuffle = () => {
    if (filteredQuestions.length <= 1) return;
    const shuffled = [...filteredQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setFilteredQuestions(shuffled);
    setCurrentIndex(0);
  };

  // Clear mistakes
  const handleClearMistakes = () => {
    const confirmed = confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử lỗi sai luyện tập không?");
    if (confirmed) {
      clearMistakes();
      setMistakeIds([]);
      setOnlyMistakes(false);
    }
  };

  // Calculate distinct category list dynamically
  const categories = Array.from(
    new Map(
      questions
        .filter((q) => q.customClassification)
        .map((q) => [
          q.customClassification!.categoryId,
          q.customClassification!.categoryName,
        ])
    ).entries()
  );

  // Calculate distinct item types dynamically
  const itemTypes = Array.from(new Set(questions.map((q) => q.jlptItemType)));

  // Calculate counts for each group dynamically
  const vocabCount = questions.filter(q => q.section === "vocabulary").length;
  const grammarCount = questions.filter(q => 
    q.section === "grammar_reading" && 
    (q.jlptItemType.includes("grammar") || q.jlptItemType.includes("composition"))
  ).length;
  const readingCount = questions.filter(q => 
    q.section === "grammar_reading" && 
    (q.jlptItemType.includes("reading") || q.jlptItemType.includes("information") || q.jlptItemType.includes("retrieval"))
  ).length;
  const listeningCount = questions.filter(q => q.section === "listening").length;

  // Toggle active group helper
  const handleToggleGroup = (group: SkillGroup) => {
    if (activeSkillGroup === group) {
      setActiveSkillGroup("all");
    } else {
      setActiveSkillGroup(group);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Render Section Loading / Error / Empty
  if (loading) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Đang tải dữ liệu luyện tập...</p>
        </div>
      </div>
    );
  }

  if (error || !levelConfig) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center font-sans p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center flex flex-col gap-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-200">Đã xảy ra lỗi</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{error}</p>
          <Link
            href="/"
            className="mt-2 w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại Trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = filteredQuestions[currentIndex];
  const totalQuestions = filteredQuestions.length;
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const mistakeRecords = loadMistakes();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans pb-12">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2 bg-slate-800 hover:bg-slate-750 rounded-xl transition text-slate-300 hover:text-slate-100 border border-slate-700/50"
              title="Quay lại trang chủ"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-1.5">
                <BookOpenCheck className="w-4.5 h-4.5 text-indigo-400" />
                Luyện Tập {levelConfig.displayName}
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">Chế độ ôn luyện kiến thức ngôn ngữ</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-[10px] font-semibold text-slate-400 rounded-md border border-slate-700">
              MVP Mode
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 py-6 flex flex-col gap-6 flex-1">
        
        {/* Skill Groups Grid */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
              Luyện tập theo nhóm kỹ năng
            </h2>
            {activeSkillGroup !== "all" && (
              <button
                onClick={() => setActiveSkillGroup("all")}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition cursor-pointer"
              >
                Xem tất cả ({questions.length})
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
            
            {/* Card 1: Vocabulary */}
            <button
              onClick={() => handleToggleGroup("vocabulary")}
              className={cn(
                "bg-slate-900 border rounded-3xl p-5 flex flex-col gap-4 text-left transition-all duration-300 hover:border-slate-700 hover:shadow-lg cursor-pointer",
                activeSkillGroup === "vocabulary"
                  ? "border-indigo-500 bg-indigo-950/10 ring-1 ring-indigo-500/20"
                  : "border-slate-800"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-purple-950/50 text-purple-400 font-bold text-lg flex items-center justify-center font-sans">
                  字
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-400 rounded-md border border-slate-850 font-medium">
                  {vocabCount} câu
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm sm:text-base mb-1">Từ vựng & Chữ Hán</h3>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                  Chứa {vocabCount} câu hỏi thực tế từ ảnh: Đọc âm Hán, nhận diện mặt chữ, bẫy âm ngắt, âm dài.
                </p>
              </div>
              <div className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1 mt-auto pt-2">
                {activeSkillGroup === "vocabulary" ? "Đang ôn tập •" : "Bắt đầu >"}
              </div>
            </button>

            {/* Card 2: Grammar */}
            <button
              onClick={() => handleToggleGroup("grammar")}
              className={cn(
                "bg-slate-900 border rounded-3xl p-5 flex flex-col gap-4 text-left transition-all duration-300 hover:border-slate-700 hover:shadow-lg cursor-pointer",
                activeSkillGroup === "grammar"
                  ? "border-indigo-500 bg-indigo-950/10 ring-1 ring-indigo-500/20"
                  : "border-slate-800"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-blue-950/50 text-blue-400 font-bold text-lg flex items-center justify-center font-sans">
                  文
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-400 rounded-md border border-slate-850 font-medium">
                  {grammarCount} câu
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm sm:text-base mb-1">Ngữ Pháp & Sắp Xếp</h3>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                  Luyện ngữ pháp, cách liên kết cấu trúc và dạng câu dấu sao ★ (Sentence Scramble) tương tác.
                </p>
              </div>
              <div className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1 mt-auto pt-2">
                {activeSkillGroup === "grammar" ? "Đang ôn tập •" : "Bắt đầu >"}
              </div>
            </button>

            {/* Card 3: Reading */}
            <button
              onClick={() => handleToggleGroup("reading")}
              className={cn(
                "bg-slate-900 border rounded-3xl p-5 flex flex-col gap-4 text-left transition-all duration-300 hover:border-slate-700 hover:shadow-lg cursor-pointer",
                activeSkillGroup === "reading"
                  ? "border-indigo-500 bg-indigo-950/10 ring-1 ring-indigo-500/20"
                  : "border-slate-800"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/50 text-emerald-400 font-bold text-lg flex items-center justify-center font-sans">
                  読
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-400 rounded-md border border-slate-850 font-medium">
                  {readingCount} câu
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm sm:text-base mb-1">Đọc Hiểu Văn Bản</h3>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                  Đọc hiểu đoạn ngắn chia màn hình (Split screen) và dạng bảng biểu dò tìm thông tin chuyên sâu.
                </p>
              </div>
              <div className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1 mt-auto pt-2">
                {activeSkillGroup === "reading" ? "Đang ôn tập •" : "Bắt đầu >"}
              </div>
            </button>

            {/* Card 4: Listening */}
            <button
              onClick={() => handleToggleGroup("listening")}
              className={cn(
                "bg-slate-900 border rounded-3xl p-5 flex flex-col gap-4 text-left transition-all duration-300 hover:border-slate-700 hover:shadow-lg cursor-pointer",
                activeSkillGroup === "listening"
                  ? "border-indigo-500 bg-indigo-950/10 ring-1 ring-indigo-500/20"
                  : "border-slate-800"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-rose-950/50 text-rose-400 font-bold text-lg flex items-center justify-center font-sans">
                  聴
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-400 rounded-md border border-slate-850 font-medium">
                  {listeningCount} câu
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm sm:text-base mb-1">Nghe Hiểu (TTS)</h3>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                  Chạy thử trình phát nghe chuẩn xác với hệ thống tự phát âm tiếng Nhật trực tiếp, hiện bài khóa sau trả lời.
                </p>
              </div>
              <div className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1 mt-auto pt-2">
                {activeSkillGroup === "listening" ? "Đang ôn tập •" : "Bắt đầu >"}
              </div>
            </button>

          </div>
        </section>

        {/* Filters Panel (Moved to top of main area, full width) */}
        <section className="bg-slate-900/80 border border-slate-850 rounded-3xl p-5 flex flex-col gap-4 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Bộ lọc câu hỏi & Thiết lập
            </h2>
            {mistakeIds.length > 0 && (
              <button 
                onClick={handleClearMistakes}
                className="text-[10px] text-rose-400 hover:text-rose-350 font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa tất cả câu sai ({mistakeIds.length})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            
            {/* Study Mode option: review wrong vs review all list */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chế độ ôn tập</label>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-full">
                <button
                  onClick={() => setOnlyMistakes(false)}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer text-center",
                    !onlyMistakes
                      ? "bg-indigo-600 text-white font-medium"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  Ôn hết list ({questions.length})
                </button>
                <button
                  onClick={() => setOnlyMistakes(true)}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-center",
                    onlyMistakes
                      ? "bg-rose-600 text-white font-medium"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Chỉ ôn câu sai ({mistakeIds.length})
                </button>
              </div>
            </div>

            {/* Classification Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phân loại</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-600 transition h-[38px]"
              >
                <option value="all">Tất cả danh mục ({questions.length})</option>
                {categories.map(([id, name]) => {
                  const count = questions.filter(q => q.customClassification?.categoryId === id).length;
                  return (
                    <option key={id} value={id}>
                      {name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Item Type Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dạng bài thi</label>
              <select
                value={filterItemType}
                onChange={(e) => setFilterItemType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-600 transition h-[38px]"
              >
                <option value="all">Tất cả dạng bài ({questions.length})</option>
                {itemTypes.map((type) => {
                  const count = questions.filter(q => q.jlptItemType === type).length;
                  const label = ITEM_TYPE_LABELS[type] || type;
                  return (
                    <option key={type} value={type}>
                      {label} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Shuffle & Reset Buttons */}
            <div className="grid grid-cols-2 gap-2 self-end w-full">
              <button
                onClick={handleShuffle}
                disabled={filteredQuestions.length <= 1}
                className="h-[38px] text-xs font-semibold bg-slate-950 text-indigo-400 border border-slate-850 hover:bg-slate-900 rounded-xl flex items-center justify-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Trộn câu
              </button>
              <button
                onClick={() => {
                  setFilterCategory("all");
                  setFilterItemType("all");
                  setOnlyMistakes(false);
                  setActiveSkillGroup("all");
                }}
                className="h-[38px] text-xs font-semibold bg-slate-950 text-slate-400 border border-slate-850 hover:bg-slate-900 rounded-xl flex items-center justify-center transition cursor-pointer w-full"
              >
                Đặt lại
              </button>
            </div>

          </div>
        </section>
        
        {/* Main Question Area (Full Width below the filters) */}
        <div className="flex flex-col gap-6">
          
          {/* Question Deck Area */}
          {totalQuestions > 0 ? (
            <div className="flex flex-col gap-4">
              
              {/* Deck Progress Bar & Indicators */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
                  <span>
                    Tiến trình ôn tập: {activeSkillGroup === "all" ? "Tất cả" : 
                      activeSkillGroup === "vocabulary" ? "Từ vựng & Chữ Hán" :
                      activeSkillGroup === "grammar" ? "Ngữ Pháp & Sắp Xếp" :
                      activeSkillGroup === "reading" ? "Đọc Hiểu Văn Bản" :
                      "Nghe Hiểu"}
                  </span>
                  <span className="font-mono text-slate-200">
                    {currentIndex + 1} / {totalQuestions} câu
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-850">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Question Renderer */}
              {currentQuestion && (
                <QuestionRenderer 
                  question={currentQuestion} 
                  onAnswered={handleQuestionAnswered}
                />
              )}

              {/* Navigation Panel */}
              <div className="flex justify-between items-center mt-2 pb-4 border-b border-slate-900">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 border border-slate-800 hover:bg-slate-900 bg-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trước</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === totalQuestions - 1}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-200 rounded-xl transition flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center gap-4">
              <AlertCircle className="w-12 h-12 text-slate-600" />
              <div>
                <h3 className="font-bold text-slate-300 text-lg mb-1">Không tìm thấy câu hỏi</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed text-center">
                  {onlyMistakes && mistakeIds.length === 0 
                    ? "Bạn chưa có câu hỏi nào bị làm sai trong danh sách ôn tập lỗi sai!"
                    : "Không có câu hỏi nào phù hợp với danh mục bộ lọc hoặc nhóm kỹ năng này."}
                </p>
              </div>
              {(filterCategory !== "all" || filterItemType !== "all" || onlyMistakes || activeSkillGroup !== "all") && (
                <button
                  onClick={() => {
                    setFilterCategory("all");
                    setFilterItemType("all");
                    setOnlyMistakes(false);
                    setActiveSkillGroup("all");
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  Đặt lại bộ lọc
                </button>
              )}
            </div>
          )}
        </div>

        {/* View list of all incorrect questions */}
        {mistakeIds.length > 0 && (
          <section className="bg-slate-900/60 border border-slate-850 rounded-3xl p-5 shadow-lg flex flex-col gap-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-855">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
                Sổ tay lỗi sai ({mistakeIds.length})
              </h2>
              <span className="text-[10px] text-slate-400 italic">Nhấp "Luyện tập" để giải lại câu sai</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Câu hỏi / Stem</th>
                    <th className="py-2.5 px-3 text-center w-24">Số lần sai</th>
                    <th className="py-2.5 px-3 text-center w-24">Số lần đúng</th>
                    <th className="py-2.5 px-3 text-right w-36">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {mistakeIds.map((id) => {
                    const q = questions.find((item) => item.id === id);
                    const stats = mistakeRecords[id] || { wrong: 0, correct: 0 };
                    if (!q) return null;
                    return (
                      <tr key={id} className="hover:bg-slate-850/20 transition-all duration-150">
                        <td className="py-3.5 px-3 max-w-[200px] sm:max-w-xs md:max-w-md">
                          <div 
                            className="font-medium text-slate-200 truncate leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: getDisplayStem(q) }}
                          />
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <span className="text-[9px] px-1.5 py-0.5 bg-indigo-950/40 text-indigo-300 rounded border border-indigo-900/40 font-semibold font-sans">
                              {ITEM_TYPE_LABELS[q.jlptItemType] || q.jlptItemType}
                            </span>
                            {q.customClassification?.displayLabel && (
                              <span className="text-[9px] px-1.5 py-0.5 bg-slate-950 text-slate-400 rounded border border-slate-850">
                                {q.customClassification.displayLabel}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-rose-400 font-mono text-sm">
                          {stats.wrong}
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-emerald-400 font-mono text-sm">
                          {stats.correct}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              onClick={() => jumpToQuestion(id)}
                              className="px-2.5 py-1.5 bg-indigo-950/50 hover:bg-indigo-600 hover:text-white border border-indigo-500/20 text-indigo-400 font-semibold rounded-lg text-[10px] transition cursor-pointer active:scale-95"
                            >
                              Luyện tập
                            </button>
                            <button
                              onClick={() => {
                                clearSingleMistake(id);
                                const newWrongIds = getWrongIds();
                                setMistakeIds(newWrongIds);
                                if (onlyMistakes) {
                                  setFilteredQuestions(prev => prev.filter(item => item.id !== id));
                                }
                              }}
                              className="p-1.5 bg-slate-950 hover:bg-rose-950/30 text-slate-500 hover:text-rose-400 border border-slate-850 hover:border-rose-900/40 rounded-lg transition cursor-pointer active:scale-95"
                              title="Xóa lỗi này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
