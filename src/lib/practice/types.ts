export interface Manifest {
  appVersion: string;
  defaultLevel: string;
  activeLevels: string[];
  dataBasePath: string;
  assetBasePath: string;
  features?: Record<string, any>;
}

export interface OfficialSection {
  id: string;
  displayName: string;
}

export interface ScoringGroup {
  id: string;
  displayName: string;
  sections: string[];
}

export interface LevelConfig {
  level: string;
  displayName: string;
  language: string;
  assetBaseUrl: string;
  officialSections: OfficialSection[];
  scoringGroups: ScoringGroup[];
}

export interface Pack {
  id: string;
  section: string;
  jlptItemType: string;
  uiTemplate: string;
  file: string;
  title: string;
  count: number;
}

export interface CustomClassification {
  source: string;
  categoryId: string;
  categoryName: string;
  subCategoryId?: string;
  subCategoryName?: string;
  displayLabel: string;
  showOnCard: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanationVi: string;
}

export interface QuestionBase {
  id: string;
  level: string;
  section: string;
  jlptItemType: string;
  uiTemplate: string;
  difficulty: number;
  tags: string[];
  customClassification?: CustomClassification;
}

export interface StandardQuizQuestion extends QuestionBase {
  uiTemplate: "standard_quiz";
  question: {
    instruction: string;
    stem: string;
    underlinedText?: string;
  };
  options: QuestionOption[];
  answer: {
    correctOptionId: string;
    shortExplanationVi: string;
    fullExplanationVi: string;
    trapVi?: string;
    translationVi?: string;
  };
}

export interface SentenceScrambleQuestion extends QuestionBase {
  uiTemplate: "sentence_scramble";
  question: {
    instruction: string;
    fixedParts: string[];
    fragments: {
      id: string;
      text: string;
    }[];
  };
  answer: {
    correctOrder: string[];
    correctStarFragmentId: string;
    completedSentence: string;
    translationVi?: string;
    shortExplanationVi: string;
    fullExplanationVi: string;
    fragmentExplanationsVi?: Record<string, string>;
    trapVi?: string;
  };
}

export interface TextGrammarClozeQuestion extends QuestionBase {
  uiTemplate: "text_grammar_cloze";
  passage: {
    title: string;
    text: string;
    translationVi?: string;
  };
  questions: {
    id: string;
    blankId: string;
    options: QuestionOption[];
    answer: {
      correctOptionId: string;
      evidenceBefore?: string;
      evidenceAfter?: string;
      logicVi?: string;
    };
  }[];
}

export interface ReadingSplitScreenQuestion extends QuestionBase {
  uiTemplate: "reading_split_screen";
  passage: {
    title: string;
    text: string;
    translationVi?: string;
  };
  questions: {
    id: string;
    questionText: string;
    questionTranslationVi?: string;
    options: QuestionOption[];
    answer: {
      correctOptionId: string;
      evidenceText?: string;
      strategyVi?: string;
    };
  }[];
}

export interface DocumentScanQuestion extends QuestionBase {
  uiTemplate: "document_scan";
  document: {
    type: string;
    title: string;
    text: string;
    image?: {
      src: string;
      alt: string;
    };
  };
  question: {
    text: string;
    translationVi?: string;
    conditions?: {
      id: string;
      labelVi: string;
      keywordJa?: string;
    }[];
  };
  options: QuestionOption[];
  answer: {
    correctOptionId: string;
    evidenceTexts?: string[];
    logicVi?: string;
  };
}

export interface ListeningPlayerQuestion extends QuestionBase {
  uiTemplate: "listening_player";
  media: {
    audio: {
      src: string;
      durationSec: number;
    };
    image?: {
      src: string;
      alt: string;
    } | null;
  };
  question: {
    instruction: string;
    instructionVi?: string;
    textVisibleBeforeAudio?: boolean;
    buttonMode?: boolean;
    stem?: string;
    stemVi?: string;
  };
  options: {
    id: string;
    text?: string;
    textAfterAnswer?: string;
    isCorrect: boolean;
    explanationVi: string;
    imageSrc?: string;
  }[];
  answer: {
    correctOptionId: string;
    transcriptJa?: string;
    translationVi?: string;
    highlightTranscript?: string[];
    shortExplanationVi: string;
    fullExplanationVi: string;
    listeningStrategyVi?: string;
    trapVi?: string;
  };
  playbackPolicy?: {
    practiceModeReplay?: boolean;
    examModeReplay?: boolean;
    showTranscriptBeforeAnswer?: boolean;
    showTranscriptAfterAnswer?: boolean;
  };
}

// Union type for questions to allow future expansion
export type Question = 
  | StandardQuizQuestion 
  | SentenceScrambleQuestion 
  | TextGrammarClozeQuestion 
  | ReadingSplitScreenQuestion
  | DocumentScanQuestion
  | ListeningPlayerQuestion;





