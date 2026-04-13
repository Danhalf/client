import { ReactElement, useMemo } from "react";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { EmailInput, PhoneInput, StateDropdown, TextInput } from "dashboard/common/form/inputs";
import { ProfileAvatar } from "dashboard/profile/common/profile-avatar";
import "./index.css";
import { Splitter } from "dashboard/common/display";
import InfoIcon from "assets/images/info-icon.svg";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

const INFO_MESSAGE = `At least one contact method is required - phone number or email. 
Without this information, two-factor authentication cannot be set up for the user in the future. 
If both fields are filled in, the user will be able to choose their preferred two-factor authentication method.`;

export const PersonalInformation = observer((): ReactElement => {
    const profileStore = useStore().profileStore;
    const user = useStore().userStore;
    const { profile, changeProfile, locations, selectedLocationUid, changeCurrentLocation } =
        profileStore;
    const { authUser } = user;
    const locationOptions = useMemo(
        () =>
            locations.map((location) => ({
                label: location.locName,
                value: location.locationuid,
            })),
        [locations]
    );

    return (
        <div className='user-profile__content'>
            <div className='user-profile__header'>
                <h3 className='user-profile__section-title'>Personal Information</h3>
            </div>
            <div className='user-profile-personal grid'>
                <div className='col-6 user-profile-personal__info'>
                    <TextInput
                        name='Username'
                        value={authUser?.loginname || profile?.loginname || ""}
                        disabled
                    />
                    <TextInput
                        name='Company Name'
                        value={authUser?.companyname || profile?.companyname || ""}
                        disabled
                    />
                    <div className='user-profile-location-select'>
                        <MultiSelect
                            optionLabel='label'
                            optionValue='value'
                            options={locationOptions}
                            value={selectedLocationUid ? [selectedLocationUid] : []}
                            onChange={({ value }: MultiSelectChangeEvent) =>
                                changeCurrentLocation(value?.[0] || "")
                            }
                            placeholder='Dealer Locations'
                            className='inventory-dropdown inventory-filter user-profile-location-select__input'
                            display='chip'
                            selectedItemsLabel='{0} selected'
                            selectionLimit={1}
                            maxSelectedLabels={1}
                            pt={{
                                header: { className: "inventory-filter__header" },
                                wrapper: {
                                    className: "inventory-filter__wrapper",
                                    style: { maxHeight: "300px", maxWidth: "310px" },
                                },
                            }}
                        />
                    </div>
                </div>
                <div className='col-6 user-profile-personal__avatar'>
                    <ProfileAvatar />
                </div>
            </div>

            <Splitter className='col-12' />

            <div className='user-profile-contact grid'>
                <TextInput
                    name='Location (address)'
                    colWidth={6}
                    value={profile.address}
                    onChange={(event) => changeProfile("address", event.target.value)}
                />

                <StateDropdown
                    name='State'
                    showClear={!!profile.state}
                    colWidth={3}
                    value={profile.state}
                    onChange={({ value }) => changeProfile("state", value || "")}
                />
                <TextInput
                    name='Zip Code'
                    colWidth={3}
                    value={profile.zipCode}
                    onChange={(event) => changeProfile("zipCode", event.target.value)}
                />
                <PhoneInput
                    name='Phone Number'
                    colWidth={3}
                    required
                    value={profile.phoneNumber}
                    onChange={(e) => changeProfile("phoneNumber", e.target.value)}
                />
                <EmailInput
                    name='E-mail'
                    colWidth={6}
                    value={profile.email}
                    onChange={({ target: { value } }) => changeProfile("email", value)}
                    withValidationMessage
                />
                <div className='col-12 user-profile-info-message'>
                    <img src={InfoIcon} alt='info' className='user-profile-info-message__icon' />
                    <span className='user-profile-info-message__text'>{INFO_MESSAGE}</span>
                </div>
            </div>
        </div>
    );
});
