import { create } from "zustand";

type PinConfirmStore = {
    isOpen: boolean;
    id?: string | null; 
    onOpen: (id: string) => void;
    onClose: () => void;
};

export const useConfirmPin = create<PinConfirmStore>((set) => ({
    isOpen: false,
    id: null,
    onOpen: (id) => set({ isOpen: true, id }), 
    onClose: () => set({ isOpen: false}),
}));
