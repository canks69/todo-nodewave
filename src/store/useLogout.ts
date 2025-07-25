import {create} from "zustand";

interface LogoutState {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const useLogoutStore = create<LogoutState>((set => ({
  isOpen: false,
  setOpen: (open: boolean) => set({ isOpen: open }),
})));