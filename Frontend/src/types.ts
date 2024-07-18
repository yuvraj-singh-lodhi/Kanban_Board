// Unique identifier type
export type Id = number;

// Board type
export interface Board {
  id?: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}


// Column type
export interface Column {
  id: Id;
  board: Id;
  title: string;
  position: number;
  tasks: Task[];
}

// Task type
export interface Task {
  columnId: unknown;
  id: Id;
  column: Id;
  content: string;
  position: number;
}
