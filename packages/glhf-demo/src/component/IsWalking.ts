import Component from "../../../glhf-ecs/src/Component";

interface IsWalkingState {
    state: string;
    animationState: string;
    stateTick: number;
    animationTick: number;
}

export default class IsWalking extends Component {
    constructor(public properties: IsWalkingState) {
        super(properties);
    }
}