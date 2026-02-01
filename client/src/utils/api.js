import axios from 'axios';

const API_URL = 'https://ivf-voting-backend.vercel.app/api';
// const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const getDiscordAuthUrl = () => api.get('/auth/discord');
export const handleDiscordCallback = (code) => api.post('/auth/callback', { code });
export const getCurrentUser = () => api.get('/auth/me');

// Polls
export const getPolls = () => api.get('/polls');
export const getActivePolls = () => api.get('/polls/active');
export const getPoll = (id) => api.get(`/polls/${id}`);
export const createPoll = (data) => api.post('/polls', data);
export const updatePoll = (id, data) => api.put(`/polls/${id}`, data);
export const deletePoll = (id) => api.delete(`/polls/${id}`);
export const closePoll = (id) => api.post(`/polls/${id}/close`);
export const reopenPoll = (id) => api.post(`/polls/${id}/reopen`);

// Votes
export const submitVote = (pollId, optionId) => api.post(`/votes/${pollId}`, { optionId });
export const getVoters = (pollId, optionId) => api.get(`/polls/${pollId}/options/${optionId}/voters`);

// Results
export const getResults = () => api.get('/results');

export default api;