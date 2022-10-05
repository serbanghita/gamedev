import Entity from "./Entity";
import System from "./System";
import Query from "./Query";

export default class World {
    public entities: {[key: string]: Entity} = Object.create(null);
    public systems: {[key: string]: System} = Object.create(null);
    private queries: {[id: string]: Query} = Object.create(null);

    public registerEntity(entity: Entity) {
        if (this.entities[entity.id]) {
            throw new Error(`Entity with entity with the id ${entity.id} already exists.`);
        }

        this.entities[entity.id] = entity;
        this.notifyQueries(entity);
        return entity;
    }

    private notifyQueries(entity: Entity) {
        for (const id in this.queries) {
            this.queries[id].notify(entity);
        }
    }
}