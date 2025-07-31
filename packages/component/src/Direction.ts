import { Component } from "@serbanghita-gamedev/ecs";

export enum Directions {
    NONE, LEFT, RIGHT, UP, DOWN
}

export type DirectionProps = {
    x: Directions.LEFT | Directions.RIGHT | Directions.NONE
    y: Directions.UP | Directions.DOWN | Directions.NONE,
    literal: 'up' | 'down' | 'left' | 'right' | ''
}

export default class Direction extends Component<DirectionProps> {
    constructor(public properties: DirectionProps) {
        super(properties);

        if (!properties.literal) {
          properties.literal = 'down';
        }
    }

    public get x(): number {
      return this.properties.x;
    }

    public get y(): number {
      return this.properties.y;
    }

    public get literal(): DirectionProps['literal'] {
      return this.properties.literal;
    }

    public setX(x: Directions.LEFT | Directions.RIGHT | Directions.NONE) {
      this.properties.x = x;
      if (x === Directions.LEFT) {
        this.properties.literal = 'left';
      } else if (x === Directions.RIGHT) {
        this.properties.literal = 'right';
      } else {
        this.properties.literal = '';
      }
    }

    public setY(y: Directions.UP | Directions.DOWN | Directions.NONE) {
      this.properties.y = y;
      if (y === Directions.UP) {
        this.properties.literal = 'up';
      } else {
        this.properties.literal = 'down';
      }
    }
}
