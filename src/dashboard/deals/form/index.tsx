/* eslint-disable jsx-a11y/anchor-is-valid */
import { Steps } from "primereact/steps";
import { Suspense, useEffect, useRef, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { AccordionDealItems, Deals, DealsItem, DealsSection } from "../common";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { DealGeneralInfo } from "dashboard/deals/form/general-info";
import {
    DealBHPH,
    DealDismantleForm,
    DealLHPH,
    DealRetail,
    DealWholeSale,
} from "dashboard/deals/form/retail";
import { useStore } from "store/hooks";
import { Loader } from "dashboard/common/loader";
import { PrintDealForms } from "dashboard/deals/form/print-forms";
import { Form, Formik, FormikProps } from "formik";
import { Deal, DealExtData } from "common/models/deals";
import * as Yup from "yup";
import { useToast } from "dashboard/common/toast";
import { MAX_VIN_LENGTH, MIN_VIN_LENGTH } from "dashboard/common/form/vin-decoder";
import { BaseResponseError, Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";
import { DeleteDealForm } from "dashboard/deals/form/delete-form";
import { ConfirmModal } from "dashboard/common/dialog/confirm";
import { PHONE_NUMBER_REGEX } from "common/constants/regex";
import { DEALS_PAGE } from "common/constants/links";

const STEP = "step";
const EMPTY_INFO_MESSAGE = "N/A";

export type PartialDeal = Pick<
    Deal,
    | "contactinfo"
    | "inventoryinfo"
    | "dealtype"
    | "dealstatus"
    | "saletype"
    | "datepurchase"
    | "dateeffective"
    | "inventorystatus"
> &
    Pick<
        DealExtData,
        | "HowFoundOut"
        | "SaleID"
        | "OdometerReading"
        | "OdomDigits"
        | "First_Lien_Phone_Num"
        | "Trade1_Make"
        | "Trade1_Model"
        | "Trade1_VIN"
        | "Trade1_Year"
        | "Trade1_Mileage"
        | "Trade1_Lien_Address"
        | "Trade1_Lien_Phone"
        | "Trade2_Make"
        | "Trade2_Model"
        | "Trade2_VIN"
        | "Trade2_Year"
        | "Trade2_Mileage"
        | "Trade2_Lien_Address"
        | "Trade2_Lien_Phone"
    >;

const tabFields: Partial<Record<AccordionDealItems, (keyof PartialDeal)[]>> = {
    [AccordionDealItems.SALE]: [
        "contactinfo",
        "inventoryinfo",
        "dealtype",
        "dealstatus",
        "saletype",
        "datepurchase",
        "dateeffective",
        "inventorystatus",
        "HowFoundOut",
        "SaleID",
    ],
    [AccordionDealItems.ODOMETER]: ["OdometerReading", "OdomDigits"],
    [AccordionDealItems.LIENS]: ["First_Lien_Phone_Num"],
    [AccordionDealItems.FIRST_TRADE]: [
        "Trade1_Make",
        "Trade1_Model",
        "Trade1_VIN",
        "Trade1_Year",
        "Trade1_Mileage",
        "Trade1_Lien_Address",
        "Trade1_Lien_Phone",
    ],
    [AccordionDealItems.SECOND_TRADE]: [
        "Trade2_Make",
        "Trade2_Model",
        "Trade2_VIN",
        "Trade2_Year",
        "Trade2_Mileage",
        "Trade2_Lien_Address",
        "Trade2_Lien_Phone",
    ],
};

const MIN_YEAR = 1970;
const MAX_YEAR = new Date().getFullYear();

export const DealFormSchema: Yup.ObjectSchema<Partial<PartialDeal>> = Yup.object().shape({
    contactinfo: Yup.string().required("Data is required."),
    inventoryinfo: Yup.string().required("Data is required."),
    dealtype: Yup.number().required("Data is required."),
    dealstatus: Yup.number().required("Data is required."),
    saletype: Yup.number().required("Data is required."),
    datepurchase: Yup.string().trim().required("Data is required."),
    dateeffective: Yup.string().trim().required("Data is required."),
    inventorystatus: Yup.number().nullable().required("Data is required."),
    HowFoundOut: Yup.string().required("Data is required."),
    SaleID: Yup.string().required("Data is required."),
    OdometerReading: Yup.string().required("Data is required."),
    OdomDigits: Yup.number().required("Data is required."),
    First_Lien_Phone_Num: Yup.string().matches(PHONE_NUMBER_REGEX, {
        message: "Please enter a valid number.",
        excludeEmptyString: false,
    }),
    Trade1_Make: Yup.string().required("Data is required."),
    Trade1_Model: Yup.string().required("Data is required."),
    Trade1_VIN: Yup.string()
        .min(MIN_VIN_LENGTH, `VIN must be at least ${MIN_VIN_LENGTH} characters`)
        .max(MAX_VIN_LENGTH, `VIN must be less than ${MAX_VIN_LENGTH} characters`)
        .required("Data is required."),
    Trade1_Year: Yup.string()
        .required("Data is required.")
        .test("is-valid-year", `Must be between ${MIN_YEAR} and ${MAX_YEAR}`, function (value) {
            const year = Number(value);
            if (year < MIN_YEAR) {
                return this.createError({ message: `Must be greater than ${MIN_YEAR}` });
            }
            if (year > MAX_YEAR) {
                return this.createError({ message: `Must be less than ${MAX_YEAR}` });
            }
            return true;
        }),
    Trade1_Mileage: Yup.string()
        .required("Data is required.")
        .test("is-positive", "Mileage must be greater than 0", (value) => {
            const numValue = parseFloat(value);
            return !isNaN(numValue) && numValue > 0;
        }),
    Trade1_Lien_Address: Yup.string().email("Please enter a valid email address."),
    Trade1_Lien_Phone: Yup.string().matches(PHONE_NUMBER_REGEX, {
        message: "Please enter a valid number.",
        excludeEmptyString: false,
    }),
    Trade2_Make: Yup.string().required("Data is required."),
    Trade2_Model: Yup.string().required("Data is required."),
    Trade2_VIN: Yup.string()
        .min(MIN_VIN_LENGTH, `VIN must be at least ${MIN_VIN_LENGTH} characters`)
        .max(MAX_VIN_LENGTH, `VIN must be less than ${MAX_VIN_LENGTH} characters`)
        .required("Data is required."),
    Trade2_Year: Yup.string()
        .required("Data is required.")
        .test("is-valid-year", `Must be between ${MIN_YEAR} and ${MAX_YEAR}`, function (value) {
            const year = Number(value);
            if (year < MIN_YEAR) {
                return this.createError({ message: `Must be greater than ${MIN_YEAR}` });
            }
            if (year > MAX_YEAR) {
                return this.createError({ message: `Must be less than ${MAX_YEAR}` });
            }
            return true;
        }),
    Trade2_Mileage: Yup.string()
        .required("Data is required.")
        .test("is-positive", "Mileage must be greater than 0", (value) => {
            const numValue = parseFloat(value);
            return !isNaN(numValue) && numValue > 0;
        }),
    Trade2_Lien_Address: Yup.string().email("Please enter a valid email address."),
    Trade2_Lien_Phone: Yup.string().matches(PHONE_NUMBER_REGEX, {
        message: "Please enter a valid number.",
        excludeEmptyString: false,
    }),
});

enum DealType {
    LHPH = 7,
    DISMANTLE = 6,
    WHOLESALE = 5,
    BHPH = 0,
}

export const DealsForm = observer(() => {
    const { id } = useParams();
    const location = useLocation();
    const toast = useToast();
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get(STEP) ? Number(searchParams.get(STEP)) - 1 : 0;

    const store = useStore().dealStore;
    const {
        deal,
        inventory,
        dealType,
        dealExtData,
        accordionActiveIndex,
        getDeal,
        getPrintList,
        saveDeal,
        clearDeal,
        isFormChanged,
        isLoading,
        deleteMessage,
        deleteReason,
        hasDeleteOptionsSelected,
    } = store;

    const [stepActiveIndex, setStepActiveIndex] = useState<number>(tabParam);
    const [printActiveIndex, setPrintActiveIndex] = useState<number>(0);
    const stepsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [dealsSections, setDealsSections] = useState<DealsSection[]>([]);
    const [accordionSteps, setAccordionSteps] = useState<number[]>([0]);
    const [itemsMenuCount, setItemsMenuCount] = useState(0);
    const formikRef = useRef<FormikProps<Partial<Deal> & Partial<DealExtData>>>(null);
    const [errorSections, setErrorSections] = useState<string[]>([]);
    const [deleteActiveIndex, setDeleteActiveIndex] = useState<number>(0);
    const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState<boolean>(false);
    const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
    const [confirmCloseVisible, setConfirmCloseVisible] = useState<boolean>(false);

    useEffect(() => {
        accordionSteps.forEach((step, index) => {
            if (stepActiveIndex >= step) store.accordionActiveIndex = [index];
        });
        if (stepsRef.current) {
            const activeStep = stepsRef.current.querySelector("[aria-selected='true']");
            if (activeStep) {
                activeStep.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        }
    }, [stepActiveIndex, stepsRef.current]);

    useEffect(() => {
        if (stepActiveIndex === printActiveIndex && id) {
            getPrintList(id);
        }
    }, [stepActiveIndex, printActiveIndex]);

    const getUrl = (activeIndex: number) => {
        const currentPath = id ? id : "create";
        return `${DEALS_PAGE.MAIN}/${currentPath}?step=${activeIndex + 1}`;
    };

    const handleGetDeal = async () => {
        if (id) {
            const response = await getDeal(id);

            if (response?.status === Status.ERROR) {
                toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: (response?.error as string) || "",
                    life: TOAST_LIFETIME,
                });
                navigate(DEALS_PAGE.MAIN);
            }
        }
    };

    useEffect(() => {
        handleGetDeal();
        return () => clearDeal();
    }, [id]);

    useEffect(() => {
        let dealsSections: Pick<Deals, "label" | "items">[] = [DealGeneralInfo];

        switch (dealType) {
            case DealType.LHPH:
                dealsSections = [...dealsSections, DealLHPH];
                break;
            case DealType.DISMANTLE:
                dealsSections = [...dealsSections, DealDismantleForm];
                break;
            case DealType.WHOLESALE:
                dealsSections = [...dealsSections, DealWholeSale];
                break;
            case DealType.BHPH:
                dealsSections = [...dealsSections, DealBHPH];
                break;
            default:
                dealsSections = [...dealsSections, DealRetail];
                break;
        }

        const sections = dealsSections.map((sectionData) => new DealsSection(sectionData));
        setDealsSections(sections);
        setAccordionSteps(sections.map((item) => item.startIndex));
        const itemsMenuCount = sections.reduce((acc, current) => acc + current.getLength(), -1);
        setItemsMenuCount(itemsMenuCount);
        setPrintActiveIndex(itemsMenuCount + 1);
        setDeleteActiveIndex(itemsMenuCount + 2);

        return () => {
            sections.forEach((section) => section.clearCount());
        };
    }, [dealType]);

    useEffect(() => {
        if (stepActiveIndex === printActiveIndex) {
            store.accordionActiveIndex = [];
        } else {
            accordionSteps.forEach((step, index) => {
                if (stepActiveIndex >= step) {
                    store.accordionActiveIndex = [index];
                }
            });
        }
    }, [stepActiveIndex, printActiveIndex, accordionSteps]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isFormChanged) {
                event.preventDefault();
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isFormChanged]);

    const handleActivePrintForms = () => {
        navigate(getUrl(printActiveIndex));
        setStepActiveIndex(printActiveIndex);
    };

    const handleSaveDealForm = () => {
        formikRef.current?.validateForm().then((errors) => {
            if (!Object.keys(errors).length) {
                formikRef.current?.submitForm();
            } else {
                const sectionsWithErrors = Object.keys(errors);
                const currentSectionsWithErrors: string[] = [];
                Object.entries(tabFields).forEach(([key, value]) => {
                    value.forEach((field) => {
                        if (
                            sectionsWithErrors.includes(field) &&
                            !currentSectionsWithErrors.includes(key)
                        ) {
                            currentSectionsWithErrors.push(key);
                        }
                    });
                });
                setErrorSections(currentSectionsWithErrors);

                const firstErrorKey = Object.keys(errors)[0];
                const firstErrorMessage = errors[firstErrorKey as keyof typeof errors];

                toast.current?.show({
                    severity: "error",
                    summary: "Validation Error",
                    detail:
                        typeof firstErrorMessage === "string"
                            ? firstErrorMessage
                            : "Please fill in all required fields.",
                    life: TOAST_LIFETIME,
                });
            }
        });
    };

    const handleCloseForm = () => {
        if (isFormChanged) {
            setConfirmCloseVisible(true);
        } else {
            navigate(DEALS_PAGE.MAIN);
        }
    };

    const handleSubmit = async () => {
        const response = await saveDeal();
        const res = response as BaseResponseError;
        if (typeof res === "string" || !res) {
            navigate(DEALS_PAGE.MAIN);
        }

        if (res?.error) {
            if (Array.isArray(res?.errors)) {
                res?.errors.forEach((error) => {
                    toast.current?.show({
                        severity: "error",
                        summary: "Error",
                        detail: error.message,
                    });
                });
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: res?.error,
                });
            }
        } else {
            navigate(DEALS_PAGE.MAIN);
        }
    };

    return isLoading ? (
        <Loader overlay />
    ) : (
        <Suspense>
            <div className='grid relative'>
                <Button
                    icon='pi pi-times'
                    className='p-button close-button'
                    onClick={handleCloseForm}
                />
                <div className='col-12'>
                    <div className='card deal'>
                        <div className='card-header flex'>
                            <h2 className='card-header__title uppercase m-0'>
                                {id ? "Edit" : "Create new"} Deal
                            </h2>
                            {id && (
                                <div className='card-header-info'>
                                    Stock#
                                    <span className='card-header-info__data'>
                                        {inventory?.StockNo || EMPTY_INFO_MESSAGE}
                                    </span>
                                    Make
                                    <span className='card-header-info__data'>
                                        {inventory?.Make || EMPTY_INFO_MESSAGE}
                                    </span>
                                    Model
                                    <span className='card-header-info__data'>
                                        {inventory?.Model || EMPTY_INFO_MESSAGE}
                                    </span>
                                    Year
                                    <span className='card-header-info__data'>
                                        {inventory?.Year || EMPTY_INFO_MESSAGE}
                                    </span>
                                    VIN
                                    <span className='card-header-info__data'>{inventory?.VIN}</span>
                                </div>
                            )}
                        </div>
                        <div className='card-content deal__card'>
                            <div className='grid flex-nowrap deal__card-content'>
                                <div className='p-0 card-content__wrapper' ref={stepsRef}>
                                    <Accordion
                                        activeIndex={accordionActiveIndex}
                                        onTabChange={(e) => {
                                            store.accordionActiveIndex = e.index;
                                        }}
                                        className='deal__accordion'
                                        multiple
                                    >
                                        {dealsSections.map((section) => (
                                            <AccordionTab
                                                key={section.sectionId}
                                                header={section.label}
                                            >
                                                <Steps
                                                    readOnly={false}
                                                    activeIndex={
                                                        stepActiveIndex - section.startIndex
                                                    }
                                                    onSelect={(e) => {
                                                        setStepActiveIndex(
                                                            e.index + section.startIndex
                                                        );
                                                    }}
                                                    model={section.items.map(
                                                        (
                                                            { itemLabel, template }: any,
                                                            idx: number
                                                        ) => ({
                                                            label: itemLabel,
                                                            template,
                                                            command: () => {
                                                                navigate(
                                                                    getUrl(section.startIndex + idx)
                                                                );
                                                            },
                                                            className: errorSections.length
                                                                ? errorSections.includes(itemLabel)
                                                                    ? "section-invalid"
                                                                    : "section-valid"
                                                                : "",
                                                        })
                                                    )}
                                                    className='vertical-step-menu'
                                                    pt={{
                                                        menu: { className: "flex-column w-full" },
                                                        step: {
                                                            className: "border-circle deal-step",
                                                        },
                                                    }}
                                                />
                                            </AccordionTab>
                                        ))}
                                    </Accordion>
                                    {id && (
                                        <Button
                                            icon='icon adms-print'
                                            className={`p-button gap-2 deal__print-nav ${
                                                stepActiveIndex === printActiveIndex &&
                                                "deal__print-nav--active"
                                            } w-full`}
                                            onClick={handleActivePrintForms}
                                        >
                                            Print forms
                                        </Button>
                                    )}
                                    {id && (
                                        <Button
                                            icon='pi pi-times'
                                            className='p-button gap-2 deal__delete-nav w-full'
                                            severity='danger'
                                            onClick={() => {
                                                navigate(getUrl(deleteActiveIndex));
                                                setStepActiveIndex(deleteActiveIndex);
                                            }}
                                        >
                                            Delete deal
                                        </Button>
                                    )}
                                </div>
                                <div className='w-full flex flex-column p-0 card-content__wrapper'>
                                    <div className='flex flex-grow-1'>
                                        <Formik
                                            innerRef={formikRef}
                                            initialValues={
                                                {
                                                    contactinfo: deal.contactinfo || "",
                                                    inventoryinfo: deal.inventoryinfo || "",
                                                    dealtype: deal.dealtype || dealType,
                                                    dealstatus: deal.dealstatus,
                                                    saletype: deal.saletype,
                                                    datepurchase: deal.datepurchase,
                                                    dateeffective: deal.dateeffective,
                                                    inventorystatus: deal.inventorystatus || 0,
                                                    accountInfo: deal.accountInfo || "",
                                                    HowFoundOut: dealExtData?.HowFoundOut || "",
                                                    SaleID: dealExtData?.SaleID || "",
                                                    OdometerReading:
                                                        dealExtData?.OdometerReading || "",
                                                    OdomDigits: dealExtData?.OdomDigits || "",
                                                    First_Lien_Phone_Num:
                                                        dealExtData?.First_Lien_Phone_Num || "",
                                                    Trade1_Make: dealExtData?.Trade1_Make || "",
                                                    Trade1_Model: dealExtData?.Trade1_Model || "",
                                                    Trade1_VIN: dealExtData?.Trade1_VIN || "",
                                                    Trade1_Year: dealExtData?.Trade1_Year || "",
                                                    Trade1_Mileage:
                                                        dealExtData?.Trade1_Mileage || "",
                                                    Trade1_Lien_Address:
                                                        dealExtData?.Trade1_Lien_Address || "",
                                                    Trade1_Lien_Phone:
                                                        dealExtData?.Trade1_Lien_Phone || "",
                                                    Trade2_Make: dealExtData?.Trade2_Make || "",
                                                    Trade2_Model: dealExtData?.Trade2_Model || "",
                                                    Trade2_VIN: dealExtData?.Trade2_VIN || "",
                                                    Trade2_Year: dealExtData?.Trade2_Year || "",
                                                    Trade2_Mileage:
                                                        dealExtData?.Trade2_Mileage || "",
                                                    Trade2_Lien_Address:
                                                        dealExtData?.Trade2_Lien_Address || "",
                                                    Trade2_Lien_Phone:
                                                        dealExtData?.Trade2_Lien_Phone || "",
                                                } as Partial<Deal> & Partial<DealExtData>
                                            }
                                            enableReinitialize
                                            validationSchema={DealFormSchema}
                                            validateOnChange={false}
                                            validateOnBlur={false}
                                            onSubmit={handleSubmit}
                                        >
                                            <Form name='dealForm' className='w-full'>
                                                {dealsSections.map((section) =>
                                                    section.items.map((item: DealsItem) => (
                                                        <div
                                                            key={item.itemIndex}
                                                            className={`${
                                                                stepActiveIndex === item.itemIndex
                                                                    ? "block deal-form"
                                                                    : "hidden"
                                                            }`}
                                                        >
                                                            <div className='deal-form__title uppercase'>
                                                                {item.itemLabel}
                                                            </div>
                                                            {stepActiveIndex === item.itemIndex && (
                                                                <Suspense fallback={<Loader />}>
                                                                    {item.component}
                                                                </Suspense>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                                {stepActiveIndex === printActiveIndex && (
                                                    <div className='deal-form'>
                                                        <div className='deal-form__title uppercase'>
                                                            Print forms
                                                        </div>
                                                        <PrintDealForms />
                                                    </div>
                                                )}{" "}
                                                {stepActiveIndex === deleteActiveIndex && (
                                                    <DeleteDealForm
                                                        isDeleteConfirm={isDeleteConfirm}
                                                        attemptedSubmit={attemptedSubmit}
                                                    />
                                                )}
                                            </Form>
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-content-end gap-3 mt-5 mr-3 form-nav'>
                                <Button
                                    onClick={() => {
                                        if (!stepActiveIndex) {
                                            return handleCloseForm();
                                        }
                                        setStepActiveIndex((prev) => {
                                            const newStep = prev - 1;
                                            navigate(getUrl(newStep));
                                            return newStep;
                                        });
                                    }}
                                    className='form-nav__button deal__button'
                                    outlined
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={() =>
                                        setStepActiveIndex((prev) => {
                                            const newStep = prev + 1;
                                            navigate(getUrl(newStep));
                                            return newStep;
                                        })
                                    }
                                    disabled={stepActiveIndex >= itemsMenuCount}
                                    severity={
                                        stepActiveIndex === deleteActiveIndex ||
                                        stepActiveIndex >= itemsMenuCount
                                            ? "secondary"
                                            : "success"
                                    }
                                    className='form-nav__button deal__button'
                                    outlined
                                >
                                    Next
                                </Button>
                                {stepActiveIndex === deleteActiveIndex ? (
                                    <Button
                                        onClick={() =>
                                            deleteReason.length
                                                ? setConfirmDeleteVisible(true)
                                                : setAttemptedSubmit(true)
                                        }
                                        disabled={
                                            !deleteReason.length ||
                                            !deleteMessage ||
                                            !hasDeleteOptionsSelected
                                        }
                                        severity={
                                            !deleteReason.length ||
                                            !deleteMessage ||
                                            !hasDeleteOptionsSelected
                                                ? "secondary"
                                                : "danger"
                                        }
                                        className='p-button form-nav__button deal__button'
                                    >
                                        Delete
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSaveDealForm}
                                        className='form-nav__button deal__button'
                                        severity={isFormChanged ? "success" : "secondary"}
                                        disabled={!isFormChanged}
                                    >
                                        {id ? "Update" : "Save"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {confirmDeleteVisible && (
                <ConfirmModal
                    position='top'
                    visible={confirmDeleteVisible}
                    className='deal-delete-modal'
                    acceptLabel='Delete'
                    rejectLabel='Cancel'
                    bodyMessage={deleteMessage}
                    confirmAction={() => setIsDeleteConfirm(true)}
                    onHide={() => setConfirmDeleteVisible(false)}
                />
            )}
            {confirmCloseVisible && (
                <ConfirmModal
                    visible={confirmCloseVisible}
                    position='top'
                    title='Quit Editing?'
                    icon='adms-warning'
                    className='deal-close-modal'
                    acceptLabel='Confirm'
                    rejectLabel='Cancel'
                    bodyMessage='Are you sure you want to leave this page? All unsaved data will be lost.'
                    confirmAction={() => navigate(DEALS_PAGE.MAIN)}
                    onHide={() => setConfirmCloseVisible(false)}
                />
            )}
        </Suspense>
    );
});
