import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, Profile } from '../types';

export interface AppState {
  // Auth
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setProfile: (profile: Profile | null) => void;
  setAuthLoading: (loading: boolean) => void;

  // Network
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;

  // Sync
  isSyncing: boolean;
  lastSyncedAt: number | null;
  setSyncing: (syncing: boolean) => void;
  setLastSyncedAt: (time: number) => void;

  // UI
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth defaults
      user: null,
      profile: null,
      isAuthenticated: false,
      authLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setProfile: (profile) => set({ profile }),
      setAuthLoading: (authLoading) => set({ authLoading }),

      // Network defaults
      isOnline: true,
      setIsOnline: (isOnline) => set({ isOnline }),

      // Sync defaults
      isSyncing: false,
      lastSyncedAt: null,
      setSyncing: (isSyncing) => set({ isSyncing }),
      setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt }),

      // UI defaults
      showOnboarding: true,
      setShowOnboarding: (showOnboarding) => set({ showOnboarding }),
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        lastSyncedAt: state.lastSyncedAt,
        showOnboarding: state.showOnboarding,
      }),
    }
  )
);
