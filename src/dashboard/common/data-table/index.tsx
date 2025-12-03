import { Button } from "primereact/button";
import { Column, ColumnProps } from "primereact/column";
import { ReactElement } from "react";

export const rowExpansionTemplate = (text: string, label: string = "Description: ") => {
    return (
        <div className='expanded-row'>
            <div className='expanded-row__label'>{label}</div>
            <div className='expanded-row__text'>{text || ""}</div>
        </div>
    );
};

interface ExpansionColumnProps extends ColumnProps {
    handleRowExpansion: (rowData: any) => void;
    width?: string;
}

export const ExpansionColumn = (props: ExpansionColumnProps): ReactElement => {
    return (
        <Column
            bodyStyle={{ textAlign: "center" }}
            reorderable={props.reorderable ?? false}
            resizeable={props.resizeable ?? false}
            body={(rowData) => {
                return (
                    <div className={`expansion-column flex gap-3 align-items-center`}>
                        <Button
                            className='text expansion-column__button'
                            icon='pi pi-angle-down'
                            onClick={() => props.handleRowExpansion(rowData)}
                        />
                    </div>
                );
            }}
            pt={{
                root: {
                    style: {
                        width: props.width ?? "60px",
                    },
                },
            }}
        />
    );
};
