
export enum ReadingMode {
  QUICK = 'Nhanh',
  STANDARD = 'Chuẩn',
  DEEP = 'Chuyên sâu'
}

export enum ActionMode {
  TEACHER = 'Nhiệm vụ Cá nhân',
  LEADERSHIP = 'Nhiệm vụ Ban Huân',
  CHECKLIST = 'Checklist triển khai',
  ALL = 'Tất cả'
}

export enum ToneMode {
  LEGAL = 'Pháp lý',
  CONCISE = 'Ngắn gọn',
  EASY = 'Dễ hiểu',
  SUPER_SUMMARY = 'Siêu tóm tắt'
}

export interface StandardSummary {
  title: string;
  legalBasis: string;
  scope: string;
  subjects: string;
  mainContent: string;
  validity: string;
}

export interface DeepAnalysis {
  legalExplanation: string;
  newPoints: string;
  impact: string;
  risks: string;
  recommendations: string;
}

export interface TaskList {
  schoolBoard: string[]; // BGH
  groupLeaders: string[]; // Tổ trưởng (Đỗ Hồng Hà) & Tổ phó (Nguyễn Phương Thảo)
  englishTeachers: string[]; // Nhóm Tiếng Anh (Mr. Thành & Ms. Vươn)
  artsTeachers: string[]; // Nhóm Nghệ thuật & Đội (Việt, Duy, Tiêm, Lê)
  socialScienceTeachers: string[]; // GV Tổ KHXH nói chung
}

export interface ChecklistItem {
  step: string;
  details: string;
  timeline: string;
  assignee: string; 
}

export interface AnalysisResult {
  superSummary: string;
  standardSummary: StandardSummary;
  bulletPoints: string[];
  deepAnalysis: DeepAnalysis;
  tasks: TaskList;
  checklist: ChecklistItem[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AppState {
  inputText: string;
  inputImage: string | null; 
  readingMode: ReadingMode;
  actionMode: ActionMode;
  toneMode: ToneMode;
  isLoading: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
