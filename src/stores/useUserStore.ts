import { create } from "zustand";
import { STORAGE_KEYS } from "@/constants";
import { getStorage, removeStorage, setStorage } from "@/utils/storage";
import type { LoginRes as User } from "@/types/auth";

interface UserState {
  user: User | undefined;
  setUser: (u: User) => void;
  delUser: () => void;
}

const STORAGE_KEY = STORAGE_KEYS.TOKEN;

export const useUserStore = create<UserState>((set) => ({
  // 启动时从 localStorage 恢复登录态，没存过就是未登录
  user: getStorage<User>(STORAGE_KEY, undefined) ?? undefined,
  setUser: (u) => {
    setStorage(STORAGE_KEY, u);
    set({ user: u });
  },

  delUser: () => {
    removeStorage(STORAGE_KEY);
    set({ user: undefined });
  },
}));
