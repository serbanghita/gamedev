import { PhysicsBodyPropsDeclaration, SpriteSheetAnimation, SpriteSheetPropsDeclaration } from "@serbanghita-gamedev/component";
import { TiledMapFileContents } from "@serbanghita-gamedev/tiled";

export async function loadLocalImage(data: string): Promise<HTMLImageElement> {
  const img = new Image();
  const test1 = data.match(/([a-z0-9-_]+).(png|gif|jpg)$/i);
  const test2 = data.match(/^data:image\//i);
  if (!test1 && !test2) {
    throw new Error(`Trying to an load an invalid image ${data}.`);
  }

  return new Promise((resolve) => {
    img.src = data;
    img.onload = function () {
      resolve(this as HTMLImageElement);
    };
  });
}

export async function loadTileMapFile(path: string): Promise<TiledMapFileContents> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Could not fetch the map file at ${path}`);
    }
    return await response.json();
  } catch (e) {
    console.log(`Error loading ${path}`, e);
    throw e;
  }
}

export type Assets = {
  "entities/images": { [key: string]: HTMLImageElement };
  "entities/animations": { [key: string]: { [key: string]: SpriteSheetAnimation } };
  "entities/declarations": EntityDeclaration[];
  "maps/images": { [key: string]: HTMLImageElement };
  "maps/declarations": { [key: string]: TiledMapFileContents };
};

export type EntityDeclaration = {
  id: string;
  components: {
    [componentName: string]: object;

    PhysicsBody: PhysicsBodyPropsDeclaration;
    SpriteSheet: SpriteSheetPropsDeclaration;
  };
};
