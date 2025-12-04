import { Button } from "primereact/button";
import { FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import { useStore } from "store/hooks";
import { PhoneInput } from "dashboard/common/form/inputs";
import { ProgressIndicator } from "../ProgressIndicator";

interface TwoFactorAuthForm {
    phoneNumber: string;
    verificationCode: string[];
    backupCodes: string[];
}

interface PhoneNumberStepProps {
    formik: FormikProps<TwoFactorAuthForm>;
}

export const PhoneNumberStep = observer(({ formik }: PhoneNumberStepProps) => {
    const twoFactorAuthStore = useStore().userStore.twoFactorAuth;

    return (
        <>
            <ProgressIndicator currentStep={twoFactorAuthStore.currentStep} />
            <h1 className='two-factor-auth__title'>Add Your Number</h1>
            <p className='two-factor-auth__description'>
                Enter your phone number, and we'll send you a verification code via text message.
            </p>
            <form onSubmit={formik.handleSubmit}>
                <div className='two-factor-auth__input space pt-2 pb-2'>
                    <PhoneInput
                        name='Phone number'
                        className={`sign__input ${
                            formik.touched.phoneNumber && formik.errors.phoneNumber
                                ? "p-invalid"
                                : ""
                        }`}
                        id='phoneNumber'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phoneNumber}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                        <small className='p-error error-space'>{formik.errors.phoneNumber}</small>
                    ) : null}
                </div>
                <div className='text-center'>
                    <Button
                        label='Continue'
                        severity='secondary'
                        type='submit'
                        className='two-factor-auth__button two-factor-auth__button--secondary'
                    />
                </div>
            </form>
        </>
    );
});
