import { Component } from "@serbanghita-gamedev/ecs";

export enum Directions {
    NONE, LEFT, RIGHT, UP, DOWN
}

export type DirectionInitProps = {
    x: Directions.LEFT | Directions.RIGHT | Directions.NONE
    y: Directions.UP | Directions.DOWN | Directions.NONE,
    literal: 'up' | 'down' | 'left' | 'right' | ''
}

export default class Direction extends Component {
  public x!: Directions;
  public y!: Directions;
  public literal: DirectionInitProps['literal'] = 'down';

    constructor(public properties: DirectionInitProps) {
        super(properties);

        this.init(properties);
    }

    public init(properties: DirectionInitProps) {
      this.x = properties.x;
      this.y = properties.y;
      this.literal = properties.literal;
    }

    public setX(x: Directions.LEFT | Directions.RIGHT | Directions.NONE) {
      this.x = x;
      if (x === Directions.LEFT) {
        this.literal = 'left';
      } else if (x === Directions.RIGHT) {
        this.literal = 'right';
      } else {
        this.literal = '';
      }
    }

    public setY(y: Directions.UP | Directions.DOWN | Directions.NONE) {
      this.y = y;
      if (y === Directions.UP) {
        this.literal = 'up';
      } else {
        this.literal = 'down';
      }
    }
}
