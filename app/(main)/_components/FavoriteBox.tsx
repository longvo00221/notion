'use client'
import { ConfirmModal } from '@/components/modals/confirm-modal'
import { Spinner } from '@/components/spinner'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useConfirmPin } from '@/hooks/useConfirmPin'
import { useQuery, useMutation } from 'convex/react'
import { Search, Trash, Undo } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
type FavoriteBoxtype = {}
const FavoriteBox: React.FC<FavoriteBoxtype> = () => {
    const router = useRouter()
    const pinConfirm = useConfirmPin()
    const documents = useQuery(api.documents.getFavorite)

    const [search, setSearch] = useState<string>("")
    const filterdDocuments = documents?.filter((doc) => {
        return doc.title.toLowerCase().includes(search.toLowerCase())
    })
    const onClick = (docId: string, isLocked: any) => {
        if (isLocked && isLocked.length > 0 && !pinConfirm.isUnlocked) {
            pinConfirm.onOpen(docId)
        } else {
            router.push(`/documents/${docId}`)
        }

    }

    if (documents === undefined) {
        return (
            <div className='h-full flex items-center justify-center p-4'>
                <Spinner size="lg" />
            </div>
        )
    }
    return (
        <div className='text-sm'>
            <div className='flex items-center gap-x-1 p-2'>
                <Search className='h-4 w-4' />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='h-7 px-2 focus-visible:ring-transparent'
                    placeholder='Filter by page title...' />
            </div>
            <div className='mt-2 px-1 pb-1'>
                <p className='hidden last:block text-xs text-center text-muted-foreground pb-2'>
                    No documents found.
                </p>
                {filterdDocuments?.map((doc) => (
                    <div
                        key={doc._id}
                        role='button'
                        onClick={() => onClick(doc._id, doc.isLocked)}
                        className='text-sm rounded-sm w-full hover:bg-primary/5 flex items-center py-1 justify-between text-primary'
                    >
                        <span className='truncate pl-2'>{doc.icon} {doc.title}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FavoriteBox