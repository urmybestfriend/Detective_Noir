import { EventDispatcher } from "../utils/EventDispatcher";
import { State } from "./State";

export class StateMachine {
    private currentState: State;
    private emitter: EventDispatcher;

    constructor() { }

    Initialize(initialState) {
        this.emitter = EventDispatcher.getInstance();
        this.currentState = initialState;
        this.currentState.Enter();
    }

    Update() {
        if (this.currentState)
            this.currentState.Update();
    }

    changeState(to: State, transitionObject: any = { callback: () => {} }) {
        const tmpCb: Function = transitionObject.callback;
        transitionObject.callback = () => {
                tmpCb?.();
                this.processState(to);
            }
        this.emitter.emit("onTransition", transitionObject);
    }

    processState(state: State) {
        this.currentState.Exit();
        this.currentState = state;
        this.currentState.Enter();
    }

    GetCurrentState<T>(): T {
        return this.currentState as any;
    }
}