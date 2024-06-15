import { observer } from "mobx-react-lite";
import { InputText, InputTextProps } from "primereact/inputtext";
import { ReactElement, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useStore } from "store/hooks";
import { useFormikContext } from "formik";
import { Contact } from "common/models/contact";

interface SocialInputProps extends InputTextProps {
    social: "Skype" | "Facebook" | "WhatsApp" | "Slack";
}

const SocialInput = (props: SocialInputProps): ReactElement => {
    const currentIcon = `pi pi-${props.social.toLowerCase()}`;
    return (
        <span className='p-float-label contact-social'>
            <InputText
                {...props}
                className='contact-social__input contacts-social__text-input w-full'
            />
            <label className='float-label'>{props.social}</label>
            <i className={`${currentIcon} contact-social__icon`} />
        </span>
    );
};

export const ContactsSocialInfo = observer((): ReactElement => {
    const store = useStore().contactStore;
    const { contact, changeContact } = store;
    const { values, errors, setFieldValue } = useFormikContext<Contact>();
    const [anotherEmail, setAnotherEmail] = useState<boolean>(false);
    const [anotherPhone, setAnotherPhone] = useState<boolean>(false);

    useEffect(() => {
        setAnotherEmail(!!contact.email2?.length);
        setAnotherPhone(!!contact.phone2?.length);
    }, [contact.email2, contact.phone2]);

    return (
        <div className='grid contacts-social row-gap-2'>
            <div className='col-6 relative'>
                <span className='p-float-label'>
                    <InputText
                        className={`contacts-social__text-input w-full ${
                            errors.email1 ? "p-invalid" : ""
                        }`}
                        value={values.email1 || ""}
                        onChange={({ target: { value } }) => {
                            setFieldValue("email1", value);
                            changeContact("email1", value);
                        }}
                    />
                    <label className='float-label'>E-mail address</label>
                </span>
                <small className='p-error'>{errors.email1}</small>
            </div>
            {anotherEmail ? (
                <div className='col-6 relative'>
                    <span className='p-float-label'>
                        <InputText
                            className={`contacts-social__text-input w-full ${
                                errors.email2 ? "p-invalid" : ""
                            }`}
                            value={values.email2 || ""}
                            onChange={({ target: { value } }) => {
                                if (!value?.length) setAnotherEmail(false);
                                setFieldValue("email2", value);
                                changeContact("email2", value);
                            }}
                        />
                        <label className='float-label'>E-mail address</label>
                    </span>
                    <small className='p-error'>{errors.email2}</small>
                </div>
            ) : (
                <div className='col-6'>
                    <Button
                        type='button'
                        className='contacts__button'
                        onClick={() => setAnotherEmail(true)}
                        outlined
                    >
                        <i className='pi pi-plus mr-2 text-xs pt-1' />
                        Add another email address
                    </Button>
                </div>
            )}

            <div className='col-6 relative'>
                <span className='p-float-label'>
                    <InputText
                        className={`contacts-social__text-input w-full ${
                            errors.phone1 ? "p-invalid" : ""
                        }`}
                        value={values.phone1 || ""}
                        onChange={({ target: { value } }) => {
                            setFieldValue("phone1", value);
                            changeContact("phone1", value);
                        }}
                    />
                    <label className='float-label'>Phone Number</label>
                </span>
                <small className='p-error'>{errors.phone1}</small>
            </div>
            {anotherPhone ? (
                <div className='col-6 relative'>
                    <span className='p-float-label'>
                        <InputText
                            className={`contacts-social__text-input w-full ${
                                errors.phone2 ? "p-invalid" : ""
                            }`}
                            value={values.phone2 || ""}
                            onChange={({ target: { value } }) => {
                                if (!value?.length) setAnotherPhone(false);
                                setFieldValue("phone2", value);
                                changeContact("phone2", value);
                            }}
                        />
                        <label className='float-label'>Phone Number</label>
                    </span>
                    <small className='p-error'>{errors.phone2}</small>
                </div>
            ) : (
                <div className='col-6'>
                    <Button
                        type='button'
                        className='contacts__button'
                        outlined
                        onClick={() => setAnotherPhone(true)}
                    >
                        <i className='pi pi-plus mr-2 text-xs pt-1' />
                        Add another phone number
                    </Button>
                </div>
            )}

            <hr className='form-line' />

            <div className='col-6'>
                <SocialInput
                    social='Facebook'
                    value={contact.messager1}
                    onChange={({ target: { value } }) => changeContact("messager1", value)}
                />
            </div>
            <div className='col-6'>
                <SocialInput
                    social='WhatsApp'
                    value={contact.messager2}
                    onChange={({ target: { value } }) => changeContact("messager2", value)}
                />
            </div>

            <div className='col-6'>
                <SocialInput
                    social='Slack'
                    value={contact.messager3}
                    onChange={({ target: { value } }) => changeContact("messager3", value)}
                />
            </div>

            <div className='col-6'>
                <SocialInput
                    social='Skype'
                    value={contact.messager4}
                    onChange={({ target: { value } }) => changeContact("messager4", value)}
                />
            </div>
        </div>
    );
});
