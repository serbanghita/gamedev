import Entity from "./Entity";
import System from "./System";
import Query, { IQueryFilters } from "./Query";
import Component from "./Component";
import { hasBit } from "@serbanghita-gamedev/bitmask";
import ComponentRegistry from "./ComponentRegistry";
import { EntityDeclaration } from "@serbanghita-gamedev/assets";

export type WorldStartOptions = {
  // Limit the FPS.
  fpsCap?: number;
  // Function to run at the end of each frame.
  callbackFnAfterSystemsUpdate?: () => void;
}

export default class World {
  public declarations = {
    components: ComponentRegistry.getInstance(),
  };

  public queries = new Map<string, Query>();
  public entities = new Map<string, Entity>();
  public systems = new Map<typeof System, System>();
  public fps: number = 0;
  public frameDuration: number = 0;
  public frameNo: number = 0;
  public fpsCap: number = 0;
  public fpsCapDuration: number = 0;
  public callbackFnAfterSystemsUpdate: (() => void) | undefined = undefined;
  public now: DOMHighResTimeStamp = 0;

  public registerComponent(declaration: typeof Component) {
    this.declarations.components.registerComponent(declaration);
  }

  public registerComponents(declarations: (typeof Component)[]) {
    this.declarations.components.registerComponents(declarations);
  }

  public createQuery(id: string, filters: IQueryFilters): Query {
    const query = new Query(this, id, filters);

    if (this.queries.has(query.id)) {
      throw new Error(`A query with the id "${query.id}" already exists.`);
    }

    this.queries.set(query.id, query);

    query.init();

    return query;
  }

  public removeQuery(id: string) {
    this.queries.delete(id);
  }

  public getQuery(id: string): Query {
    const query = this.queries.get(id);
    if (!query) {
      throw new Error(`There is not query registered with the id: ${id}.`);
    }
    return query;
  }

  public createEntityFromDeclaration(entityDeclaration: EntityDeclaration): Entity {
    // Create the entity and assign it to the world.
    const entity = this.createEntity(entityDeclaration.id);

    // Add Component(s) to the Entity.
    for (const name in entityDeclaration.components) {
      const componentDeclaration = this.declarations.components.getComponent(name);
      const props = entityDeclaration.components[name];

      entity.addComponent(componentDeclaration, props);
    }

    return entity;
  }

  public createEntity(id: string): Entity {
    if (this.entities.has(id)) {
      throw new Error(`Entity with the id "${id}" already exists.`);
    }

    const entity = new Entity(this, id);

    this.entities.set(entity.id, entity);
    this.notifyQueriesOfEntityCandidacy(entity);

    return entity;
  }

  public getEntity(id: string) {
    return this.entities.get(id);
  }

  public removeEntity(id: string) {
    const entity = this.entities.get(id);

    if (!entity) {
      return;
    }

    this.notifyQueriesOfEntityRemoval(entity);
    this.entities.delete(id);
  }

  public createSystem(systemDeclaration: typeof System, query: Query, ...args: unknown[]): System {
    const systemInstance = new systemDeclaration(this, query, ...args);
    this.systems.set(systemDeclaration, systemInstance);

    return systemInstance;
  }

  public getSystem(system: typeof System) {
    const systemInstance = this.systems.get(System);

    if (!systemInstance) {
      throw new Error(`There is no system instance with the id ${system.name}`);
    }

    return systemInstance;
  }

  public removeSystem(system: typeof System) {
    this.systems.delete(system);
  }

  public notifyQueriesOfEntityCandidacy(entity: Entity) {
    this.queries.forEach((query) => {
      query.candidate(entity);
    });
  }

  public notifyQueriesOfEntityRemoval(entity: Entity) {
    this.queries.forEach((query) => {
      query.remove(entity);
    });
  }

  /**
   * 1. Finds all Queries that have the Component in their filter.
   * 2. Add candidacy of the Entity to the list of Entities inside the Query.
   *
   * @param entity
   * @param component
   */
  public notifyQueriesOfEntityComponentAddition(entity: Entity, component: Component) {
    this.queries.forEach((query) => {
      if (hasBit(query.all, component.bitmask)) {
        query.add(entity);
      }
    });
  }

  /**
   * 1. Finds all Queries that have the Component in their filter.
   * 2. Remove the Entity from the list of Entities inside the Query.
   *
   * @param entity
   * @param component
   */
  public notifyQueriesOfEntityComponentRemoval(entity: Entity, component: Component) {
    this.queries.forEach((query) => {
      if (hasBit(query.all, component.bitmask)) {
        query.remove(entity);
      }
    });
  }

  public start(options?: WorldStartOptions) {
    if (options) {
      this.fpsCap = options.fpsCap || 0;
    }

    // Run all systems that need to be run once and de-register them from the loop.
    [...this.systems]
      .filter(([, systemInstance]) => systemInstance.settings.ticksToRunBeforeExit === 1)
      .forEach(([systemDeclaration, systemInstance]) => {
        systemInstance.update();
        this.systems.delete(systemDeclaration);
      });

    this.startLoop();
  }

  private startLoop() {

    let frameTimeDiff = 0;
    let lastFrameTime = 0;

    let fps = 0;
    let frames = 0;
    let lastFpsTime = 0;

    let fpsCap = this.fpsCap;
    let fpsCapDurationTime = this.fpsCapDuration = 1000 / fpsCap;
    let fpsCapLastFrameTime = 0;
    let logicFrames = 0;

    const loop = (now: DOMHighResTimeStamp) => {
      this.now = now;
      frames++;

      // Last frame time.
      if (lastFrameTime === 0) { lastFrameTime = now; }
      frameTimeDiff = now - lastFrameTime;
      lastFrameTime = now;

      if (fpsCapLastFrameTime === 0) { fpsCapLastFrameTime = now; }
      if (fpsCap > 0 && fps > fpsCap) {
        logicFrames++;
        if ((now - fpsCapLastFrameTime) >= fpsCapDurationTime) {
          fpsCapLastFrameTime = now;
          // frames++
          if (fps > 0) {
            this.systems.forEach((system) => system.update(now));
          }
          logicFrames = 0;
        }
      } else {
        // frames++
        if (fps > 0) {
          this.systems.forEach((system) => system.update(now));
        }
      }

      // Fps
      if (lastFpsTime === 0) { lastFpsTime = now; }
      if (now - lastFpsTime >= 1000) {
        fps = frames;
        frames = 0;
        lastFpsTime = now;
      }

      // Public properties.
      this.fps = fps;
      this.frameDuration = frameTimeDiff;

      if (this.callbackFnAfterSystemsUpdate) {
        this.callbackFnAfterSystemsUpdate();
      }

      this.frameNo = frames;

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }
}
