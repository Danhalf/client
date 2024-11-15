import { TypeList } from "common/models";

export const ACCOUNT_STATUS_LIST = [
    { name: "OK" },
    { name: "1-29 Days Overdue" },
    { name: "30-60 Days Overdue" },
    { name: "60-90 Days Overdue" },
    { name: "90-150 Days Overdue" },
    { name: "150+ Days Overdue" },
];

export const ACCOUNT_ACTIVITY_LIST = ["All Activity", "Active data", "Deleted payments"];

export enum ACCOUNT_PAYMENT_METHODS_NAMES {
    CHECK = "Check",
    CASH = "Cash",
    VISA = "VISA",
    MC = "MC",
    DISCOVERY = "Discovery",
    AMEX = "AMEX",
    DEBIT = "Debit",
    ACH = "ACH",
    MONEY_ORDER = "Money Order",
    WESTERN_UNION = "Western Union",
    TRAVEL_CHECK = "Travel Check",
    BANK_CHECK = "Bank Check",
    TRADE_IN = "Trade-In",
}

export const ACCOUNT_PAYMENT_METHODS: readonly Partial<TypeList>[] = Object.values(
    ACCOUNT_PAYMENT_METHODS_NAMES
).map((method) => ({ name: method }));

export const ACCOUNT_FEE_TYPES: readonly Partial<TypeList>[] = [
    { name: "Other" },
    { name: "Late Fee" },
    { name: "NSF Charge" },
    { name: "Returned Check Fee" },
    { name: "Mechanical Repair Fee" },
    { name: "Repo Fee" },
    { name: "Tow Fee" },
    { name: "Garage Fee" },
    { name: "Property Tax" },
    { name: "Interest" },
];

export const ACCOUNT_PAYMENT_TYPES: readonly Partial<TypeList>[] = [
    { name: "Fee" },
    { name: "Adjustment" },
    { name: "Down Payment" },
    { name: "Pickup Payment" },
    { name: "QuickPay Payment" },
    { name: "Payoff Payment" },
];

export const ACCOUNT_PROMISE_STATUS: readonly TypeList[] = [
    {
        name: "Default",
        id: 0,
    },
    {
        name: "Paid",
        id: 1,
    },
    {
        name: "Late",
        id: 2,
    },
    {
        name: "Broken",
        id: 3,
    },
    {
        name: "Outstanding",
        id: 4,
    },
];

export const ACCOUNT_NOTE_CONTACT_TYPE: readonly string[] = [
    "Phone",
    "In Person",
    "Mail",
    "E-Mail",
    "Fax",
];

export const ACCOUNT_PAYMENT_STATUS_LIST: readonly string[] = ["All Payments", "Exclude Deleted"];

export const ADJUSTMENT_TYPES: readonly string[] = [
    "Adjustment",
    "Refund",
    "WriteOff",
    "ChargeOff",
    "Manual",
];
