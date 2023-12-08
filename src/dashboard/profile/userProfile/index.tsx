import { DashboardDialog } from "dashboard/common/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { DialogProps } from "primereact/dialog";
import "./index.css";
import { AuthUser } from "http/services/auth.service";
import { Password } from "primereact/password";

interface UserProfileDialogProps extends DialogProps {
    authUser: AuthUser;
}

export const UserProfileDialog = ({
    visible,
    onHide,
    authUser,
}: UserProfileDialogProps): JSX.Element => {
    const [user, setUser] = useState<AuthUser>(authUser);

    useEffect(() => {}, []);

    const handleSendSupportContact = (): void => {
        onHide();
        return;
    };

    return (
        <DashboardDialog
            className='dialog__user-profile user-profile'
            footer='Save changes'
            header='My profile'
            visible={visible}
            onHide={onHide}
            action={handleSendSupportContact}
        >
            <div className='user-profile__row profile-row'>
                <div className='profile-row__title'>User name</div>
                <div className='profile-row__value'>{user.loginname}</div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__title'>Company name</div>
                <div className='profile-row__value'>
                    <InputText
                        placeholder='Company name'
                        value={user.companyname}
                        onChange={(event) =>
                            setUser((prev) => ({ ...prev, companyname: event.target.value }))
                        }
                    />
                </div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__title'>Location</div>
                <div className='profile-row__value'>
                    <InputText placeholder='Location' value={"Arizona"} onChange={(event) => {}} />
                </div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__title'>Address</div>
                <div className='profile-row__value'>
                    <InputText
                        placeholder='Address'
                        value={"40377 Cit Crest"}
                        onChange={(event) => {}}
                    />
                </div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__title'>Phone</div>
                <div className='profile-row__value'>
                    <InputText placeholder='Phone' value='536-587-1865' onChange={(event) => {}} />
                </div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__title'>Current password</div>
                <div className='profile-row__value'>
                    <Password
                        className='w-100'
                        value={"password"}
                        onChange={(e) => {}}
                        toggleMask
                    />
                </div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__title'>Next payment</div>
                <div className='profile-row__value'>16 of May, 2023</div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__title'>Last login</div>
                <div className='profile-row__value'>04/26/2023 10:45:39 PM</div>
            </div>
        </DashboardDialog>
    );
};
