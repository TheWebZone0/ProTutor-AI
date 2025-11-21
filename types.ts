export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  mimeType: string;
  data: string; // Base64
}

export type TutorMode = 'fast' | 'learning';

export interface UserSettings {
  mode: TutorMode;
}

export const SUBJECTS = [
  "Math", "Physics", "Chemistry", "Biology", "Accounting", 
  "Statistics", "English", "Arabic", "Computer Science", 
  "Geography", "History", "Economics", "Business", 
  "Engineering", "Medicine"
];