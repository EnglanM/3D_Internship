import ISystem from "../types";
import { dropObject, loadObjects, loadRoom, moveObject, pickObject } from "./objects";
import { ExecutionTime as ET } from "@/ecs/utilities/Types";

interface IRegisterStaticSystems extends ISystem {
  onSceneReady?: () => void;
}

const registerStaticSystems = async (props: IRegisterStaticSystems) => {
  const { onSceneReady, ...wce } = props;
  const { world: w } = wce;

  w.systemManager.register(loadObjects(wce), ET.BEFORE_RENDER);
  w.systemManager.register(loadRoom(wce), ET.BEFORE_RENDER);
  w.systemManager.register(onSceneReady, ET.SCENE_READY);
  w.systemManager.register(pickObject(wce), ET.WINDOW_MOUSE_DOWN);
  w.systemManager.register(moveObject(wce), ET.POINTER);
  w.systemManager.register(dropObject(wce), ET.WINDOW_MOUSE_UP);

};

export default registerStaticSystems;
export { loadObjects };
