import { create } from "zustand";
import { STORAGE_KEYS } from "@/constants";
import { getStorage, removeStorage, setStorage } from "@/utils/storage";
import type { LoginRes as User } from "@/types/common";

interface UserState {
  user: User | undefined;
  setUser: (u: User) => void;
  delUser: () => void;
  clearUser: () => void;
}

const STORAGE_KEY = STORAGE_KEYS.TOKEN;

function readInitialUser(): User | undefined {
  const stored = getStorage<User>(STORAGE_KEY, undefined);
  return stored ?? undefined;
}

export const useUserStore = create<UserState>((set) => ({
  user: readInitialUser(),

  setUser: (u) => {
    setStorage(STORAGE_KEY, u);
    set({ user: u });
  },

  delUser: () => {
    removeStorage(STORAGE_KEY);
    set({ user: undefined });
  },

  clearUser: () => {
    removeStorage(STORAGE_KEY);
    set({ user: undefined });
  },
}));
