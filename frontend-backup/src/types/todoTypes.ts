export interface Task {
  id: string;
  name: string;
  type: 'Study' | 'Personal';
  due_date: string;
  description: string;
  created_at: string;
  user_id: string;
  completed?: boolean;
}

export interface Substep {
  id: string;
  text: string;
  created_at: string;
  task_id: string;
  completed?: boolean;
}

export interface TaskWithSubsteps extends Task {
  substeps: Substep[];
}