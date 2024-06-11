import { observer } from "mobx-react-lite";
import { InputText } from "primereact/inputtext";
import { ReactElement, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useStore } from "store/hooks";
import "./index.css";

export const ContactsSocialInfo = observer((): ReactElement => {
    const store = useStore().contactStore;
    const { contact, changeContact } = store;
    const [anotherEmail, setAnotherEmail] = useState<boolean>(false);
    const [anotherPhone, setAnotherPhone] = useState<boolean>(false);

    useEffect(() => {
        setAnotherEmail(!!contact.email2?.length);
        setAnotherPhone(!!contact.phone2?.length);
    }, [contact.email2, contact.phone2]);

    return (
        <div className='grid contacts-social row-gap-2'>
            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        className='contacts-social__text-input w-full'
                        value={contact.email1 || ""}
                        onChange={({ target: { value } }) => {
                            changeContact("email1", value);
                        }}
                    />
                    <label className='float-label'>E-mail address</label>
                </span>
            </div>
            {anotherEmail ? (
                <div className='col-6'>
                    <span className='p-float-label'>
                        <InputText
                            className='contacts-social__text-input w-full'
                            value={contact.email2 || ""}
                            onChange={({ target: { value } }) => {
                                if (!value?.length) setAnotherEmail(false);
                                changeContact("email2", value);
                            }}
                        />
                        <label className='float-label'>E-mail address</label>
                    </span>
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

            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        className='contacts-social__text-input w-full'
                        value={contact.phone1 || ""}
                        onChange={({ target: { value } }) => {
                            changeContact("phone1", value);
                        }}
                    />
                    <label className='float-label'>Phone Number</label>
                </span>
            </div>
            {anotherPhone ? (
                <div className='col-6'>
                    <span className='p-float-label'>
                        <InputText
                            className='contacts-social__text-input w-full'
                            value={contact.phone2 || ""}
                            onChange={({ target: { value } }) => {
                                if (!value?.length) setAnotherPhone(false);
                                changeContact("phone2", value);
                            }}
                        />
                        <label className='float-label'>Phone Number</label>
                    </span>
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
                <span className='p-float-label'>
                    <InputText
                        className='contacts-social__text-input w-full'
                        value={contact.messager1 || ""}
                        onChange={(e) => changeContact("messager1", e.target.value)}
                    />
                    <label className='float-label'>Facebook</label>
                </span>
            </div>
            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        className='contacts-social__text-input w-full'
                        value={contact.messager2 || ""}
                        onChange={(e) => changeContact("messager2", e.target.value)}
                    />
                    <label className='float-label'>WhatsApp</label>
                </span>
            </div>

            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        className='contacts-social__text-input w-full'
                        value={contact.messager3 || ""}
                        onChange={(e) => changeContact("messager3", e.target.value)}
                    />
                    <label className='float-label'>Slack</label>
                </span>
            </div>

            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        className='contacts-social__text-input w-full'
                        value={contact.messager4 || ""}
                        onChange={(e) => changeContact("messager4", e.target.value)}
                    />
                    <label className='float-label'>Skype</label>
                </span>
            </div>
        </div>
    );
});
