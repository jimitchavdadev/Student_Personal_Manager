export interface Task {
  id: string;
  name: string;
  type: 'Study' | 'Personal';
  due_date: string;
  description: string;
  completed: boolean;
  user_id: string;
  created_at: string;
}

export interface Substep {
  id: string;
  task_id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at'>;
        Update: Partial<Omit<Task, 'id' | 'created_at'>>;
      };
      substeps: {
        Row: Substep;
        Insert: Omit<Substep, 'id' | 'created_at'>;
        Update: Partial<Omit<Substep, 'id' | 'created_at'>>;
      };
    };
  };
}