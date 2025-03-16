export interface Assignment {
  _id: string;
  userId: string;
  assignment_name: string;
  due_date: string;
  submit_to: string;
  where_to_submit: string;
  what_to_submit: string;
  how_to_submit: string;
  status: string;
  // Optional fields
  completed?: boolean;
  attachments?: string[];
}

export interface Exam {
  id: string;
  subject_name: string;
  exam_date: string;
  what_to_study: string;
  resources: string[];
}