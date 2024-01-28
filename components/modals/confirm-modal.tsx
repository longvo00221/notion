'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import React from "react"
interface ConfirmModalProps {
    children:React.ReactNode;
    onConfirm: () => void
}
export const ConfirmModal = ({children,onConfirm}:ConfirmModalProps) => {
    const handleConfirm = (e:React.MouseEvent<HTMLButtonElement,MouseEvent>) => {
        e.stopPropagation()
        onConfirm()
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger onClick={(e) =>e.stopPropagation()}>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="dark:text-white/75 text-black">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}