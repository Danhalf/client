import { CurrencyInput, DateInput, SearchInput } from "dashboard/common/form/inputs";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { InputNumber } from "primereact/inputnumber";
import { ContactUser } from "common/models/contact";
import { AuthUser } from "http/services/auth.service";
import { LS_APP_USER } from "common/constants/localStorage";
import { QueryParams } from "common/models/query-params";
import { getContacts } from "http/services/contacts-service";
import { getKeyValue } from "services/local-storage.service";
import { ContactsDataTable } from "dashboard/contacts";
import { Dialog } from "primereact/dialog";
const FIELD: keyof ContactUser = "companyName";
export const PurchaseConsign = observer((): ReactElement => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [options, setOptions] = useState<ContactUser[]>([]);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const store = useStore().inventoryStore;
    const {
        inventoryExtData: {
            csDate,
            csEarlyRemoval,
            csFee,
            csIsConsigned,
            csListingFee,
            csName,
            csNetToOwner,
            csNotes,
            csNumDays,
            csOwnerAskingPrice,
            csReserveAmt,
            csReserveFactor,
            csReturnDate,
            csReturned,
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
            key: "csName",
            value: companyName,
        });
        setDialogVisible(false);
    };
    return (
        <div className='grid purchase-consign row-gap-2'>
            <div className='col-3 flex align-items-center'>
                <div className='purchase-consign__checkbox'>
                    <Checkbox
                        inputId='consign-vehicle'
                        name='consign-vehicle'
                        className='mt-1'
                        checked={!!csIsConsigned}
                        onChange={() =>
                            changeInventoryExtData({
                                key: "csIsConsigned",
                                value: !!csIsConsigned ? 0 : 1,
                            })
                        }
                    />
                    <label htmlFor='consign-vehicle' className='ml-2'>
                        Vehicle is Consigned
                    </label>
                </div>
            </div>
            <div className='col-6'>
                <SearchInput
                    name='Consignor'
                    title='Consignor'
                    optionValue={FIELD}
                    optionLabel={FIELD}
                    options={options}
                    onInputChange={handleCompanyInputChange}
                    value={csName}
                    onChange={({ target: { value } }) => {
                        changeInventoryExtData({
                            key: "csName",
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
                    date={csDate}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "csDate",
                            value: Number(value),
                        });
                    }}
                    name='Consign Date'
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-consign__text-input w-full'
                        value={csNetToOwner}
                        onChange={({ target: { value } }) => {
                            changeInventoryExtData({
                                key: "csNetToOwner",
                                value,
                            });
                        }}
                    />
                    <label className='float-label'>Net To Owner</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputNumber
                        className='purchase-consign__number-input'
                        value={csNumDays}
                        onChange={({ value }) => {
                            value &&
                                changeInventoryExtData({
                                    key: "csNumDays",
                                    value,
                                });
                        }}
                    />
                    <label className='float-label'># Days</label>
                </span>
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    title='Consignment Fee'
                    value={csFee}
                    onChange={({ value }) => {
                        value &&
                            changeInventoryExtData({
                                key: "csFee",
                                value,
                            });
                    }}
                />
            </div>

            <hr className='form-line' />

            <div className='col-3 flex align-items-center'>
                <div className='purchase-consign__checkbox'>
                    <Checkbox
                        inputId='consign-returned'
                        name='consign-returned'
                        className='mt-1'
                        checked={!!csReturned}
                        onChange={() =>
                            changeInventoryExtData({
                                key: "csReturned",
                                value: !!csReturned ? 0 : 1,
                            })
                        }
                    />
                    <label htmlFor='consign-returned' className='ml-2'>
                        Returned to Seller Unsold
                    </label>
                </div>
            </div>
            <div className='col-3'>
                <DateInput
                    name='Return Date'
                    date={csReturnDate}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "csReturnDate",
                            value: Number(value),
                        });
                    }}
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputNumber
                        className='purchase-consign__number-input w-full'
                        value={csReserveFactor}
                        onChange={({ value }) => {
                            value &&
                                changeInventoryExtData({
                                    key: "csReserveFactor",
                                    value,
                                });
                        }}
                    />
                    <label className='float-label'>Reserve Factor</label>
                </span>
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    title='Reserve Amount'
                    value={csReserveAmt}
                    onChange={({ value }) => {
                        value &&
                            changeInventoryExtData({
                                key: "csReserveAmt",
                                value,
                            });
                    }}
                />
            </div>
            <div className='col-12'>
                <InputTextarea
                    className='purchase-consign__text-area'
                    placeholder='Consignment Notes'
                    value={csNotes}
                    onChange={({ target: { value } }) => {
                        changeInventoryExtData({
                            key: "csNotes",
                            value,
                        });
                    }}
                />
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    title='Early Removal Fee'
                    value={csEarlyRemoval}
                    onChange={({ value }) => {
                        value &&
                            changeInventoryExtData({
                                key: "csEarlyRemoval",
                                value,
                            });
                    }}
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    title='Listing Fee'
                    value={csListingFee}
                    onChange={({ value }) => {
                        value &&
                            changeInventoryExtData({
                                key: "csListingFee",
                                value,
                            });
                    }}
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    title='Owner’s Asking Price'
                    value={csOwnerAskingPrice}
                    onChange={({ value }) => {
                        value &&
                            changeInventoryExtData({
                                key: "csOwnerAskingPrice",
                                value,
                            });
                    }}
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
