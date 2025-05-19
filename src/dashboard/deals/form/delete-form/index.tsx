import { LS_APP_USER } from "common/constants/localStorage";
import { BaseResponseError, Status } from "common/models/base-response";
import { ComboBox } from "dashboard/common/form/dropdown";
import { useToast } from "dashboard/common/toast";
import { AuthUser } from "http/services/auth.service";
import { deleteDeal, getDealDeleteReasonsList } from "http/services/deals.service";
import { observer } from "mobx-react-lite";
import { DropdownProps } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getKeyValue } from "services/local-storage.service";
import { useStore } from "store/hooks";

interface DeleteDealFormProps extends DropdownProps {
    isDeleteConfirm: boolean;
    attemptedSubmit?: boolean;
}

export const DeleteDealForm = observer(
    ({ isDeleteConfirm, attemptedSubmit }: DeleteDealFormProps): ReactElement => {
        const toast = useToast();
        const navigate = useNavigate();
        const { id } = useParams();
        const store = useStore().dealStore;

        const { deleteReason } = store;

        const [deleteReasonsList, setDeleteReasonsList] = useState<string[]>([]);
        const [comment, setComment] = useState<string>("");

        useEffect(() => {
            const authUser: AuthUser = getKeyValue(LS_APP_USER);
            if (authUser) {
                getDealDeleteReasonsList(authUser.useruid).then(
                    (res: string[] | BaseResponseError) => {
                        Array.isArray(res) && setDeleteReasonsList(res);
                    }
                );
            }
        }, []);

        const handleDeleteDeal = () => {
            if (id && deleteReason) {
                deleteDeal(id, { reason: deleteReason, comment }).then(
                    (response: BaseResponseError | undefined) => {
                        if (response?.status === Status.ERROR) {
                            const { error } = response as BaseResponseError;
                            toast.current?.show({
                                severity: "error",
                                summary: "Error",
                                detail: error || "Error while deleting deal",
                            });
                        } else {
                            navigate("/dashboard/deals");
                        }
                    }
                );
            }
        };

        useEffect(() => {
            if (isDeleteConfirm) {
                handleDeleteDeal();
            }
        }, [isDeleteConfirm]);

        return (
            <div className='deal-form'>
                <div className='deal-form__title deal-form__title--danger uppercase'>
                    Delete deal
                </div>
                <div className='grid'>
                    <div className='col-6 relative'>
                        <ComboBox
                            optionLabel='name'
                            optionValue='name'
                            value={deleteReason}
                            required
                            onChange={({ value }) => {
                                store.deleteReason = value;
                            }}
                            options={deleteReasonsList}
                            className={`w-full deal-general__dropdown ${
                                attemptedSubmit && !deleteReason ? "p-invalid" : ""
                            }`}
                            label='Reason (required)'
                        />

                        {attemptedSubmit && !deleteReason && (
                            <small className='p-error'>Data is required</small>
                        )}
                    </div>
                    <div className='col-6'>
                        <span className='p-float-label'>
                            <InputTextarea
                                className='w-full'
                                value={comment}
                                pt={{
                                    root: {
                                        style: {
                                            height: "110px",
                                        },
                                    },
                                }}
                                onChange={({ target: { value } }) => {
                                    setComment(value);
                                }}
                            />
                            <label className='float-label'>Comment</label>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
);
