import { GeneralInventoryOptions } from "common/models/general-settings";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ReactElement } from "react";

export const NEW_ITEM = "new";

interface InventoryOptionRowProps {
    item: Partial<GeneralInventoryOptions>;
    index: number;
    isFirst: boolean;
    draggedItemId?: string | null;
    editedItem: Partial<GeneralInventoryOptions>;
    setEditedItem: (item: Partial<GeneralInventoryOptions>) => void;
    handleSetOrder: (option: Partial<GeneralInventoryOptions>, newOrder: number) => Promise<void>;
    handleSaveOption: (option: Partial<GeneralInventoryOptions>) => void;
    handleDeleteOption: (optionuid: string) => void;
    totalOffset?: number;
}

export const HeaderColumn = (): ReactElement => (
    <div className='settings-inventory__header col-12 grid m-0'>
        <div className='settings-inventory__number settings-inventory__number--left'>#</div>
        <div className='col-1'></div>
        <div className='settings-inventory__name justify-content-start'>Option</div>
        <div className='col-2'></div>
        <div className='settings-inventory__name justify-content-end'>Option</div>
        <div className='settings-inventory__number settings-inventory__number--right'>#</div>
    </div>
);

export const InventoryOptionRow = observer(
    ({
        item,
        index,
        isFirst,
        editedItem,
        setEditedItem,
        handleSaveOption,
        handleSetOrder,
        handleDeleteOption,
        draggedItemId = null,
        totalOffset = 0,
    }: InventoryOptionRowProps): ReactElement => (
        <div
            key={item.itemuid}
            className={`settings-inventory__row ${index < totalOffset / 2 ? "justify-content-start settings-inventory__row--left" : "justify-content-end settings-inventory__row--right"} grid col-12 ${draggedItemId === item.itemuid ? "dragged" : ""}`}
        >
            <div className='col-2 option-control'>
                <Button
                    icon='pi pi-arrow-circle-up'
                    rounded
                    text
                    severity='success'
                    tooltip='Move up'
                    className='p-button-text option-control__button'
                    onClick={() => handleSetOrder(item, index - 1)}
                    disabled={isFirst || item.itemuid === NEW_ITEM}
                />
                <Button
                    icon='pi pi-arrow-circle-down'
                    rounded
                    text
                    severity='success'
                    tooltip='Move down'
                    disabled={item.itemuid === NEW_ITEM || index === totalOffset - 1}
                    onClick={() => handleSetOrder(item, index + 1)}
                    className='p-button-text option-control__button'
                />
            </div>
            <div className='col-7 flex align-items-center'>
                {editedItem.itemuid === item.itemuid ? (
                    <div className='flex row-edit'>
                        <InputText
                            type='text'
                            value={editedItem.name || ""}
                            className='row-edit__input'
                            onChange={(e) =>
                                setEditedItem({
                                    ...editedItem,
                                    name: e.target.value,
                                })
                            }
                        />
                        <Button
                            className='p-button row-edit__button'
                            onClick={() => handleSaveOption(editedItem)}
                        >
                            Save
                        </Button>
                    </div>
                ) : (
                    item.name
                )}
            </div>
            <div className='col-2 option-control'>
                {editedItem.itemuid !== item.itemuid && (
                    <Button
                        tooltip='Edit option'
                        className='inventory-options__edit-button'
                        icon='icon adms-edit-item'
                        text
                        onClick={() =>
                            editedItem.itemuid ? setEditedItem({}) : setEditedItem(item)
                        }
                    />
                )}
                {editedItem.itemuid !== item.itemuid && (
                    <Button
                        tooltip='Delete option'
                        className='inventory-options__delete-button'
                        icon='icon adms-trash-can'
                        text
                        onClick={() => item?.itemuid && handleDeleteOption(item.itemuid)}
                    />
                )}
            </div>
        </div>
    )
);
