import { create } from "zustand";

interface rangeState {
  rangeValue: number;
  setRangeValue: (by: number) => void;
}

const useRangeStore = create<rangeState>((set) => ({
  rangeValue: 70,
  setRangeValue: (newRangeValue: number) =>
    set(() => ({ rangeValue: newRangeValue })),
}));

export default useRangeStore;
