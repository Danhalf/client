import { ReactElement } from "react";
import { InputText } from "primereact/inputtext";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";

export const PersonalInformation = observer((): ReactElement => {
    const store = useStore().userStore;
    const { authUser } = store;

    return (
        <div className='user-profile__content'>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>User name</div>
                <div className='profile-row__value'>{authUser?.loginname}</div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>Company name</div>
                <div className='profile-row__value'>
                    <InputText placeholder='Company name' value={authUser?.companyname || ""} />
                </div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>Location</div>
                <div className='profile-row__value'>
                    <InputText placeholder='Location' value={authUser?.locationname || ""} />
                </div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>Address</div>
                <div className='profile-row__value'>
                    <InputText placeholder='Address' value={""} />
                </div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>Phone</div>
                <div className='profile-row__value'>
                    <InputText placeholder='Phone' value={""} />
                </div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>Last login</div>
                <div className='profile-row__value'>04/26/2023 10:45:39 PM</div>
            </div>
        </div>
    );
});
