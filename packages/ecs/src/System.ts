import World from "./World";
import Query from "./Query";

// export type SystemConstructor = new (world: World, properties?: {}) => System;

export type SystemSettings = {
  // How many times to run the system before de-registering itself from the loop.
  ticksToRunBeforeExit: number;
  // Run the system "update" function every X ticks.
  runEveryTicks: number;
};

export default class System {
  public settings: SystemSettings = { ticksToRunBeforeExit: -1, runEveryTicks: 0 };
  public ticks: number = 0;

  public constructor(
    public world: World,
    public query: Query,
    ...args: unknown[]
  ) {
    this.ticks = 0;
  }

  public runEveryTicks(ticks: number) {
    this.settings.runEveryTicks = ticks;
  }

  public runOnlyOnce() {
    this.settings.ticksToRunBeforeExit = 1;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(now: number = 0): void {
    throw new Error(`System update() must be implemented.`);
  }
}
