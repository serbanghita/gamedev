import World from "./World";
import Query from "./Query";

// export type SystemConstructor = new (world: World, properties?: {}) => System;

export type SystemSettings = {
  ticks: number;
  // How many times to run the system before de-registering itself from the loop.
  ticksToRunBeforeExit: number;
};

export default class System {
  public settings: SystemSettings = { ticks: 0, ticksToRunBeforeExit: -1 };

  public constructor(
    public world: World,
    public query: Query,
    ...args: unknown[]
  ) {}

  public runOnlyOnce() {
    this.settings.ticksToRunBeforeExit = 1;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(now: number = 0): void {
    throw new Error(`System update() must be implemented.`);
  }
}
