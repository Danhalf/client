import { Navigate } from "react-router-dom";
import { ReactElement, ReactNode } from "react";
import { usePermissions } from "common/hooks";
import { DASHBOARD_PAGE } from "common/constants/links";

interface AccountsProtectedRouteProps {
    children: ReactNode;
}

export const AccountsProtectedRoute = ({ children }: AccountsProtectedRouteProps): ReactElement => {
    const { accountPermissions } = usePermissions();

    if (!accountPermissions.canView()) {
        return <Navigate to={DASHBOARD_PAGE} replace />;
    }

    return <>{children}</>;
};
