import {
    createContext,
    ReactNode,
    ReactElement,
    useCallback,
    useContext,
    useMemo,
    useState,
    useEffect,
} from "react";
import { AuthUser } from "common/models/user";
import { getKeyValue } from "services/local-storage.service";
import { LS_APP_USER } from "common/constants/localStorage";
import { typeGuards } from "common/utils";

const MS_IN_SECOND = 1000;

interface AuthTokensState {
    accessToken: string | null;
    refreshToken: string | null;
    sessionUid: string | null;
    userUid: string | null;
    expiresAt: number | null;
    refreshExpiresAt: number | null;
}

interface AuthContextValue extends AuthTokensState {
    authUser: AuthUser | null;
    isSessionExpiring: boolean;
    secondsLeft: number;
    login: (user: AuthUser) => void;
    logout: () => void;
    scheduleRefresh: (expiresInSec: number) => void;
    forceRefresh: () => Promise<void>;
    setSessionExpiring: (expiring: boolean, secondsLeft?: number) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const createInitialStateFromStoredUser = (): {
    user: AuthUser | null;
    tokens: AuthTokensState;
} => {
    const storedUser = getKeyValue(LS_APP_USER) as AuthUser | null;
    if (!storedUser) {
        return {
            user: null,
            tokens: {
                accessToken: null,
                refreshToken: null,
                sessionUid: null,
                userUid: null,
                expiresAt: null,
                refreshExpiresAt: null,
            },
        };
    }

    const now = Date.now();
    const expiresAt = typeGuards.isNumber(storedUser.expires_in)
        ? now + storedUser.expires_in * MS_IN_SECOND
        : null;
    const refreshExpiresAt = typeGuards.isNumber(storedUser.refresh_token_expires_in)
        ? now + storedUser.refresh_token_expires_in * MS_IN_SECOND
        : null;

    return {
        user: storedUser,
        tokens: {
            accessToken: storedUser.token || null,
            refreshToken: storedUser.refresh_token || null,
            sessionUid: storedUser.sessionuid || null,
            userUid: storedUser.useruid || null,
            expiresAt,
            refreshExpiresAt,
        },
    };
};

export const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
    const initialState = useMemo(() => createInitialStateFromStoredUser(), []);

    const [authUser, setAuthUser] = useState<AuthUser | null>(initialState.user);
    const [tokens, setTokens] = useState<AuthTokensState>(initialState.tokens);
    const [isSessionExpiring, setIsSessionExpiring] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        const { user, tokens: nextTokens } = createInitialStateFromStoredUser();
        setAuthUser(user);
        setTokens(nextTokens);
    }, []);

    const login = useCallback((user: AuthUser) => {
        const now = Date.now();
        setAuthUser(user);
        setTokens({
            accessToken: user.token || null,
            refreshToken: user.refresh_token || null,
            sessionUid: user.sessionuid || null,
            userUid: user.useruid || null,
            expiresAt: typeGuards.isNumber(user.expires_in)
                ? now + user.expires_in * MS_IN_SECOND
                : null,
            refreshExpiresAt: typeGuards.isNumber(user.refresh_token_expires_in)
                ? now + user.refresh_token_expires_in * MS_IN_SECOND
                : null,
        });
        setIsSessionExpiring(false);
        setSecondsLeft(0);
    }, []);

    const logout = useCallback(() => {
        setAuthUser(null);
        setTokens({
            accessToken: null,
            refreshToken: null,
            sessionUid: null,
            userUid: null,
            expiresAt: null,
            refreshExpiresAt: null,
        });
        setIsSessionExpiring(false);
        setSecondsLeft(0);
    }, []);

    const scheduleRefresh = useCallback((expiresInSec: number) => {
        const now = Date.now();
        setTokens((prev) => ({
            ...prev,
            expiresAt: now + expiresInSec * MS_IN_SECOND,
        }));
    }, []);

    const forceRefresh = useCallback(async () => {
        return;
    }, []);

    const setSessionExpiring = useCallback((expiring: boolean, value?: number) => {
        setIsSessionExpiring(expiring);
        if (typeGuards.isNumber(value)) {
            setSecondsLeft(value);
        }
    }, []);

    const value: AuthContextValue = useMemo(
        () => ({
            authUser,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            sessionUid: tokens.sessionUid,
            userUid: tokens.userUid,
            expiresAt: tokens.expiresAt,
            refreshExpiresAt: tokens.refreshExpiresAt,
            isSessionExpiring,
            secondsLeft,
            login,
            logout,
            scheduleRefresh,
            forceRefresh,
            setSessionExpiring,
        }),
        [
            authUser,
            tokens,
            isSessionExpiring,
            secondsLeft,
            login,
            logout,
            scheduleRefresh,
            forceRefresh,
            setSessionExpiring,
        ]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext is not defined. useAuth must be used within an AuthProvider");
    }
    return context;
};
