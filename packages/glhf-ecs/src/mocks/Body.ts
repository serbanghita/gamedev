import Component from "Component";

export interface IBodyProps {
    width: number;
    height: number;
}

export class Body extends Component {
    constructor(public properties: IBodyProps) {
        super(properties);
    }
}