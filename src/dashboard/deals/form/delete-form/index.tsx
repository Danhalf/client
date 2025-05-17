import { observer } from "mobx-react-lite";
import { DropdownProps } from "primereact/dropdown";
import { ReactElement } from "react";

interface DeleteDealFormProps extends DropdownProps {
    isDeleteConfirm: boolean;
    attemptedSubmit?: boolean;
}

export const DeleteDealForm = observer(
    ({ isDeleteConfirm, attemptedSubmit }: DeleteDealFormProps): ReactElement => {
        return <div>DeleteForm</div>;
    }
);
