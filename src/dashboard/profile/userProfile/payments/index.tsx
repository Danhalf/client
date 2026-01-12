import { ReactElement } from "react";

export const Payments = (): ReactElement => {
    return (
        <div className='user-profile__content'>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>Next payment</div>
                <div className='profile-row__value'>16 of May, 2023</div>
            </div>
        </div>
    );
};
