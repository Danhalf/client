import { PermissionKey } from "common/constants/permissions";
import { BorderedCheckbox } from "dashboard/common/form/inputs";
import { observer } from "mobx-react-lite";
import { CheckboxChangeEvent } from "primereact/checkbox";
import { ReactElement, useState } from "react";
import { useStore } from "store/hooks";

export const RolesContacts = observer((): ReactElement => {
    const { togglePermission, hasRolePermission } = useStore().usersStore;
    const [selectAll, setSelectAll] = useState<boolean>(false);

    const handleSelectAllChange = (event: CheckboxChangeEvent) => {
        setSelectAll(event.checked ?? false);
        const contactsPermissions: readonly PermissionKey[] = [
            "uaAddContacts",
            "uaEditContacts",
            "uaViewContacts",
            "uaDeleteContacts",
        ];

        contactsPermissions.forEach((permission: PermissionKey) => {
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
        <section className='grid roles-contacts'>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Select All'
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Add Contacts'
                    checked={hasRolePermission("uaAddContacts")}
                    onChange={() => togglePermission("uaAddContacts")}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Edit Contacts'
                    checked={hasRolePermission("uaEditContacts")}
                    onChange={() => togglePermission("uaEditContacts")}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='View Contacts'
                    checked={hasRolePermission("uaViewContacts")}
                    onChange={() => togglePermission("uaViewContacts")}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Delete Contacts'
                    checked={hasRolePermission("uaDeleteContacts")}
                    onChange={() => togglePermission("uaDeleteContacts")}
                />
            </div>
        </section>
    );
});
