import Component from "../../glhf-ecs/src/Component";

export interface IBodyProps {
    width: number;
    height: number;
}

export default class Body extends Component {
    constructor(public properties: IBodyProps) {
        super(properties);
    }
}