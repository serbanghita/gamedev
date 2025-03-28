import AStarPathFinding, { AStarPathFindingSearchType } from "./AStarPathFinding";

describe('AStarPathFinding', () => {
  describe('constructor', () => {
    test('constructor - out of bounds startCoordinates x', () => {
      expect(() => {
        new AStarPathFinding({
          matrix: [
            [0,1,0,0,0],
            [0,1,0,1,0],
            [0,0,0,1,0],
          ],
          matrixTileSize: 16,
          searchType: AStarPathFindingSearchType.BY_STEP,
          startCoordinates: { x: 5, y: 0 },
          finishCoordinates: { x: 0, y: 0 }
        });
      }).toThrow(`Out of bounds coordinates: start (5, 0) finish (0, 0)`);
    });
    test('constructor - out of bounds negative startCoordinates x', () => {
      expect(() => {
        new AStarPathFinding({
          matrix: [
            [0,1,0,0,0],
            [0,1,0,1,0],
            [0,0,0,1,0],
          ],
          matrixTileSize: 16,
          searchType: AStarPathFindingSearchType.BY_STEP,
          startCoordinates: { x: -1, y: 0 },
          finishCoordinates: { x: 0, y: 0 }
        });
      }).toThrow(`Out of bounds coordinates: start (-1, 0) finish (0, 0)`);
    });
    test('constructor - out of bounds startCoordinates y', () => {
      expect(() => {
        new AStarPathFinding({
          matrix: [
            [0,1,0,0,0],
            [0,1,0,1,0],
            [0,0,0,1,0],
          ],
          matrixTileSize: 16,
          searchType: AStarPathFindingSearchType.BY_STEP,
          startCoordinates: { x: 0, y: 5 },
          finishCoordinates: { x: 0, y: 0 }
        });
      }).toThrow(`Out of bounds coordinates: start (0, 5) finish (0, 0)`);
    });
    test('constructor - out of bounds negative startCoordinates y', () => {
      expect(() => {
        new AStarPathFinding({
          matrix: [
            [0,1,0,0,0],
            [0,1,0,1,0],
            [0,0,0,1,0],
          ],
          matrixTileSize: 16,
          searchType: AStarPathFindingSearchType.BY_STEP,
          startCoordinates: { x: 0, y: -1 },
          finishCoordinates: { x: 0, y: 0 }
        });
      }).toThrow(`Out of bounds coordinates: start (0, -1) finish (0, 0)`);
    });
    test('constructor - out of bounds finishCoordinates x', () => {
      expect(() => {
        new AStarPathFinding({
          matrix: [
            [0,1,0,0,0],
            [0,1,0,1,0],
            [0,0,0,1,0],
          ],
          matrixTileSize: 16,
          searchType: AStarPathFindingSearchType.BY_STEP,
          startCoordinates: { x: 0, y: 0 },
          finishCoordinates: { x: 5, y: 0 }
        });
      }).toThrow(`Out of bounds coordinates: start (0, 0) finish (5, 0)`);
    });
    test('constructor - out of bounds negative finishCoordinates x', () => {
      expect(() => {
        new AStarPathFinding({
          matrix: [
            [0,1,0,0,0],
            [0,1,0,1,0],
            [0,0,0,1,0],
          ],
          matrixTileSize: 16,
          searchType: AStarPathFindingSearchType.BY_STEP,
          startCoordinates: { x: 0, y: 0 },
          finishCoordinates: { x: -1, y: 0 }
        });
      }).toThrow(`Out of bounds coordinates: start (0, 0) finish (-1, 0)`);
    });
    test('constructor - out of bounds finishCoordinates y', () => {
      expect(() => {
        new AStarPathFinding({
          matrix: [
            [0,1,0,0,0],
            [0,1,0,1,0],
            [0,0,0,1,0],
          ],
          matrixTileSize: 16,
          searchType: AStarPathFindingSearchType.BY_STEP,
          startCoordinates: { x: 0, y: 0 },
          finishCoordinates: { x: 0, y: 5 }
        });
      }).toThrow(`Out of bounds coordinates: start (0, 0) finish (0, 5)`);
    });
    test('constructor - out of bounds negative finishCoordinates y', () => {
      expect(() => {
        new AStarPathFinding({
          matrix: [
            [0,1,0,0,0],
            [0,1,0,1,0],
            [0,0,0,1,0],
          ],
          matrixTileSize: 16,
          searchType: AStarPathFindingSearchType.BY_STEP,
          startCoordinates: { x: 0, y: 0 },
          finishCoordinates: { x: 0, y: -1 }
        });
      }).toThrow(`Out of bounds coordinates: start (0, 0) finish (0, -1)`);
    });
    test('constructor - start and finish tile are calculated', () => {
      const aStar = new AStarPathFinding({
        matrix: [
          [0,1,0,0,0],
          [0,1,0,1,0],
          [0,0,0,1,0],
        ],
        matrixTileSize: 1,
        searchType: AStarPathFindingSearchType.BY_STEP,
        startCoordinates: { x: 0, y: 1 },
        finishCoordinates: { x: 4, y: 2 }
      });

      expect(aStar.startTileValue).toEqual(5);
      expect(aStar.finishTileValue).toEqual(14);
    });
  });

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
      finishCoordinates: { x: 10, y: 4 }
    });

    expect(aStar.queue.size).toEqual(1);
  });

  describe('search - BY_STEP', () => {
    test('success - only one path possible', () => {
      const aStar = new AStarPathFinding({
        matrix: [
          [0,1,0,0,0],
          [0,1,0,1,0],
          [0,0,0,1,0],
        ],
        matrixTileSize: 1,
        searchType: AStarPathFindingSearchType.BY_STEP,
        startCoordinates: { x: 0, y: 0 },
        finishCoordinates: { x: 4, y: 2 }
      });
      let result = aStar.search();
      expect([...aStar.visitedTiles]).toEqual([0]);
      expect(result).toBe(false);

      result = aStar.search();
      expect([...aStar.visitedTiles]).toEqual([0,5]);
      expect(result).toBe(false);

      result = aStar.search();
      expect([...aStar.visitedTiles]).toEqual([0,5,10]);
      expect(result).toBe(false);

      result = aStar.search();
      expect([...aStar.visitedTiles]).toEqual([0,5,10,11]);
      expect(result).toBe(false);

      result = aStar.search();
      expect([...aStar.visitedTiles]).toEqual([0,5,10,11,12]);
      expect(result).toBe(false);

      result = aStar.search();
      expect([...aStar.visitedTiles]).toEqual([0,5,10,11,12,7]);
      expect(result).toBe(false);

      result = aStar.search();
      expect([...aStar.visitedTiles]).toEqual([0,5,10,11,12,7,2]);
      expect(result).toBe(false);

      result = aStar.search();
      expect([...aStar.visitedTiles]).toEqual([0,5,10,11,12,7,2,3]);
      expect(result).toBe(false);

      result = aStar.search();
      expect([...aStar.visitedTiles]).toEqual([0,5,10,11,12,7,2,3,4]);
      expect(result).toBe(false);

      result = aStar.search();
      expect([...aStar.visitedTiles]).toEqual([0,5,10,11,12,7,2,3,4,9]);
      expect(result).toBe(false);

      result = aStar.search();
      expect([...aStar.visitedTiles]).toEqual([0,5,10,11,12,7,2,3,4,9,14]);
      expect(result).toBe(true);
    });
  });


  describe('search - CONTINUOUS', () => {
    test('success - only one path possible', () => {
      const aStar = new AStarPathFinding({
        matrix: [
          [0,1,0,0,0],
          [0,1,0,1,0],
          [0,0,0,1,0],
        ],
        matrixTileSize: 1,
        searchType: AStarPathFindingSearchType.CONTINUOUS,
        startCoordinates: { x: 0, y: 0 },
        finishCoordinates: { x: 4, y: 2 }
      });
      const result = aStar.search();
      expect([...aStar.visitedTiles]).toEqual([0,5,10,11,12,7,2,3,4,9,14]);
      expect(result).toBe(true);
    });
  });
});
