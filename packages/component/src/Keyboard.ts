import Component from "../../ecs/src/Component";

export interface IKeyboardKeys {
    up: string;
    down: string;
    left: string;
    right: string;
    action_1: string;
}

export default class Keyboard extends Component {
    constructor(public properties: IKeyboardKeys) {
        super(properties);
    }
}