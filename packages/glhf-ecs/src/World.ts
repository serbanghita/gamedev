import Entity from "./Entity";
import System from "./System";
import Query from "./Query";

export default class World {
    private queries: {[id: string]: Query} = Object.create(null);
    public entities: {[key: string]: Entity} = Object.create(null);
    public systems: {[key: string]: System} = Object.create(null);

    public registerQuery(query: Query) {
        if (this.queries[query.id]) {
            throw new Error(`A query with the id "${query.id}" already exists.`);
        }

        this.queries[query.id] = query;
    }

    public registerEntity(entity: Entity) {
        if (this.entities[entity.id]) {
            throw new Error(`Entity with the id "${entity.id}" already exists.`);
        }

        this.entities[entity.id] = entity;
        this.notifyQueriesOfCandidacy(entity);
        return entity;
    }

    private notifyQueriesOfCandidacy(entity: Entity) {
        for (const id in this.queries) {
            this.queries[id].candidate(entity);
        }
    }

    private notifyQueriesOfRemoval(entity: Entity) {
        for (const id in this.queries) {
            this.queries[id].remove(entity);
        }
    }
}