import { ArcRotateCamera, Vector3 } from "@babylonjs/core";
import ISystem from "../types";

const initCamera = ({ world: w, components: c, entities: e }: ISystem) => {
  const arcRotateCamera = new ArcRotateCamera(
    "camera",
    -Math.PI,
    Math.PI / 2.5,
    15,
    new Vector3(0, 0, 0)
  );

  w.entityManager.addComponent(e.camera, c.camera, arcRotateCamera);

  arcRotateCamera.attachControl(w.canvas);

  arcRotateCamera.lowerRadiusLimit = 10;
  arcRotateCamera.upperRadiusLimit = 305;
};

export default initCamera;
