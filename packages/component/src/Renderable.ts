import Component from "../../ecs/src/Component";

export default class Renderable extends Component {
    constructor(public properties: {}) {
        super(properties);
    }
}