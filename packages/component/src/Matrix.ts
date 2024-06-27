import Component from "../../ecs/src/Component";

export interface IMatrixProps {
    x: number;
    y: number;
    tile: number;
}

export default class Matrix extends Component {
    constructor(public properties: IMatrixProps) {
        super(properties);
    }
}