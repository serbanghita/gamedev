import {Component} from "@serbanghita-gamedev/ecs";
import {TiledMapFileContents} from "@serbanghita-gamedev/tiled";

export type TiledMapFileProps = {
  mapFilePath: string;
  mapFile: TiledMapFileContents;
}

export default class TiledMapFile extends Component {
  constructor(public properties: TiledMapFileProps) {
    super(properties);
  }
}
