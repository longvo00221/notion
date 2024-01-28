import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import React, { useState, useRef, useEffect, createRef } from 'react';
import { Button } from './ui/button';
import { Id } from '@/convex/_generated/dataModel';
import { useConfirmPin } from '@/hooks/useConfirmPin';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type PinComfirmInputProps = {
    length: number;
};
const PinComfirmInput: React.FC<PinComfirmInputProps> = ({ length }) => {
    const [pin, setPin] = useState<string[]>(Array(length).fill(''));

    const confirmPin = useConfirmPin()
    const document = useQuery(api.documents.getById, {
        documentId: confirmPin.id as Id<"documents">
    })
    const router = useRouter()
    const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        inputRefs.current = Array.from({ length }, (_, index) => inputRefs.current[index] || createRef());
        inputRefs.current[0].current?.focus();
    }, [length]);

    const handleInputChange = (index: number, value: string) => {
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        if (value && index < length - 1 && inputRefs.current[index + 1]?.current) {
            inputRefs.current[index + 1]!.current!.focus();
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && index > 0 && !pin[index]) {
            inputRefs.current[index - 1]!.current!.focus();
        }
    };
    const handleLastKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && pin.length === length && pin.every(value => value !== '')) {
            onSubmitPin();
        }
    };
    const onSubmitPin = () => {
        setIsSubmitting(true);
        const pinString = pin.join('');
        const isLockedString = document?.isLocked?.join('') || '';

        if (pinString === isLockedString) {
            confirmPin.onClose()
            toast.success("Note unlocked!")
            router.push(`/documents/${document?._id}`)

        } else {
            toast.error("Wrong pin try again")
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center">
                {pin.map((digit, index) => (
                    <input
                        key={index}
                        ref={inputRefs.current[index]}
                        type="password"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => (index === length - 1 ? handleLastKeyDown(index, e) : handleKeyDown(index, e))}
                        className="w-10 h-10  rounded-md mx-3 text-center border-black border-[2px]"
                    />
                ))}

            </div>
            <Button
                onClick={onSubmitPin}
                disabled={pin.length !== 4 || pin.some(value => !value)}
                className='w-full mt-5'
            >Accept</Button>
        </div>
    );
};
export default PinComfirmInput
