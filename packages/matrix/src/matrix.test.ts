import {
    createFlatMatrix,
    createMatrix,
    getTileCoordinates, getTileFromCoordinates,
    getTileRowAndColumn,
} from "./matrix";

describe('createMatrix', () => {
    test('createMatrix(1, 1)', () => {
        const m = createMatrix({ width: 1, height: 1, tileSize: 16 });
        expect(m).toEqual([[0]]);
    });

    test('createMatrix(1, 2)', () => {
        const m = createMatrix({ width: 1, height: 2, tileSize: 16 });
        expect(m).toEqual([[0], [0]]);
    });

    test('createMatrix(3, 3)', () => {
        const m = createMatrix({ width: 3, height: 3, tileSize: 16 });
        expect(m).toEqual([[0,0,0], [0,0,0], [0,0,0]]);
    });

    test('createMatrix(3, 4)', () => {
        const m = createMatrix({ width: 3, height: 4, tileSize: 16 });
        expect(m).toEqual([[0,0,0], [0,0,0], [0,0,0], [0,0,0]]);
    });
});

describe('createFlatMatrix', () => {
    test('createFlatMatrix(1, 1)', () => {
        const m = createFlatMatrix({ width: 1, height: 1, tileSize: 16 });
        expect(m).toEqual([0]);
    });

    test('createFlatMatrix(1, 2)', () => {
        const m = createFlatMatrix({ width: 1, height: 2, tileSize: 16 });
        expect(m).toEqual([0, 0]);
    });

    test('createFlatMatrix(3, 3)', () => {
        const m = createFlatMatrix({ width: 3, height: 3, tileSize: 16 });
        expect(m).toEqual([0,0,0,0,0,0,0,0,0]);
    })
});

describe('tile', () => {

    test('getTileRowAndColumn', () => {
        const matrixConfig = { width: 40, height: 30, tileSize: 16 };

        expect(getTileRowAndColumn(0, matrixConfig)).toEqual({row: 0, column: 0}); // first tile.
        expect(getTileRowAndColumn(129, matrixConfig)).toEqual({row: 3, column: 9});
        expect(getTileRowAndColumn(1199, matrixConfig)).toEqual({row: 29, column: 39}); // last tile.
    });

    test('getTileCoordinates', () => {
        const matrixConfig = { width: 40, height: 30, tileSize: 16 };

        expect(getTileCoordinates(0, matrixConfig)).toEqual({x: 0, y: 0});
        expect(getTileCoordinates(129, matrixConfig)).toEqual({x: 144, y: 48});
        expect(getTileCoordinates(1199, matrixConfig)).toEqual({x: 624, y: 464});
    });

    test('getTileFromCoordinates', () => {
        const matrixConfig = { width: 40, height: 30, tileSize: 16 };

        expect(getTileFromCoordinates(0, 0, matrixConfig)).toEqual(0);
        expect(getTileFromCoordinates(144, 48, matrixConfig)).toEqual(129);
        expect(getTileFromCoordinates(624, 464, matrixConfig)).toEqual(1199);
    });

});