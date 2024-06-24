import { ReactElement, useEffect, useRef, useState } from "react";
import "./index.css";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import logo from "assets/images/logo.svg";
import userCabinet from "assets/images/icons/header/user-cabinet.svg";
import { AuthUser, logout } from "http/services/auth.service";
import { useNavigate } from "react-router-dom";
import { localStorageClear } from "services/local-storage.service";
import { LS_APP_USER } from "common/constants/localStorage";
import { SupportContactDialog } from "dashboard/profile/supportContact";
import { SupportHistoryDialog } from "dashboard/profile/supportHistory";
import { UserProfileDialog } from "dashboard/profile/userProfile";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { getExtendedData } from "http/services/auth-user.service";
import { HELP_PAGE } from "common/constants/links";

export const Header = observer((): ReactElement => {
    const store = useStore().userStore;
    const { authUser } = store;
    const menuRight = useRef<Menu>(null);
    const navigate = useNavigate();
    const [supportContact, setSupportContact] = useState<boolean>(false);
    const [supportHistory, setSupportHistory] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<boolean>(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    const [isSalesPerson, setIsSalesPerson] = useState(true);
    useEffect(() => {
        if (authUser && Object.keys(authUser.permissions).length) {
            const { permissions } = authUser;
            const { uaSalesPerson, ...otherPermissions } = permissions;
            if (Object.values(otherPermissions).some((permission) => permission === 1)) {
                return setIsSalesPerson(false);
            }
            if (!!uaSalesPerson) setIsSalesPerson(true);
        }
    }, [authUser, authUser?.permissions]);

    const signOut = ({ useruid }: AuthUser) => {
        logout(useruid).finally(() => {
            localStorageClear(LS_APP_USER);
            navigate("/");
        });
    };

    useEffect(() => {
        const items: MenuItem[] = [
            {
                label: "My Profile",
                command() {
                    setUserProfile(true);
                },
            },
            { separator: true },
            { label: "Users" },
            { separator: true },
            {
                label: "Contact support",
                command() {
                    setSupportContact(true);
                },
            },
            {
                label: "Support history",
                command() {
                    setSupportHistory(true);
                },
            },
            {
                label: "Help",
                command() {
                    window.open(HELP_PAGE, "_blank");
                },
            },
            { separator: true },
            {
                label: "Logout",
                command() {
                    authUser && signOut(authUser);
                },
            },
        ];
        if (authUser && !isSalesPerson) {
            items.splice(1, 0, {
                label: "General Settings",
                command() {
                    navigate("settings");
                },
            });
        }

        if (authUser) {
            getExtendedData(authUser.useruid).then((response) => {
                if (response && response.locations && response.locations.length > 1) {
                    items.splice(3, 0, {
                        label: "Change location",
                    });
                }
            });
        }

        setMenuItems(items);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser, isSalesPerson]);

    if (menuRight) {
        return (
            <header className='header'>
                <div className='flex h-full align-items-center'>
                    <div className='header__logo'>
                        <img src={logo} alt='ADMSS' />
                    </div>
                    <div className='grid m-0 head-container justify-content-between'>
                        <div className='header-dealer-info'>
                            <p className='header-dealer-info__name font-bold'>
                                {authUser?.loginname}
                            </p>
                            <span className='header-dealer-location'></span>
                        </div>
                        <div className='header-user-menu ml-auto'>
                            <Menu model={menuItems} popup ref={menuRight} popupAlignment='right' />
                            <img
                                className='header-user-menu__toggle'
                                onClick={(event) => menuRight?.current?.toggle(event)}
                                src={userCabinet}
                                alt='User cabinet'
                            />
                        </div>
                    </div>
                </div>
                {authUser && (
                    <>
                        <UserProfileDialog
                            onHide={() => setUserProfile(false)}
                            visible={userProfile}
                            authUser={authUser}
                        />
                        <SupportContactDialog
                            onHide={() => setSupportContact(false)}
                            visible={supportContact}
                        />
                        <SupportHistoryDialog
                            onHide={() => setSupportHistory(false)}
                            useruid={authUser.useruid}
                            visible={supportHistory}
                        />
                    </>
                )}
            </header>
        );
    }
    return <></>;
});
