import { PermissionKey } from "common/constants/permissions";
import { BorderedCheckbox } from "dashboard/common/form/inputs";
import { observer } from "mobx-react-lite";
import { CheckboxChangeEvent } from "primereact/checkbox";
import { ReactElement, useState } from "react";
import { useStore } from "store/hooks";

export const RolesInventory = observer((): ReactElement => {
    const { togglePermission, hasRolePermission } = useStore().usersStore;
    const [selectAll, setSelectAll] = useState<boolean>(false);

    const handleSelectAllChange = (event: CheckboxChangeEvent) => {
        setSelectAll(event.checked ?? false);
        const inventoryPermissions: readonly PermissionKey[] = [
            "uaAddInventory",
            "uaEditInventory",
            "uaViewInventory",
            "uaDeleteInventory",
            "uaEditExpenses",
            "uaEditPayments",
            "uaDeletePayments",
        ];

        inventoryPermissions.forEach((permission: PermissionKey) => {
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
        <section className='grid roles-inventory'>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Select All'
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Add Inventory'
                    checked={hasRolePermission("uaAddInventory")}
                    onChange={() => togglePermission("uaAddInventory")}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Edit Inventory'
                    checked={hasRolePermission("uaEditInventory")}
                    onChange={() => togglePermission("uaEditInventory")}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='View Inventory'
                    checked={hasRolePermission("uaViewInventory")}
                    onChange={() => togglePermission("uaViewInventory")}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Delete Inventory'
                    checked={hasRolePermission("uaDeleteInventory")}
                    onChange={() => togglePermission("uaDeleteInventory")}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Edit Expenses'
                    checked={hasRolePermission("uaEditExpenses")}
                    onChange={() => togglePermission("uaEditExpenses")}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Edit Payments'
                    checked={hasRolePermission("uaEditPayments")}
                    onChange={() => togglePermission("uaEditPayments")}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Delete Payments'
                    checked={hasRolePermission("uaDeletePayments")}
                    onChange={() => togglePermission("uaDeletePayments")}
                />
            </div>
        </section>
    );
});
