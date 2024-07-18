// Unique identifier type
export type Id = number;

// Board type
export interface Board {
  id: Id;
  name: string;
  user: number;
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

// Props for ColumnContainer component
export interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: Id) => Promise<void>;
  updateColumn: (id: Id, updates: Partial<Column>) => Promise<void>;
  createTask: (taskData: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: Id, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: Id) => Promise<void>;
}

// Props for TaskCard component
export interface TaskCardProps {
  task: Task;
  deleteTask: (id: Id) => Promise<void>;
  updateTask: (id: Id, updates: Partial<Task>) => Promise<void>;
}