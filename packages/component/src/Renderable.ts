import Component from "../../ecs/src/Component";

export default class Renderable extends Component {
    constructor(public properties: Record<string, never>) {
        super(properties);
    }
}