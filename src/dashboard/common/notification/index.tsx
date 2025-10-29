import { ReactElement, ReactNode, createContext, useContext, useState, useCallback } from "react";
import { DashboardDialog } from "dashboard/common/dialog";

export enum NOTIFICATION_TYPE {
    INFO,
    WARNING,
    ERROR,
}

interface NotificationOptions {
    type?: NOTIFICATION_TYPE;
    description?: string;
}

interface NotificationContextValue {
    showNotification: (options?: NotificationOptions) => void;
    hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps): ReactElement => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [notificationType, setNotificationType] = useState<NOTIFICATION_TYPE>(
        NOTIFICATION_TYPE.INFO
    );
    const [notificationDescription, setNotificationDescription] = useState<string>("");

    const showNotification = useCallback((options: NotificationOptions = {}) => {
        setNotificationType(options.type || NOTIFICATION_TYPE.INFO);
        setNotificationDescription(options.description || "");
        setIsVisible(true);
    }, []);

    const hideNotification = useCallback(() => {
        setIsVisible(false);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification }}>
            {children}
            <DashboardDialog
                header={notificationType || NOTIFICATION_TYPE.INFO}
                onHide={hideNotification}
                visible={isVisible}
            >
                <div>
                    <p>{notificationDescription}</p>
                </div>
            </DashboardDialog>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === null) {
        throw new Error("This hook must be used within a NotificationProvider");
    }
    return context;
};
