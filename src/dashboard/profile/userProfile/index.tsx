import "./index.css";
import { ReactElement, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { PersonalInformation } from "dashboard/profile/userProfile/personal-information";
import { Security } from "dashboard/profile/userProfile/security";
import { Payments } from "dashboard/profile/userProfile/payments";
import { DASHBOARD_PAGE } from "common/constants/links";
import { observer } from "mobx-react-lite";
import { DataTableWrapper } from "dashboard/common/data-table";

interface TabItem {
    settingName: string;
    component: ReactElement;
    route: string;
}

export const UserProfile = observer((): ReactElement => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const tabItems: TabItem[] = [
        {
            settingName: "Personal information",
            route: "personal-information",
            component: <PersonalInformation />,
        },
        {
            settingName: "Security",
            route: "security",
            component: <Security />,
        },
        {
            settingName: "Payments",
            route: "payments",
            component: <Payments />,
        },
    ];

    useEffect(() => {
        const defaultTabRoute = tabItems[0].route;
        const currentTab = searchParams.get("section");
        if (!currentTab) {
            setSearchParams({ section: defaultTabRoute });
        }
    }, [searchParams, setSearchParams]);

    const activeTabParam = searchParams.get("section") || tabItems[0].route;
    const activeTabIndex = tabItems.findIndex((section) => section.route === activeTabParam);

    const handleTabChange = (index: number) => {
        const selectedTabRoute = tabItems[index].route;
        setSearchParams({ section: selectedTabRoute });
    };

    const handleCloseClick = () => {
        navigate(DASHBOARD_PAGE);
    };

    const handleSave = () => {
        return;
    };

    return (
        <DataTableWrapper className='grid p-0 relative user-profile-page'>
            <Button
                icon='pi pi-times'
                className='p-button close-button'
                onClick={handleCloseClick}
            />
            <div className='col-12'>
                <div className='card'>
                    <div className='card-header flex'>
                        <h2 className='card-header__title uppercase m-0'>MY PROFILE</h2>
                    </div>
                    <TabView
                        className='user-profile-page__tabs'
                        activeIndex={activeTabIndex}
                        onTabChange={(e) => handleTabChange(e.index)}
                    >
                        {tabItems.map(({ settingName, component }) => {
                            return (
                                <TabPanel
                                    header={settingName}
                                    children={component}
                                    key={settingName}
                                    className='user-profile-page__panel'
                                />
                            );
                        })}
                    </TabView>
                    <div className='user-profile-page__buttons'>
                        <Button
                            className='uppercase px-6 form__button'
                            onClick={handleSave}
                            severity='success'
                        >
                            UPDATE
                        </Button>
                    </div>
                </div>
            </div>
        </DataTableWrapper>
    );
});
