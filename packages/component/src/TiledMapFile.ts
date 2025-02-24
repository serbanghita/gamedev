import {Component} from "@serbanghita-gamedev/ecs";
import {TiledMapFileContents} from "@serbanghita-gamedev/tiled";

export type TiledMapFileInitProps = {
  mapFilePath: string;
  mapFileContents: TiledMapFileContents;
}

export default class TiledMapFile extends Component {
  public mapFileContents!: TiledMapFileContents;
  public mapFilePath!: string;

  constructor(public properties: TiledMapFileInitProps) {
    super(properties);

    this.init(properties);
  }

  public init(properties: TiledMapFileInitProps) {
    this.mapFileContents = properties.mapFileContents;
    this.mapFilePath = properties.mapFilePath;
  }
}
