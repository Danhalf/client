import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import "../index.css";
import { DASHBOARD_PAGE } from "common/constants/links";

export interface TwoFactorAuthForm {
    code: string;
}

export const TwoFactorAuth = () => {
    const navigate = useNavigate();

    const formik = useFormik<TwoFactorAuthForm>({
        initialValues: {
            code: "",
        },
        validate: (data: { code: string }) => {
            let errors: any = {};

            if (!data.code.trim()) {
                errors.code = "Code is required.";
            }

            return errors;
        },
        onSubmit: async () => {
            navigate(DASHBOARD_PAGE);
        },
    });

    const handleCancel = () => {
        navigate(DASHBOARD_PAGE);
    };

    return (
        <section className='sign'>
            <div className='two-factor-auth'>
                <div className='two-factor-auth-wrapper'>
                    <h1 className='sign__title'>Two-Factor Authentication</h1>
                    <form onSubmit={formik.handleSubmit}>
                        <div className='two-factor-auth__input space pt-2 pb-2'>
                            <span className='w-full p-float-label'>
                                <InputText
                                    placeholder='Verification Code'
                                    className={`sign__input ${
                                        formik.touched.code && formik.errors.code ? "p-invalid" : ""
                                    }`}
                                    id='code'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.code}
                                />
                                <label htmlFor='code'>Verification Code</label>
                            </span>
                            {formik.touched.code && formik.errors.code ? (
                                <small className='p-error error-space'>{formik.errors.code}</small>
                            ) : null}
                        </div>

                        <div className='two-factor-auth__footer'>
                            <div className='two-factor-auth__buttons'>
                                <Button
                                    label='Cancel'
                                    severity='secondary'
                                    type='button'
                                    onClick={handleCancel}
                                    className='sign__button font-bold flex-1'
                                />
                                <Button
                                    label='Verify'
                                    severity='success'
                                    type='submit'
                                    className='sign__button font-bold flex-1'
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};
