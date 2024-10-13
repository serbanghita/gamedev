import {Component} from "@serbanghita-gamedev/ecs";

interface CurrentStateProps {
    stateName: string;
    defaultStateName: string;
}

export default class CurrentState extends Component {
    constructor(public properties: CurrentStateProps) {
        super(properties);
    }
}