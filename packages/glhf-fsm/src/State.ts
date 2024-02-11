export enum StateStatus {
    NOT_STARTED = 0,
    STARTED = 1,
    RUNNING = 2,
    FINISHED = 4
}

export default class State
{
    status: StateStatus = StateStatus.NOT_STARTED;
    tick: number = 0;

    constructor(public id: string, public priority: number, public isDefault:boolean = false) {

    }

    enter(...args: any[]): boolean {
        this.status = StateStatus.STARTED;
        return true;
    }

    exit(): void {
        this.status = StateStatus.FINISHED;
    }

    update(): boolean {
        this.status = StateStatus.RUNNING;
        this.tick++;
        return true;
    }

}