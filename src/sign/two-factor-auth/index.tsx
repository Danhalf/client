import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useState, useEffect, useRef } from "react";
import "../index.css";
import "./index.css";
import { DASHBOARD_PAGE } from "common/constants/links";
import { IntroductionStep } from "./components/Introduction";
import { PhoneNumberStep } from "./components/PhoneNumber";
import { VerificationCodeStep } from "./components/Verification";
import { BackupCodesStep } from "./components/BackupCodes";

export interface TwoFactorAuthForm {
    phoneNumber: string;
    verificationCode: string[];
    backupCodes: string[];
}

enum TwoFactorAuthStep {
    INTRODUCTION = 1,
    PHONE_NUMBER = 2,
    VERIFICATION_CODE = 3,
    SUCCESS = 4,
}

export const TwoFactorAuth = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<TwoFactorAuthStep>(
        TwoFactorAuthStep.INTRODUCTION
    );
    const [resendTimer, setResendTimer] = useState<number>(60);
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [verificationCode, setVerificationCode] = useState<string[]>(["", "", "", "", "", ""]);
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const formik = useFormik<TwoFactorAuthForm>({
        initialValues: {
            phoneNumber: "",
            verificationCode: ["", "", "", "", "", ""],
            backupCodes: [],
        },
        validate: (data) => {
            let errors: any = {};

            if (currentStep === TwoFactorAuthStep.PHONE_NUMBER) {
                if (!data.phoneNumber.trim()) {
                    errors.phoneNumber = "Phone number is required.";
                }
            }

            if (currentStep === TwoFactorAuthStep.VERIFICATION_CODE) {
                if (data.verificationCode.some((code) => !code.trim())) {
                    errors.verificationCode = "All code digits are required.";
                }
            }

            return errors;
        },
        onSubmit: async () => {
            if (currentStep === TwoFactorAuthStep.PHONE_NUMBER) {
                const cleanPhoneNumber = formik.values.phoneNumber.replace(/\D/g, "");
                setPhoneNumber(cleanPhoneNumber);
                setCurrentStep(TwoFactorAuthStep.VERIFICATION_CODE);
                setResendTimer(60);
                setTimeout(() => {
                    codeInputRefs.current[0]?.focus();
                }, 100);
            } else if (currentStep === TwoFactorAuthStep.VERIFICATION_CODE) {
                const generatedBackupCodes = Array.from({ length: 15 }, () => {
                    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10))
                        .join("")
                        .replace(/(\d{3})(\d{3})/, "$1 $2");
                });
                setBackupCodes(generatedBackupCodes);
                setCurrentStep(TwoFactorAuthStep.SUCCESS);
            }
        },
    });

    useEffect(() => {
        if (currentStep === TwoFactorAuthStep.VERIFICATION_CODE && resendTimer > 0) {
            const timer = setTimeout(() => {
                setResendTimer(resendTimer - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentStep, resendTimer]);

    const handleContinue = () => {
        if (currentStep === TwoFactorAuthStep.INTRODUCTION) {
            setCurrentStep(TwoFactorAuthStep.PHONE_NUMBER);
        } else {
            formik.handleSubmit();
        }
    };

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.slice(-1);
        }
        if (!/^\d*$/.test(value)) {
            return;
        }

        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);
        formik.setFieldValue("verificationCode", newCode);

        if (value && index < 5) {
            codeInputRefs.current[index + 1]?.focus();
        }
    };

    const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
            codeInputRefs.current[index - 1]?.focus();
        }
    };

    const handleResendCode = () => {
        if (resendTimer === 0) {
            setResendTimer(60);
        }
    };

    const handleSaveBackupCodes = () => {
        const codesText = backupCodes.join("\n");
        const blob = new Blob([codesText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "2fa-backup-codes.txt";
        link.click();
        URL.revokeObjectURL(url);
    };

    const handlePrintBackupCodes = () => {
        window.print();
    };

    const handleCopyBackupCodes = () => {
        navigator.clipboard.writeText(backupCodes.join("\n"));
    };

    const handleOk = () => {
        navigate(DASHBOARD_PAGE);
    };

    return (
        <section className='sign'>
            <div className='two-factor-auth'>
                <div className='two-factor-auth-wrapper'>
                    {currentStep === TwoFactorAuthStep.INTRODUCTION && (
                        <IntroductionStep onContinue={handleContinue} />
                    )}
                    {currentStep === TwoFactorAuthStep.PHONE_NUMBER && (
                        <PhoneNumberStep formik={formik} currentStep={currentStep} />
                    )}
                    {currentStep === TwoFactorAuthStep.VERIFICATION_CODE && (
                        <VerificationCodeStep
                            formik={formik}
                            currentStep={currentStep}
                            phoneNumber={phoneNumber}
                            verificationCode={verificationCode}
                            codeInputRefs={codeInputRefs}
                            resendTimer={resendTimer}
                            onCodeChange={handleCodeChange}
                            onCodeKeyDown={handleCodeKeyDown}
                            onResendCode={handleResendCode}
                        />
                    )}
                    {currentStep === TwoFactorAuthStep.SUCCESS && (
                        <BackupCodesStep
                            currentStep={currentStep}
                            backupCodes={backupCodes}
                            onSave={handleSaveBackupCodes}
                            onPrint={handlePrintBackupCodes}
                            onCopy={handleCopyBackupCodes}
                            onComplete={handleOk}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};
