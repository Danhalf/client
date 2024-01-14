import { makeAutoObservable, observable } from "mobx";

export class RootStore {
    public stepperStore: StepperStore;

    public constructor() {
        this.stepperStore = new StepperStore(this);
    }
}

class Step {
    public index: number;
    public isValid: boolean = false;

    public constructor(index: number) {
        this.index = index;
        // this.isValid = false;
    }
}

export class StepperStore {
    public rootStore: RootStore;
    steps: Step[] = [];

    public constructor(rootStore: RootStore) {
        makeAutoObservable(this, { steps: observable });
        this.rootStore = rootStore;
    }

    createStep(index: number): Step | null {
        if (this.steps.some((step) => step.index === index)) {
            return null;
        }
        const step = new Step(index);
        this.steps.push(step);
        return step;
    }

    setStepValid(index: number, valid: boolean) {
        this.steps.map((step) => (step.index === index ? { ...step, valid } : step));
    }
}

export const store = new RootStore();
