import { Component } from "@serbanghita-gamedev/ecs";

export default class Renderable extends Component<object> {
    constructor(public properties: Record<string, never>) {
        super(properties);
    }
}
