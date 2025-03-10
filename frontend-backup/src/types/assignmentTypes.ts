export interface Assignment {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
  whom: string;
  where: string;
  what: string;
  how: string;
  details: string;
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
}

// other exports
export interface Exam {
  id: string;
  subject: string;
  date: string;
  toStudy: string;
  resources: string;
}