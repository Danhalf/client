import { Button, ButtonProps } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { PanelHeaderTemplateOptions } from "primereact/panel";
import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

export const ActionButtons = ({ reportuid }: { reportuid: string }): ReactElement => {
    return (
        <div className='reports-actions flex'>
            <Button
                className='p-button reports-actions__button reports-actions__add-button'
                icon='pi pi-plus'
                tooltip='Add to Collection'
                outlined
            />
            <Button
                className='p-button reports-actions__button'
                icon='pi pi-heart'
                outlined
                tooltip='Add to Favorites'
            />
            <Button
                className='p-button reports-actions__button'
                icon='icon adms-password'
                outlined
                tooltip='Edit Access'
            />
        </div>
    );
};

interface ReportsAccordionHeaderProps {
    title: string;
    info: string;
    actionButton?: ReactElement;
}

export const ReportsAccordionHeader = ({
    title,
    info,
    actionButton,
}: ReportsAccordionHeaderProps): ReactElement => {
    return (
        <div className='reports-accordion-header'>
            <div className='flex gap-1'>
                <div className='reports-accordion-header__title'>{title}</div>
                <div className='reports-accordion-header__info'>{info}</div>
            </div>
            {actionButton}
        </div>
    );
};

interface ReportsPanelHeaderProps extends ButtonProps {
    options: PanelHeaderTemplateOptions;
    state: string;
    navigatePath: string;
    setStateAction: (state: string) => void;
}

export const ReportsPanelHeader = ({
    options,
    state,
    navigatePath,
    setStateAction,
}: ReportsPanelHeaderProps): ReactElement => {
    const navigate = useNavigate();
    return (
        <div className='reports-header col-12 px-0 pb-3'>
            <Button
                icon='pi pi-plus'
                className='reports-header__button'
                onClick={options.onTogglerClick}
            >
                New collection
            </Button>
            <Button className='reports-header__button' onClick={() => navigate(navigatePath)}>
                Custom Report
            </Button>
            <span className='p-input-icon-right reports-header__search'>
                <i
                    className={`pi pi-${!state ? "search" : "times cursor-pointer"}`}
                    onClick={() => setStateAction("")}
                />
                <InputText
                    value={state}
                    placeholder='Search'
                    onChange={(e) => setStateAction(e.target.value)}
                />
            </span>
        </div>
    );
};
