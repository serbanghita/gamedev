import Component from "../../glhf-ecs/src/Component";

export interface IStateProps {
    state: string;
    stateTick: number;
    animationState: string;
    animationTick: number;
}

export default class State extends Component {
    constructor(public properties: IStateProps) {
        super(properties);
    }
}