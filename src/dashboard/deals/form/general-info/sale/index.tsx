import { observer } from "mobx-react-lite";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { Dropdown } from "primereact/dropdown";
import { DateInput } from "dashboard/common/form/inputs";
import { InputText } from "primereact/inputtext";
import { useStore } from "store/hooks";
import {
    getDealInventoryStatuses,
    getDealStatuses,
    getDealTypes,
    getSaleTypes,
} from "http/services/deals.service";
import { IndexedDealList } from "common/models/deals";
import { CompanySearch } from "dashboard/contacts/common/company-search";

export const DealGeneralSale = observer((): ReactElement => {
    const store = useStore().dealStore;
    const {
        deal: {
            dealtype,
            dealstatus,
            saletype,
            inventoryinfo,
            inventoryuid,
            datepurchase,
            dateeffective,
            inventorystatus,
            accountuid,
        },
        dealExtData,
        changeDeal,
        changeDealExtData,
    } = store;

    const [dealTypesList, setDealTypesList] = useState<IndexedDealList[]>([]);
    const [saleTypesList, setSaleTypesList] = useState<IndexedDealList[]>([]);
    const [dealStatusesList, setDealStatusesList] = useState<IndexedDealList[]>([]);
    const [inventoryStatusesList, setInventoryStatusesList] = useState<IndexedDealList[]>([]);

    useEffect(() => {
        getDealTypes().then((res) => {
            if (res) setDealTypesList(res);
        });
        getSaleTypes().then((res) => {
            if (res) setSaleTypesList(res);
        });
        getDealStatuses().then((res) => {
            if (res) setDealStatusesList(res);
        });
        getDealInventoryStatuses().then((res) => {
            if (res) setInventoryStatusesList(res);
        });
    }, []);

    return (
        <div className='grid deal-general-sale row-gap-2'>
            <div className='col-6'>
                <CompanySearch
                    value={inventoryuid}
                    onChange={({ target: { value } }) => changeDeal({ key: "inventoryuid", value })}
                    onRowClick={(value) =>
                        changeDeal({
                            key: "inventoryuid",
                            value,
                        })
                    }
                    name='Buyer Name (required)'
                />
            </div>
            <div className='col-6'>
                <span className='p-float-label'>
                    <CompanySearch
                        value={inventoryinfo}
                        onChange={({ target: { value } }) =>
                            changeDeal({ key: "inventoryuid", value })
                        }
                        onRowClick={(value) =>
                            changeDeal({
                                key: "inventoryuid",
                                value,
                            })
                        }
                        name='Vehicle (required)'
                    />

                    <label className='float-label'></label>
                </span>
            </div>
            <div className='col-6'>
                <span className='p-float-label'>
                    <Dropdown
                        optionLabel='name'
                        optionValue='id'
                        filter
                        required
                        options={dealTypesList}
                        value={dealtype}
                        onChange={(e) => changeDeal({ key: "dealtype", value: e.value })}
                        className='w-full deal-sale__dropdown'
                    />
                    <label className='float-label'>Type of Deal (required)</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <Dropdown
                        optionLabel='name'
                        optionValue='id'
                        value={dealstatus}
                        onChange={(e) => changeDeal({ key: "dealstatus", value: e.value })}
                        options={dealStatusesList}
                        filter
                        required
                        className='w-full deal-sale__dropdown'
                    />
                    <label className='float-label'>Sale status (required)</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <Dropdown
                        optionLabel='name'
                        optionValue='id'
                        filter
                        required
                        options={saleTypesList}
                        value={saletype}
                        onChange={(e) => changeDeal({ key: "saletype", value: e.value })}
                        className='w-full deal-sale__dropdown'
                    />
                    <label className='float-label'>Sale type (required)</label>
                </span>
            </div>
            <div className='col-3'>
                <DateInput
                    name='Sale date (required)'
                    date={Number(datepurchase)}
                    onChange={({ value }) =>
                        changeDeal({ key: "datepurchase", value: Number(value) })
                    }
                />
            </div>
            <div className='col-3'>
                <DateInput
                    name='First operated (req.)'
                    date={Number(dateeffective)}
                    onChange={({ value }) =>
                        changeDeal({ key: "dateeffective", value: Number(value) })
                    }
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <Dropdown
                        optionLabel='name'
                        optionValue='id'
                        value={inventorystatus}
                        options={inventoryStatusesList}
                        onChange={(e) => changeDeal({ key: "inventorystatus", value: e.value })}
                        filter
                        required
                        className='w-full deal-sale__dropdown'
                    />
                    <label className='float-label'>New or Used (req.)</label>
                </span>
            </div>

            <div className='col-12 text-line'>
                <h3 className='text-line__title m-0 pr-3'>Vehicle payments tracking</h3>
                <hr className='text-line__line flex-1' />
            </div>

            <div className='col-3'>
                <DateInput name='Warn Overdue After X Days' />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='deal-sale__text-input w-full'
                        value={accountuid}
                        onChange={({ target: { value } }) => {
                            changeDeal({ key: "accountuid", value });
                        }}
                    />
                    <label className='float-label'>Account number</label>
                </span>
            </div>

            <hr className='col-12 form-line' />

            <div className='col-6'>
                <span className='p-float-label'>
                    <Dropdown
                        optionLabel='name'
                        optionValue='name'
                        value={dealExtData.HowFoundOut}
                        onChange={(e) => changeDealExtData({ key: "HowFoundOut", value: e.value })}
                        editable
                        filter
                        required
                        className='w-full deal-sale__dropdown'
                    />
                    <label className='float-label'>How did you hear about us? (required)</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='deal-sale__text-input w-full'
                        value={dealExtData.SaleID}
                        onChange={(e) =>
                            changeDealExtData({ key: "SaleID", value: e.target.value })
                        }
                    />
                    <label className='float-label'>ROS SaleID (required)</label>
                </span>
            </div>
        </div>
    );
});
