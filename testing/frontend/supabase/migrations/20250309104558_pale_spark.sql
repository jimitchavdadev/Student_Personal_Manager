/*
  # Create tasks and substeps tables

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text)
      - `due_date` (date)
      - `description` (text)
      - `completed` (boolean)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
    - `substeps`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `text` (text)
      - `completed` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own tasks and substeps
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  due_date date NOT NULL,
  description text,
  completed boolean DEFAULT false,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create substeps table
CREATE TABLE IF NOT EXISTS substeps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks ON DELETE CASCADE NOT NULL,
  text text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE substeps ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Users can create their own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for substeps
CREATE POLICY "Users can manage substeps of their tasks"
  ON substeps
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = substeps.task_id 
      AND tasks.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = substeps.task_id 
      AND tasks.user_id = auth.uid()
    )
  );