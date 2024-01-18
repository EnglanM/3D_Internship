import { Color4 } from "@babylonjs/core";
import { IGridDebugColor } from "./types";

export enum ObjectHelpers {
  COLLIDER = "_coll",
  OBJECT = "_obj",
  PICKABLE_SURFACE = "_pick",
  ROOT = "__root__"
}

export enum MovementStatus {
  ALLOWED = 1,
  DISALLOWED = 2
}

export enum GridStatus {
  FREE = 0,
  TAKEN = 1
}
