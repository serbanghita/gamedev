import Component from "../Component";

export interface IKeyboard {
    up: string;
    down: string;
    left: string;
    right: string;
}

export class Keyboard extends Component {
    constructor(public properties: IKeyboard) {
        super(properties);
    }
}