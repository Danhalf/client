import { LoginForm } from "sign/sign-in";
import { ApiRequest, nonAuthorizedUserApiInstance } from "../index";
import { BaseResponseError } from "common/models/base-response";
import { UserPermissionsResponse } from "common/models/user";

export interface AuthUser {
    companyname: string;
    firstname: string;
    isadmin: 0 | 1;
    islocaladmin: 0 | 1;
    ismanager: 0 | 1;
    issalesperson: 0 | 1;
    lastname: string;
    loginname: string;
    locationname: string;
    locationuid: string;
    modified: string;
    sessionuid: string;
    started: string;
    status: "OK";
    token: string;
    username: string;
    useruid: string;
    permissions: UserPermissionsResponse;
}

export const auth = async ({ username, password, rememberme, application, version }: LoginForm) => {
    return new ApiRequest(nonAuthorizedUserApiInstance).post<AuthUser | BaseResponseError>({
        url: "user",
        data: {
            user: username,
            secret: password,
            rememberme,
            application,
            version,
        },
        defaultError: "Authentication failed",
    });
};

export const logout = async (useruid: string) => {
    return new ApiRequest().post({
        url: `user/${useruid}/logout`,
        defaultError: "Logout failed",
    });
};

export const checkToken = async (token: string) => {
    return new ApiRequest().get({
        url: `sites/${token}/checktoken`,
        defaultError: "Token validation failed",
    });
};

export const resend2FA = async (data?: unknown) => {
    return new ApiRequest().post({
        url: "user/2fa-resend",
        data,
        defaultError: "Failed to resend 2FA verification code",
    });
};

export const check2FA = async (data?: unknown) => {
    return new ApiRequest().post({
        url: "user/2fa-check",
        data,
        defaultError: "Failed to check 2FA requirement",
    });
};

export const setup2FA = async (data?: unknown) => {
    return new ApiRequest().post({
        url: "user/2fa-setup",
        data,
        defaultError: "Failed to setup 2FA verification method",
    });
};

export const verify2FA = async (data?: unknown) => {
    return new ApiRequest().post({
        url: "user/2fa-verify",
        data,
        defaultError: "Failed to verify 2FA code",
    });
};

export const get2FATrustedDevices = async (useruid: string) => {
    return new ApiRequest().get({
        url: `user/${useruid}/2fa-trusted-devices`,
        defaultError: "Failed to get trusted devices",
    });
};

export const remove2FATrustedDevice = async (useruid: string, data?: unknown) => {
    return new ApiRequest().post({
        url: `user/${useruid}/2fa-trusted-devices-remove`,
        data,
        defaultError: "Failed to remove trusted device",
    });
};

export const removeAll2FATrustedDevices = async (useruid: string) => {
    return new ApiRequest().post({
        url: `user/${useruid}/2fa-trusted-devices-removeall`,
        defaultError: "Failed to remove all trusted devices",
    });
};

export const get2FASettings = async (useruid: string) => {
    return new ApiRequest().get({
        url: `user/${useruid}/2fa-settings`,
        defaultError: "Failed to get 2FA settings",
    });
};

export const set2FAPreference = async (useruid: string, data?: unknown) => {
    return new ApiRequest().post({
        url: `user/${useruid}/2fa-preference`,
        data,
        defaultError: "Failed to set 2FA preference",
    });
};

export const confirm2FA = async (useruid: string, data?: unknown) => {
    return new ApiRequest().post({
        url: `user/${useruid}/2fa-confirm`,
        data,
        defaultError: "Failed to confirm 2FA setup",
    });
};

export const disable2FA = async (useruid: string, data?: unknown) => {
    return new ApiRequest().post({
        url: `user/${useruid}/2fa-disable`,
        data,
        defaultError: "Failed to disable 2FA method",
    });
};

export const regenerate2FABackupCodes = async (useruid: string) => {
    return new ApiRequest().post({
        url: `user/${useruid}/2fa-backup-regenerate`,
        defaultError: "Failed to regenerate 2FA backup codes",
    });
};

export const elevate2FA = async (useruid: string, data?: unknown) => {
    return new ApiRequest().post({
        url: `user/${useruid}/2fa-elevate`,
        data,
        defaultError: "Failed to elevate session with 2FA",
    });
};

export const get2FAElevationStatus = async (useruid: string) => {
    return new ApiRequest().get({
        url: `user/${useruid}/2fa-elevation-status`,
        defaultError: "Failed to get 2FA elevation status",
    });
};

export const check2FAEndpoint = async (useruid: string, data?: unknown) => {
    return new ApiRequest().post({
        url: `user/${useruid}/2fa-check-endpoint`,
        data,
        defaultError: "Failed to check if endpoint requires 2FA elevation",
    });
};
