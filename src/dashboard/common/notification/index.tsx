import { ReactElement, ReactNode, createContext, useContext, useState, useCallback } from "react";
import { DashboardDialog } from "dashboard/common/dialog";
import { ERROR_MESSAGES } from "common/constants/error-messages";
import "./index.css";
import { NOTIFICATION_TITLE_STATUS } from "common/constants/title-status";

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

    const [defaultNotificationTitle] = NOTIFICATION_TITLE_STATUS;

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
                header={
                    <div className='notification-header'>
                        <i className={`pi pi-times-circle notification-header__icon`} />
                        <div className='notification-header__title'>
                            {notificationType || defaultNotificationTitle.name}
                        </div>
                    </div>
                }
                children={
                    <div className='text-center w-full notification-body'>
                        {notificationDescription}
                    </div>
                }
                onHide={hideNotification}
                className='notification'
                visible={isVisible}
                action={hideNotification}
                footer='Got it'
            ></DashboardDialog>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === null) {
        throw new Error(ERROR_MESSAGES.PROVIDER_ERROR);
    }
    return context;
};
