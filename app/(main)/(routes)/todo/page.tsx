'use client'
import CreateTask from '@/components/creatTask';
import ListTasks from '@/components/listTask';
import React, { useEffect, useState } from 'react';
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
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
    <DndProvider backend={HTML5Backend}>
        <div className='p-5 relative'>
            <h1 className="pl-10 font-bold text-2xl text-gray-700 dark:text-white absolute top-0 left-0 bg-white dark:bg-[#252525] shadow-md px-2 py-[5px] w-full">Todo list</h1>
           <div className='px-10 flex items-center flex-col justify-center mt-[60px]'>
                <CreateTask tasks={tasks} setTasks={setTasks}/>
                <ListTasks tasks={tasks} setTasks={setTasks}/>
           </div>
        </div>
    </DndProvider>)
}
export default TodoPage;