import { useEffect, useRef, useState } from "react";
import { AuthUser } from "http/services/auth.service";
import { getKeyValue } from "services/local-storage.service";
import { Task, TaskStatus, getTasksByUserId, setTaskStatus } from "http/services/tasks.service";
import { AddTaskDialog } from "./add-task-dialog";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import { LS_APP_USER } from "common/constants/localStorage";
import { TaskSummaryDialog } from "./task-summary";

import "./index.css";
import { Button } from "primereact/button";

export const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showAddTaskDialog, setShowAddTaskDialog] = useState<boolean>(false);
    const [showEditTaskDialog, setShowEditTaskDialog] = useState<boolean>(false);
    const [checkboxDisabled, setCheckboxDisabled] = useState<boolean>(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [checkboxStates, setCheckboxStates] = useState<{ [key: string]: boolean }>({});

    const toast = useRef<Toast>(null);

    const authUser: AuthUser = getKeyValue(LS_APP_USER);

    const getTasks = async (taskCount = 5) => {
        const res = await getTasksByUserId(authUser.useruid, { top: taskCount });
        if (res && Array.isArray(res)) {
            setTasks(res);
        }
    };

    useEffect(() => {
        if (authUser) {
            getTasks();
        }
    }, []);

    const handleEditTask = (task: Task) => {
        setCurrentTask(task);
        setShowEditTaskDialog(true);
    };

    const handleTaskStatusChange = (taskuid: string) => {
        setCheckboxStates((prevStates) => ({
            ...prevStates,
            [taskuid]: true,
        }));
        setCheckboxDisabled(true);

        setTaskStatus(taskuid, TaskStatus.COMPLETED)
            .then((res) => {
                if (res.status === "OK" && toast.current != null) {
                    toast.current.show({
                        severity: "info",
                        summary: "Confirmed",
                        detail: "The task marked as completed",
                        life: 3000,
                    });
                    getTasks();
                }
            })
            .finally(() => {
                setCheckboxStates((prevStates) => ({
                    ...prevStates,
                    [taskuid]: false,
                }));
                setCheckboxDisabled(false);
            });
    };

    const isLoggedUserTask = (): boolean =>
        !!currentTask &&
        (currentTask.parentuid === authUser.useruid || currentTask.useruid === authUser.useruid);

    return (
        <>
            <div className='tasks-header flex justify-content-between align-items-center'>
                <h2 className='card-content__title uppercase m-0'>
                    Tasks
                    <span className={`tasks-count ${!tasks.length ? "empty-list" : ""}`}>
                        ({tasks.length})
                    </span>
                </h2>
                <Button
                    icon='pi pi-plus'
                    className='add-task-control'
                    onClick={() => setShowAddTaskDialog(true)}
                />
            </div>
            <ul className='list-none ml-0 pl-0'>
                {tasks.length ? (
                    tasks.map((task) => {
                        return (
                            <li key={`${task.itemuid}-${task.index}`} className='mb-2'>
                                <Checkbox
                                    name='task'
                                    disabled={checkboxDisabled}
                                    checked={checkboxStates[task.itemuid] || false}
                                    onChange={() => handleTaskStatusChange(task.itemuid)}
                                />
                                <label
                                    className='ml-2 cursor-pointer'
                                    onClick={() => handleEditTask(task)}
                                >
                                    {task.taskname ||
                                        `${task.description} ${
                                            task.username ?? `- ${task.username}`
                                        }`}
                                </label>
                            </li>
                        );
                    })
                ) : (
                    <li className='mb-2 empty-list'>No tasks yet.</li>
                )}
            </ul>
            <div className='hidden'>
                <AddTaskDialog
                    visible={showAddTaskDialog}
                    onHide={() => setShowAddTaskDialog(false)}
                    onAction={getTasks}
                    header='Add Task'
                />
                {isLoggedUserTask() ? (
                    <AddTaskDialog
                        visible={showEditTaskDialog}
                        onHide={() => setShowEditTaskDialog(false)}
                        currentTask={currentTask as Task}
                        header='Edit Task'
                    />
                ) : (
                    <TaskSummaryDialog
                        visible={showEditTaskDialog}
                        onHide={() => setShowEditTaskDialog(false)}
                        currentTask={currentTask as Task}
                        header='Task summary'
                    />
                )}
            </div>

            <Toast ref={toast} />
        </>
    );
};
