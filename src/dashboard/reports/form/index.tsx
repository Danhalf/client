import { ReportCollection } from "common/models/reports";
import { getUserReportCollectionsContent } from "http/services/reports.service";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { ReactElement, Suspense, useEffect, useState } from "react";
import { useStore } from "store/hooks";
import "./index.css";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";

export const ReportForm = (): ReactElement => {
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [collections, setCollections] = useState<ReportCollection[]>([]);

    const handleGetUserReportCollections = (useruid: string) =>
        getUserReportCollectionsContent(useruid).then((response) => {
            if (Array.isArray(response)) {
                setCollections(response);
            } else {
                setCollections([]);
            }
        });

    useEffect(() => {
        if (authUser) {
            handleGetUserReportCollections(authUser.useruid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser]);

    const ReportSelect = ({
        header,
        values,
    }: {
        header: string;
        values: string[];
    }): ReactElement => {
        return (
            <div className='report-select'>
                <span className='report-select__header'>{header}</span>
                <ul className='report-select__list'>
                    {values.map((value) => (
                        <li className='report-select__item' key={value}>
                            {value}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <Suspense>
            <div className='grid relative'>
                <div className='col-12'>
                    <div className='card report'>
                        <div className='card-header flex'>
                            <h2 className='report__title uppercase m-0'>Create custom report</h2>
                        </div>
                        <div className='card-content report__card grid'>
                            <div className='col-4'>
                                <Accordion multiple className='report__accordion'>
                                    {collections &&
                                        collections.map(
                                            ({ itemUID, name, documents }: ReportCollection) => (
                                                <AccordionTab
                                                    key={itemUID}
                                                    header={name}
                                                    className='report__accordion-tab'
                                                >
                                                    {documents &&
                                                        documents.map((report) => (
                                                            <div
                                                                className='report__list-item'
                                                                key={report.itemUID}
                                                            >
                                                                <p>{report.name}</p>
                                                            </div>
                                                        ))}
                                                </AccordionTab>
                                            )
                                        )}
                                </Accordion>
                            </div>
                            <div className='col-8 grid report-form'>
                                <div className='report-form__header uppercase'>New report</div>
                                <div className='report-form__body grid'>
                                    <div className='col-6'>
                                        <span className='p-float-label'>
                                            <InputText className='w-full' />
                                            <label className='float-label w-full'>Name</label>
                                        </span>
                                    </div>
                                    <div className='col-3'>
                                        <Button
                                            className='uppercase w-full px-6 report__button'
                                            outlined
                                        >
                                            Preview
                                        </Button>
                                    </div>
                                    <div className='col-3'>
                                        <Button
                                            className='uppercase w-full px-6 report__button'
                                            outlined
                                        >
                                            Download
                                        </Button>
                                    </div>
                                    <div className='col-12 report-controls'>
                                        <div className='report-controls__top'>
                                            <span className='p-float-label'>
                                                <Dropdown className='report-controls__dropdown' />
                                                <label className='float-label'>Data Set</label>
                                            </span>
                                        </div>
                                        <div className='report-control'>
                                            <Button
                                                className='report-control__button'
                                                icon='pi pi-angle-up'
                                                outlined
                                            />
                                            <Button
                                                className='report-control__button'
                                                icon='pi pi-angle-double-up'
                                                outlined
                                            />
                                            <Button
                                                className='report-control__button'
                                                icon='pi pi-angle-down'
                                                outlined
                                            />
                                            <Button
                                                className='report-control__button'
                                                icon='pi pi-angle-double-down'
                                                outlined
                                            />
                                        </div>
                                        <ReportSelect
                                            header='Available'
                                            values={[
                                                "Account",
                                                "Buyer Name",
                                                "Type",
                                                "Info (value)",
                                                "Stock#",
                                                "VIN",
                                                "Date",
                                            ]}
                                        />
                                        <div className='report-control'>
                                            <Button
                                                className='report-control__button'
                                                icon='pi pi-angle-right'
                                                outlined
                                            />
                                            <Button
                                                className='report-control__button'
                                                icon='pi pi-angle-double-right'
                                                outlined
                                            />
                                            <Button
                                                className='report-control__button'
                                                icon='pi pi-angle-left'
                                                outlined
                                            />
                                            <Button
                                                className='report-control__button'
                                                icon='pi pi-angle-double-left'
                                                outlined
                                            />
                                        </div>
                                        <ReportSelect
                                            header='Selected'
                                            values={["Account", "Buyer Name", "Type"]}
                                        />
                                        <div className='report-control'>
                                            <Button
                                                className='report-control__button'
                                                icon='pi pi-angle-up'
                                                outlined
                                            />
                                            <Button
                                                className='report-control__button'
                                                icon='pi pi-angle-double-up'
                                                outlined
                                            />
                                            <Button
                                                className='report-control__button'
                                                icon='pi pi-angle-down'
                                                outlined
                                            />
                                            <Button
                                                className='report-control__button'
                                                icon='pi pi-angle-double-down'
                                                outlined
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='hr col-12'>
                                    <h3 className='hr__title m-0 pr-3'>Report options</h3>
                                    <hr className='hr__line flex-1' />
                                </div>

                                <div className='col-3'>
                                    <label className='cursor-pointer report-control__checkbox'>
                                        <Checkbox checked={false} onChange={() => {}} />
                                        Show Totals
                                    </label>
                                </div>
                                <div className='col-3'>
                                    <label className='cursor-pointer report-control__checkbox'>
                                        <Checkbox checked={false} onChange={() => {}} />
                                        Show Averages
                                    </label>
                                </div>
                                <div className='col-3'>
                                    <label className='cursor-pointer report-control__checkbox'>
                                        <Checkbox checked={false} onChange={() => {}} />
                                        Show Line Count
                                    </label>
                                </div>

                                <div className='hr col-12'>
                                    <h3 className='hr__title m-0 pr-3'>Report parameters</h3>
                                    <hr className='hr__line flex-1' />
                                </div>

                                <div className='col-4'>
                                    <label className='cursor-pointer report-control__checkbox'>
                                        <Checkbox checked={false} onChange={() => {}} />
                                        Ask for Start and End Dates
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-content-end gap-3 mt-8 mr-3'>
                            <Button className='uppercase px-6 report__button' outlined>
                                Cancel
                            </Button>
                            <Button className='uppercase px-6 report__button'>Create</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
};
export default ReportForm;
