import Component from "../../ecs/src/Component";

export interface IMatrixConfigProps {
    width: number;
    height: number;
    tileSize: number;
}

export default class MatrixConfig extends Component {
    constructor(public properties: IMatrixConfigProps) {
        super(properties);
    }
}