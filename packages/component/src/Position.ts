import Component from "../../ecs/src/Component";

export type PositionProps = {
  x: number;
  y: number;
};

export default class Position extends Component {
  constructor(public properties: PositionProps) {
    super(properties);
  }
}
