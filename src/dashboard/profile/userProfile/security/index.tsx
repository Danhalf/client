import { ReactElement, useState } from "react";
import { Password } from "primereact/password";

export const Security = (): ReactElement => {
    const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    return (
        <div className='user-profile__content'>
            <div className='user-profile__section'>
                <h3 className='user-profile__section-title'>CHANGE PASSWORD</h3>
                {!showChangePassword && (
                    <div className='user-profile__row profile-row'>
                        <div
                            className='profile__change-password'
                            onClick={() => setShowChangePassword(true)}
                        >
                            Change password
                        </div>
                    </div>
                )}
                {showChangePassword && (
                    <>
                        <div className='user-profile__row profile-row'>
                            <div className='profile-row__label'>Current Password</div>
                            <div className='profile-row__value'>
                                <Password
                                    className='w-100'
                                    value={currentPassword}
                                    onChange={(event) => setCurrentPassword(event.target.value)}
                                    toggleMask
                                    placeholder='Current Password'
                                />
                            </div>
                        </div>
                        <div className='user-profile__row profile-row'>
                            <div className='profile-row__label'></div>
                            <div className='profile-row__value'>
                                <span className='profile__forgot-password'>Forgot password?</span>
                            </div>
                        </div>
                        <div className='user-profile__row profile-row'>
                            <div className='profile-row__label'>New Password</div>
                            <div className='profile-row__value'>
                                <Password
                                    className='w-100'
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    toggleMask
                                    placeholder='New Password'
                                />
                            </div>
                        </div>
                        <div className='user-profile__row profile-row'>
                            <div className='profile-row__label'>Confirm Password</div>
                            <div className='profile-row__value'>
                                <Password
                                    className='w-100'
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    toggleMask
                                    placeholder='Confirm Password'
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className='user-profile__section'>
                <h3 className='user-profile__section-title'>TWO-FACTOR AUTHENTICATION</h3>
                <p className='user-profile__section-text'>
                    For security reasons, two-factor authentication (2FA) cannot be disabled. If you
                    need to <strong>reset</strong> your 2FA settings, please{" "}
                    <span className='user-profile__link'>contact our support team</span> for
                    assistance. We're here to help ensure your account remains secure.
                </p>
            </div>
        </div>
    );
};
