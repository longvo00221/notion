'use client'
import { useEffect,useState } from "react"
import { SettingModal } from "@/components/modals/setting-modal"
import {CoverImageModal} from "@/components/modals/cover-image-modal"
import { PinModal } from "../modals/pin-modal"
import { PinComfirmModal } from "../modals/pin-confirm-modal"
import UserProfileModal from "../modals/user-profile-modal"
import NotificationModal from "../modals/notification-modal"
export const ModalProvider = () => {
    const [isMounted,setIsMounted] = useState<boolean>(false)
    useEffect(()=>{
        setIsMounted(true)
    },[])
    if(!isMounted){
        return null
    }
    return(
        <>
            <SettingModal/>
            <NotificationModal/>
            <PinModal/>
            <PinComfirmModal/>
            <CoverImageModal/>
            <UserProfileModal/>
        </>
    )
}