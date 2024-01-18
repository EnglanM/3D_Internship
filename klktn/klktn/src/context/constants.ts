import { Color4 } from "@babylonjs/core";
import { IGridDebugColor, IConfig } from "./types";

export const GridHelperColors : IGridDebugColor = {
    0 : new Color4(0.3, 0.3, 0.3, 0.1),
    1 : new Color4(1,0.2,0.2,1.0)
  }

export const Config : IConfig = {
    debug : false,
    cellSize: 0.125,
    blockMovement : true
}
  