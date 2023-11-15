import { useEffect, useState } from "react";
import { AuthUser } from "http/services/auth.service";
import { getKeyValue } from "services/local-storage.service";
import { Task, getTasksByUserId } from "http/services/tasks.service";
import { AddTaskDialog } from "./add-task-dialog";

export const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showAddTaskDialog, setShowAddTaskDialog] = useState<boolean>(false);
    useEffect(() => {
        const authUser: AuthUser = getKeyValue("admss-client-app-user");
        if (authUser) {
            getTasksByUserId(authUser.useruid).then((response) => setTasks(response.splice(0, 5)));
        }
    }, []);

    const handleAddTaskClick = () => {
        setShowAddTaskDialog(true);
    };

    const handleAddTaskDialogHide = () => {
        setShowAddTaskDialog(false);
    };
    return (
        <>
            <h2 className='card-content__title uppercase'>Tasks</h2>
            <ul className='list-none ml-0 pl-0'>
                {tasks.map((task) => (
                    <li key={task.itemuid} className='mb-2'>
                        <label className='ml-2'>
                            {task.taskname && `${task.taskname} - `}
                            {task.description && `${task.description} - `}
                            {task.username}
                        </label>
                    </li>
                ))}
            </ul>
            <span
                className='add-task-control font-semibold cursor-pointer'
                onClick={handleAddTaskClick}
            >
                <i className='pi pi-plus add-task-control__icon'></i>
                Add new task
            </span>
            <div className='hidden'>
                <AddTaskDialog
                    visible={showAddTaskDialog}
                    onHide={handleAddTaskDialogHide}
                    header='Add Task'
                />
            </div>
        </>
    );
};
