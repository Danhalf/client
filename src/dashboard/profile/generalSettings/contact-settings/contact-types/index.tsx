import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { TextInput } from "dashboard/common/form/inputs";
import { SwitchButton } from "dashboard/common/button";
import { ComboBox } from "dashboard/common/form/dropdown";
import { ContactTypeNameList } from "common/models/contact";

const MAX_TYPE_LENGTH = 109;

export enum ContactTypeCategory {
    INDIVIDUAL = "Individual",
    BUSINESS = "Business",
}

const CATEGORY_OPTIONS = [
    { label: ContactTypeCategory.INDIVIDUAL, value: ContactTypeCategory.INDIVIDUAL },
    { label: ContactTypeCategory.BUSINESS, value: ContactTypeCategory.BUSINESS },
];

export interface ContactSettingsType {
    itemuid: string;
    name: string;
    category: ContactTypeCategory;
    enabled: 0 | 1;
    isDefault?: boolean;
}

const DEFAULT_CONTACT_TYPES: Omit<ContactSettingsType, "itemuid">[] = [
    { name: ContactTypeNameList.BUYERS, category: ContactTypeCategory.INDIVIDUAL, enabled: 1, isDefault: true },
    { name: ContactTypeNameList.DEALERS, category: ContactTypeCategory.BUSINESS, enabled: 1, isDefault: true },
    {
        name: ContactTypeNameList.INSURANCE_COMPANIES,
        category: ContactTypeCategory.BUSINESS,
        enabled: 1,
        isDefault: true,
    },
    {
        name: ContactTypeNameList.INSURANCE_AGENTS,
        category: ContactTypeCategory.BUSINESS,
        enabled: 1,
        isDefault: true,
    },
    { name: ContactTypeNameList.VENDORS, category: ContactTypeCategory.BUSINESS, enabled: 1, isDefault: true },
    { name: ContactTypeNameList.LENDERS, category: ContactTypeCategory.BUSINESS, enabled: 1, isDefault: true },
    { name: ContactTypeNameList.AUCTIONS, category: ContactTypeCategory.BUSINESS, enabled: 1, isDefault: true },
    { name: ContactTypeNameList.CONSIGNORS, category: ContactTypeCategory.BUSINESS, enabled: 1, isDefault: true },
];

const buildDefaultRows = (): ContactSettingsType[] =>
    DEFAULT_CONTACT_TYPES.map((item, index) => ({
        ...item,
        itemuid: `default-${index + 1}`,
    }));

