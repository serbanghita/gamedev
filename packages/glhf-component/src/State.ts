import Component from "../../glhf-ecs/src/Component";

export interface IStateProps {
    updateStateName: string;
    updateStateTick: number;
    animationFrameName: string;
    animationFrameTick: number;
}

export default class State extends Component {
    constructor(public properties: IStateProps) {
        super(properties);
    }
}