import AStarPathFinding, { AStarPathFindingSearchType } from "./AStarPathFinding";

describe('AStarPathFinding', () => {
  test('constructor - invalid coordinates', () => {});
  test('constructor - invalid matrix size', () => {});
  test('constructor - invalid matrix', () => {});

  test('constructor - queue', () => {
    const aStar = new AStarPathFinding({
      matrix: [
        [0,1,0,0,1,1,0,0,0,1,0],
        [0,1,0,0,0,0,0,1,0,0,0],
        [0,1,0,1,0,1,1,1,0,0,0],
        [0,0,0,1,0,1,0,0,0,1,0],
        [0,0,0,1,0,0,0,1,1,1,0]
      ],
      matrixTileSize: 16,
      searchType: AStarPathFindingSearchType.BY_STEP,
      startCoordinates: { x: 0, y: 0 },
      finishCoordinates: { x: 39, y: 19 }
    });

    expect(aStar.queue.size).toEqual(1);
  });

  test('search - BY_STEP', () => {});
  test('search - CONTINUOUS', () => {});
});
