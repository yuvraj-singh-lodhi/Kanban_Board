// src/api/index.ts
import axios from 'axios';

const API_URL = 'http://localhost:8000/kanban';

export interface Board {
  id?: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface Column {
  id?: number;
  title: string;
  position: number;
  board: number;
}

export interface Task {
  id?: number;
  title: string;
  content: string;
  columnId: number;
  position: number;
}

export const fetchBoards = async () => {
  try {
    const response = await axios.get<Board[]>(`${API_URL}/boards/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching boards:', error);
    throw error;
  }
};

export const createBoard = async (board: Omit<Board, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const response = await axios.post<Board>(`${API_URL}/boards/`, board);
    return response.data;
  } catch (error) {
    console.error('Error creating board:', error);
    throw error;
  }
};

export const fetchColumns = async () => {
  try {
    const response = await axios.get<Column[]>(`${API_URL}/columns/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching columns:', error);
    throw error;
  }
};

export const createColumn = async (column: Omit<Column, 'id'>) => {
  try {
    const response = await axios.post<Column>(`${API_URL}/columns/`, column);
    return response.data;
  } catch (error) {
    console.error('Error creating column:', error);
    throw error;
  }
};

export const updateColumn = async (id: number, column: Partial<Column>) => {
  try {
    const response = await axios.put<Column>(`${API_URL}/columns/${id}/`, column);
    return response.data;
  } catch (error) {
    console.error(`Error updating column ${id}:`, error);
    throw error;
  }
};

export const deleteColumn = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/columns/${id}/`);
  } catch (error) {
    console.error(`Error deleting column ${id}:`, error);
    throw error;
  }
};

export const fetchTasks = async () => {
  try {
    const response = await axios.get<Task[]>(`${API_URL}/tasks/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (task: Omit<Task, 'id'>) => {
  try {
    const response = await axios.post<Task>(`${API_URL}/tasks/`, task);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (id: number, task: Partial<Task>) => {
  try {
    const response = await axios.put<Task>(`${API_URL}/tasks/${id}/`, task);
    return response.data;
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/tasks/${id}/`);
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
};