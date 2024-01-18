import ISystem from "../types";
import initCamera from "./camera";
import initLight from "./light";
import initReferencePlane from "./referencePlane";
import initSkybox from "./skybox";
import initWorldGrid from "./worldGrid";
import initMeshGrid from "./MeshGrid";
import { Config } from "../constants";

const tempInitRoom = ({ world: w, components: c, entities: e }: ISystem) => {
  const room = w.entityManager.create();
  w.entityManager.addComponent(room, c.loadable, {
    path: "assets/models/bedroom.glb",
    mouseX: window.screen.width / 2 + 5,
    mouseY: window.screen.height / 2,
  });
};

const initWorld = (props: ISystem) => {
  initCamera(props);
  initLight(props);
  initSkybox(props);
  initReferencePlane(props);
  tempInitRoom(props);
  initWorldGrid(props);

  if(Config.debug) {
    initMeshGrid(props);  
  }
};

export default initWorld;
export { initCamera, initLight, initReferencePlane, initSkybox };
