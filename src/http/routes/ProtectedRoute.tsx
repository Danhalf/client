import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { LS_APP_USER } from "common/constants/localStorage";
import { AuthUser } from "http/services/auth.service";
import { getKeyValue, localStorageClear, setKey } from "services/local-storage.service";
import { getUserPermissions } from "http/services/auth-user.service";

interface UserRoles {
    admin: boolean;
    localAdmin: boolean;
    manager: boolean;
    salesPerson: boolean;
}

interface ProtectedRouteProps {
    notAllowed?: (keyof UserRoles)[];
    children?: ReactNode;
}

const throttle = (func: (...args: any[]) => void, limit: number) => {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

export const useAuth = (): AuthUser | null => {
    const [authUser, setAuthUser] = useState<AuthUser | null>(() => getKeyValue(LS_APP_USER));
    const location = useLocation();

    const updatePermissions = async () => {
        if (authUser) {
            getUserPermissions(authUser.useruid).then(
                ({ uaSystemAdmin, uaLocationAdmin, uaManager, uaSalesPerson }) => {
                    const user: AuthUser = getKeyValue(LS_APP_USER);

                    user.islocaladmin = uaLocationAdmin || 0;
                    authUser.islocaladmin = uaLocationAdmin || 0;
                    user.isadmin = uaSystemAdmin || 0;
                    authUser.isadmin = uaSystemAdmin || 0;
                    user.ismanager = uaManager || 0;
                    authUser.ismanager = uaManager || 0;
                    user.issalesperson = uaSalesPerson || 0;
                    authUser.issalesperson = uaSalesPerson || 0;

                    localStorageClear(LS_APP_USER);
                    setKey(LS_APP_USER, JSON.stringify(user));
                    setAuthUser(user);
                }
            );
        }
    };

    const throttledUpdatePermissions = throttle(updatePermissions, 3000);

    useEffect(() => {
        const handleStorageChange = () => {
            setAuthUser(getKeyValue(LS_APP_USER));
        };

        throttledUpdatePermissions();
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return authUser;
};

const ProtectedRoute = ({ notAllowed, children }: ProtectedRouteProps): ReactElement => {
    const authUser = useAuth();
    const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(true);

    useEffect(() => {
        if (authUser) {
            const userRoles: UserRoles = {
                admin: !!authUser.isadmin,
                localAdmin: !!authUser.islocaladmin,
                manager: !!authUser.ismanager,
                salesPerson: !!authUser.issalesperson,
            };

            if (notAllowed) {
                setHasRequiredRole(notAllowed.some((role) => !userRoles[role]));
            }
        }
    }, [authUser, notAllowed]);

    if (!authUser) {
        return <Navigate to='/' replace />;
    }

    if (!hasRequiredRole) {
        return <Navigate to='/dashboard' replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
