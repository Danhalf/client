import { ReactElement, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import {
    ContactAccordionItems,
    ContactSection,
    createContactSections,
    getContactMenuCount,
    resetFormStepSectionCounters,
} from "dashboard/contacts/common/step-navigation";
import { FormStepAccordion, SectionHeaderWithCount } from "dashboard/common/form-stepper";
import { useNavigate, useParams } from "react-router-dom";
import {
    BUYER_ID,
    generalBuyerInfo,
    generalCoBuyerInfo,
} from "dashboard/contacts/form/general-info";
import { ContactInfoData } from "dashboard/contacts/form/contact-info";
import { useStore } from "store/hooks";
import { useLocation } from "react-router-dom";
import { Loader } from "dashboard/common/loader";
import { observer } from "mobx-react-lite";
import { Form, Formik, FormikProps } from "formik";
import { Contact, ContactExtData } from "common/models/contact";
import * as Yup from "yup";
import { Status } from "common/models/base-response";
import { ConfirmModal } from "dashboard/common/dialog/confirm";
import { DashboardDialog } from "dashboard/common/dialog";
import { ContactMediaData } from "dashboard/contacts/form/media-data";
import { DeleteForm } from "dashboard/contacts/form/delete-form";
import { truncateText } from "common/helpers";
import { Tooltip } from "primereact/tooltip";
import {
    EMAIL_REGEX,
    LETTERS_NUMBERS_SIGNS_REGEX,
    PHONE_NUMBER_REGEX,
    SSN_REGEX,
    SSN_VALID_LENGTH,
} from "common/constants/regex";
import { ERROR_MESSAGES } from "common/constants/error-messages";
import { usePermissions, useToastMessage } from "common/hooks";
import { CONTACTS_PAGE } from "common/constants/links";
const STEP = "step";

export type PartialContact = Pick<
    Contact,
    | "firstName"
    | "middleName"
    | "lastName"
    | "type"
    | "businessName"
    | "email1"
    | "email2"
    | "phone1"
    | "phone2"
> &
    Pick<
        ContactExtData,
        | "CoBuyer_First_Name"
        | "CoBuyer_Middle_Name"
        | "CoBuyer_Last_Name"
        | "Buyer_Emp_Ext"
        | "Buyer_Emp_Phone"
        | "Buyer_SS_Number"
        | "CoBuyer_SS_Number"
    >;

const tabFields: Partial<Record<ContactAccordionItems, (keyof PartialContact)[]>> = {
    [ContactAccordionItems.BUYER]: [
        "firstName",
        "lastName",
        "type",
        "businessName",
        "Buyer_SS_Number",
    ],
    [ContactAccordionItems.CO_BUYER]: [
        "CoBuyer_First_Name",
        "CoBuyer_Last_Name",
        "CoBuyer_SS_Number",
    ],
    [ContactAccordionItems.CONTACTS]: ["email1", "email2", "phone1", "phone2"],
    [ContactAccordionItems.COMPANY]: ["Buyer_Emp_Ext", "Buyer_Emp_Phone"],
};

const buildFormValues = (contact: Contact, contactExtData: ContactExtData): PartialContact =>
    ({
        firstName: contact?.firstName || "",
        middleName: contact?.middleName || "",
        lastName: contact?.lastName || "",
        type: contact?.type || null,
        businessName: contact?.businessName || "",
        email1: contact?.email1 || "",
        email2: contact?.email2 || "",
        phone1: contact?.phone1?.replace(/[^0-9]/g, "") || "",
        phone2: contact?.phone2?.replace(/[^0-9]/g, "") || "",
        Buyer_Emp_Ext: contactExtData.Buyer_Emp_Ext || "",
        Buyer_Emp_Phone: contactExtData.Buyer_Emp_Phone || "",
        CoBuyer_First_Name: contactExtData.CoBuyer_First_Name || "",
        CoBuyer_Middle_Name: contactExtData.CoBuyer_Middle_Name || "",
        CoBuyer_Last_Name: contactExtData.CoBuyer_Last_Name || "",
        Buyer_SS_Number: contactExtData.Buyer_SS_Number || "",
        CoBuyer_SS_Number: contactExtData.CoBuyer_SS_Number || "",
    }) as PartialContact;

const isFieldValueEmpty = (value: PartialContact[keyof PartialContact]): boolean =>
    value === null || value === undefined || (typeof value === "string" && !value.trim());

const getFieldValidationError = (
    field: keyof PartialContact,
    values: PartialContact
): string | undefined => {
    if (isFieldValueEmpty(values[field])) {
        return undefined;
    }

    try {
        ContactFormSchema.validateSyncAt(field, values);
        return undefined;
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            return error.message;
        }
    }
};

