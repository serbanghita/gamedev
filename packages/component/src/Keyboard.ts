import Component from "../../ecs/src/Component";

export interface KeyboardProps {
    up: string;
    down: string;
    left: string;
    right: string;
    action_1: string;
}

export default class Keyboard extends Component<KeyboardProps> {

  constructor(public properties: KeyboardProps) {
    super(properties);
  }

}
