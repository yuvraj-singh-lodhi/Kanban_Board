import api from './api';
import { Board, Column, Task, Id } from '../types';

// Board Services
export const fetchBoards = (): Promise<{ data: Board[] }> => {
  return api.get('boards/');
};

export const fetchBoard = (boardId: Id): Promise<{ data: Board }> => {
  return api.get(`boards/${boardId}/`);
};

export const createBoard = (boardData: Omit<Board, 'id'>): Promise<{ data: Board }> => {
  return api.post('boards/', boardData);
};

export const updateBoard = (boardId: Id, boardData: Partial<Board>): Promise<{ data: Board }> => {
  return api.put(`boards/${boardId}/`, boardData);
};

export const deleteBoard = (boardId: Id): Promise<void> => {
  return api.delete(`boards/${boardId}/`);
};

// Column Services
export const fetchColumns = (): Promise<{ data: Column[] }> => {
  return api.get('columns/');
};

export const fetchColumn = (columnId: Id): Promise<{ data: Column }> => {
  return api.get(`columns/${columnId}/`);
};

export const createColumn = (columnData: Omit<Column, 'id' | 'tasks'>): Promise<{ data: Column }> => {
  return api.post('columns/', columnData);
};

export const updateColumn = (columnId: Id, columnData: Partial<Column>): Promise<{ data: Column }> => {
  return api.put(`columns/${columnId}/`, columnData);
};

export const deleteColumn = (columnId: Id): Promise<void> => {
  return api.delete(`columns/${columnId}/`);
};

// Task Services
export const fetchTasks = (): Promise<{ data: Task[] }> => {
  return api.get('tasks/');
};

export const fetchTask = (taskId: Id): Promise<{ data: Task }> => {
  return api.get(`tasks/${taskId}/`);
};

export const createTask = (taskData: Omit<Task, 'id'>): Promise<{ data: Task }> => {
  return api.post('tasks/', taskData);
};

export const updateTask = (taskId: Id, taskData: Partial<Task>): Promise<{ data: Task }> => {
  return api.put(`tasks/${taskId}/`, taskData);
};

export const deleteTask = (taskId: Id): Promise<void> => {
  return api.delete(`tasks/${taskId}/`);
};