const isTabFilled = (
    itemLabel: ContactAccordionItems,
    contact: Contact,
    contactExtData: ContactExtData,
    contactType: number,
    isCoBuyerFieldsFilled: boolean,
    values: PartialContact
): boolean => {
    const tabFieldsForItem = tabFields[itemLabel];

    if (tabFieldsForItem?.some((field) => getFieldValidationError(field, values))) {
        return false;
    }

    switch (itemLabel) {
        case ContactAccordionItems.BUYER: {
            const type = contact.type;
            if (!type) return false;
            if (REQUIRED_COMPANY_TYPE_INDEXES.includes(type)) {
                return !!contact.businessName?.trim();
            }
            return !!(contact.firstName?.trim() && contact.lastName?.trim());
        }
        case ContactAccordionItems.CO_BUYER:
            if (contactType !== BUYER_ID || !isCoBuyerFieldsFilled) return false;
            return !!(
                contactExtData.CoBuyer_First_Name?.trim() ||
                contactExtData.CoBuyer_Last_Name?.trim()
            );
        case ContactAccordionItems.CONTACTS:
            return !!(
                contact.email1?.trim() ||
                contact.email2?.trim() ||
                contact.phone1?.trim() ||
                contact.phone2?.trim()
            );
        case ContactAccordionItems.COMPANY:
            return !!(
                contactExtData.Buyer_Emp_Company?.trim() ||
                contactExtData.Buyer_Emp_Contact?.trim() ||
                contactExtData.Buyer_Emp_Ext?.trim() ||
                contactExtData.Buyer_Emp_Phone?.trim()
            );
        case ContactAccordionItems.PROSPECTING:
            return !!(
                contactExtData.Notes?.trim() ||
                contactExtData.PROSPECT1_ID?.trim() ||
                contactExtData.PROSPECT2_ID?.trim()
            );
        default:
            return false;
    }
};

export const REQUIRED_COMPANY_TYPE_INDEXES = [2, 3, 4, 5, 6, 7, 8];

enum ERROR_TYPE {
    MISSING,
    INVALID,
}

enum DIALOG_ERROR_MESSAGES {
    MISSING_TITLE = "Required data is missing",
    INVALID_TITLE = "Invalid data format",
    MISSING_MESSAGE = "The form cannot be saved as it missing required data.",
    INVALID_MESSAGE = "The form cannot be saved because some fields have an invalid format.",
    MISSING_BUTTON = "Please fill in the required fields and try again.",
    INVALID_BUTTON = "Please correct the invalid fields and try again.",
}

const handleValidationMessage = (text: string, isShort?: boolean) => {
    const defaultMessage = `${text || "This field"} does not match the required format.`;
    const shortMessage = `${text || "This field"} is invalid.`;
    return isShort ? shortMessage : defaultMessage;
};

