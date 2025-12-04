import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FormikProps } from "formik";
import { ProgressIndicator } from "../ProgressIndicator";

interface TwoFactorAuthForm {
    phoneNumber: string;
    verificationCode: string[];
    backupCodes: string[];
}

interface VerificationCodeStepProps {
    formik: FormikProps<TwoFactorAuthForm>;
    currentStep: number;
    phoneNumber: string;
    verificationCode: string[];
    codeInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
    resendTimer: number;
    onCodeChange: (index: number, value: string) => void;
    onCodeKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
    onResendCode: () => void;
}

export const VerificationCodeStep = ({
    formik,
    currentStep,
    phoneNumber,
    verificationCode,
    codeInputRefs,
    resendTimer,
    onCodeChange,
    onCodeKeyDown,
    onResendCode,
}: VerificationCodeStepProps) => {
    const formatPhoneNumber = (phone: string): string => {
        const digits = phone.replace(/\D/g, "");
        if (digits.length === 10) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        return phone;
    };

    return (
        <>
            <ProgressIndicator currentStep={currentStep} />
            <h1 className='two-factor-auth__title'>Authentication</h1>
            <p className='two-factor-auth__description'>
                Enter the code we just sent to {phoneNumber ? formatPhoneNumber(phoneNumber) : "your phone"} to verify your identity.
            </p>
            <form onSubmit={formik.handleSubmit}>
                <div className='two-factor-auth__code-inputs'>
                    {verificationCode.map((code, index) => (
                        <InputText
                            key={index}
                            ref={(el) => (codeInputRefs.current[index] = el)}
                            value={code}
                            onChange={(e) => onCodeChange(index, e.target.value)}
                            onKeyDown={(e) => onCodeKeyDown(index, e)}
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
                    {resendTimer > 0 ? (
                        <span className='two-factor-auth__resend-timer'>
                            Resend code in {resendTimer} seconds
                        </span>
                    ) : (
                        <button
                            type='button'
                            className='two-factor-auth__resend-link'
                            onClick={onResendCode}
                        >
                            Resend code
                        </button>
                    )}
                </div>
            </form>
        </>
    );
};

