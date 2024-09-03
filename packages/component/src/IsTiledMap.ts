import {Component} from "@serbanghita-gamedev/ecs";
import {TiledMapFile} from "@serbanghita-gamedev/tiled";

export type IsTiledMapProps = {
  mapFilePath: string;
  mapFile: TiledMapFile;
}

export default class IsTiledMap extends Component {
  constructor(public properties: IsTiledMapProps) {
    super(properties);

    this.init(properties);
  }
}