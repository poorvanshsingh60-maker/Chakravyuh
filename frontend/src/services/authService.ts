import { UserRole } from '../types/user';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  name?: string;
  role: UserRole;
  isActive?: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

const TOKEN_KEY = 'chakravyuh_jwt_token';
const USER_KEY = 'chakravyuh_user';

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.verifySession();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to sign in' }));
      throw new Error(err.detail || 'Invalid email or password');
    }

    const data: AuthResponse = await res.json();
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  async signup(email: string, password: string, fullName: string, role: UserRole): Promise<AuthResponse> {
    const res = await fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
        full_name: fullName.trim() || email.split('@')[0],
        role,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to create account' }));
      throw new Error(err.detail || 'Account registration failed');
    }

    const data: AuthResponse = await res.json();
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  async verifySession(): Promise<AuthUser | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        this.logout();
        return null;
      }

      const user: AuthUser = await res.json();
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch {
      return this.getStoredUser();
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  loginAsGuest(role: UserRole = 'COORDINATOR'): AuthResponse {
    const guestUser: AuthUser = {
      id: `guest-${Date.now()}`,
      email: 'guest.scheduler@chakravyuh.ai',
      full_name: 'Guest Coordinator (Scheduler)',
      role,
      isActive: true,
    };
    const mockToken = `guest-token-${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(guestUser));
    return {
      access_token: mockToken,
      token_type: 'bearer',
      user: guestUser,
    };
  },

  getGoogleClientId(): string {
    const envClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (envClientId && typeof envClientId === 'string' && envClientId.trim()) {
      return envClientId.trim();
    }
    const stored = localStorage.getItem('chakravyuh_google_client_id');
    if (stored && stored.trim()) {
      return stored.trim();
    }
    return '1086710915799-guosai45oj81h4sp0kqhuvgo3j5vfhi2.apps.googleusercontent.com';
  },

  setGoogleClientId(clientId: string): void {
    if (clientId && clientId.trim()) {
      localStorage.setItem('chakravyuh_google_client_id', clientId.trim());
    } else {
      localStorage.removeItem('chakravyuh_google_client_id');
    }
  },

  async loginWithGoogle(params: {
    credential?: string;
    accessToken?: string;
    role?: UserRole;
  }): Promise<AuthResponse> {
    const res = await fetch('/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential: params.credential,
        access_token: params.accessToken,
        role: params.role || 'COORDINATOR',
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Google authentication failed' }));
      throw new Error(err.detail || 'Failed to authenticate with Google');
    }

    const data: AuthResponse = await res.json();
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },
};
