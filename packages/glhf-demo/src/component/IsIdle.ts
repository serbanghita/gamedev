import Component from "../../../glhf-ecs/src/Component";

interface IsIdleState {
    state: string;
    animationState: string;
    stateTick: number;
    animationTick: number;
}

export default class IsIdle extends Component {
    constructor(public properties: IsIdleState) {
        super(properties);
    }
}