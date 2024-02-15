'use client'
import CreateTask from '@/components/creatTask';
import ListTasks from '@/components/listTask';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
type TodoPageProps = {

};

const TodoPage: React.FC<TodoPageProps> = () => {
    const [tasks, setTasks] = useState<any>([])
    const [isMobile, setIsMobile] = useState<boolean>(false)
    useEffect(() => {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, [])
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 812 && window.innerHeight > window.innerWidth) {
                setIsMobile(true);
            }
            console.log(isMobile)
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <DndProvider backend={HTML5Backend}>
            <div className='p-5 relative'>
                {isMobile && <div onClick={() => setIsMobile(false)} className=' fixed top-0 right-0 left-0 bottom-0 bg-black/80 z-[9998] flex items-center justify-center flex-col'>

                    <div className="phone">
                    </div>
                    <div className="message">
                        Please rotate your device!
                    </div>
                </div>}
                <h1 className="pl-10 font-bold text-2xl text-gray-700 dark:text-white absolute top-0 left-0 bg-white dark:bg-[#252525] shadow-md px-2 py-[5px] w-full">Todo list</h1>
                <div className='px-10 flex items-center flex-col justify-center mt-[60px]'>
                    <CreateTask tasks={tasks} setTasks={setTasks} />
                    <ListTasks tasks={tasks} setTasks={setTasks} />
                </div>
            </div>
        </DndProvider>)
}
export default TodoPage;