export const ContactFormSchema: Yup.ObjectSchema<Partial<PartialContact>> = Yup.object().shape({
    firstName: Yup.string()
        .trim()
        .test("firstNameRequired", ERROR_MESSAGES.REQUIRED, function (value) {
            const { type, businessName } = this.parent;
            if (!REQUIRED_COMPANY_TYPE_INDEXES.includes(type) && !businessName?.trim()) {
                return !!value?.trim();
            }
            return true;
        })
        .matches(LETTERS_NUMBERS_SIGNS_REGEX, {
            message: handleValidationMessage("First name"),
            excludeEmptyString: true,
        }),
    middleName: Yup.string()
        .trim()
        .matches(LETTERS_NUMBERS_SIGNS_REGEX, {
            message: handleValidationMessage("Middle name"),
        }),
    lastName: Yup.string()
        .trim()
        .test("lastNameRequired", ERROR_MESSAGES.REQUIRED, function (value) {
            const { type, businessName } = this.parent;
            if (!REQUIRED_COMPANY_TYPE_INDEXES.includes(type) && !businessName?.trim()) {
                return !!value?.trim();
            }
            return true;
        })
        .matches(LETTERS_NUMBERS_SIGNS_REGEX, {
            message: handleValidationMessage("Last name"),
            excludeEmptyString: true,
        }),
    businessName: Yup.string()
        .trim()
        .test("businessNameRequired", ERROR_MESSAGES.REQUIRED, function (value) {
            const { type } = this.parent;
            if (REQUIRED_COMPANY_TYPE_INDEXES.includes(type)) {
                return !!value?.trim();
            }
            return true;
        }),
    type: Yup.number()
        .test("typeRequired", ERROR_MESSAGES.REQUIRED, function (value) {
            return value !== 0 && value !== null && value !== undefined;
        })
        .required(ERROR_MESSAGES.REQUIRED),
    email1: Yup.string().email(ERROR_MESSAGES.EMAIL).matches(EMAIL_REGEX, {
        message: ERROR_MESSAGES.EMAIL,
    }),
    email2: Yup.string().email(ERROR_MESSAGES.EMAIL).matches(EMAIL_REGEX, {
        message: ERROR_MESSAGES.EMAIL,
    }),
    phone1: Yup.string()
        .transform((value) => value.replace(/[-+]/g, ""))
        .matches(PHONE_NUMBER_REGEX, {
            message: ERROR_MESSAGES.PHONE,
            excludeEmptyString: false,
        }),
    phone2: Yup.string()
        .transform((value) => value.replace(/[-+]/g, ""))
        .matches(PHONE_NUMBER_REGEX, {
            message: ERROR_MESSAGES.PHONE,
            excludeEmptyString: false,
        }),
    Buyer_Emp_Ext: Yup.string().email(ERROR_MESSAGES.EMAIL).matches(EMAIL_REGEX, {
        message: ERROR_MESSAGES.EMAIL,
    }),
    Buyer_Emp_Phone: Yup.string()
        .transform((value) => value.replace(/[-+]/g, ""))
        .matches(PHONE_NUMBER_REGEX, {
            message: ERROR_MESSAGES.PHONE,
            excludeEmptyString: false,
        }),
    CoBuyer_First_Name: Yup.string()
        .trim()
        .test("coBuyerFirstNameRequired", ERROR_MESSAGES.REQUIRED, function (value) {
            const { CoBuyer_Last_Name, CoBuyer_Middle_Name, type } = this.parent;
            if (type !== BUYER_ID) return true;
            if (type === BUYER_ID && (CoBuyer_Last_Name?.trim() || CoBuyer_Middle_Name?.trim())) {
                return !!value?.trim();
            }
            return true;
        })
        .test("coBuyerFirstNameFormat", handleValidationMessage("First name"), function (value) {
            const { type } = this.parent;
            if (type !== BUYER_ID) return true;
            if (!value || !value.trim()) return true;
            return LETTERS_NUMBERS_SIGNS_REGEX.test(value);
        }),
    CoBuyer_Middle_Name: Yup.string()
        .trim()
        .test("coBuyerMiddleNameFormat", handleValidationMessage("Middle name"), function (value) {
            const { type } = this.parent;
            if (type !== BUYER_ID) return true;
            if (!value || !value.trim()) return true;
            return LETTERS_NUMBERS_SIGNS_REGEX.test(value);
        }),
    CoBuyer_Last_Name: Yup.string()
        .trim()
        .test("coBuyerLastNameRequired", ERROR_MESSAGES.REQUIRED, function (value) {
            const { CoBuyer_First_Name, CoBuyer_Middle_Name, type } = this.parent;
            if (type !== BUYER_ID) return true;
            if (type === BUYER_ID && (CoBuyer_First_Name?.trim() || CoBuyer_Middle_Name?.trim())) {
                return !!value?.trim();
            }
            return true;
        })
        .test("coBuyerLastNameFormat", handleValidationMessage("Last name"), function (value) {
            const { type } = this.parent;
            if (type !== BUYER_ID) return true;
            if (!value || !value.trim()) return true;
            return LETTERS_NUMBERS_SIGNS_REGEX.test(value);
        }),
    Buyer_SS_Number: Yup.string().test(
        "ssnFormat",
        handleValidationMessage("Buyer SSN", true),
        function (value) {
            if (!value || !value.trim().length) return true;
            const digitsOnly = value.replace(/\D/g, "");
            if (!!digitsOnly.length && digitsOnly.length < SSN_VALID_LENGTH) return false;
            return SSN_REGEX.test(value);
        }
    ),
    CoBuyer_SS_Number: Yup.string().test(
        "ssnFormat",
        handleValidationMessage("Co-Buyer SSN", true),
        function (value) {
            const { type } = this.parent;
            if (type !== BUYER_ID) return true;
            if (!value || !value.trim().length) return true;
            const digitsOnly = value.replace(/\D/g, "");
            if (!!digitsOnly.length && digitsOnly.length < SSN_VALID_LENGTH) return false;
            return SSN_REGEX.test(value);
        }
    ),
});

