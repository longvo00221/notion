'use client'
import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Toolbar from '@/components/toolbar';
type DocumentIdProps = {
    params:{
        documentId:Id<"documents">
    }
};

const DocumentId:React.FC<DocumentIdProps> = ({params}) => {
    const document = useQuery(api.documents.getById,{
        documentId: params.documentId
    })
  
    if(document === undefined){
        return(
            <p>Loading...</p>
        )
    }
    if(document === null) {
        return(
            <div>Not found</div>
        )
    }
    return (
    <div className='pb-40 mt-[52px]'>
        <div className='h-[35vh]'/>
        <div className='md:max-w-3xl lg:md-max-w-4xl mx-auto'>
            <Toolbar initialData={document}/>
        </div>
    </div>
    )
}
export default DocumentId;