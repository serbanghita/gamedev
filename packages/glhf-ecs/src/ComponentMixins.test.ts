// https://www.typescriptlang.org/docs/handbook/mixins.html#how-does-a-mixin-work
describe("Component mixins", () => {
    type Constructor = new (...args: any[]) => {};
    type ConstructorWithParams<T = {}> = new (...args: any[]) => T;

    class Position {
        constructor(
            public name: string = "",
            public properties: { x: number, y: number } = { x: 0, y: 0}
        ) { }
    }

    class Body {
        constructor(
            public name: string = "",
            public properties: { width: number, height: number } = { width: 0, height: 0 }
        ) {}
    }

    class Renderable {
        constructor(
            public name: string = "",
            public properties: {} = {}
        ) {
        }
    }

    // Simulates a component Registry.
    let BITMASK = 0b0;
    function newBitmask() {
        return BITMASK = (BITMASK << 0b1) | 0b1
    }

    function registerComponent<TBase extends ConstructorWithParams>(Base: TBase) {
        const bits = newBitmask();
        return class NewComponent extends Base {
            public bits = bits;
        }
    }

    test("bits", () => {
        // In theory, I can obtain "Position" instead of "PositionC"
        // if I use `import {Position as PositionDeclaration} from "./Position"`
        const PositionC = registerComponent(Position);
        const BodyC = registerComponent(Body);
        const RenderableC = registerComponent(Renderable);

        const entity1Position = new PositionC("Position", {x: 1, y: 2});
        const entity1Body = new BodyC("Body", { width: 100, height: 200 });
        const entity1Renderable = new RenderableC("Renderable");

        const entity2Position = new PositionC("Position", {x: 11, y: 22});
        const entity2Body = new BodyC("Body", { width: 111, height: 222 });
        const entity2Renderable = new RenderableC("Renderable");

        expect(entity1Position.bits).toEqual(0b1);
        expect(entity1Body.bits).toEqual(0b11);
        expect(entity1Renderable.bits).toEqual(0b111);

        expect(entity1Position).toBeInstanceOf(Position);
        expect(entity1Body).toBeInstanceOf(Body);
        expect(entity1Renderable).toBeInstanceOf(Renderable);

        expect(entity2Position.bits).toEqual(0b1);
        expect(entity2Body.bits).toEqual(0b11);
        expect(entity2Renderable.bits).toEqual(0b111);

        expect(entity2Position).toBeInstanceOf(Position);
        expect(entity2Body).toBeInstanceOf(Body);
        expect(entity2Renderable).toBeInstanceOf(Renderable);

        expect(BITMASK).toEqual(0b111);
    });
});