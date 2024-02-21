'use client'
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import { useSetting } from "@/hooks/useSetting"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import { Settings } from "lucide-react"
import { useUserProfile } from "@/hooks/useUserProfile"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
export const SettingModal = () => {
    const setting = useSetting()
    const useProfile = useUserProfile()
    const [isSyncTheme,setIsSyncTheme] = useState<boolean | undefined>(false)
    const handleOpenProfileModal = () => {
        useProfile.onOpen()
        setting.onClose()
    }
    useEffect(() => {

        const storedIsSyncTheme = localStorage.getItem('isSyncTheme');
        if (storedIsSyncTheme) {
            setIsSyncTheme(JSON.parse(storedIsSyncTheme));
        }
    }, []);
    const toggleSyncWithDevice = () => {
       try {
        const newSyncTheme = !isSyncTheme;
        setIsSyncTheme(newSyncTheme);
        localStorage.setItem('isSyncTheme', JSON.stringify(newSyncTheme));
        window.location.reload()
       } catch (error) {
        console.log(error)
       }
    };
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
                            Sync Theme
                        </Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            This setting will make theme synchronized with your device
                        </span>
                    </div>
                    <Switch
                      checked={isSyncTheme}
                      onCheckedChange={toggleSyncWithDevice}
                    
                    />
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
                    <div className="border p-[9px] rounded-md dark:hover:bg-[#414040] hover:bg-[#f4f4f4] cursor-pointer" onClick={handleOpenProfileModal}><Settings className="h-5 w-5" /></div>
                    {/* <UserButton afterSignOutUrl="/" /> */}
                </div>
            </DialogContent>
        </Dialog>
    )
}