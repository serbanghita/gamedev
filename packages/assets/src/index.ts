import { SpriteSheetAnimation } from "@serbanghita-gamedev/component";
import { EntityDeclaration } from "@serbanghita-gamedev/ecs";
import { TiledMapFile } from "@serbanghita-gamedev/tiled";
import { PhysicsBodyPropsDeclaration } from "@serbanghita-gamedev/component/PhysicsBody";
import { SpriteSheetPropsDeclaration } from "@serbanghita-gamedev/component/SpriteSheet";

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

export type Assets = {
  "entities/images": { [key: string]: HTMLImageElement };
  "entities/animations": { [key: string]: { [key: string]: SpriteSheetAnimation } };
  "entities/declarations": EntityDeclaration[];
  "maps/images": { [key: string]: HTMLImageElement };
  "maps/declarations": { [key: string]: TiledMapFile };
};

export type EntityDeclaration = {
  id: string;
  components: {
    [componentName: string]: object;

    PhysicsBody: PhysicsBodyPropsDeclaration;
    SpriteSheet: SpriteSheetPropsDeclaration;
  };
};
