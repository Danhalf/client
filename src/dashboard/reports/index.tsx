import React, { ReactElement, useEffect, useState } from "react";
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

const mockReports = [
    {
        id: "1",
        name: "Report 1",
    },
    {
        id: "2",
        name: "Report 2",
    },
    {
        id: "3",
        name: "Report 3",
    },
];

export default function Reports(): ReactElement {
    const [authUser, setUser] = useState<AuthUser | null>(null);
    const [reportSearch, setReportSearch] = useState<string>("");

    useEffect(() => {
        const authUser: AuthUser = getKeyValue(LS_APP_USER);
        if (authUser) {
            setUser(authUser);
            getReportsList(authUser.useruid, { total: 1 }).then((response) => {});
        }
    }, []);

    const ActionButtons = ({ reportuid }: { reportuid: string }): ReactElement => {
        return (
            <div className='reports-actions flex gap-3'>
                <Button className='p-button reports-actions__button' outlined>
                    Preview
                </Button>
                <Button className='p-button reports-actions__button' outlined>
                    Download
                </Button>
            </div>
        );
    };

    return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card reports'>
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
                                <Accordion
                                    multiple
                                    activeIndex={[0]}
                                    className='reports__accordion'
                                >
                                    <AccordionTab header='Favorites' className='reports__list'>
                                        {mockReports.map((report) => (
                                            <div
                                                className='reports__list-item'
                                                key={report.id}
                                                onClick={() => getReportById(report.id)}
                                            >
                                                <p>{report.name}</p>
                                                <ActionButtons reportuid={report.id} />
                                            </div>
                                        ))}
                                    </AccordionTab>
                                    <AccordionTab header='AR Reports'>
                                        <p>AR Reports</p>
                                    </AccordionTab>
                                    <AccordionTab header='BHPH Reports'>
                                        <p>BHPH Reports</p>
                                    </AccordionTab>
                                    <AccordionTab header='Custom Collections'>
                                        <p>Custom Collections</p>
                                    </AccordionTab>
                                    <AccordionTab header='Custom Reports'>
                                        <p>Custom Reports</p>
                                    </AccordionTab>
                                    <AccordionTab header='Inventory Reports'>
                                        <p>Inventory Reports</p>
                                    </AccordionTab>
                                    <AccordionTab header='Miscellaneous'>
                                        <p>Miscellaneous</p>
                                    </AccordionTab>
                                    <AccordionTab header='Sales Reports'>
                                        <p>Sales Reports</p>
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
