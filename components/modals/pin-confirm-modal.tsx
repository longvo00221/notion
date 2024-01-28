'use client'
import {
    Dialog,
    DialogContent,

    DialogHeader,

} from "@/components/ui/dialog"

import { usePin } from "@/hooks/usePin"
import { DialogDescription } from "@radix-ui/react-dialog"
import PinInput from "../pinInput"
import PinComfirmInput from "../pinConfirmInput"
import { useConfirmPin } from "@/hooks/useConfirmPin"


export const PinComfirmModal = () => {

    const pinComfrim = useConfirmPin()
    return (
        <Dialog  open={pinComfrim.isOpen} onOpenChange={pinComfrim.onClose}>
            <DialogContent className="dark:text-white/75 max-w-[300px]">
                <DialogHeader className="border-b  dark:text-white/75 text-black">
                    <h2 className="text-lg font-medium">
                        Enter Pin
                    </h2>
                    <DialogDescription className="text-muted-foreground text-sm italic">
                        This note is locked please enter pin for edit
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center ">

                    <PinComfirmInput length={4} />
                </div>
            </DialogContent>
        </Dialog>
    )
}