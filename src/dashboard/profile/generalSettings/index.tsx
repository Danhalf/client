import { DashboardDialog } from "dashboard/common/dialog";
import { DialogProps } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import "./index.css";
import { SettingsDeals } from "./deals";
import { SettingsFees } from "./fees";
import { SettingsTaxes } from "./taxes";
import { SettingsStockNew } from "./stockNew";
import { SettingsStockTradeIn } from "./stockTradeIn";
import { SettingsAccount } from "./account";
import { SettingsContract } from "./contract";
import { SettingsLease } from "./lease";

interface TabItem {
    settingName: string;
    component: JSX.Element;
}

const tabItems: TabItem[] = [
    { settingName: "Deals", component: <SettingsDeals /> },
    { settingName: "Fees", component: <SettingsFees /> },
    { settingName: "Taxes", component: <SettingsTaxes /> },
    { settingName: "Stock# for new inventory ", component: <SettingsStockNew /> },
    { settingName: "Stock# for trade-in inventory", component: <SettingsStockTradeIn /> },
    { settingName: "Account Settings", component: <SettingsAccount /> },
    { settingName: "Contract Settings", component: <SettingsContract /> },
    { settingName: "Lease Settings", component: <SettingsLease /> },
];

export const GeneralSettingsDialog = ({ visible, onHide }: DialogProps): JSX.Element => {
    const handleSendSupportContact = (): void => {
        onHide();
        return;
    };

    return (
        <>
            <DashboardDialog
                className='dialog__general-settings general-settings'
                footer='Send'
                header='General settings'
                visible={visible}
                onHide={onHide}
                action={handleSendSupportContact}
            >
                <TabView className='general-settings__tab'>
                    {tabItems.map(({ settingName, component }) => {
                        return <TabPanel header={settingName} children={component} />;
                    })}
                </TabView>
            </DashboardDialog>
        </>
    );
};
