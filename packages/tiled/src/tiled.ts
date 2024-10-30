// This is the main JSON map file.
export type TiledMapFile = {
    width: number;
    height: number;
    tilewidth: number;
    tileheight: number;
    // The layers contain all the tiles that need to be rendered + special layer with objects (entities).
    layers: TiledLayer[];
    properties: {name: string, type: string, value: number | string | boolean}[];
}

export type TiledLayer = {
    data: number[]; // Objects (int) on the grid
    name: string; // "background"
    width: number; // 40
    height: number; // 30
    type: string; // "tiledlayer"
    visible: boolean;
    properties: {name: string, type: string, value: number | string | boolean}[];
    objects?: TiledObject[];
};

export type TiledObject = {
    id: number;
    name: string;
    type: string;
    visible: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    properties: TiledObjectProperty[];
};

export type TiledObjectProperty = {
    name: string;
    type: string;
    value: number | string | boolean;
}

export function getObjectProperty(properties: TiledObjectProperty[], name: string) {
    if (!properties || !properties.length) {
        return;
    }
    const result = properties.find((prop) => prop.name === name && prop.value !== "");
    return result && result.value;
}

export default class TiledMap {
    constructor(public mapFile: TiledMapFile) {
        this.checkSettings();
    }

    private checkSettings() {
        if (!Object.prototype.hasOwnProperty.call(this.mapFile, "width")) {
            throw new Error(`Map has no 'width' property.`);
        }
        if (!Object.prototype.hasOwnProperty.call(this.mapFile, "height")) {
            throw new Error(`Map has no 'height' property.`);
        }
        if (!Object.prototype.hasOwnProperty.call(this.mapFile, "tilewidth")) {
            throw new Error(`Map has no 'tilewidth' property.`);
        }
        if (!Object.prototype.hasOwnProperty.call(this.mapFile, "tileheight")) {
            throw new Error(`Map has no 'tileheight' property.`);
        }
        if (!Object.prototype.hasOwnProperty.call(this.mapFile, "layers")) {
            throw new Error(`Map has no 'layers' property.`);
        }
        if (!(this.mapFile.layers instanceof Array) || !this.mapFile.layers.length) {
            throw new Error(`Map has no valid 'layers' property.`);
        }
    }

    public getTileWidth(): number {
        return this.mapFile.tilewidth;
    }

    public getTileHeight(): number {
        return this.mapFile.tileheight;
    }

    public getTileSize(): number {
      if (this.mapFile.tilewidth !== this.mapFile.tileheight) {
        throw new Error(`Tile is not a square: ${this.mapFile.tilewidth}x${this.mapFile.tileheight}`);
      }

      return this.mapFile.tilewidth;
    }

    public getWidthInTiles(): number {
        return this.mapFile.width;
    }

    public getHeightInTiles(): number {
        return this.mapFile.height;
    }

    public getWidthInPx(): number {
      return this.mapFile.width * this.mapFile.tilewidth;
    }

    public getHeightInPx(): number {
      return this.mapFile.height * this.mapFile.tileheight;
    }

    public getRenderLayers() {
        return this.mapFile.layers.filter((layer) => {
            return (
                (layer.type === "tilelayer") &&
                ("properties" in layer) &&
                (getObjectProperty(layer.properties, "renderOnLayer")) &&
                layer.visible &&
                layer.data
            );
        });
    }

    public getCollisionLayers() {
        const tileLayers = this.mapFile.layers.filter((layer) => {
            return (
                layer.type === "tilelayer" &&
                layer.name === "collisions" &&
                layer.data
            );
        });

        if (tileLayers.length === 0) {
            throw new Error(`There are no 'collision' layers set.`);
        }

        return tileLayers;
    }

    // Get all layers that include "objects" key.
    public getObjectLayers() {
        const objectGroupLayers = (this.mapFile.layers as Array<TiledLayer & {objects: TiledObject[]}>).filter((layer) => {
            return layer.type === "objectgroup" && layer.objects && layer.objects.length;
        });

        if (!objectGroupLayers) {
            throw new Error(`No "objectgroup" layers have been defined in Tiled.`);
        }

        return objectGroupLayers;
    }

    public getObjects(): TiledObject[] {
        // Collect all objects from all "objectgroup" layer.
        return this.getObjectLayers().reduce((acc, objectGroup) => {
            // Remove all "hidden" objects.
            const objects = objectGroup.objects.filter((mapObject: TiledObject) => {
                return mapObject.visible === true && mapObject.type !== "";
            })
            return [...acc, ...objects];
        }, [] as TiledObject[]);
    }
}
