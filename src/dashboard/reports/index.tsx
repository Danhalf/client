import { ReactElement, useEffect, useState } from "react";
import { AuthUser } from "http/services/auth.service";
import {
    getCommonReportsList,
    getReportById,
    getReportsList,
    getUserReportCollections,
} from "http/services/reports.service";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import "./index.css";
import { getKeyValue } from "services/local-storage.service";
import { LS_APP_USER } from "common/constants/localStorage";
import { BaseResponseError, Status } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { MultiSelect } from "primereact/multiselect";

const getMockReports = () => {
    return Array.from({ length: Math.random() * 7 + 1 }, (_, i) => ({
        id: i.toString(),
        name: `report ${i + 1}`,
    }));
};

const mockReportsGroup = [
    {
        id: 1,
        name: "Favorites",
        items: getMockReports(),
    },
    {
        id: 2,
        name: "AR Reports",
        items: getMockReports(),
    },
    {
        id: 3,
        name: "BHPH Reports",
        items: getMockReports(),
    },
    {
        id: 4,
        name: "Custom Collections",
        items: getMockReports(),
    },
    {
        id: 5,
        name: "Custom Reports",
        items: getMockReports(),
    },
    {
        id: 6,
        name: "Inventory Reports",
        items: getMockReports(),
    },
    {
        id: 7,
        name: "Miscellaneous",
        items: getMockReports(),
    },
    {
        id: 8,
        name: "Sales Reports",
        items: getMockReports(),
    },
];

export default function Reports(): ReactElement {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [reportSearch, setReportSearch] = useState<string>("");

    const toast = useToast();

    useEffect(() => {
        const authUser: AuthUser = getKeyValue(LS_APP_USER);
        setUser(authUser);
    }, []);

    useEffect(() => {
        if (user) {
            getReportsList(user.useruid, { total: 1 }).then((response) => {});
            getUserReportCollections(user.useruid).then((response) => {});
            getCommonReportsList().then((response) => {
                if (response.status === Status.ERROR && toast.current) {
                    const { error } = response as BaseResponseError;
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: error,
                        life: TOAST_LIFETIME,
                    });
                }
            });
        }
    }, [toast, user]);

    const ActionButtons = ({ reportuid }: { reportuid: string }): ReactElement => {
        return (
            <div className='reports-actions flex gap-3'>
                <Button className='p-button' icon='pi pi-plus' outlined />
                <Button className='p-button' icon='pi pi-heart' outlined />
                <Button className='p-button reports-actions__button' outlined>
                    Preview
                </Button>
                <Button className='p-button reports-actions__button' outlined>
                    Download
                </Button>
            </div>
        );
    };

    const ReportsAccordionHeader = ({
        title,
        info,
    }: {
        title: string;
        info: string;
    }): ReactElement => {
        return (
            <div className='reports-accordion-header flex gap-1'>
                <div className='reports-accordion-header__title'>{title}</div>
                <div className='reports-accordion-header__info'>{info}</div>
            </div>
        );
    };

    const ReportsPanelHeader = (options: PanelHeaderTemplateOptions) => {
        return (
            <div className='reports-header col-12 px-0 pb-3'>
                <Button
                    icon='pi pi-plus'
                    className='reports-header__button'
                    onClick={options.onTogglerClick}
                >
                    New collection
                </Button>
                <Button className='reports-header__button'>Custom Report</Button>
                <span className='p-input-icon-right reports-header__search'>
                    <i
                        className={`pi pi-${!reportSearch ? "search" : "times cursor-pointer"}`}
                        onClick={() => setReportSearch("")}
                    />
                    <InputText
                        value={reportSearch}
                        placeholder='Search'
                        onChange={(e) => setReportSearch(e.target.value)}
                    />
                </span>
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
                            <div className='col-12'>
                                <Panel
                                    headerTemplate={ReportsPanelHeader}
                                    className='new-collection w-full'
                                    toggleable
                                >
                                    <h3 className='uppercase new-collection__title'>
                                        Add new collection
                                    </h3>
                                    <div className='grid new-collection__form'>
                                        <div className='col-4'>
                                            <InputText
                                                className='w-full'
                                                placeholder='Collection name'
                                            />
                                        </div>
                                        <div className='col-8'>
                                            <MultiSelect
                                                filter
                                                optionGroupLabel='name'
                                                optionGroupChildren='items'
                                                optionLabel='name'
                                                options={mockReportsGroup}
                                                className='w-full new-collection__multiselect'
                                                placeholder='Select reports'
                                                pt={{
                                                    wrapper: {
                                                        style: {
                                                            minHeight: "420px",
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                        <div className='col-12 flex justify-content-end'>
                                            <Button outlined>Create collection</Button>
                                        </div>
                                    </div>
                                </Panel>
                            </div>
                            <div className='col-12'>
                                <Accordion
                                    multiple
                                    activeIndex={[0]}
                                    className='reports__accordion'
                                >
                                    {mockReportsGroup.map((group) => {
                                        return (
                                            <AccordionTab
                                                key={group.id}
                                                header={
                                                    <ReportsAccordionHeader
                                                        title={group.name}
                                                        info={`(${group.items.length} reports)`}
                                                    />
                                                }
                                                className='reports__accordion-tab'
                                            >
                                                {group.items.map((report) => (
                                                    <div
                                                        className='reports__list-item'
                                                        key={report.id}
                                                        onClick={() => getReportById(report.id)}
                                                    >
                                                        <p>{`${group.name} ${report.name}`}</p>
                                                        <ActionButtons reportuid={report.id} />
                                                    </div>
                                                ))}
                                            </AccordionTab>
                                        );
                                    })}
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
