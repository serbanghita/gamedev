import Component from "../../ecs/src/Component";

export interface IStateProps {
    name: string;
}

export default class State extends Component {
    constructor(public properties: IStateProps) {
        super(properties);
    }
}