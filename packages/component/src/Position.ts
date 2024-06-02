import Component from "../../ecs/src/Component";

export interface IPositionProps {
    x: number;
    y: number;
}

export default class Position extends Component {
    constructor(public properties: IPositionProps) {
        super(properties);
    }
}