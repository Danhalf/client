import { ReactElement, useState } from "react";
import { Password } from "primereact/password";
import "./index.css";

export const Security = (): ReactElement => {
    const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    return (
        <div className='user-profile__content'>
            <div className='user-profile__section'>
                <h3 className='user-profile__section-title'>CHANGE PASSWORD</h3>
                <div className='user-profile-password'>
                    {!showChangePassword && (
                        <div className='user-profile-password__trigger'>
                            <span
                                className='user-profile-password__link'
                                onClick={() => setShowChangePassword(true)}
                            >
                                Change password
                            </span>
                        </div>
                    )}
                    {showChangePassword && (
                        <div className='user-profile-password__fields'>
                            <div className='user-profile-password__field'>
                                <Password
                                    className='user-profile-password__input'
                                    value={currentPassword}
                                    onChange={(event) => setCurrentPassword(event.target.value)}
                                    toggleMask
                                    placeholder='Current Password'
                                />
                            </div>
                            <div className='user-profile-password__forgot'>
                                <span className='user-profile-password__forgot-link'>
                                    Forgot password?
                                </span>
                            </div>
                            <div className='user-profile-password__field'>
                                <Password
                                    className='user-profile-password__input'
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    toggleMask
                                    placeholder='New Password'
                                />
                            </div>
                            <div className='user-profile-password__field'>
                                <Password
                                    className='user-profile-password__input'
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    toggleMask
                                    placeholder='Confirm Password'
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='user-profile__section'>
                <h3 className='user-profile__section-title'>TWO-FACTOR AUTHENTICATION</h3>
                <div className='user-profile-two-factor'>
                    <p className='user-profile-two-factor__text'>
                        For security reasons, two-factor authentication (2FA) cannot be disabled. If
                        you need to <strong>reset</strong> your 2FA settings, please{" "}
                        <span className='user-profile-two-factor__link'>
                            contact our support team
                        </span>{" "}
                        for assistance. We're here to help ensure your account remains secure.
                    </p>
                </div>
            </div>
        </div>
    );
};
