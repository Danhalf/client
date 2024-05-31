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
import { Deal, DealExtData, IndexedDealList } from "common/models/deals";
import { CompanySearch } from "dashboard/contacts/common/company-search";
import { InventorySearch } from "dashboard/inventory/common/inventory-search";
import { BaseResponseError } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import { useFormik } from "formik";
import * as Yup from "yup";

export const DealGeneralSale = observer((): ReactElement => {
    const store = useStore().dealStore;
    const toast = useToast();
    const {
        deal: {
            dealtype,
            dealstatus,
            saletype,
            inventoryuid,
            datepurchase,
            dateeffective,
            inventorystatus,
            accountuid,
            contactuid,
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
            const { error } = res as BaseResponseError;
            if (error && toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: error,
                });
            } else {
                setDealTypesList(res as IndexedDealList[]);
            }
        });
        getSaleTypes().then((res) => {
            const { error } = res as BaseResponseError;
            if (error && toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: error,
                });
            } else {
                setSaleTypesList(res as IndexedDealList[]);
            }
        });
        getDealStatuses().then((res) => {
            const { error } = res as BaseResponseError;
            if (error && toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: error,
                });
            } else {
                setDealStatusesList(res as IndexedDealList[]);
            }
        });
        getDealInventoryStatuses().then((res) => {
            const { error } = res as BaseResponseError;
            if (error && toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: error,
                });
            } else {
                setInventoryStatusesList(res as IndexedDealList[]);
            }
        });
    }, [toast]);

    const DealSaleSchema = Yup.object().shape({
        contactuid: Yup.string().required("Data is required."),
        inventoryuid: Yup.string().required("Data is required."),
        dealtype: Yup.string().required("Data is required."),
        dealstatus: Yup.string().required("Data is required."),
        saletype: Yup.string().required("Data is required."),
        datepurchase: Yup.string().required("Data is required."),
        dateeffective: Yup.string().required("Data is required."),
        inventorystatus: Yup.string().required("Data is required."),
        SaleID: Yup.string().required("Data is required."),
    });

    const formik = useFormik({
        initialValues: {
            contactuid,
            inventoryuid,
            dealtype,
            dealstatus,
            saletype,
            datepurchase,
            dateeffective,
            inventorystatus,
            accountuid,
            HowFoundOut: dealExtData?.HowFoundOut || "",
            SaleID: dealExtData?.SaleID || "",
        } as Partial<Deal> & Partial<DealExtData>,
        validationSchema: DealSaleSchema,
        enableReinitialize: true,
        onSubmit: (values) => {},
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            onChange={() => {
                if (Object.keys(formik.errors).length > 0) store.isFormValid = false;
            }}
            className='grid deal-general-sale row-gap-2'
        >
            <div className='col-6 relative'>
                <CompanySearch
                    {...formik.getFieldProps("contactuid")}
                    value={formik.values.contactuid}
                    onChange={({ target: { value } }) => {
                        formik.setFieldValue("contactuid", value);
                        changeDeal({ key: "contactuid", value });
                    }}
                    onRowClick={(value) => {
                        formik.setFieldValue("contactuid", value);
                        changeDeal({ key: "contactuid", value });
                    }}
                    name='Buyer Name (required)'
                    className={`${formik.errors.contactuid && "p-invalid"}`}
                />
                <small className='p-error'>{formik.errors.contactuid || ""}</small>
            </div>
            <div className='col-6 relative'>
                <span className='p-float-label'>
                    <InventorySearch
                        {...formik.getFieldProps("inventoryuid")}
                        className={`${formik.errors.inventoryuid && "p-invalid"}`}
                        onChange={({ target: { value } }) => {
                            formik.setFieldValue("inventoryuid", value);
                            changeDeal({ key: "inventoryuid", value });
                        }}
                        onRowClick={(value) => {
                            formik.setFieldValue("inventoryuid", value);
                            changeDeal({ key: "inventoryuid", value });
                        }}
                        name='Vehicle (required)'
                    />
                    <label className='float-label'></label>
                </span>
                <small className='p-error'>{formik.errors.inventoryuid || ""}</small>
            </div>
            <div className='col-6 relative'>
                <span className='p-float-label'>
                    <Dropdown
                        {...formik.getFieldProps("dealtype")}
                        optionLabel='name'
                        optionValue='id'
                        filter
                        required
                        options={dealTypesList}
                        value={formik.values.dealtype}
                        onChange={(e) => {
                            formik.setFieldValue("dealtype", e.value);
                            changeDeal({ key: "dealtype", value: e.value });
                        }}
                        className={`w-full deal-sale__dropdown ${
                            formik.errors.dealtype && "p-invalid"
                        }`}
                    />
                    <label className='float-label'>Type of Deal (required)</label>
                </span>
                <small className='p-error'>{formik.errors.dealtype || ""}</small>
            </div>
            <div className='col-3 relative'>
                <span className='p-float-label'>
                    <Dropdown
                        {...formik.getFieldProps("dealstatus")}
                        optionLabel='name'
                        optionValue='id'
                        value={formik.values.dealstatus}
                        onChange={(e) => {
                            formik.setFieldValue("dealstatus", e.value);
                            changeDeal({ key: "dealstatus", value: e.value });
                        }}
                        options={dealStatusesList}
                        filter
                        required
                        className={`w-full deal-sale__dropdown ${
                            formik.errors.dealstatus && "p-invalid"
                        }`}
                    />
                    <label className='float-label'>Sale status (required)</label>
                </span>
                <small className='p-error'>{formik.errors.dealstatus || ""}</small>
            </div>
            <div className='col-3 relative'>
                <span className='p-float-label'>
                    <Dropdown
                        {...formik.getFieldProps("saletype")}
                        optionLabel='name'
                        optionValue='id'
                        filter
                        required
                        options={saleTypesList}
                        value={formik.values.saletype}
                        onChange={(e) => {
                            formik.setFieldValue("saletype", e.value);
                            changeDeal({ key: "saletype", value: e.value });
                        }}
                        className={`w-full deal-sale__dropdown ${
                            formik.errors.saletype && "p-invalid"
                        }`}
                    />
                    <label className='float-label'>Sale type (required)</label>
                </span>
                <small className='p-error'>{formik.errors.saletype || ""}</small>
            </div>
            <div className='col-3 relative'>
                <DateInput
                    {...formik.getFieldProps("datepurchase")}
                    className={`${formik.errors.datepurchase && "p-invalid"}`}
                    name='Sale date (required)'
                    date={Number(formik.values.datepurchase)}
                    onChange={({ value }) => {
                        formik.setFieldValue("datepurchase", Number(value));
                        changeDeal({ key: "datepurchase", value: Number(value) });
                    }}
                />
                <small className='p-error'>{formik.errors.datepurchase || ""}</small>
            </div>
            <div className='col-3 relative'>
                <DateInput
                    {...formik.getFieldProps("dateeffective")}
                    className={`${formik.errors.dateeffective && "p-invalid"}`}
                    name='First operated (req.)'
                    value={formik.values.dateeffective}
                    onChange={({ value }) => {
                        formik.setFieldValue("dateeffective", Number(value));
                        changeDeal({ key: "dateeffective", value: Number(value) });
                    }}
                />
                <small className='p-error'>{formik.errors.dateeffective || ""}</small>
            </div>
            <div className='col-3 relative'>
                <span className='p-float-label'>
                    <Dropdown
                        {...formik.getFieldProps("inventorystatus")}
                        optionLabel='name'
                        optionValue='id'
                        value={formik.values.inventorystatus}
                        options={inventoryStatusesList}
                        onChange={(e) => {
                            formik.setFieldValue("inventorystatus", e.value);
                            changeDeal({ key: "inventorystatus", value: e.value });
                        }}
                        filter
                        required
                        className={`w-full deal-sale__dropdown ${
                            formik.errors.inventorystatus &&
                            formik.touched.inventorystatus &&
                            "p-invalid"
                        }`}
                    />
                    <label className='float-label'>New or Used (req.)</label>
                </span>
                <small className='p-error'>{formik.errors.inventorystatus || ""}</small>
            </div>

            <div className='col-12 text-line'>
                <h3 className='text-line__title m-0 pr-3'>Vehicle payments tracking</h3>
                <hr className='text-line__line flex-1' />
            </div>

            <div className='col-3'>
                <DateInput name='Warn Overdue After X Days' />
            </div>
            <div className='col-3 relative'>
                <span className='p-float-label'>
                    <InputText
                        {...formik.getFieldProps("accountuid")}
                        className='w-full deal-sale__text-input'
                        value={formik.values.accountuid}
                        onChange={({ target: { value } }) => {
                            formik.setFieldValue("accountuid", value);
                            changeDeal({ key: "accountuid", value });
                        }}
                    />
                    <label className='float-label'>Account number</label>
                </span>
            </div>

            <hr className='col-12 form-line' />

            <div className='col-6 relative'>
                <span className='p-float-label'>
                    <Dropdown
                        {...formik.getFieldProps("HowFoundOut")}
                        required
                        {...formik.getFieldProps("HowFoundOut")}
                        optionLabel='name'
                        optionValue='name'
                        value={formik.values.HowFoundOut}
                        onChange={(e) => {
                            formik.setFieldValue("HowFoundOut", e.value);
                            changeDealExtData({ key: "HowFoundOut", value: e.value });
                        }}
                        editable
                        filter
                        className={`w-full deal-sale__dropdown ${
                            formik.errors.HowFoundOut && "p-invalid"
                        }`}
                    />
                    <label className='float-label'>How did you hear about us? (required)</label>
                </span>
                <small className='p-error'>{formik.errors.HowFoundOut || ""}</small>
            </div>
            <div className='col-3 relative'>
                <span className='p-float-label'>
                    <InputText
                        {...formik.getFieldProps("SaleID")}
                        className={`deal-sale__text-input w-full ${
                            formik.errors.SaleID && "p-invalid"
                        }`}
                        value={formik.values.SaleID}
                        onChange={(e) => {
                            formik.setFieldValue("SaleID", e.target.value);
                            changeDealExtData({ key: "SaleID", value: e.target.value });
                        }}
                    />
                    <label className='float-label'>ROS SaleID (required)</label>
                </span>
                <small className='p-error'>{formik.errors.SaleID || ""}</small>
            </div>
            <div className='col-12'>
                <button type='submit' className='p-button p-component p-button-primary'>
                    Submit
                </button>
            </div>
        </form>
    );
});
