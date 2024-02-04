import { create } from "zustand";
type UserProfileStore = {
    isOpen:boolean
    onOpen:()=>void
    onClose:()=>void
}

export const useUserProfile = create<UserProfileStore>((set) => ({
    isOpen:false,
    onOpen:()=>set({isOpen:true}),
    onClose:()=>set({isOpen:false})
}))