import { create1DMatrix, create2DMatrix, getPixelCoordinatesFromTile, getTileFromGridCoordinates, getGridCoordinatesFromTile } from "./utils";

describe("createMatrix", () => {
  test("createMatrix(1, 1)", () => {
    const m = create2DMatrix({ width: 1, height: 1, tileSize: 16 });
    expect(m).toEqual([[0]]);
  });

  test("createMatrix(1, 2)", () => {
    const m = create2DMatrix({ width: 1, height: 2, tileSize: 16 });
    expect(m).toEqual([[0], [0]]);
  });

  test("createMatrix(3, 3)", () => {
    const m = create2DMatrix({ width: 3, height: 3, tileSize: 16 });
    expect(m).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  test("createMatrix(3, 4)", () => {
    const m = create2DMatrix({ width: 3, height: 4, tileSize: 16 });
    expect(m).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });
});

describe("createFlatMatrix", () => {
  test("createFlatMatrix(1, 1)", () => {
    const m = create1DMatrix({ width: 1, height: 1, tileSize: 16 });
    expect(m).toEqual([0]);
  });

  test("createFlatMatrix(1, 2)", () => {
    const m = create1DMatrix({ width: 1, height: 2, tileSize: 16 });
    expect(m).toEqual([0, 0]);
  });

  test("createFlatMatrix(3, 3)", () => {
    const m = create1DMatrix({ width: 3, height: 3, tileSize: 16 });
    expect(m).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });
});

describe("tile", () => {
  test("getTileRowAndColumn", () => {
    const matrixConfig = { width: 40, height: 30, tileSize: 16 };

    expect(getGridCoordinatesFromTile(0, matrixConfig)).toEqual({ row: 0, column: 0 }); // first tile.
    expect(getGridCoordinatesFromTile(129, matrixConfig)).toEqual({ row: 3, column: 9 });
    expect(getGridCoordinatesFromTile(1199, matrixConfig)).toEqual({ row: 29, column: 39 }); // last tile.
  });

  test("getCoordinatesFromTile", () => {
    const matrixConfig = { width: 40, height: 30, tileSize: 16 };

    expect(getPixelCoordinatesFromTile(0, matrixConfig)).toEqual({ x: 0, y: 0 });
    expect(getPixelCoordinatesFromTile(129, matrixConfig)).toEqual({ x: 144, y: 48 });
    expect(getPixelCoordinatesFromTile(1199, matrixConfig)).toEqual({ x: 624, y: 464 });
  });

  test("getTileFromCoordinates", () => {
    const matrixConfig = { width: 40, height: 30, tileSize: 16 };

    expect(getTileFromGridCoordinates(0, 0, matrixConfig)).toEqual(0);
    expect(getTileFromGridCoordinates(144, 48, matrixConfig)).toEqual(129);
    expect(getTileFromGridCoordinates(624, 464, matrixConfig)).toEqual(1199);
  });
});
