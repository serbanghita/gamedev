import { EntityDeclaration } from "@serbanghita-gamedev/assets";
import { Entity, World } from "@serbanghita-gamedev/ecs";

type PropertiesOptions = {
    [key: string]: string | number | unknown;
}

export function extend<T extends PropertiesOptions , U extends Partial<PropertiesOptions>>(props: T, newProps: U) {
    if (!newProps) {
        return props;
    }

    return { ...props, ...newProps};
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function roundWithTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function deepClonePlainObject<T extends Record<string, any>>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function createEntityFromDeclaration(world: World, id: string, entityDeclaration: EntityDeclaration): Entity {
  // Create the entity and assign it to the world.
  const entity = world.createEntity(id);

  // Add Component(s) to the Entity.
  for (const name in entityDeclaration.components) {
    const componentDeclaration = world.declarations.components.getComponent(name);
    const props = entityDeclaration.components[name];

    entity.addComponent(componentDeclaration, props);
  }

  return entity;
}