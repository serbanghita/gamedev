import {createFlatMatrix, createMatrix} from "./matrix";

describe('createMatrix', () => {
    test('createMatrix(1, 1)', () => {
        const m = createMatrix(1, 1);
        expect(m).toEqual([[0]]);
    });

    test('createMatrix(1, 2)', () => {
        const m = createMatrix(1, 2);
        expect(m).toEqual([[0], [0]]);
    });

    test('createMatrix(3, 3)', () => {
        const m = createMatrix(3, 3);
        expect(m).toEqual([[0,0,0], [0,0,0], [0,0,0]]);
    });

    test('createMatrix(3, 4)', () => {
        const m = createMatrix(3, 4);
        expect(m).toEqual([[0,0,0], [0,0,0], [0,0,0], [0,0,0]]);
    });
});

describe('createFlatMatrix', () => {
    test('createFlatMatrix(1, 1)', () => {
        const m = createFlatMatrix(1, 1);
        expect(m).toEqual([0]);
    });

    test('createFlatMatrix(1, 2)', () => {
        const m = createFlatMatrix(1, 2);
        expect(m).toEqual([0, 0]);
    });

    test('createFlatMatrix(3, 3)', () => {
        const m = createFlatMatrix(3, 3);
        expect(m).toEqual([0,0,0,0,0,0,0,0,0]);
    })
});