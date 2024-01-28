import { create } from "zustand";
type PinStore = {
    isOpen:boolean
    onOpen:()=>void
    onClose:()=>void
}

export const usePin = create<PinStore>((set) => ({
    isOpen:false,
    onOpen:()=>set({isOpen:true}),
    onClose:()=>set({isOpen:false})
}))