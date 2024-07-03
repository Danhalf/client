import { ReportCollection } from "common/models/reports";
import { getUserReportCollectionsContent } from "http/services/reports.service";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { ReactElement, Suspense, useEffect, useState } from "react";
import { useStore } from "store/hooks";
import "./index.css";
import { InputText } from "primereact/inputtext";

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
                            <div className='col-8 report-form'>
                                <div className='report-form__header uppercase'>New report</div>
                                <div className='report-form__body grid'>
                                    <div className='col-6'>
                                        <span className='p-float-label'>
                                            <InputText />
                                            <label className='float-label w-full'>name</label>
                                        </span>
                                    </div>
                                    <div className='col-3'>
                                        <Button className='uppercase px-6 report__button' outlined>
                                            Preview
                                        </Button>
                                    </div>
                                    <div className='col-3'>
                                        <Button className='uppercase px-6 report__button' outlined>
                                            Download
                                        </Button>
                                    </div>
                                    <div className='grid'>
                                        <div className='col-1'>
                                            <Button
                                                className='report__control-button'
                                                icon='pi pi-plus'
                                                outlined
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-content-end gap-3 mt-8 mr-3'>
                            <Button className='uppercase px-6 report__button' outlined>
                                Cancel
                            </Button>
                            <Button className='uppercase px-6 report__button' outlined>
                                Create
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
};
export default ReportForm;
