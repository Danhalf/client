import { observer } from "mobx-react-lite";
import { TabView, TabPanel } from "primereact/tabview";
import { ReactElement } from "react";
import { ContactsAddressInfo } from "../tabs/address";
import { ContactsGeneralInfo } from "../tabs/general";
import { ContactsIdentificationInfo } from "../tabs/identification";

export const ContactsCoBuyerInfo = observer((): ReactElement => {
    return (
        <div className='col-12'>
            <TabView className='contact-form__tabs'>
                <TabPanel header='General'>
                    <ContactsGeneralInfo type='buyer' />
                </TabPanel>
                <TabPanel header='Address'>
                    <ContactsAddressInfo type='buyer' />
                </TabPanel>
                <TabPanel header='Identification'>
                    <ContactsIdentificationInfo type='buyer' />
                </TabPanel>
                <TabPanel header='OFAC CHECK'>
                    <div>OFAC CHECK TAB</div>
                </TabPanel>
            </TabView>
        </div>
    );
});
