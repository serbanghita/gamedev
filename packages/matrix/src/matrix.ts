export enum MatrixTile {
    FREE = 0,
    BLOCKED = 1,
    DESTRUCTIBLE = 2,
    BLOCKED_FOR_AI = 3
}

export type MatrixConfig = {
    width: number;
    height: number;
    tileSize: number;
}

export function createMatrix(matrixConfig: MatrixConfig): Array<MatrixTile[]> {
    const grid = [];

    for (let row = 1; row <= matrixConfig.height; row++) {
        grid[row - 1] = [];
        for (let col = 1; col <= matrixConfig.width; col++) {
            grid[row - 1][col - 1] = MatrixTile.FREE;
        }
    }

    return grid;
}

export function createFlatMatrix(matrixConfig: MatrixConfig) {
    return new Array(matrixConfig.width * matrixConfig.height).fill(MatrixTile.FREE);
}

export function getXYFromTile(tile: number, matrixConfig: MatrixConfig) {
    return {
        x: Math.floor(tile / matrixConfig.width),
        y: (tile % matrixConfig.width)
    }
}

export function getTileFromXY<T extends MatrixConfig>(x: number, y: number, matrixConfig: T): number {
    const tileIndex = Math.floor(x / matrixConfig.tileSize) +
        (matrixConfig.width * matrixConfig.tileSize) * Math.floor(y / matrixConfig.tileSize);

    if (tileIndex < 0 || tileIndex > ((matrixConfig.width * matrixConfig.height) - 1)) {
        throw new Error(`Invalid tile ${tileIndex} resulted from ${x} and ${y}`);
    }

    return tileIndex;
}
