import axios from 'axios';
import { Column, Task } from '../types';

const API_URL = 'http://localhost:8000/kanban';

export const fetchColumns = async () => {
  return await axios.get(`${API_URL}/columns/`);
};

export const createColumn = async (column: Omit<Column, "id">) => {
  return await axios.post(`${API_URL}/columns/`, column);
};

export const updateColumn = async (id: number, column: { title: string; }) => {
  return await axios.put(`${API_URL}/columns/${id}/`, column);
};

export const deleteColumn = async (id: number) => {
  return await axios.delete(`${API_URL}/columns/${id}/`);
};

export const fetchTasks = async () => {
  return await axios.get(`${API_URL}/tasks/`);
};

export const createTask = async (task: Omit<Task, "id">) => {
  return await axios.post(`${API_URL}/tasks/`, task);
};

export const updateTask = async (id: number, task: { content: string; }) => {
  return await axios.put(`${API_URL}/tasks/${id}/`, task);
};

export const deleteTask = async (id: number) => {
  return await axios.delete(`${API_URL}/tasks/${id}/`);
};
