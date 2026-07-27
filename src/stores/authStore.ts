import { create } from 'zustand';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  showAuthModal: boolean;
  authModalRedirect: string | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  openAuthModal: (redirect?: string) => void;
  closeAuthModal: () => void;
  checkSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  showAuthModal: false,
  authModalRedirect: null,

  setUser: (user) => set({ user }),

  openAuthModal: (redirect) => set({ showAuthModal: true, authModalRedirect: redirect || null }),

  closeAuthModal: () => set({ showAuthModal: false, authModalRedirect: null }),

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        set({ user: data.user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  signOut: async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } catch {
      // ignore
    }
    set({ user: null });
  },
}));
