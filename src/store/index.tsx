import { makeAutoObservable } from "mobx";

export class RootStore {
    public stepperStore: StepperStore;

    public constructor() {
        this.stepperStore = new StepperStore(this);
    }
}

export class StepperStore {
    public rootStore: RootStore;
    activeStep = 0;
    isStepValid = false;

    public constructor(rootStore: RootStore) {
        makeAutoObservable(this, { rootStore: false });
        this.rootStore = rootStore;
    }

    setActiveStep(step: number) {
        this.activeStep = step;
    }

    setStepValid() {
        this.isStepValid = true;
    }

    setStepInvalid() {
        this.isStepValid = false;
    }
}

export const store = new RootStore();
