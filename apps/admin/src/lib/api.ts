import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8004';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in', error);
    throw error;
  }
};

export const getTeams = async () => {
  try {
    const response = await api.get('/teams');
    return response.data;
  } catch (error) {
    console.error('Error getting teams', error);
    throw error;
  }
};

export const createTeam = async (teamData: any) => {
  try {
    const response = await api.post('/teams', teamData);
    return response.data;
  } catch (error) {
    console.error('Error creating team', error);
    throw error;
  }
};

export const updateTeam = async (teamId: number, teamData: any) => {
  try {
    const response = await api.put(`/teams/${teamId}`, teamData);
    return response.data;
  } catch (error) {
    console.error('Error updating team', error);
    throw error;
  }
};

export const deleteTeam = async (teamId: number) => {
  try {
    const response = await api.delete(`/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting team', error);
    throw error;
  }
};

export default api;
