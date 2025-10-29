import { TypeList } from "common/models";

export const TITLE_STATUS_LIST: readonly TypeList[] = [
    {
        name: "Default",
        id: 0,
    },
    {
        name: "Not Received",
        id: 1,
    },
    {
        name: "Lost",
        id: 2,
    },
    {
        name: "Applied For",
        id: 3,
    },
    {
        name: "With Lienholder Pending Payoff",
        id: 4,
    },
    {
        name: "In Transit",
        id: 5,
    },
    {
        name: "Received",
        id: 6,
    },
];

export const NOTIFICATION_TITLE_STATUS: readonly TypeList[] = [
    {
        name: "Info",
        id: 0,
    },
    {
        name: "Warning",
        id: 1,
    },
    {
        name: "Error",
        id: 2,
    },
];
