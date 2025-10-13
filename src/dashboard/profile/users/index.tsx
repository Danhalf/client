import { getClientsList, getUsersList } from "http/services/users";
import { observer } from "mobx-react-lite";
import { useStore } from "store/hooks";
import { useEffect, useState } from "react";

export const Users = observer(() => {
    const { authUser } = useStore().userStore;

    const [users, setUsers] = useState<any[]>([]);

    const handleGetUsers = async () => {
        if (!authUser) return;
        const response = await getUsersList(authUser?.useruid);
        if (response && Array.isArray(response)) {
            return setUsers(response);
        }
        const clientsResponse = await getClientsList(authUser?.useruid);
        if (clientsResponse && Array.isArray(clientsResponse)) {
            return setUsers(clientsResponse);
        }
    };

    useEffect(() => {
        handleGetUsers();
    }, []);

    return (
        <div>
            <h1>Users</h1>
            <div>
                {users.map((user) => (
                    <div key={user.useruid}>{user.username}</div>
                ))}
            </div>
        </div>
    );
});
