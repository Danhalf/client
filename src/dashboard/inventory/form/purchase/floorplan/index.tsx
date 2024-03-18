import { LS_APP_USER } from "common/constants/localStorage";
import { ContactUser } from "common/models/contact";
import { QueryParams } from "common/models/query-params";
import {
    BorderedCheckbox,
    CurrencyInput,
    DateInput,
    SearchInput,
} from "dashboard/common/form/inputs";
import { ContactsDataTable } from "dashboard/contacts";
import { AuthUser } from "http/services/auth.service";
import { getContacts } from "http/services/contacts-service";
import { observer } from "mobx-react-lite";
import { Dialog } from "primereact/dialog";
import { ReactElement, useEffect, useState } from "react";
import { getKeyValue } from "services/local-storage.service";
import { useStore } from "store/hooks";

const FIELD: keyof ContactUser = "companyName";

export const PurchaseFloorplan = observer((): ReactElement => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [options, setOptions] = useState<ContactUser[]>([]);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const store = useStore().inventoryStore;
    const {
        inventoryExtData: {
            fpFloorplanCompany,
            fpIsFloorplanned,
            fpPayoffBy,
            fpReductionDate,
            fpReduxAmt,
            fpRemainBal,
        },
        changeInventoryExtData,
    } = store;

    useEffect(() => {
        const authUser: AuthUser = getKeyValue(LS_APP_USER);
        setUser(authUser);
    }, []);

    const handleCompanyInputChange = (searchValue: string): void => {
        const params: QueryParams = {
            qry: `${searchValue}.${FIELD}`,
        };
        user &&
            getContacts(user.useruid, params).then((response) => {
                if (response?.length) {
                    setOptions(response);
                } else {
                    setOptions([]);
                }
            });
    };

    const handleOnRowClick = (companyName: string) => {
        changeInventoryExtData({
            key: "fpFloorplanCompany",
            value: companyName,
        });
        setDialogVisible(false);
    };

    return (
        <div className='grid purchase-floorplan row-gap-2'>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Floorplanned'
                    checked={!!fpIsFloorplanned}
                    onChange={() =>
                        changeInventoryExtData({
                            key: "fpIsFloorplanned",
                            value: !!fpIsFloorplanned ? 0 : 1,
                        })
                    }
                />
            </div>
            <div className='col-6'>
                <SearchInput
                    name='Floor'
                    title='Floorplan Company'
                    optionValue={FIELD}
                    optionLabel={FIELD}
                    options={options}
                    onInputChange={handleCompanyInputChange}
                    value={fpFloorplanCompany}
                    onChange={({ target: { value } }) => {
                        changeInventoryExtData({
                            key: "fpFloorplanCompany",
                            value,
                        });
                    }}
                    onIconClick={() => {
                        setDialogVisible(true);
                    }}
                />
            </div>
            <div className='col-3'>
                <DateInput
                    name='Reduction Date'
                    date={fpReductionDate}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "fpReductionDate",
                            value: Number(value),
                        });
                    }}
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    name='Reduced amount'
                    title='Reduced amount'
                    labelPosition='top'
                    value={fpReduxAmt}
                    onChange={({ value }) => {
                        value &&
                            changeInventoryExtData({
                                key: "fpReduxAmt",
                                value,
                            });
                    }}
                />
            </div>
            <div className='col-3'>
                <DateInput
                    name='Pay Off By'
                    date={fpPayoffBy}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "fpPayoffBy",
                            value: Number(value),
                        });
                    }}
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    title='Remain balance'
                    labelPosition='top'
                    value={fpRemainBal}
                    onChange={({ value }) =>
                        value &&
                        changeInventoryExtData({
                            key: "fpRemainBal",
                            value,
                        })
                    }
                />
            </div>
            <Dialog
                header={<div className='uppercase'>Inventory</div>}
                visible={dialogVisible}
                style={{ width: "75vw" }}
                maximizable
                modal
                onHide={() => setDialogVisible(false)}
            >
                <ContactsDataTable onRowClick={handleOnRowClick} />
            </Dialog>
        </div>
    );
});
