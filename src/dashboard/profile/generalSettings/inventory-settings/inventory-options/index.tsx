import "./index.css";
import { Button } from "primereact/button";
import { ReactElement, useEffect, useState, useMemo } from "react";
import { UserGroup } from "common/models/user";
import { TOAST_LIFETIME } from "common/settings";
import { useToast } from "dashboard/common/toast";
import { useStore } from "store/hooks";
import { getInventoryGroupOptions } from "http/services/inventory-service";
import { Dropdown } from "primereact/dropdown";
import { observer } from "mobx-react-lite";
import { GeneralInventoryOptions } from "common/models/general-settings";
import { NEW_ITEM, InventoryOptionRow } from "./template";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { setInventoryGroupOption } from "http/services/settings.service";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const SettingsInventoryOptions = observer((): ReactElement => {
    const toast = useToast();
    const store = useStore().generalSettingsStore;
    const { inventoryGroupID, inventoryGroups } = store;

    const [inventoryOptions, setInventoryOptions] = useState<Partial<GeneralInventoryOptions>[]>(
        []
    );
    const [editedItem, setEditedItem] = useState<Partial<GeneralInventoryOptions>>({});
    const [draggedItem, setDraggedItem] = useState<Partial<GeneralInventoryOptions> | null>(null);

    const handleGetInventoryOptionsGroupList = async () => {
        const response = await getInventoryGroupOptions(inventoryGroupID);
        if (response?.error && !Array.isArray(response)) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: response.error,
                life: TOAST_LIFETIME,
            });
        } else {
            const options = response as unknown as UserGroup[];
            setInventoryOptions(options?.filter(Boolean));
        }
    };

    useEffect(() => {
        inventoryGroupID && handleGetInventoryOptionsGroupList();
    }, [inventoryGroupID]);

    const handleSaveOption = async (option: Partial<GeneralInventoryOptions>) => {
        if (!option.name) {
            toast.current?.show({
                severity: "warn",
                summary: "Warning",
                detail: "Option name is required",
                life: TOAST_LIFETIME,
            });
            return;
        }

        if (!option.itemuid) {
            toast.current?.show({
                severity: "warn",
                summary: "Warning",
                detail: "Option UID is required",
                life: TOAST_LIFETIME,
            });
            return;
        }

        try {
            const isNew = option.itemuid === NEW_ITEM;
            const response = await setInventoryGroupOption(inventoryGroupID, option);
            if (response?.error) {
                throw new Error(response.error);
            }

            await handleGetInventoryOptionsGroupList();
            setEditedItem({});

            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: isNew ? "Option created successfully" : "Option updated successfully",
                life: TOAST_LIFETIME,
            });
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: `Failed to ${option.itemuid === NEW_ITEM ? "create" : "update"} option`,
                life: TOAST_LIFETIME,
            });
        }
    };

    const handleDeleteOption = (optionuid: string) => {};

    const handleChangeOrder = async (
        option: Partial<GeneralInventoryOptions>,
        newOrder?: number
    ) => {
        const response = await setInventoryGroupOption(inventoryGroupID, {
            ...option,
            order: newOrder || option.order,
        });
        if (response?.error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to update order",
                life: TOAST_LIFETIME,
            });
        } else {
            await handleGetInventoryOptionsGroupList();
        }
    };

    const handleDragItem = async (layout: Layout[], oldItem: Layout, newItem: Layout) => {
        if (oldItem.i === newItem.i) return;

        const sortedLayout = [...layout].sort((a, b) => {
            if (a.x === b.x) return a.y - b.y;
            return a.x - b.x;
        });

        const updatedOptions = sortedLayout
            .map((layoutItem, index) => {
                const originalItem = inventoryOptions.find((opt) => opt.itemuid === layoutItem.i);
                return {
                    ...originalItem,
                    order: index,
                };
            })
            .filter(Boolean) as Partial<GeneralInventoryOptions>[];

        const updatedOption = updatedOptions.find((opt) => opt.itemuid === newItem.i);
        setDraggedItem(null);

        updatedOption && handleChangeOrder(updatedOption);
    };

    const layouts = useMemo(() => {
        const itemsPerColumn = Math.ceil(inventoryOptions.length / 2);
        return {
            lg: inventoryOptions.map((item, index) => ({
                i: item.itemuid || `${index}`,
                x: index < itemsPerColumn ? 0 : 1,
                y: index % itemsPerColumn,
                w: 1,
                h: 1,
            })),
        };
    }, [inventoryOptions]);

    return (
        <>
            <div className='flex justify-content-end mb-4'>
                <div className='col-3'>
                    <span className='p-float-label'>
                        <Dropdown
                            optionLabel='description'
                            optionValue='itemuid'
                            filter
                            options={inventoryGroups}
                            value={inventoryGroupID}
                            onChange={(e) => {
                                store.inventoryGroupID = e.value;
                            }}
                            placeholder='Group class'
                            className={`w-full vehicle-general__dropdown`}
                        />
                        <label className='float-label'>Options by inventory group</label>
                    </span>
                </div>
                <Button
                    className='ml-auto settings-form__button'
                    outlined
                    onClick={() => {
                        setEditedItem({ name: "", itemuid: NEW_ITEM });
                        setInventoryOptions([...inventoryOptions, { name: "", itemuid: NEW_ITEM }]);
                    }}
                >
                    New Option
                </Button>
            </div>
            <div className='grid general-inventory-option p-2'>
                {!inventoryOptions.length ? (
                    <div className='col-12'>No options available</div>
                ) : (
                    <div className='col-12 grid p-0'>
                        <ResponsiveReactGridLayout
                            className='layout relative'
                            layouts={layouts}
                            cols={{ lg: 2, md: 2, sm: 2, xs: 1, xxs: 1 }}
                            rowHeight={50}
                            width={600}
                            isDraggable={true}
                            isDroppable={true}
                            onDragStart={(_, item) => {
                                const draggedItem = inventoryOptions.find(
                                    (opt) => opt.itemuid === item.i
                                );
                                setDraggedItem(draggedItem || null);
                            }}
                            onDragStop={handleDragItem}
                            draggableCancel='.option-control__button, .inventory-options__edit-button, .inventory-options__delete-button, .row-edit'
                        >
                            {inventoryOptions.map((item, index) => (
                                <div key={item.itemuid || `${index}`} className='cursor-move'>
                                    <InventoryOptionRow
                                        item={item}
                                        index={index}
                                        isFirst={index === 0}
                                        editedItem={editedItem}
                                        draggedItemId={draggedItem?.itemuid}
                                        setEditedItem={setEditedItem}
                                        handleSaveOption={handleSaveOption}
                                        handleSetOrder={handleChangeOrder}
                                        handleDeleteOption={handleDeleteOption}
                                        totalOffset={inventoryOptions.length}
                                    />
                                </div>
                            ))}
                        </ResponsiveReactGridLayout>
                    </div>
                )}
            </div>
        </>
    );
});
