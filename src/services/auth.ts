import { supabase } from './supabase';
import { useAppStore } from '@store/appStore';
import { AuthUser, Profile } from '../types';

export const authService = {
  async signUpWithEmail(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  },

  async signInWithOtp(email: string): Promise<void> {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
    if (error) throw error;
  },

  async verifyOtp(email: string, token: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) throw error;
    if (!data.session || !data.user) throw new Error('No session data');

    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email || '',
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };

    useAppStore.setState({ user: authUser, isAuthenticated: true });
    return authUser;
  },

  async signInWithPassword(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!data.session || !data.user) throw new Error('No session data');

    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email || '',
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };

    useAppStore.setState({ user: authUser, isAuthenticated: true });
    return authUser;
  },

  async restoreSession(): Promise<AuthUser | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return null;

    const authUser: AuthUser = {
      id: data.session.user.id,
      email: data.session.user.email || '',
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };

    useAppStore.setState({ user: authUser, isAuthenticated: true });
    return authUser;
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    useAppStore.setState({ user: null, isAuthenticated: false, profile: null });
  },

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    const profile: Profile = {
      id: data.id,
      email: data.email,
      walletAddress: data.wallet_address || '',
      role: data.role || 'user',
      createdAt: data.created_at,
    };

    return profile;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        wallet_address: updates.walletAddress,
        role: updates.role,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No profile data returned');

    const profile: Profile = {
      id: data.id,
      email: data.email,
      walletAddress: data.wallet_address || '',
      role: data.role || 'user',
      createdAt: data.created_at,
    };

    return profile;
  },
};
