import { Button } from "primereact/button";
import { observer } from "mobx-react-lite";
import { useStore } from "store/hooks";
import { ProgressIndicator } from "sign/two-factor-auth/components/ProgressIndicator";

interface BackupCodesStepProps {
    onComplete: () => void;
}

export const BackupCodesStep = observer(({ onComplete }: BackupCodesStepProps) => {
    const twoFactorAuthStore = useStore().userStore.twoFactorAuth;

    return (
        <>
            <ProgressIndicator currentStep={twoFactorAuthStore.currentStep} />
            <div className='two-factor-auth__success-icon'>
                <i className='icon adms-check' />
            </div>
            <h1 className='two-factor-auth__title two-factor-auth__title--success'>
                Successfully Enabled
            </h1>
            <p className='two-factor-auth__description'>
                Save this emergency backup code and store it somewhere safe. It allows you to log in
                if you can't receive verification codes on your phone.
            </p>
            <div className='two-factor-auth__backup-codes'>
                {twoFactorAuthStore.backupCodes.map((code, index) => (
                    <div key={index} className='two-factor-auth__backup-code'>
                        {code}
                    </div>
                ))}
            </div>
            <div className='two-factor-auth__backup-actions'>
                <button
                    type='button'
                    className='two-factor-auth__backup-action'
                    onClick={() => twoFactorAuthStore.handleSaveBackupCodes()}
                >
                    Save
                </button>
                <button
                    type='button'
                    className='two-factor-auth__backup-action'
                    onClick={() => twoFactorAuthStore.handlePrintBackupCodes()}
                >
                    Print
                </button>
                <button
                    type='button'
                    className='two-factor-auth__backup-action'
                    onClick={() => twoFactorAuthStore.handleCopyBackupCodes()}
                >
                    Copy
                </button>
            </div>
            <div className='text-center'>
                <Button
                    label='OK'
                    severity='success'
                    onClick={onComplete}
                    className='two-factor-auth__button two-factor-auth__button--primary'
                />
            </div>
        </>
    );
});
