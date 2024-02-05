import React, { useEffect, useState } from 'react';

type ListTasksProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

type ListTasksSectionProps = {
  status: string;
  tasks: Task[];
  todos:Task[];
  inProgress:Task[];
  closed:Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

type Task = {
  id: string;
  name: string;
  status: string;
};
type headerProps = {
    text:string;
    bg:string;
    count:number
}
type TaskItemProps = {

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

const Section: React.FC<ListTasksSectionProps> = ({ status,tasks, setTasks, todos , inProgress, closed}) => {
    let text = "Todo"
    let bg = "bg-slate-500"
    let tasksToMap = todos
    if(status === 'inprogress') {
        text = 'In Progress' 
        bg = 'bg-purple-500'
        tasksToMap = inProgress
    }
    if(status === 'closed') {
        text = 'Closed' 
        bg = 'bg-green-500'
        tasksToMap = closed
    }
  return (
    <div className={`w-64`}>
        <Header text={text} bg={bg} count={tasksToMap.length}/>
        {tasksToMap.length > 0 && tasksToMap.map(task => <TaskItem/>)}
    </div>
  );
};
const Header:React.FC<headerProps> = ({text,bg,count}) => {
    return <div className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-sm text-white`}>
        {text} <div className='ml-2'>{count}</div>
    </div>
}
const TaskItem:React.FC<TaskItemProps> = () => {
    return <div>
     
    </div>
}