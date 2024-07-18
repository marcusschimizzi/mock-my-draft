import axios from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.mockmydraft.com/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use((response) => {
  return response.data;
});

export default apiClient;
