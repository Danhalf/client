import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import { useStore } from "store/hooks";
import { ProgressIndicator } from "../ProgressIndicator";

interface TwoFactorAuthForm {
    phoneNumber: string;
    verificationCode: string[];
    backupCodes: string[];
}

interface VerificationCodeStepProps {
    formik: FormikProps<TwoFactorAuthForm>;
}

export const VerificationCodeStep = observer(({ formik }: VerificationCodeStepProps) => {
    const twoFactorAuthStore = useStore().userStore.twoFactorAuth;

    const formatPhoneNumber = (phone: string): string => {
        const digits = phone.replace(/\D/g, "");
        if (digits.length === 10) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        return phone;
    };

    const handleCodeChange = (index: number, value: string) => {
        twoFactorAuthStore.handleCodeChange(index, value);
        formik.setFieldValue("verificationCode", twoFactorAuthStore.verificationCode);
    };

    return (
        <>
            <ProgressIndicator currentStep={twoFactorAuthStore.currentStep} />
            <h1 className='two-factor-auth__title'>Authentication</h1>
            <p className='two-factor-auth__description'>
                Enter the code we just sent to{" "}
                {twoFactorAuthStore.phoneNumber
                    ? formatPhoneNumber(twoFactorAuthStore.phoneNumber)
                    : "your phone"}{" "}
                to verify your identity.
            </p>
            <form onSubmit={formik.handleSubmit}>
                <div className='two-factor-auth__code-inputs'>
                    {twoFactorAuthStore.verificationCode.map((code, index) => (
                        <InputText
                            key={index}
                            ref={(el) => twoFactorAuthStore.setCodeInputRef(index, el)}
                            value={code}
                            onChange={(e) => handleCodeChange(index, e.target.value)}
                            onKeyDown={(e) => twoFactorAuthStore.handleCodeKeyDown(index, e)}
                            className='two-factor-auth__code-input'
                            maxLength={1}
                        />
                    ))}
                </div>
                {formik.touched.verificationCode && formik.errors.verificationCode ? (
                    <small className='p-error'>{formik.errors.verificationCode}</small>
                ) : null}
                <div className='text-center'>
                    <Button
                        label='Continue'
                        severity='secondary'
                        type='submit'
                        className='two-factor-auth__button two-factor-auth__button--secondary'
                    />
                </div>
                <div className='two-factor-auth__resend'>
                    <span>Didn't receive a code? </span>
                    {twoFactorAuthStore.resendTimer > 0 ? (
                        <span className='two-factor-auth__resend-timer'>
                            Resend code in {twoFactorAuthStore.resendTimer} seconds
                        </span>
                    ) : (
                        <button
                            type='button'
                            className='two-factor-auth__resend-link'
                            onClick={() => twoFactorAuthStore.handleResendCode()}
                        >
                            Resend code
                        </button>
                    )}
                </div>
            </form>
        </>
    );
});
