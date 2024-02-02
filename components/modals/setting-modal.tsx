'use client'
import {
    Dialog,

    DialogContent,

    DialogHeader,

} from "@/components/ui/dialog"
import { useSetting } from "@/hooks/useSetting"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import { UserButton, } from "@clerk/clerk-react";
import { Settings } from "lucide-react"
import { useUserProfile } from "@/hooks/useUserProfile"
export const SettingModal = () => {
    const setting = useSetting()
    const useProfile = useUserProfile()
    const handleOpenProfileModal = () => {
        useProfile.onOpen()
        setting.onClose()
    }
    return (
        <Dialog open={setting.isOpen} onOpenChange={setting.onClose}>
            <DialogContent className="dark:text-white/75 text-black">
                <DialogHeader className="border-b pb-3">
                    <h2 className="text-lg font-medium">
                        My Settings
                    </h2>
                </DialogHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>
                            Appearance
                        </Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            Customize how Notion looks on your device
                        </span>
                    </div>
                    <ModeToggle />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>
                            User Account
                        </Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            You can edit your profile account
                        </span>
                    </div>
                    <div className="border p-[9px] rounded-md hover:bg-[#414040] cursor-pointer" onClick={handleOpenProfileModal}><Settings className="h-5 w-5" /></div>
                    {/* <UserButton afterSignOutUrl="/" /> */}
                </div>
            </DialogContent>
        </Dialog>
    )
}