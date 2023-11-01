import { create } from "zustand";

interface thumbState {
  isThumbModalActive: boolean;
  imageUrl1: string;
  imageUrl2: string;
  image1Loaded: boolean;
  setIsThumbModalActive: () => void;
  resetIsThumbModalActive: () => void;
  setImageUrl1: (url: string) => void;
  setImageUrl2: (url: string) => void;
  setImage1Loaded: (val: boolean) => void;
}

const useThumbStore = create<thumbState>((set) => ({
  isThumbModalActive: false,
  imageUrl1: "",
  imageUrl2: "",
  image1Loaded: false,
  setIsThumbModalActive: () => set(() => ({ isThumbModalActive: true })),
  resetIsThumbModalActive: () => set(() => ({ isThumbModalActive: false })),
  setImageUrl1: (url) => set(() => ({ imageUrl1: url })),
  setImageUrl2: (url) => set(() => ({ imageUrl2: url })),
  setImage1Loaded: (val) => set(() => ({ image1Loaded: val })),
}));

export default useThumbStore;
