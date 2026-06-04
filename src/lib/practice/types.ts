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

// Union type for questions to allow future expansion
export type Question = StandardQuizQuestion;
