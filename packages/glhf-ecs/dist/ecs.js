"use strict";
(() => {
  // src/Component.ts
  var Component = class {
    constructor(properties) {
      this.properties = properties;
    }
    // Lazy init / Re-init.
    init(properties) {
      this.properties = properties;
    }
  };
  var Component_default = Component;

  // src/ComponentRegistry.ts
  var ComponentRegistry = class _ComponentRegistry {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
      this.bitmask = 1n;
    }
    static getInstance() {
      if (!_ComponentRegistry.instance) {
        _ComponentRegistry.instance = new _ComponentRegistry();
      }
      return _ComponentRegistry.instance;
    }
    registerComponent(ComponentDeclaration) {
      ComponentDeclaration.prototype.bitmask = this.bitmask <<= 1n;
      return ComponentDeclaration;
    }
    getLastBitmask() {
      return this.bitmask;
    }
  };

  // ../glhf-bitmask/src/bitmask.ts
  function addBit(bitmasks, bit) {
    bitmasks |= bit;
    return bitmasks;
  }
  function removeBit(bitmasks, bit) {
    bitmasks &= ~bit;
    return bitmasks;
  }
  function hasBit(bitmasks, bit) {
    return (bitmasks & bit) === bit;
  }
  function hasAnyOfBits(bitmask, bits) {
    return (bitmask & bits) !== 0n;
  }

  // src/Entity.ts
  var Entity = class {
    constructor(world, id) {
      this.world = world;
      this.id = id;
      // Bitmask for storing Entity's components.
      this.componentsBitmask = 0n;
      // Cache of Component instances.
      this.components = /* @__PURE__ */ new Map();
    }
    addComponent(declaration, properties = {}) {
      let instance = this.components.get(declaration.name);
      if (instance) {
        instance.init(properties);
      } else {
        instance = new declaration(properties);
      }
      this.components.set(instance.constructor.name, instance);
      if (typeof instance.bitmask === "undefined") {
        throw new Error(`Please register the component ${instance.constructor.name} in the ComponentRegistry.`);
      }
      this.componentsBitmask = addBit(this.componentsBitmask, instance.bitmask);
      this.onAddComponent(instance);
      return this;
    }
    getComponent(declaration) {
      const instance = this.components.get(declaration.name);
      if (!instance) {
        throw new Error(`Component requested ${declaration.name} is non-existent.`);
      }
      return instance;
    }
    getComponentByName(name) {
      const instance = this.components.get(name);
      if (!instance) {
        throw new Error(`Component requested ${name} is non-existent.`);
      }
      return instance;
    }
    removeComponent(declaration) {
      const component = this.getComponent(declaration);
      this.componentsBitmask = removeBit(this.componentsBitmask, component.bitmask);
      this.onRemoveComponent(component);
      return this;
    }
    hasComponent(declaration) {
      return hasBit(this.componentsBitmask, declaration.prototype.bitmask);
    }
    onAddComponent(newComponent) {
      this.world.notifyQueriesOfEntityComponentAddition(this, newComponent);
      return this;
    }
    onRemoveComponent(oldComponent) {
      this.world.notifyQueriesOfEntityComponentRemoval(this, oldComponent);
    }
  };

  // src/Query.ts
  var Query = class {
    /**
     * Create a "query" of Entities that contain certain Components set.
     *
     * @param world
     * @param id
     * @param filters
     */
    constructor(world, id, filters) {
      this.world = world;
      this.id = id;
      this.filters = filters;
      this.all = 0n;
      this.any = 0n;
      this.none = 0n;
      this.hasExecuted = false;
      this.dataSet = [];
      this.processFiltersAsBitMasks();
    }
    processFiltersAsBitMasks() {
      if (this.filters.all) {
        this.filters.all.forEach((component) => {
          this.all = addBit(this.all, component.prototype.bitmask);
        });
      }
      if (this.filters.any) {
        this.filters.any.forEach((component) => {
          this.any = addBit(this.any, component.prototype.bitmask);
        });
      }
      if (this.filters.none) {
        this.filters.none.forEach((component) => {
          this.none = addBit(this.none, component.prototype.bitmask);
        });
      }
    }
    init() {
      this.world.entities.forEach((entity) => {
        this.candidate(entity);
      });
    }
    /**
     * Set only the entities that correspond to the filters given.
     */
    execute() {
      if (!this.hasExecuted) {
        this.dataSet = this.dataSet.filter((entity) => this.match(entity));
        this.hasExecuted = true;
      }
      return this.dataSet;
    }
    match(entity) {
      if (this.none !== 0n && hasAnyOfBits(entity.componentsBitmask, this.none)) {
        return false;
      }
      if (this.any !== 0n && hasAnyOfBits(entity.componentsBitmask, this.any)) {
        return true;
      }
      if (this.all !== 0n && !hasBit(entity.componentsBitmask, this.all)) {
        return false;
      }
      return true;
    }
    candidate(entity) {
      if (this.match(entity)) {
        this.dataSet.push(entity);
        return true;
      }
      return false;
    }
    add(entity) {
      this.dataSet.push(entity);
    }
    remove(entity) {
      const index = this.dataSet.indexOf(entity);
      if (index !== -1) {
        this.dataSet.splice(index, 1);
      }
    }
  };

  // src/System.ts
  var System = class {
    constructor(world, query, ...args) {
      this.world = world;
      this.query = query;
    }
    update(now) {
      throw new Error(`System update() must be implemented.`);
    }
  };

  // src/World.ts
  var World = class {
    constructor() {
      this.systemRegistry = /* @__PURE__ */ new Map();
      this.componentRegistry = ComponentRegistry.getInstance();
      this.queries = /* @__PURE__ */ new Map();
      this.entities = /* @__PURE__ */ new Map();
      this.systems = /* @__PURE__ */ new Map();
    }
    createQuery(id, filters) {
      const query = new Query(this, id, filters);
      if (this.queries.has(query.id)) {
        throw new Error(`A query with the id "${query.id}" already exists.`);
      }
      this.queries.set(query.id, query);
      query.init();
      return query;
    }
    removeQuery(id) {
      this.queries.delete(id);
    }
    getQuery(id) {
      const query = this.queries.get(id);
      if (!query) {
        throw new Error(`There is not query registered with the id: ${id}.`);
      }
      return query;
    }
    createEntity(id) {
      if (this.entities.has(id)) {
        throw new Error(`Entity with the id "${id}" already exists.`);
      }
      const entity = new Entity(this, id);
      this.entities.set(entity.id, entity);
      this.notifyQueriesOfEntityCandidacy(entity);
      return entity;
    }
    getEntity(id) {
      return this.entities.get(id);
    }
    removeEntity(id) {
      const entity = this.entities.get(id);
      if (!entity) {
        return;
      }
      this.notifyQueriesOfEntityRemoval(entity);
    }
    registerSystem(id, declaration) {
      this.systemRegistry.set(id, declaration);
      return this;
    }
    createSystem(systemId, queryId, ...args) {
      const declaration = this.systemRegistry.get(systemId);
      if (!declaration) {
        throw new Error(`There is no system registered with the id ${systemId}`);
      }
      const queryInstance = this.queries.get(queryId);
      if (!queryInstance) {
        throw new Error(`There is no query registered with the id ${queryId}`);
      }
      this.systems.set(systemId, new declaration(this, queryInstance, ...args));
      return this;
    }
    getSystem(id) {
      const system = this.systems.get(id);
      if (!system) {
        throw new Error(`There is no system instance with the id ${id}`);
      }
      return system;
    }
    registerComponent(declaration) {
      this.componentRegistry.registerComponent(declaration);
      return this;
    }
    notifyQueriesOfEntityCandidacy(entity) {
      this.queries.forEach((query) => {
        query.candidate(entity);
      });
    }
    notifyQueriesOfEntityRemoval(entity) {
      for (const id in this.queries) {
        if (this.queries.has(id)) {
          this.queries.get(id)?.remove(entity);
        }
      }
    }
    /**
     * 1. Finds all Queries that have the Component in their filter.
     * 2. Add candidacy of the Entity to the list of Entities inside the Query.
     *
     * @param entity
     * @param component
     */
    notifyQueriesOfEntityComponentAddition(entity, component) {
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
    notifyQueriesOfEntityComponentRemoval(entity, component) {
      this.queries.forEach((query) => {
        if (hasBit(query.all, component.bitmask)) {
          query.remove(entity);
        }
      });
    }
  };
})();
