import { Button } from "primereact/button";

interface IntroductionStepProps {
    onContinue: () => void;
}

export const IntroductionStep = ({ onContinue }: IntroductionStepProps) => {
    return (
        <>
            <div className='two-factor-auth__icon'>
                <div className='two-factor-auth__icon-devices'>
                    <div className='two-factor-auth__icon-device two-factor-auth__icon-device--desktop'>
                        <i className='icon adms-check' />
                    </div>
                    <div className='two-factor-auth__icon-lock'>
                        <i className='icon adms-lock' />
                    </div>
                    <div className='two-factor-auth__icon-device two-factor-auth__icon-device--phone'>
                        <i className='icon adms-check' />
                    </div>
                </div>
            </div>
            <h1 className='two-factor-auth__title'>Two-factor authentication</h1>
            <p className='two-factor-auth__description'>
                Add an extra layer of protection to your account with 2FA. Use a code sent to your
                phone along with your password to stay secure.
            </p>
            <Button
                label='Continue'
                severity='success'
                onClick={onContinue}
                className='two-factor-auth__button two-factor-auth__button--primary'
            />
        </>
    );
};

