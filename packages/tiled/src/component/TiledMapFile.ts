import {Component} from "@serbanghita-gamedev/ecs";
import {TiledMapFileContents} from "@serbanghita-gamedev/tiled";

export type TiledMapFileProps = {
  mapFilePath: string;
  mapFileContents: TiledMapFileContents;
}

export default class TiledMapFile extends Component<TiledMapFileProps> {

  constructor(public properties: TiledMapFileProps) {
    super(properties);
  }

  public get mapFileContents(): TiledMapFileContents {
    return this.properties.mapFileContents;
  }

  public get mapFilePath(): string {
    return this.properties.mapFilePath;
  }
}
