import { ReactElement } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

interface EditActionColumnProps {
    onEdit: (item: any) => void;
    icon?: string;
    className?: string;
    width?: string;
}

export const EditActionColumn = ({
    onEdit,
    icon = "icon adms-edit-item",
    className,
    width = "80px",
}: EditActionColumnProps): ReactElement => {
    return (
        <Column
            bodyStyle={{ textAlign: "center" }}
            reorderable={false}
            resizeable={false}
            body={(item) => {
                return (
                    <Button
                        className={`${className} table-button`}
                        icon={icon}
                        onClick={() => onEdit(item)}
                    />
                );
            }}
            pt={{
                root: {
                    style: {
                        width,
                    },
                },
            }}
        />
    );
};
