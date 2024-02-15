import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

type Task = {
    id: string;
    name: string;
    status: string;
};

type CreateTaskProps = {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const formSchema = z.object({
    task: z.any(),
});

type CreateTasksValues = z.infer<typeof formSchema>;

const CreateTask: React.FC<CreateTaskProps> = ({ tasks, setTasks }) => {
    const [task, setTask] = useState<Task>({
        id: "",
        name: "",
        status: "todo",
    });

    const form = useForm<CreateTasksValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            task: {
                id: "",
                name: "",
                status: "todo",
            },
        },
    });


    const onSubmit = async (data:CreateTasksValues) => {
   
        try {
            if(task.name.length < 2) {
                toast.error("Task name must be longer than 2 character")
                return
            }
            if(task.name.length > 100) {
                toast.error("Task name too long")
                return
            }
            setTasks((prev:any) => {
                const list = [...prev, task]
                localStorage.setItem("tasks",JSON.stringify(list))
                return list;
            });
            toast.success("Create new task success")
            form.reset();
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="gap-2 w-full md:w-1/2 flex items-center justify-center mb-5">
                <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Task name" {...field} value={task.name} onChange={(e) => setTask({ ...task, id: uuidv4(), name: e.target.value })} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit">Create</Button>
            </form>
        </Form>
    );
};

export default CreateTask;
