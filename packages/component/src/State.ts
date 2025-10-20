import { Component } from "@serbanghita-gamedev/ecs";

export type StateProps = {
    name: string;
}

export default class State extends Component<StateProps> {
    constructor(public properties: StateProps) {
        super(properties);
    }
}
