import Component from "../../glhf-ecs/src/Component";

export default class Renderable extends Component {
    constructor(public properties: {}) {
        super(properties);
    }
}