import React, { useEffect, useState } from "react";
import { AuthUser } from "http/services/auth.service";
import { getKeyValue } from "services/local-storage.service";
import {
    getReportById,
    getReportsList,
    makeReports,
    printDocumentByUser,
} from "http/services/reports.service";
import { Button } from "primereact/button";
import { LS_APP_USER } from "common/constants/localStorage";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import "./index.css";

export default function Reports() {
    const [authUser, setUser] = useState<AuthUser | null>(null);
    const [reportSearch, setReportSearch] = useState<string>("");

    useEffect(() => {
        const authUser: AuthUser = getKeyValue(LS_APP_USER);
        if (authUser) {
            setUser(authUser);
            getReportsList(authUser.useruid, { total: 1 }).then((response) => {});
        }
    }, []);

    return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='card-header__title uppercase m-0'>Reports</h2>
                    </div>
                    <div className='card-content'>
                        <div className='grid'>
                            <div className='reports-header col-12'>
                                <Button icon='pi pi-plus' className='reports-header__button'>
                                    New collection
                                </Button>
                                <Button className='reports-header__button'>Custom Report</Button>
                                <span className='p-input-icon-right reports-header__search'>
                                    <i
                                        className={`pi pi-${
                                            !reportSearch ? "search" : "times cursor-pointer"
                                        }`}
                                        onClick={() => setReportSearch("")}
                                    />
                                    <InputText
                                        value={reportSearch}
                                        placeholder='Search'
                                        onChange={(e) => setReportSearch(e.target.value)}
                                    />
                                </span>
                            </div>
                            <div className='col-12'>
                                <Accordion multiple activeIndex={[0]}>
                                    <AccordionTab header='Favorites'>
                                        <p className='m-0'>Favorites</p>
                                    </AccordionTab>
                                    <AccordionTab header='AR Reports'>
                                        <p className='m-0'>AR Reports</p>
                                    </AccordionTab>
                                    <AccordionTab header='BHPH Reports'>
                                        <p className='m-0'>BHPH Reports</p>
                                    </AccordionTab>
                                    <AccordionTab header='Custom Collections'>
                                        <p className='m-0'>Custom Collections</p>
                                    </AccordionTab>
                                    <AccordionTab header='Custom Reports'>
                                        <p className='m-0'>Custom Reports</p>
                                    </AccordionTab>
                                    <AccordionTab header='Inventory Reports'>
                                        <p className='m-0'>Inventory Reports</p>
                                    </AccordionTab>
                                    <AccordionTab header='Miscellaneous'>
                                        <p className='m-0'>Miscellaneous</p>
                                    </AccordionTab>
                                    <AccordionTab header='Sales Reports'>
                                        <p className='m-0'>Sales Reports</p>
                                    </AccordionTab>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
