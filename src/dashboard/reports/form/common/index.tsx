import { BaseResponseError, Status } from "common/models/base-response";
import { ReportServiceColumns } from "common/models/reports";
import { TOAST_LIFETIME } from "common/settings";
import { useToast } from "dashboard/common/toast";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { ReactElement } from "react";
import { useStore } from "store/hooks";

interface ReportSelectProps {
    header: string;
    values: ReportServiceColumns[];
    currentItem: ReportServiceColumns | null;
    onItemClick: (item: ReportServiceColumns) => void;
}

export const ReportSelect = ({
    header,
    values,
    currentItem,
    onItemClick,
}: ReportSelectProps): ReactElement => {
    return (
        <div className='report-select'>
            <span className='report-select__header'>{header}</span>
            <ul className='report-select__list'>
                {values.map((value) => (
                    <li
                        className={`report-select__item ${currentItem === value ? "selected" : ""}`}
                        key={value.data}
                        onClick={() => {
                            onItemClick(value);
                        }}
                    >
                        {value.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

interface ReportFooterProps {
    onAction: () => void;
}

export const ReportFooter = observer(({ onAction }: ReportFooterProps): ReactElement => {
    const reportStore = useStore().reportStore;
    const { report, saveReport } = reportStore;
    const toast = useToast();

    const handleSaveReport = () => {
        saveReport(report?.itemuid).then((response: BaseResponseError | undefined) => {
            if (response?.status === Status.OK) {
                onAction();
                toast.current?.show({
                    severity: "success",
                    summary: "Success",
                    detail: "New custom report is successfully saved!",
                    life: TOAST_LIFETIME,
                });
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: response?.error || "Error while saving new custom report",
                    life: TOAST_LIFETIME,
                });
            }
        });
    };
    return (
        <div className='report__footer gap-3 mt-8 mr-3'>
            <Button
                className='report__icon-button'
                icon='icon adms-password'
                severity='secondary'
            />
            <Button className='report__icon-button' icon='icon adms-blank' severity='secondary' />
            <Button
                className='report__icon-button'
                icon='icon adms-trash-can'
                severity='secondary'
            />
            <Button className='ml-auto uppercase px-6 report__button' severity='danger' outlined>
                Cancel
            </Button>
            <Button
                className='uppercase px-6 report__button'
                disabled={!report.name}
                severity={!report.name ? "secondary" : "success"}
                onClick={() => handleSaveReport()}
            >
                {report?.itemuid ? "Update" : "Create"}
            </Button>
        </div>
    );
});
