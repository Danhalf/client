import { Expenses, ExpensesSetResponse, ExpensesTotal } from "common/models/expenses";
import { authorizedUserApiInstance } from "http/index";

export const getExpensesList = async (inventoryuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<Expenses[]>(
            `inventory/${inventoryuid}/expenses`
        );
        if (request.status === 200) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const getExpensesTotal = async (inventoryuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<ExpensesTotal>(
            `inventory/${inventoryuid}/expensestotal`
        );
        if (request.status === 200) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const setExpensesItem = async (expenseuid: number, expenseData: Partial<Expenses>) => {
    try {
        const request = await authorizedUserApiInstance.post<ExpensesSetResponse>(
            `inventory/${expenseuid}/expense`,
            expenseData
        );
        if (request.status === 200) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};
