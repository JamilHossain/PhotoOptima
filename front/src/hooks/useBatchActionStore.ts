import { create } from "zustand";

interface BA_ModalState {
  isModalActive: boolean;
  whichModal: string;
  setIsModalActive: (val: boolean) => void;
  setWhichModal: (val: string) => void;
}

const useBatchActionStore = create<BA_ModalState>((set) => ({
  isModalActive: false,
  whichModal: "which modal field empty",
  setIsModalActive: (val) => set(() => ({ isModalActive: val })),
  setWhichModal: (val) => set(() => ({ whichModal: val })),
}));

export default useBatchActionStore;
