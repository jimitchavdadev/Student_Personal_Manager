export interface Assignment {
  id: string;
  title: string;
  description: string;
  course: string;
  dueDate: string;
  completed: boolean;
  location: string;
  submissionMethod: string;
  attachments: any[];
}
// other exports
export interface Exam {
  id: string;
  subject: string;
  date: string;
  toStudy: string;
  resources: string;
}