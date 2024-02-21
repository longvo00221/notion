import React from 'react';
import { UserProfile } from '@clerk/clerk-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import { useUserProfile } from '@/hooks/useUserProfile';
import { X } from 'lucide-react';
import { useTheme } from 'next-themes';
type UserProfileModalProps = {

};

const UserProfileModal: React.FC<UserProfileModalProps> = () => {
    const useProfile = useUserProfile()
    const {resolvedTheme} = useTheme()
    return (
        <Dialog open={useProfile.isOpen} onOpenChange={useProfile.onClose} >

            <DialogContent className="dark:text-white/75 text-black w-[900px]" style={{
                maxWidth: "unset ",
                display: "flex",
                alignItems: "end",
                justifyContent: "center",
                backgroundColor: resolvedTheme === "dark" ?"#19191a":"#fff"
            }}>

                <div className='mt-5 relative'>
                    <div className='absolute top-9 right-4 z-[9999] hover:bg-[#555] rounded-md p-1 md:hidden block' onClick={()=>useProfile.onClose()}><X className='w-5 h-5 ' /></div>
                    <UserProfile />
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default UserProfileModal;