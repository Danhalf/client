import { Navigate } from "react-router-dom";
import { ReactElement, ReactNode } from "react";
import { usePermissions } from "common/hooks";

interface InventoryProtectedRouteProps {
    children: ReactNode;
    requireCreate?: boolean;
    requireEdit?: boolean;
}

export const InventoryProtectedRoute = ({
    children,
    requireCreate,
    requireEdit,
}: InventoryProtectedRouteProps): ReactElement => {
    const { inventory } = usePermissions();

    if (!inventory.canView()) {
        return <Navigate to='/dashboard' replace />;
    }

    if (requireCreate && !inventory.canCreate()) {
        return <Navigate to='/dashboard/inventory' replace />;
    }

    if (requireEdit && !inventory.canOpenDetails()) {
        return <Navigate to='/dashboard/inventory' replace />;
    }

    return <>{children}</>;
};
