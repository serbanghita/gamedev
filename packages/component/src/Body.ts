import Component from "../../ecs/src/Component";

type BodyProps = {
    width: number;
    height: number;
}

export default class Body extends Component<BodyProps> {
    constructor(public properties: BodyProps) {
        super(properties);
    }

    public get width(): number {
      return this.properties.width;
    }

    public get height(): number {
      return this.properties.height;
    }
}
