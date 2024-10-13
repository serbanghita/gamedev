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

  // If the update() logic should run or not.
  // This is typically used along with settings.runEveryTicks.
  public isPaused: boolean = false;

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

  public preUpdate() {
    this.ticks++;

    if (this.settings.runEveryTicks > 0) {
      if (this.ticks < this.settings.runEveryTicks) {
        this.isPaused = true;
      } else {
        this.ticks = 0;
        this.isPaused = false;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(now: number = 0): void {
    throw new Error(`System update() must be implemented.`);
  }
}
