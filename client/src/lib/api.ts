import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Restore this now that backend uses specific origins
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  sendOTP: (email: string) => api.post('/api/auth/send-otp', { email }),
  verifyOTP: (email: string, otp: string, name?: string, dateOfBirth?: string) => 
    api.post('/api/auth/verify-otp', { email, otp, name, dateOfBirth }),
  googleLogin: () => `${API_URL}/api/auth/google`,
  verifySignupOTP: (email: string, otp: string, name: string, dateOfBirth: string) =>
    api.post('/api/auth/verify-signup-otp', { email, otp, name, dateOfBirth }),
  verifyLoginOTP: (email: string, otp: string) =>
    api.post('/api/auth/verify-login-otp', { email, otp }),
};

// Notes API
export const notesAPI = {
  getNotes: () => api.get('/api/notes'),
  createNote: (title: string, content: string) => 
    api.post('/api/notes', { title, content }),
  deleteNote: (id: string) => api.delete(`/api/notes/${id}`),
};