const DialogBody = ({ type }: { type: ERROR_TYPE }): ReactElement => {
    return (
        <>
            <div className='confirm-header'>
                <i className='pi pi-exclamation-triangle confirm-header__icon' />
                <div className='confirm-header__title'>
                    {type === ERROR_TYPE.MISSING
                        ? DIALOG_ERROR_MESSAGES.MISSING_TITLE
                        : DIALOG_ERROR_MESSAGES.INVALID_TITLE}
                </div>
            </div>
            <div className='text-center w-full confirm-body'>
                {type === ERROR_TYPE.MISSING
                    ? DIALOG_ERROR_MESSAGES.MISSING_MESSAGE
                    : DIALOG_ERROR_MESSAGES.INVALID_MESSAGE}
            </div>
            <div className='text-center w-full confirm-body--bold'>
                {type === ERROR_TYPE.MISSING
                    ? DIALOG_ERROR_MESSAGES.MISSING_BUTTON
                    : DIALOG_ERROR_MESSAGES.INVALID_BUTTON}
            </div>
        </>
    );
};

export const ContactForm = observer((): ReactElement => {
    const { id } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const { contactPermissions } = usePermissions();
    const { showError, showSuccess } = useToastMessage();

    const [contactSections, setContactSections] = useState<ContactSection[]>([]);
    const [itemsMenuCount, setItemsMenuCount] = useState(0);
    const tabParam = searchParams.get(STEP) ? Number(searchParams.get(STEP)) - 1 : 0;
    const [stepActiveIndex, setStepActiveIndex] = useState<number>(tabParam);
    const [accordionActiveIndex, setAccordionActiveIndex] = useState<number | number[]>([]);
    const store = useStore().contactStore;
    const {
        contact,
        contactType,
        contactExtData,
        getContact,
        clearContact,
        saveContact,
        changeContact,
        isContactChanged,
        isCoBuyerFieldsFilled,
        memoRoute,
        deleteReason,
        activeTab,
        tabLength,
    } = store;
    const navigate = useNavigate();
    const formikRef = useRef<FormikProps<PartialContact>>(null);
    const [validateOnMount, setValidateOnMount] = useState<boolean>(false);
    const [errorSections, setErrorSections] = useState<string[]>([]);
    const [confirmMessage, setConfirmMessage] = useState<string>("");
    const [confirmTitle, setConfirmTitle] = useState<string>("");
    const [confirmAction, setConfirmAction] = useState<() => void>(() => () => {});
    const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
    const [isDataMissingConfirm, setIsDataMissingConfirm] = useState<boolean>(false);
    const [validationErrorType, setValidationErrorType] = useState<ERROR_TYPE>(ERROR_TYPE.MISSING);
    const [confirmActive, setConfirmActive] = useState<boolean>(false);
    const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false);
    const [deleteActiveIndex, setDeleteActiveIndex] = useState<number>(0);
    const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
    const stepsRef = useRef<HTMLDivElement>(null);
    const isCreateAccordionInitialized = useRef(false);

    useEffect(() => {
        let contactsSections = [ContactInfoData];

        switch (contactType) {
            case BUYER_ID:
                contactsSections = [generalCoBuyerInfo, ...contactsSections];
                break;
            default:
                contactsSections = [generalBuyerInfo, ...contactsSections];
                break;
        }

        if (id) {
            contactsSections = [...contactsSections, ContactMediaData];
        }

        const sections = createContactSections(contactsSections);
        setContactSections(sections);
        const itemsMenuCount = getContactMenuCount(sections);
        setItemsMenuCount(itemsMenuCount);
        setDeleteActiveIndex(itemsMenuCount + 1);

        return () => {
            resetFormStepSectionCounters();
        };
    }, [contactType, id]);

    useEffect(() => {
        if (id || contactSections.length === 0 || isCreateAccordionInitialized.current) {
            return;
        }

        setAccordionActiveIndex(contactSections.map((_, index) => index));
        isCreateAccordionInitialized.current = true;
    }, [id, contactSections]);

    useEffect(() => {
        if (id) {
            getContact(id).then((response) => {
                if (response?.status === Status.ERROR) {
                    showError(response?.error as string);
                    navigate(CONTACTS_PAGE.MAIN);
                }
            });
        } else {
            clearContact();
        }
        return () => {
            clearContact();
        };
    }, [id, store]);

    const getUrl = (activeIndex: number) => {
        const currentPath = id ? id : "create";
        return `${CONTACTS_PAGE.EDIT(currentPath)}?step=${activeIndex + 1}`;
    };

    const handleStepChange = useCallback(
        (globalIndex: number) => {
            setStepActiveIndex(globalIndex);
            navigate(getUrl(globalIndex));
        },
        [id, navigate]
    );

    const handleCloseClick = () => {
        const performNavigation = () => {
            if (memoRoute) {
                navigate(memoRoute);
                store.memoRoute = "";
            } else {
                navigate(CONTACTS_PAGE.MAIN);
            }
        };

        if (isContactChanged) {
            setConfirmTitle("Quit Editing?");
            setConfirmMessage(
                "Are you sure you want to leave this page? All unsaved data will be lost."
            );
            setConfirmAction(() => performNavigation);
            setIsConfirmVisible(true);
        } else {
            performNavigation();
        }
    };

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isContactChanged) {
                event.preventDefault();
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isContactChanged]);

    const handleSaveContactForm = () => {
        formikRef.current?.validateForm().then(async (errors) => {
            const coBuyerValidationErrors: Record<string, string> = {};

            if (REQUIRED_COMPANY_TYPE_INDEXES.includes(contact.type)) {
                changeContact([
                    ["firstName", ""],
                    ["lastName", ""],
                    ["middleName", ""],
                ]);
            }

            if (store.isCoBuyerFieldsFilled && contactType === BUYER_ID) {
                const hasCoBuyerName =
                    contactExtData.CoBuyer_First_Name?.trim() ||
                    contactExtData.CoBuyer_Last_Name?.trim();

                if (!hasCoBuyerName) {
                    coBuyerValidationErrors.CoBuyer_First_Name = ERROR_MESSAGES.REQUIRED;
                    coBuyerValidationErrors.CoBuyer_Last_Name = ERROR_MESSAGES.REQUIRED;
                }

                if (!hasCoBuyerName && !contactExtData.CoBuyer_Emp_Company?.trim()) {
                    coBuyerValidationErrors.CoBuyer_Emp_Company = ERROR_MESSAGES.REQUIRED;
                }
            }

            const allErrors = { ...errors, ...coBuyerValidationErrors };

            if (!Object.keys(allErrors).length) {
                if (contact.type !== BUYER_ID) {
                    store.changeContactExtData([
                        ["CoBuyer_First_Name", ""],
                        ["CoBuyer_Middle_Name", ""],
                        ["CoBuyer_Last_Name", ""],
                        ["CoBuyer_SS_Number", ""],
                    ]);
                }

                const response = await saveContact();

                if (response && response.status === Status.OK) {
                    if (memoRoute) {
                        navigate(memoRoute);
                        store.memoRoute = "";
                    } else {
                        navigate(CONTACTS_PAGE.MAIN);
                    }
                    showSuccess("Contact saved successfully");
                } else {
                    if (response && Array.isArray(response)) {
                        const formErrors: Record<string, string> = {};
                        let ssnDuplicateErrorShown = false;
                        const touchedFields: string[] = [];

                        response.forEach((error) => {
                            const serverField = error.field.toLowerCase();
                            const formField =
                                Object.keys(formikRef.current?.values || {}).find(
                                    (field) => field.toLowerCase() === serverField
                                ) || error.field;

                            const isSSNDuplicateError =
                                (error.field === "Buyer_SS_Number" ||
                                    error.field === "CoBuyer_SS_Number") &&
                                error.message.includes("must not be equal");

                            if (isSSNDuplicateError) {
                                if (!ssnDuplicateErrorShown) {
                                    formErrors["Buyer_SS_Number"] = ERROR_MESSAGES.SSN_DUPLICATE;
                                    formErrors["CoBuyer_SS_Number"] = ERROR_MESSAGES.SSN_DUPLICATE;
                                    touchedFields.push("Buyer_SS_Number", "CoBuyer_SS_Number");
                                    showError(ERROR_MESSAGES.SSN_DUPLICATE);
                                    ssnDuplicateErrorShown = true;
                                }
                            } else {
                                formErrors[formField] = error.message;
                                touchedFields.push(formField);
                                showError(error.message);
                            }
                        });

                        if (Object.keys(formErrors).length > 0) {
                            formikRef.current?.setErrors(formErrors);
                            touchedFields.forEach((field) => {
                                formikRef.current?.setFieldTouched(field, true, false);
                            });
                        }

                        const serverErrorFields = response
                            .map((error) => {
                                const isSSNDuplicateError =
                                    (error.field === "Buyer_SS_Number" ||
                                        error.field === "CoBuyer_SS_Number") &&
                                    error.message.includes("must not be equal");
                                if (isSSNDuplicateError) {
                                    return ["buyer_ss_number", "cobuyer_ss_number"];
                                }
                                return error.field.toLowerCase();
                            })
                            .flat();
                        const currentSectionsWithErrors: string[] = [];
                        Object.entries(tabFields).forEach(([key, value]) => {
                            value.forEach((field) => {
                                const hasError = serverErrorFields.some(
                                    (errorField) => errorField === field.toLowerCase()
                                );
                                if (hasError && !currentSectionsWithErrors.includes(key)) {
                                    currentSectionsWithErrors.push(key);
                                }
                            });
                        });
                        setErrorSections(currentSectionsWithErrors);
                    } else {
                        showError(response.error);
                    }
                }
            } else {
                setValidateOnMount(true);
                formikRef.current?.setErrors(allErrors);

                Object.keys(allErrors).forEach((field) => {
                    formikRef.current?.setFieldTouched(field, true, false);
                });

                const sectionsWithErrors = Object.keys(allErrors);
                const currentSectionsWithErrors: string[] = [];
                Object.entries(tabFields).forEach(([key, value]) => {
                    value.forEach((field) => {
                        const hasError = sectionsWithErrors.some(
                            (errorField) => errorField.toLowerCase() === field.toLowerCase()
                        );
                        if (hasError && !currentSectionsWithErrors.includes(key)) {
                            currentSectionsWithErrors.push(key);
                        }
                    });
                });

                setErrorSections(currentSectionsWithErrors);

                const hasFormatErrors = Object.values(allErrors).some(
                    (error) => error !== ERROR_MESSAGES.REQUIRED
                );
                setValidationErrorType(hasFormatErrors ? ERROR_TYPE.INVALID : ERROR_TYPE.MISSING);

                const hasCoBuyerMiddleNameOnly =
                    contactType === BUYER_ID &&
                    contactExtData.CoBuyer_Middle_Name?.trim() &&
                    !contactExtData.CoBuyer_First_Name?.trim() &&
                    !contactExtData.CoBuyer_Last_Name?.trim();

                const hasMainMiddleNameOnly =
                    contact.middleName?.trim() &&
                    !contact.firstName?.trim() &&
                    !contact.lastName?.trim();

                const hasBusinessNameOnly =
                    contact.businessName?.trim() &&
                    !contact.firstName?.trim() &&
                    !contact.lastName?.trim() &&
                    REQUIRED_COMPANY_TYPE_INDEXES.includes(contact.type);

                if (hasCoBuyerMiddleNameOnly || hasMainMiddleNameOnly || hasBusinessNameOnly) {
                    setConfirmAction(() => {
                        setIsConfirmVisible(false);
                        setIsDataMissingConfirm(true);
                    });
                    setIsConfirmVisible(true);
                } else {
                    setIsDataMissingConfirm(true);
                }
            }
        });
    };

    const handleOnBackClick = () => {
        if (activeTab !== null && activeTab && activeTab > 0) {
            store.activeTab = activeTab - 1;
        } else {
            setStepActiveIndex((prev) => {
                const newStep = prev - 1;
                navigate(getUrl(newStep));
                return newStep;
            });
        }
    };

    const handleOnNextClick = () => {
        if (activeTab !== null && activeTab < tabLength - 1) {
            store.activeTab = activeTab + 1;
        } else {
            setStepActiveIndex((prev) => {
                const newStep = prev + 1;
                navigate(getUrl(newStep));
                return newStep;
            });
        }
    };

    const renderSectionHeader = (section: ContactSection) => {
        const formValues = buildFormValues(contact, contactExtData);
        const filledTabsCount = section.items.reduce(
            (count, item) =>
                isTabFilled(
                    item.itemLabel as ContactAccordionItems,
                    contact,
                    contactExtData,
                    contactType,
                    isCoBuyerFieldsFilled,
                    formValues
                )
                    ? count + 1
                    : count,
            0
        );

        return (
            <SectionHeaderWithCount
                label={section.label}
                filledCount={filledTabsCount}
                totalCount={section.items.length}
            />
        );
    };

    return (
        <Suspense>
            <div className='grid relative'>
                <Button
                    icon='pi pi-times'
                    className='p-button close-button'
                    onClick={handleCloseClick}
                />
                <div className='col-12'>
                    <div className='card contact'>
                        <div className='card-header'>
                            <h2 className='card-header__title uppercase m-0 pr-2'>
                                {id ? "Edit" : "Create new"} contact
                            </h2>
                            {id && (
                                <div className='card-header-info'>
                                    <Tooltip target='.tooltip-target' />

                                    {(contact.firstName || contact.lastName) && (
                                        <>
                                            Full Name
                                            <span
                                                className='card-header-info__data tooltip-target'
                                                data-pr-tooltip={`${contact.firstName || ""} ${contact.lastName || ""}`}
                                                data-pr-position='top'
                                            >
                                                {truncateText(
                                                    `${contact.firstName || ""} ${contact.lastName || ""}`
                                                )}
                                            </span>
                                        </>
                                    )}

                                    {contact?.businessName && (
                                        <>
                                            Company name
                                            <span
                                                className='card-header-info__data tooltip-target'
                                                data-pr-tooltip={contact.businessName}
                                                data-pr-position='top'
                                            >
                                                {truncateText(contact.businessName)}
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className='card-content contact__card'>
                            <div className='grid flex-nowrap card-content__wrapper'>
                                <FormStepAccordion
                                    sections={contactSections}
                                    stepActiveIndex={stepActiveIndex}
                                    accordionActiveIndex={accordionActiveIndex}
                                    onAccordionChange={setAccordionActiveIndex}
                                    onStepChange={handleStepChange}
                                    errorSections={errorSections}
                                    accordionClassName='contact__accordion'
                                    stepClassName='border-circle contact-step'
                                    renderSectionHeader={renderSectionHeader}
                                    navigationRef={stepsRef}
                                    expandMode='sync-with-step'
                                    wrapperClassName='p-0'
                                    footer={
                                        id ? (
                                            <Button
                                                icon='pi pi-times'
                                                className='p-button gap-2 inventory__delete-nav w-full'
                                                severity={
                                                    contactPermissions.canDelete()
                                                        ? "danger"
                                                        : "secondary"
                                                }
                                                disabled={!contactPermissions.canDelete()}
                                                onClick={() =>
                                                    contactPermissions.canDelete() &&
                                                    setStepActiveIndex(deleteActiveIndex)
                                                }
                                            >
                                                Delete contact
                                            </Button>
                                        ) : undefined
                                    }
                                />
                                <div className='w-full flex flex-column p-0'>
                                    <div className='flex flex-grow-1'>
                                        <Formik
                                            innerRef={formikRef}
                                            validationSchema={ContactFormSchema}
                                            initialValues={
                                                {
                                                    firstName: contact?.firstName || "",
                                                    middleName: contact?.middleName || "",
                                                    lastName: contact?.lastName || "",
                                                    type: contact?.type || null,
                                                    businessName: contact?.businessName || "",
                                                    email1: contact?.email1 || "",
                                                    email2: contact?.email2 || "",
                                                    phone1:
                                                        contact?.phone1?.replace(/[^0-9]/g, "") ||
                                                        "",
                                                    phone2:
                                                        contact?.phone2?.replace(/[^0-9]/g, "") ||
                                                        "",
                                                    Buyer_Emp_Ext:
                                                        contactExtData.Buyer_Emp_Ext || "",
                                                    Buyer_Emp_Phone:
                                                        contactExtData.Buyer_Emp_Phone || "",
                                                    CoBuyer_First_Name:
                                                        contactExtData.CoBuyer_First_Name || "",
                                                    CoBuyer_Last_Name:
                                                        contactExtData.CoBuyer_Last_Name || "",
                                                    Buyer_SS_Number:
                                                        contactExtData.Buyer_SS_Number || "",
                                                    CoBuyer_SS_Number:
                                                        contactExtData.CoBuyer_SS_Number || "",
                                                } as PartialContact
                                            }
                                            enableReinitialize
                                            validateOnChange={false}
                                            validateOnBlur={false}
                                            validateOnMount={validateOnMount}
                                            onSubmit={() => {
                                                setValidateOnMount(false);
                                            }}
                                        >
                                            <Form name='contactForm' className='w-full'>
                                                {contactSections.map((section) =>
                                                    section.items.map((item) => {
                                                        return (
                                                            <div
                                                                key={item.itemIndex}
                                                                className={`${
                                                                    stepActiveIndex ===
                                                                    item.itemIndex
                                                                        ? "block contact-form"
                                                                        : "hidden"
                                                                }`}
                                                            >
                                                                <div className='contact-form__title uppercase'>
                                                                    {item.itemLabel}
                                                                </div>
                                                                {stepActiveIndex ===
                                                                    item.itemIndex && (
                                                                    <Suspense
                                                                        fallback={
                                                                            <Loader className='contact-form__loader' />
                                                                        }
                                                                    >
                                                                        {item.component}
                                                                    </Suspense>
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </Form>
                                        </Formik>
                                        {stepActiveIndex === deleteActiveIndex &&
                                            contactPermissions.canDelete() && (
                                                <DeleteForm
                                                    attemptedSubmit={attemptedSubmit}
                                                    isDeleteConfirm={isDeleteConfirm}
                                                />
                                            )}
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-content-end gap-3 mt-5 mr-3 form-nav'>
                                <Button
                                    onClick={handleOnBackClick}
                                    className='form-nav__button'
                                    outlined
                                    disabled={stepActiveIndex <= 0 && !activeTab}
                                    severity={
                                        stepActiveIndex <= 0 && !activeTab ? "secondary" : "success"
                                    }
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleOnNextClick}
                                    disabled={stepActiveIndex >= itemsMenuCount}
                                    severity={
                                        stepActiveIndex >= itemsMenuCount ? "secondary" : "success"
                                    }
                                    className='form-nav__button'
                                    outlined
                                >
                                    Next
                                </Button>
                                {stepActiveIndex === deleteActiveIndex &&
                                contactPermissions.canDelete() ? (
                                    <Button
                                        onClick={() =>
                                            deleteReason.length
                                                ? setConfirmActive(true)
                                                : setAttemptedSubmit(true)
                                        }
                                        disabled={!deleteReason.length}
                                        {...(!deleteReason.length && { severity: "secondary" })}
                                        className='form-nav__button form-nav__button--danger'
                                    >
                                        Delete
                                    </Button>
                                ) : (
                                    <Button
                                        className='form-nav__button'
                                        type='button'
                                        onClick={handleSaveContactForm}
                                        disabled={!isContactChanged || !contact.type}
                                        severity={
                                            isContactChanged && contact.type
                                                ? "success"
                                                : "secondary"
                                        }
                                    >
                                        {id ? "Update" : "Save"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isConfirmVisible ? (
                <ConfirmModal
                    visible={!!isConfirmVisible}
                    title={confirmTitle}
                    icon='pi-exclamation-triangle'
                    bodyMessage={confirmMessage}
                    confirmAction={confirmAction}
                    draggable={false}
                    rejectLabel='Cancel'
                    acceptLabel='Confirm'
                    resizable={false}
                    className='contact-confirm-dialog'
                    onHide={() => setIsConfirmVisible(false)}
                />
            ) : (
                <ConfirmModal
                    visible={confirmActive}
                    draggable={false}
                    position='top'
                    className='contact-delete-dialog'
                    bodyMessage='Do you really want to delete this contact? 
                This process cannot be undone.'
                    rejectLabel='Cancel'
                    acceptLabel='Delete'
                    confirmAction={() => setIsDeleteConfirm(true)}
                    onHide={() => setConfirmActive(false)}
                />
            )}

            <DashboardDialog
                visible={!!isDataMissingConfirm}
                className='contact-missed-data-dialog'
                onHide={() => setIsDataMissingConfirm(false)}
                footer='Got it'
                action={() => setIsDataMissingConfirm(false)}
            >
                <DialogBody type={validationErrorType} />
            </DashboardDialog>
        </Suspense>
    );
});
