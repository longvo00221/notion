import { create } from "zustand";

type PinConfirmStore = {
    isOpen: boolean;
    isUnlocked?: boolean;
    id?: string | null;
    onOpen: (id: string) => void;
    onClose: () => void;
    onUnlocked: () => void;
    onLocked: () => void
};

export const useConfirmPin = create<PinConfirmStore>((set) => ({
    isOpen: false,
    isUnlocked: false,
    id: null,
    onOpen: (id) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false }),
    onUnlocked: () => set({ isUnlocked: true }),
    onLocked: () => set({ isUnlocked: false })
}));
