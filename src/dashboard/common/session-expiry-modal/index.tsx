import { ReactElement } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "./index.css";

const SESSION_EXPIRY = {
    MESSAGE:
        "For security reasons, inactive sessions are automatically signed out. To continue working, please confirm your session.",
    TIME_REMAINING: "TIME REMAINING",
    CONTINUE: "Continue session",
    SIGN_OUT: "Sign out now",
};

interface SessionExpiryModalProps {
    visible: boolean;
    secondsLeft: number;
    onContinue: () => void;
    onLogout: () => void;
}

export const SessionExpiryModal = ({
    visible,
    secondsLeft,
    onContinue,
    onLogout,
}: SessionExpiryModalProps): ReactElement => {
    const minutes = Math.floor(secondsLeft / 60)
        .toString()
        .padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");

    return (
        <Dialog
            visible={visible}
            onHide={onLogout}
            className='session-expiry-modal'
            closable={false}
            draggable={false}
            header='Your session is about to expire'
        >
            <div className='session-expiry-modal__content'>
                <p className='session-expiry-modal__description'>{SESSION_EXPIRY.MESSAGE}</p>
                <div className='session-expiry-modal__timer'>
                    <span className='session-expiry-modal__timer-value'>
                        {minutes}:{seconds}
                    </span>
                    <span className='session-expiry-modal__timer-label'>
                        {SESSION_EXPIRY.TIME_REMAINING}
                    </span>
                </div>
                <div className='session-expiry-modal__actions'>
                    <Button
                        label={SESSION_EXPIRY.CONTINUE}
                        className='session-expiry-modal__button session-expiry-modal__button--primary'
                        onClick={onContinue}
                    />
                    <Button
                        label={SESSION_EXPIRY.SIGN_OUT}
                        className='session-expiry-modal__button session-expiry-modal__button--secondary'
                        outlined
                        onClick={onLogout}
                    />
                </div>
            </div>
        </Dialog>
    );
};
