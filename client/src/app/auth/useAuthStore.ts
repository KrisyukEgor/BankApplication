import { AuthUser } from "../../types";
import { create } from "zustand";

type State = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
};

type Actions = {
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<State & Actions>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user, error: null }),
  clearUser: () => set({ user: null }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
