import { HemisphericLight, Vector3 } from "@babylonjs/core";
import ISystem from "../types";

const initLight = ({ world: w, components: c, entities: e }: ISystem) => {
  w.entityManager.addComponent(
    e.light,
    c.light,
    new HemisphericLight("HemiLight", new Vector3(0, 1, 0), w.scene)
  );
};

export default initLight;
