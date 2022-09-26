import Component from "../Component";

export interface IPositionProps {
    x: number;
    y: number;
}

export class Position extends Component {
    constructor(public properties: IPositionProps) {
        super(properties);
    }
}