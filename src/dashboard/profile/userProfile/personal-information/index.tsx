import { ReactElement, useState } from "react";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { PhoneInput, StateDropdown, TextInput } from "dashboard/common/form/inputs";
import "./index.css";
import { Splitter } from "dashboard/common/display";

export const PersonalInformation = observer((): ReactElement => {
    const store = useStore().userStore;
    const { authUser } = store;

    const [username, setUsername] = useState<string>(authUser?.loginname || "");
    const [companyName, setCompanyName] = useState<string>(authUser?.companyname || "");
    const [location, setLocation] = useState<string>(authUser?.locationname || "");
    const [address, setAddress] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [zipCode, setZipCode] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    return (
        <div className='user-profile__content'>
            <div className='user-profile__header'>
                <h3 className='user-profile__section-title'>Personal Information</h3>
            </div>
            <div className='user-profile-personal grid'>
                <div className='col-6 user-profile-personal__info'>
                    <TextInput
                        name='Username'
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <TextInput
                        name='Company Name'
                        value={companyName}
                        onChange={(event) => setCompanyName(event.target.value)}
                    />
                    <TextInput
                        name='Location (city/state)'
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                    />
                </div>
                <div className='col-6 user-profile-personal__avatar'>
                    <div className='user-profile-avatar'>
                        <div className='user-profile-avatar__placeholder'>
                            <i className='pi pi-user' />
                        </div>
                        <div className='user-profile-avatar__choose'>
                            <i className='pi pi-camera' />
                        </div>
                    </div>
                </div>
            </div>

            <Splitter className='col-12' />

            <div className='user-profile-contact grid'>
                <div className='col-6'>
                    <TextInput
                        name='Location (address)'
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                    />
                </div>

                <div className='col-6'>
                    <StateDropdown
                        name='State'
                        showClear={!!state}
                        className='w-full'
                        value={state}
                        onChange={({ value }) => setState(value || "")}
                    />
                </div>
                <div className='col-6'>
                    <TextInput
                        name='Zip Code'
                        value={zipCode}
                        onChange={(event) => setZipCode(event.target.value)}
                    />
                </div>
                <div className='col-6'>
                    <PhoneInput
                        name='Phone Number'
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className='col-6'>
                    <TextInput
                        name='E-mail'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='col-12 user-profile-info-message'>
                    <i className='pi pi-info-circle user-profile-info-message__icon' />
                    <span className='user-profile-info-message__text'>
                        At least one contact method is required - phone number or email. Without
                        this information, two-factor authentication cannot be set up for the user in
                        the future. If both fields are filled in, the user will be able to choose
                        their preferred two-factor authentication method.
                    </span>
                </div>
            </div>
        </div>
    );
});
