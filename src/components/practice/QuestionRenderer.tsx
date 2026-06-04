import React from "react";
import { Question } from "@/lib/practice/types";
import { StandardQuizCard } from "./StandardQuizCard";
import { SentenceScrambleCard } from "./SentenceScrambleCard";
import { TextGrammarClozeCard } from "./TextGrammarClozeCard";
import { ReadingSplitScreenCard } from "./ReadingSplitScreenCard";
import { DocumentScanCard } from "./DocumentScanCard";
import { ListeningPlayerCard } from "./ListeningPlayerCard";

interface QuestionRendererProps {
  question: Question;
  onAnswered: (isCorrect: boolean) => void;
}

export function QuestionRenderer({ question, onAnswered }: QuestionRendererProps) {
  switch (question.uiTemplate) {
    case "standard_quiz":
      return <StandardQuizCard question={question} onAnswered={onAnswered} />;
    case "sentence_scramble":
      return <SentenceScrambleCard question={question} onAnswered={onAnswered} />;
    case "text_grammar_cloze":
      return <TextGrammarClozeCard question={question} onAnswered={onAnswered} />;
    case "reading_split_screen":
      return <ReadingSplitScreenCard question={question} onAnswered={onAnswered} />;
    case "document_scan":
      return <DocumentScanCard question={question} onAnswered={onAnswered} />;
    case "listening_player":
      return <ListeningPlayerCard question={question} onAnswered={onAnswered} />;
    default:
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
          <p className="font-semibold text-lg text-slate-300 mb-2">Giao diện câu hỏi chưa được hỗ trợ</p>
          <p className="text-xs text-slate-500">Mẫu giao diện: {(question as any).uiTemplate}</p>
        </div>
      );
  }
}
