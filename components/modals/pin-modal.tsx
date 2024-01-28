'use client'
import {
    Dialog,
    DialogContent,

    DialogHeader,

} from "@/components/ui/dialog"

import { usePin } from "@/hooks/usePin"
import { DialogDescription } from "@radix-ui/react-dialog"
import PinInput from "../pinInput"
import { useState } from "react"

export const PinModal = () => {
    const [inputLength, setInputLength] = useState<number>(4)

    const pin = usePin()

    return (
        <Dialog  open={pin.isOpen} onOpenChange={pin.onClose}>
            <DialogContent className="dark:text-white/75 max-w-[300px]">
                <DialogHeader className="border-b  dark:text-white/75 text-black">
                    <h2 className="text-lg font-medium">
                        Pin
                    </h2>
                    <DialogDescription className="text-muted-foreground text-sm italic">
                        Setup your pin here to lock your note
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex items-center border-t-2 justify-center ">

                    <PinInput length={inputLength} />
                </div>
            </DialogContent>
        </Dialog>
    )
}