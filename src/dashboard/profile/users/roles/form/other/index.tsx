import { PermissionKey } from "common/constants/permissions";
import { BorderedCheckbox } from "dashboard/common/form/inputs";
import { observer } from "mobx-react-lite";
import { CheckboxChangeEvent } from "primereact/checkbox";
import { ReactElement, useState } from "react";
import { useStore } from "store/hooks";

export const RolesOther = observer((): ReactElement => {
    const { togglePermission, hasRolePermission } = useStore().usersStore;
    const [selectAll, setSelectAll] = useState<boolean>(false);

    const handleSelectAllChange = (event: CheckboxChangeEvent) => {
        setSelectAll(event.checked ?? false);
        const otherPermissions: readonly PermissionKey[] = ["uaAllowReports", "uaAllowPrinting"];

        otherPermissions.forEach((permission: PermissionKey) => {
            const shouldAdd = event.checked ?? false;
            const hasPermission = hasRolePermission(permission);
            if (shouldAdd && !hasPermission) {
                togglePermission(permission);
            } else if (!shouldAdd && hasPermission) {
                togglePermission(permission);
            }
        });
    };
    return (
        <section className='grid roles-other'>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Select All'
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox name='Allow Mobile' checked disabled />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Allow Printing'
                    checked={hasRolePermission("uaAllowPrinting")}
                    onChange={() => togglePermission("uaAllowPrinting")}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox name='Allow Web' checked disabled />
            </div>
            <div className='col-3'>
                <BorderedCheckbox name='View Deleted' checked disabled />
            </div>
            <div className='col-3'>
                <BorderedCheckbox name='Undelete Deleted' checked disabled />
            </div>
        </section>
    );
});
