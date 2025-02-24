import Component from "../../ecs/src/Component";

export interface KeyboardInitProps {
    up: string;
    down: string;
    left: string;
    right: string;
    action_1: string;
}

export default class Keyboard extends Component {
  public keys: KeyboardInitProps = {
    up: '',
    down: '',
    left: '',
    right: '',
    action_1: ''
  };

  constructor(public properties: KeyboardInitProps) {
    super(properties);

    this.init(properties);
  }

  public init(properties: KeyboardInitProps) {
    this.keys.up = properties.up;
    this.keys.down = properties.down;
    this.keys.left = properties.left;
    this.keys.right = properties.right;
    this.keys.action_1 = properties.action_1;
  }
}
