import { Inventory } from "http/services/inventory-service";
import { makeAutoObservable } from "mobx";

export class RootStore {
    public inventoryStore: InventoryStore;
    public constructor() {
        this.inventoryStore = new InventoryStore(this);
    }
}

class InventoryStore {
    public rootStore: RootStore;
    inventory: Inventory | null = null;

    public constructor(rootStore: RootStore) {
        makeAutoObservable(this, { rootStore: false });
        this.rootStore = rootStore;
    }
}

export const store = new RootStore();
