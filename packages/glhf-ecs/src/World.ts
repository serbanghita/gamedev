import Entity from "./Entity";
import System from "./System";
import Query, {IQueryFilters} from "./Query";

export default class World {
    private queries: Map<string, Query> = new Map();
    public entities: Map<string, Entity> = new Map();
    public systems: Map<string, System> = new Map();

    public registerQuery(id: string, filters: IQueryFilters): Query
    {
        const query = new Query(id, filters);

        if (this.queries.has(query.id)) {
            throw new Error(`A query with the id "${query.id}" already exists.`);
        }

        this.queries.set(query.id, query);

        return query;
    }

    public getQuery(id: string): Query
    {
        const query = this.queries.get(id);
        if (!query) {
            throw new Error(`There is not query registered with the id: ${id}.`);
        }
        return query;
    }

    public registerEntity(entity: Entity): Entity {
        if (this.entities.has(entity.id)) {
            throw new Error(`Entity with the id "${entity.id}" already exists.`);
        }

        this.entities.set(entity.id, entity);
        this.notifyQueriesOfCandidacy(entity);

        return entity;
    }

    private notifyQueriesOfCandidacy(entity: Entity) {
        this.queries.forEach((query) => {
            query.candidate(entity);
        });
    }

    private notifyQueriesOfRemoval(entity: Entity) {
        for (const id in this.queries) {
            if (this.queries.has(id)) {
                this.queries.get(id)?.remove(entity);
            }
        }
    }
}