import {Loader} from 'lucide-react'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
// cva sẽ bao gồm class mặc định, variants sẽ chứa các thuộc tính được truyền qua props bên trong , và defaultVariants
const spinnerVariants = cva(
    "text-muted-foreground animate-spin",
    {
        variants:{
            size:{
                default:"h-4 w-4",
                sm:"h-2 w-2",
                lg:"h-6 w-6",
                icon:"h-10 w-10"
            }
        },
        defaultVariants:{
            size:"default",
        }
    }
)
interface SpinnerProps extends VariantProps<typeof spinnerVariants>{}
export const Spinner = ({
    size,
}:SpinnerProps) => {
    return(
        <Loader className={cn(spinnerVariants({size}))}/>
    )
}