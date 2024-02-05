import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useDrag, useDrop } from 'react-dnd';

type ListTasksProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

type ListTasksSectionProps = {
  status: string;
  tasks: Task[];
  todos: Task[];
  inProgress: Task[];
  closed: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

type Task = {
  id: string;
  name: string;
  status: string;
};
type headerProps = {
  text: string;
  bg: string;
  count: number
}
type TaskItemProps = {
  tasks: Task[];
  task: Task
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const ListTasks: React.FC<ListTasksProps> = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState<Task[]>([]);
  const [inProgress, setInProgress] = useState<Task[]>([]);
  const [closed, setClosed] = useState<Task[]>([]);

  useEffect(() => {
    const fTodos: Task[] = tasks.filter((task: Task) => task.status === 'todo');
    const fInProgress: Task[] = tasks.filter((task: Task) => task.status === 'inprogress');
    const fClosed: Task[] = tasks.filter((task: Task) => task.status === 'closed');

    setTodos(fTodos);
    setInProgress(fInProgress);
    setClosed(fClosed);
  }, [tasks]);

  const statuses = ["todo", "inprogress", "closed"];

  return (
    <div className='flex gap-16'>
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          inProgress={inProgress}
          closed={closed}
        />
      ))}
    </div>
  );
};

export default ListTasks;
// 1p:02:56
const Section: React.FC<ListTasksSectionProps> = ({ status, tasks, setTasks, todos, inProgress, closed }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: string }) => addItemToSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }))
  let text = "Todo"
  let bg = "bg-black"
  let tasksToMap = todos
  if (status === 'inprogress') {
    text = 'In Progress'
    bg = 'bg-black'
    tasksToMap = inProgress
  }
  if (status === 'closed') {
    text = 'Closed'
    bg = 'bg-black'
    tasksToMap = closed
  }
  const addItemToSection = (id:any) => {
    setTasks((prev) => {
      const mTasks = prev.map(t => {
        if(t.id === id) {
          return{...t,status:status}
        }
        return t
      })
      localStorage.setItem("tasks",JSON.stringify(mTasks))
      toast.success("Status changed")
      return mTasks
    })
  }
  return (
    <div ref={drop} className={`w-64 rounded-md p-2 ${isOver ? "shadow-lg" : ""}`}>
      <Header text={text} bg={bg} count={tasksToMap.length} />
      {tasksToMap.length > 0 && tasksToMap.map(task => <TaskItem task={task} key={task.id} tasks={tasks} setTasks={setTasks} />)}
    </div>
  );
};
const Header: React.FC<headerProps> = ({ text, bg, count }) => {
  return <div className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-sm text-white`}>
    {text} <div className='ml-2 bg-white w-5 h-5 text-black  rounded-full flex items-center justify-center'>{count}</div>
  </div>
}
const TaskItem: React.FC<TaskItemProps> = ({ task, tasks, setTasks }) => {
  const handleRemove = (id: any) => {

    const fTasks = tasks.filter(t => t.id !== id)
    localStorage.setItem("tasks", JSON.stringify(fTasks))
    setTasks(fTasks)
    toast.success("Task removed")
  }
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item:{id:task.id},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))
  return (
    <div ref={drag} className={`relative ${isDragging?"opacity-25":"opacity-100"} p-4 mt-8 shadow-md rounded-md cursor-grab dark:bg-[#222222]`}>
      <p>{task.name}</p>
      <Button variant="ghost" onClick={() => handleRemove(task.id)} className='absolute bottom-1 rounded-full right-1 py-[2px] px-[6px] text-slate-400'>
        <X className='w-4 h-4' />
      </Button>
    </div>
  )
}