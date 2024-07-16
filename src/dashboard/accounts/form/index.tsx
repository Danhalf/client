import { Button } from "primereact/button";
import { ReactElement } from "react";
import "./index.css";
import { TabPanel, TabView } from "primereact/tabview";

interface TabItem {
    tabName: string;
    component?: ReactElement;
}

export const AccountsForm = (): ReactElement => {
    const tabItems: TabItem[] = [
        { tabName: "Account information" },
        { tabName: "Account Management" },
        { tabName: "Payment History" },
        { tabName: "Down Payment" },
        { tabName: "Account Settings" },
        { tabName: "Notes" },
        { tabName: "Promise To Pay" },
        { tabName: "Insurance" },
    ];
    return (
        <div className='grid relative'>
            <Button icon='pi pi-times' className='p-button close-button' />
            <div className='col-12'>
                <div className='card account'>
                    <div className='card-header flex'>
                        <h2 className='account__title uppercase m-0'>Create custom account</h2>
                    </div>
                    <div className='card-content account__card grid'>
                        <TabView className='account__tabs'>
                            {tabItems.map(({ tabName, component }) => {
                                return (
                                    <TabPanel
                                        header={tabName}
                                        children={component}
                                        key={tabName}
                                        className='account__panel'
                                    />
                                );
                            })}
                        </TabView>
                    </div>
                    <div className='account__footer gap-3 ml-auto mr-3'>
                        <Button className='ml-auto uppercase px-6 account__button' outlined>
                            Cancel
                        </Button>
                        <Button className='uppercase px-6 account__button'>Create</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
