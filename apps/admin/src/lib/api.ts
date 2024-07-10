import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8004';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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

/**
 * Teams operations
 */
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

export const updateTeam = async (teamSlug: string, teamData: any) => {
  try {
    const response = await api.put(`/teams/${teamSlug}`, teamData);
    return response.data;
  } catch (error) {
    console.error('Error updating team', error);
    throw error;
  }
};

export const deleteTeam = async (teamSlug: string) => {
  try {
    const response = await api.delete(`/teams/${teamSlug}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting team', error);
    throw error;
  }
};

/**
 * Sources operations
 */
export const getSources = async () => {
  try {
    const response = await api.get('/sources');
    return response.data;
  } catch (error) {
    console.error('Error getting sources', error);
    throw error;
  }
};

export const createSource = async (sourceData: any) => {
  try {
    const response = await api.post('/sources', sourceData);
    return response.data;
  } catch (error) {
    console.error('Error creating source', error);
    throw error;
  }
};

export const updateSource = async (sourceSlug: string, sourceData: any) => {
  try {
    const response = await api.put(`/sources/${sourceSlug}`, sourceData);
    return response.data;
  } catch (error) {
    console.error('Error updating source', error);
    throw error;
  }
};

export const deleteSource = async (sourceSlug: string) => {
  try {
    const response = await api.delete(`/sources/${sourceSlug}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting source', error);
    throw error;
  }
};

export default api;