export const SettingsContactTypes = (): ReactElement => {
    const [contactTypes, setContactTypes] = useState<ContactSettingsType[]>(buildDefaultRows);
    const [editedItemId, setEditedItemId] = useState<string | null>(null);
    const [editedName, setEditedName] = useState<string>("");
    const [editedCategory, setEditedCategory] = useState<ContactTypeCategory>(
        ContactTypeCategory.BUSINESS
    );
    const newItemRowRef = useRef<HTMLDivElement>(null);

    const symbolToLimit = useMemo(() => {
        const limit = MAX_TYPE_LENGTH - editedName.length;
        return Math.max(limit, 0).toString();
    }, [editedName]);

    const isNewItemEditing = useMemo(
        () => contactTypes.some((item) => item.itemuid === editedItemId && !item.name),
        [editedItemId, contactTypes]
    );

    useEffect(() => {
        if (!isNewItemEditing) {
            return;
        }

        requestAnimationFrame(() => {
            const row = newItemRowRef.current;
            row?.scrollIntoView({ block: "nearest", inline: "nearest" });
            row?.querySelector("input")?.focus();
        });
    }, [isNewItemEditing]);

    const handleStartEdit = (item: ContactSettingsType) => {
        if (item.isDefault) {
            return;
        }

        if (editedItemId === item.itemuid) {
            setEditedItemId(null);
            setEditedName("");
            return;
        }

        setEditedItemId(item.itemuid);
        setEditedName(item.name);
        setEditedCategory(item.category);
    };

    const handleSave = (itemuid: string) => {
        const trimmedName = editedName.trim();
        if (!trimmedName) {
            return;
        }

        setContactTypes((prev) =>
            prev.map((item) =>
                item.itemuid === itemuid
                    ? { ...item, name: trimmedName, category: editedCategory }
                    : item
            )
        );
        setEditedItemId(null);
        setEditedName("");
    };

    const handleAddType = () => {
        if (editedItemId) {
            return;
        }

        const itemuid = `custom-${Date.now()}`;
        setContactTypes((prev) => [
            ...prev,
            {
                itemuid,
                name: "",
                category: ContactTypeCategory.BUSINESS,
                enabled: 1,
                isDefault: false,
            },
        ]);
        setEditedItemId(itemuid);
        setEditedName("");
        setEditedCategory(ContactTypeCategory.BUSINESS);
    };

    const handleDelete = (item: ContactSettingsType) => {
        if (item.isDefault) {
            return;
        }

        setContactTypes((prev) => prev.filter((type) => type.itemuid !== item.itemuid));
        if (editedItemId === item.itemuid) {
            setEditedItemId(null);
            setEditedName("");
        }
    };

    const handleToggle = (itemuid: string) => {
        setContactTypes((prev) =>
            prev.map((item) =>
                item.itemuid === itemuid ? { ...item, enabled: item.enabled ? 0 : 1 } : item
            )
        );
    };

    return (
        <>
            <div className='flex justify-content-start mb-4'>
                <Button
                    className='settings-form__button settings-contact__new-type'
                    outlined
                    onClick={handleAddType}
                    disabled={!!editedItemId}
                >
                    Add New Type
                </Button>
            </div>
            <div className='settings-contact__table'>
                <div className='settings-contact__header'>
                    <div className='settings-contact__name settings-contact__name--header'>
                        Name
                    </div>
                    <div className='settings-contact__category settings-contact__category--header'>
                        Category
                    </div>
                    <div className='settings-contact__actions' />
                </div>
                <div className='settings-contact__body'>
                    {contactTypes.map((item) => {
                        const isEditing = editedItemId === item.itemuid;
                        const isNewItem = !item.name;
                        const trimmedEditedName = editedName.trim();
                        const isSaveDisabled =
                            !trimmedEditedName ||
                            (!isNewItem &&
                                trimmedEditedName === item.name &&
                                editedCategory === item.category);

                        return (
                            <div
                                className='settings-contact__row'
                                key={item.itemuid}
                                ref={isNewItem ? newItemRowRef : undefined}
                            >
                                <div className='settings-contact__name'>
                                    {isNewItem ? (
                                        <span
                                            className='settings-contact__icon-placeholder'
                                            aria-hidden='true'
                                        />
                                    ) : (
                                        <Button
                                            text
                                            tooltip={
                                                item.isDefault
                                                    ? "Default type cannot be edited"
                                                    : "Edit type"
                                            }
                                            className='settings-contact__icon-button'
                                            icon='adms-edit-item'
                                            disabled={item.isDefault}
                                            onClick={() => handleStartEdit(item)}
                                        />
                                    )}
                                    {isEditing ? (
                                        <div className='settings-contact__row-edit'>
                                            <TextInput
                                                autoFocus={isNewItem}
                                                value={editedName}
                                                maxLength={MAX_TYPE_LENGTH}
                                                infoText={symbolToLimit}
                                                height={40}
                                                className='settings-contact__row-edit-input'
                                                onChange={(e) => setEditedName(e.target.value)}
                                            />
                                            <ComboBox
                                                options={CATEGORY_OPTIONS}
                                                optionLabel='label'
                                                optionValue='value'
                                                value={editedCategory}
                                                onChange={(e) =>
                                                    setEditedCategory(e.value as ContactTypeCategory)
                                                }
                                            />
                                            <Button
                                                className='settings-contact__row-edit-button'
                                                onClick={() => handleSave(item.itemuid)}
                                                disabled={isSaveDisabled}
                                                severity={isSaveDisabled ? "secondary" : "success"}
                                            >
                                                {item.name ? "Update" : "Save"}
                                            </Button>
                                        </div>
                                    ) : (
                                        <span
                                            className={`settings-contact__name-text ${item.enabled ? "" : "settings-contact__name-text--disabled"}`}
                                        >
                                            {item.name}
                                        </span>
                                    )}
                                </div>
                                <div
                                    className={`settings-contact__category ${item.enabled ? "" : "settings-contact__category-text--disabled"}`}
                                >
                                    {!isEditing && (
                                        <span className='settings-contact__category-text'>
                                            {item.category}
                                        </span>
                                    )}
                                </div>
                                <div className='settings-contact__actions'>
                                    {!isNewItem && (
                                        <>
                                            <SwitchButton
                                                small
                                                checked={!!item.enabled}
                                                onChange={() => handleToggle(item.itemuid)}
                                                tooltip={item.enabled ? "Disable" : "Enable"}
                                                tooltipOptions={{ position: "top" }}
                                            />
                                            <Button
                                                text
                                                tooltip='Delete'
                                                className='settings-contact__icon-button settings-contact__delete-button'
                                                icon='adms-trash-can'
                                                disabled={item.isDefault}
                                                onClick={() => handleDelete(item)}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};
