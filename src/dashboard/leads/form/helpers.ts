import * as Yup from "yup";
import {
    LeadFormValues,
    LeadStatus,
    LeadType,
    ServiceVisitType,
    ExistingLeadState,
    emptyLeadValues,
} from "./types";

export const LOCAL_STORAGE_KEY = "lead-form-drafts";

const mapExistingLeadToForm = (lead?: ExistingLeadState["lead"]): LeadFormValues | null => {
    if (!lead) return null;
    const [firstName = "", ...lastNameParts] = String(lead.contactinfo || "")
        .trim()
        .split(/\s+/);
    const inferredType: LeadType = Number(lead.dealtype) <= 1 ? "trade-in" : "service";
    return {
        ...emptyLeadValues,
        type: inferredType,
        status: "new",
        firstName,
        lastName: lastNameParts.join(" "),
        vin: String(lead.inventoryinfo || ""),
    };
};

export const getInitialValues = (
    id?: string,
    stateLead?: ExistingLeadState["lead"]
): LeadFormValues => {
    if (!id || id === "create") return emptyLeadValues;
    try {
        const value = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!value) {
            const mapped = mapExistingLeadToForm(stateLead);
            return mapped ? { ...mapped, id } : { ...emptyLeadValues, id };
        }
        const parsed = JSON.parse(value) as Record<string, LeadFormValues>;
        if (parsed[id]) return parsed[id];
        const mapped = mapExistingLeadToForm(stateLead);
        return mapped ? { ...mapped, id } : { ...emptyLeadValues, id };
    } catch {
        const mapped = mapExistingLeadToForm(stateLead);
        return mapped ? { ...mapped, id } : { ...emptyLeadValues, id };
    }
};

export const saveLeadDraft = (values: LeadFormValues) => {
    const nextValues = { ...values, id: values.id || crypto.randomUUID() };
    const existingRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existing = existingRaw ? (JSON.parse(existingRaw) as Record<string, LeadFormValues>) : {};
    existing[nextValues.id] = nextValues;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
};

export const isContactStepValid = (values: LeadFormValues): boolean => {
    if (values.type !== "trade-in") return false;
    return Boolean(
        values.type &&
            values.status &&
            values.firstName.trim() &&
            values.lastName.trim() &&
            values.state.trim() &&
            values.city.trim() &&
            values.email.trim() &&
            values.phone.trim()
    );
};

export const isVehicleStepValid = (values: LeadFormValues): boolean => {
    if (values.type !== "trade-in") return false;
    return Boolean(
        values.vin.trim() &&
            values.make.trim() &&
            values.model.trim() &&
            values.year.trim() &&
            values.mileage.trim() &&
            values.desiredPrice !== null &&
            values.payoffAmount !== null
    );
};

export const validationSchema = Yup.object({
    id: Yup.string().default(""),
    type: Yup.mixed<LeadType>().oneOf(["trade-in", "service"]).required("Data is required."),
    status: Yup.mixed<LeadStatus>()
        .oneOf(["new", "in-progress", "completed", "rejected"])
        .required("Data is required."),
    firstName: Yup.string().trim().required("Data is required."),
    lastName: Yup.string().trim().required("Data is required."),
    state: Yup.string()
        .trim()
        .when("type", {
            is: "trade-in",
            then: (schema) => schema.required("Data is required."),
            otherwise: (schema) => schema.notRequired(),
        }),
    city: Yup.string()
        .trim()
        .when("type", {
            is: "trade-in",
            then: (schema) => schema.required("Data is required."),
            otherwise: (schema) => schema.notRequired(),
        }),
    email: Yup.string()
        .trim()
        .email("Please enter a valid email address.")
        .required("Data is required."),
    phone: Yup.string().trim().required("Data is required."),
    message: Yup.string()
        .trim()
        .when("type", {
            is: "trade-in",
            then: (schema) => schema.required("Data is required."),
            otherwise: (schema) => schema.notRequired(),
        }),
    preferredDateTime: Yup.string()
        .trim()
        .when("type", {
            is: "service",
            then: (schema) => schema.required("Data is required."),
            otherwise: (schema) => schema.notRequired(),
        }),
    waitOrDropOff: Yup.mixed<ServiceVisitType>().when("type", {
        is: "service",
        then: (schema) => schema.oneOf(["wait", "drop-off"]).required("Data is required."),
        otherwise: (schema) => schema.notRequired(),
    }),
    vin: Yup.string().trim().required("Data is required."),
    make: Yup.string().trim().required("Data is required."),
    model: Yup.string().trim().required("Data is required."),
    year: Yup.string().trim().required("Data is required."),
    mileage: Yup.string().trim().required("Data is required."),
    desiredPrice: Yup.number()
        .nullable()
        .when("type", {
            is: "trade-in",
            then: (schema) =>
                schema.min(0, "Value must be positive.").required("Data is required."),
            otherwise: (schema) => schema.notRequired(),
        }),
    payoffAmount: Yup.number()
        .nullable()
        .when("type", {
            is: "trade-in",
            then: (schema) =>
                schema.min(0, "Value must be positive.").required("Data is required."),
            otherwise: (schema) => schema.notRequired(),
        }),
    vehicleAdditionalInfo: Yup.string().trim().notRequired(),
});
