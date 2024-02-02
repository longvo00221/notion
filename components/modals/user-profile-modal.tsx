import React from 'react';
import { UserProfile } from '@clerk/clerk-react';
import {
    Dialog,

    DialogContent,

    DialogHeader,

} from "@/components/ui/dialog"
import { useUserProfile } from '@/hooks/useUserProfile';
type UserProfileModalProps = {

};

const UserProfileModal: React.FC<UserProfileModalProps> = () => {
    const useProfile = useUserProfile()
    return (
        <Dialog open={useProfile.isOpen} onOpenChange={useProfile.onClose} >

            <DialogContent className="dark:text-white/75 text-black w-[900px]" style={{
                maxWidth:"unset ",
                display:"flex",
                alignItems:"end",
                justifyContent:"center",
                backgroundColor:"#19191a"
            }}>

                <div className='mt-5'> <UserProfile /></div>
            </DialogContent>
        </Dialog>
    )
}
export default UserProfileModal;