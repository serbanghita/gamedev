import Component from "./Component";
import Entity from "./Entity";

export interface IBodyProps {
    width: number;
    height: number;
}

export class Body extends Component {
    constructor(public properties: IBodyProps) {
        super(properties);
    }
}

export interface IPositionProps {
    x: number;
    y: number;
}

export class Position extends Component {
    constructor(public properties: IPositionProps) {
        super(properties);
    }
}

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

export class Renderable extends Component {
    constructor(public properties: {}) {
        super(properties);
    }
}

export function render(entity: Entity) {
    console.log('render', entity.id);
}

export function loop(now) {
    window.requestAnimationFrame(loop);
}