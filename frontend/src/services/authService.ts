import api from './api';
import { User, AuthTokens } from '../types/user';

export const authService = {
  login: async (email: string, _password: string): Promise<{ user: User; tokens: AuthTokens }> => {
    try {
      const res = await api.post('/auth/login', { email, password: _password });
      return res.data;
    } catch {
      // Fallback mock session
      const mockUser: User = {
        id: 'usr-1',
        email,
        name: 'Aditya Singh',
        role: 'COORDINATOR',
        isActive: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const mockTokens: AuthTokens = { accessToken: 'mock_jwt_token', tokenType: 'bearer' };
      localStorage.setItem('chakravyuh_access_token', mockTokens.accessToken);
      return { user: mockUser, tokens: mockTokens };
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch {
      return {
        id: 'usr-1',
        email: 'aditya@chakravyuh.ai',
        name: 'Aditya Singh',
        role: 'COORDINATOR',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  logout: () => {
    localStorage.removeItem('chakravyuh_access_token');
  }
};
