import Entity from "./Entity";
import System from "./System";
import Query from "./Query";

export default class World {
    private queries: Map<string, Query> = new Map();
    public entities: Map<string, Entity> = new Map();
    public systems: Map<string, System> = new Map();

    public registerQuery(query: Query) {
        if (this.queries.has(query.id)) {
            throw new Error(`A query with the id "${query.id}" already exists.`);
        }

        this.queries.set(query.id, query);
    }

    public registerEntity(entity: Entity) {
        if (this.entities.has(entity.id)) {
            throw new Error(`Entity with the id "${entity.id}" already exists.`);
        }

        this.entities.set(entity.id, entity);
        this.notifyQueriesOfCandidacy(entity);
        return entity;
    }

    private notifyQueriesOfCandidacy(entity: Entity) {
        for (const id in this.queries) {
            if (this.queries.has(id)) {
                this.queries.get(id)?.candidate(entity);
            }
        }
    }

    private notifyQueriesOfRemoval(entity: Entity) {
        for (const id in this.queries) {
            if (this.queries.has(id)) {
                this.queries.get(id)?.remove(entity);
            }
        }
    }
}