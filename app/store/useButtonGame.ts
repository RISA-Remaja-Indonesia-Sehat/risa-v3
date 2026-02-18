import { create } from 'zustand';

interface ButtonGameState {
  isButtonGameActive: boolean;
  activateButtonGame: () => void;
}

export const useButtonGameState = create<ButtonGameState>((set) => ({
  isButtonGameActive: false,
  activateButtonGame: () => set({ isButtonGameActive: true }),
}));