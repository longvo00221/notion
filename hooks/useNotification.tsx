import { create } from "zustand";
type NotificationStore = {
    isOpen:boolean
    onOpen:()=>void
    onClose:()=>void
}

export const useNotification = create<NotificationStore>((set) => ({
    isOpen:false,
    onOpen:()=>set({isOpen:true}),
    onClose:()=>set({isOpen:false})
}))