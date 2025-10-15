import { Password, PasswordProps } from "primereact/password";
import { PASSWORD_REGEX } from "common/constants/regex";
import "./index.css";
import { useId } from "react";

interface PasswordInputProps extends PasswordProps {
    label?: string;
    password: string;
    setPassword: (password: string) => void;
}

export const PasswordInput = ({
    label = "Password (required)",
    password,
    setPassword,
    ...props
}: PasswordInputProps) => {
    const id = useId();
    const hasValidLength = PASSWORD_REGEX.LENGTH_REGEX.test(password || "");
    const hasLowercase = PASSWORD_REGEX.LOWERCASE_REGEX.test(password || "");
    const hasUppercase = PASSWORD_REGEX.UPPERCASE_REGEX.test(password || "");
    const hasNumber = PASSWORD_REGEX.NUMBER_REGEX.test(password || "");
    const hasSpecial = PASSWORD_REGEX.SPECIAL_CHAR_REGEX.test(password || "");

    const getRuleClass = (isCorrect: boolean) =>
        isCorrect ? "password-content__success" : "password-content__error";

    const passwordContent = (
        <section className='password-content'>
            Password must be
            <span className={getRuleClass(hasValidLength)}>&nbsp;5–64 characters&nbsp;</span>
            and include at least
            <span className={getRuleClass(hasLowercase)}>&nbsp;1 lowercase</span> letter,
            <span className={getRuleClass(hasUppercase)}>&nbsp;1 uppercase</span> letter,
            <span className={getRuleClass(hasNumber)}>&nbsp;1 Number&nbsp;</span>
            and
            <span className={getRuleClass(hasSpecial)}>&nbsp;1 special character&nbsp;</span>
            (!@#$%^&*()-+)
        </section>
    );

    return (
        <span className='p-float-label'>
            <Password
                inputId={id}
                name='Password'
                value={password}
                className='w-full'
                toggleMask
                autoComplete='new-password'
                inputClassName='w-full'
                onChange={(e) => setPassword(e.target.value)}
                content={passwordContent}
                feedback={true}
                {...props}
            />
            <label htmlFor={id} className='float-label'>
                {label}
            </label>
        </span>
    );
};
