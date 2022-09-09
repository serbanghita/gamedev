import Entity from "./Entity";
import ComponentRegistry from "./ComponentRegistry";
import {Body as BodyDeclaration, Position as PositionDeclaration} from "./mocks";

interface IBodyProps {
    width: number;
    height: number;
}

test('addComponent', () => {
    const reg = ComponentRegistry.getInstance();
    const Body = reg.registerComponent(BodyDeclaration);
    const Position = reg.registerComponent(PositionDeclaration);

    const entity = new Entity();
    entity.addComponent(Body, {width: 10, height: 20});
    entity.addComponent(Position, {x: 1, y: 2});

    expect(entity.componentsBitmask).toBe(2n);
    expect(entity.getComponent(Body)).toBeInstanceOf(Body);
    expect(entity.getComponent(Position)).toBeInstanceOf(Position);
});