import World from "@/ecs/World";
import { StaticComponents } from "./Components";
import { StaticEntities } from "./Entities";
import { Color4 } from "@babylonjs/core";

export default interface ISystem {
  world: World;
  components: StaticComponents;
  entities: StaticEntities;
}

export interface IDimensions {
  width: number,
  height: number,
  depth: number
}

export interface IGridDebugColor {
  [key: number]: Color4;
}

export interface IConfig {
  debug: boolean,
  blockMovement: boolean,
  cellSize: number
}
