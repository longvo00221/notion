'use client'
import CreateTask from '@/components/creatTask';
import ListTasks from '@/components/listTask';
import React, { useEffect, useState } from 'react';

type TodoPageProps = {
    
};

const TodoPage:React.FC<TodoPageProps> = () => {
    const [tasks,setTasks] = useState<any>([])
    useEffect(()=>{
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    },[])
    return (
    <div className='p-5 relative'>
        <h1 className="font-bold text-2xl text-gray-700 dark:text-white absolute top-0 left-0 bg-white dark:bg-[#252525] shadow-md px-2 py-4 w-full">Todo list</h1>
       <div className='px-10 flex items-center flex-col justify-center mt-[60px]'>
            <CreateTask tasks={tasks} setTasks={setTasks}/>
            <ListTasks tasks={tasks} setTasks={setTasks}/>
       </div>
    </div>)
}
export default TodoPage;