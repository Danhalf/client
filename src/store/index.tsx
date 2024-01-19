import {
    Inventory,
    InventoryExtData,
    InventoryOptionsInfo,
    getInventoryInfo,
    initialInventoryState,
} from "http/services/inventory-service";
import { action, configure, makeAutoObservable } from "mobx";

configure({
    enforceActions: "never",
});

export class RootStore {
    public inventoryStore: InventoryStore;
    public constructor() {
        this.inventoryStore = new InventoryStore(this);
    }
}

class InventoryStore {
    public rootStore: RootStore;
    public inventory: Inventory = {} as Inventory;
    public intentoryOptions: InventoryOptionsInfo[] = [];
    public intentoryExtData: InventoryExtData = {} as InventoryExtData;
    public isLoading = false;

    public constructor(rootStore: RootStore) {
        makeAutoObservable(this, { rootStore: false });
        this.rootStore = rootStore;
    }

    getInventory = async (itemuid: string) => {
        this.isLoading = true;
        try {
            const response = await getInventoryInfo(itemuid);
            if (response) {
                const { extdata, options_info, ...inventory } = response;
                this.rootStore.inventoryStore.inventory = inventory || ({} as Inventory);
                this.rootStore.inventoryStore.intentoryOptions = options_info || [];
                this.rootStore.inventoryStore.intentoryExtData =
                    extdata || ({} as InventoryExtData);
                this.rootStore.inventoryStore.isLoading = false;
            }
        } catch (error) {
            this.rootStore.inventoryStore.isLoading = false;
        }
    };

    changeInventory = action(({ key, value }: { key: keyof Inventory; value: string | number }) => {
        if (
            this.rootStore.inventoryStore.inventory &&
            key !== "extdata" &&
            key !== "options_info"
        ) {
            (this.rootStore.inventoryStore.inventory as Record<typeof key, string | number>)[key] =
                value;
        }
    });

    changeInventoryOptions = action((optionName: string) => {
        const inventoryStore = this.rootStore.inventoryStore;
        if (inventoryStore) {
            const { intentoryOptions } = inventoryStore;

            if (intentoryOptions.includes(optionName)) {
                const updatedOptions = intentoryOptions.filter((option) => option !== optionName);
                inventoryStore.intentoryOptions = updatedOptions;
            } else {
                inventoryStore.intentoryOptions.push(optionName);
            }
        }
    });

    clearInventory = () => (this.rootStore.inventoryStore.inventory = initialInventoryState);
}

export const store = new RootStore();
