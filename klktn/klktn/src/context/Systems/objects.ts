import { QueryType } from "@/ecs/utilities/Types";
import { AbstractMesh, Color3, Matrix, SceneLoader } from "@babylonjs/core";
import ISystem, { IDimensions } from "../types";
import "@babylonjs/loaders/glTF";
import { GridStatus, MovementStatus, ObjectHelpers } from "../enums";
import { Config } from "../constants";
import { roundPosition, getDimensions, updateContainerGrid, canDropOnContainer, setupColliders } from "./helpers";


export const pickObject =
  ({ world: w, components: c, entities: e }: ISystem) =>
    () => {

      const pickedEntities = w.query.getEntities([c.mesh, c.picked], QueryType.WITH);

      if(pickedEntities.length > 0) {
        return;
      }
      
      const archetypes = w.query.get([c.pickable], QueryType.WITH);

      if (archetypes.length == 0) {
        return;
      }

      let ray = w.scene.createPickingRay(
        w.scene.pointerX,
        w.scene.pointerY,
        Matrix.Identity(),
        null
      );
      let hit = w.scene.pickWithRay(ray);

      for (let archeType of archetypes) {
        for (
          let index = archeType.getEntities().length() - 1;
          index >= 0;
          index--
        ) {

          let mesh = archeType.getColumn(c.mesh)[index];

          const rootId = hit?.pickedMesh?.id.split("root_");

          if (rootId && mesh.id == "root_" + rootId[1]) {

            const highlightLayer = w.entityManager.getComponent(e.worldGrid, c.highlight)[w.entityManager.getArchTypeId(e.worldGrid)];

            for(let child of mesh.getChildMeshes())
            {
              child.isPickable = false;
              // child.visibility = 0.5;

              highlightLayer.addMesh(child, Color3.Green());
            }
            
            const entityId = archeType.getEntityIdFromIndex(index);

            if(w.entityManager.hasComponent(entityId, c.onGrid)) {
              console.log("cleaning grid of object");
              updateContainerGrid({world: w, components: c, entities: e}, entityId, e.worldGrid, GridStatus.FREE);
            }

            w.entityManager.getComponent(e.camera, c.camera)[w.entityManager.getArchTypeId(e.camera)].detachControl(w.canvas);
            w.entityManager.removeComponent(entityId, c.pickable);

            w.entityManager.addComponent(entityId, c.picked, { status: MovementStatus.ALLOWED});
          }
        }
      }
    };


export const moveObject =
  ({ world: w, components: c, entities: e }: ISystem) =>
    () => {

      const archetypes = w.query.get([c.picked], QueryType.WITH);

      if (archetypes.length == 0) {
        return;
      }

      for (let archeType of archetypes) {
        for (
          let index = archeType.getEntities().length() - 1;
          index >= 0;
          index--
        ) {

          let pickingInfo = w.scene.pick(w.scene.pointerX, w.scene.pointerY);

          if(!pickingInfo?.pickedMesh){
            return;
          }

          const entityId = archeType.getEntityIdFromIndex(index);

          const mesh: AbstractMesh = archeType.getColumn(c.mesh)[w.entityManager.getArchTypeId(entityId)];

          const status = archeType.getColumn(c.picked).status[w.entityManager.getArchTypeId(entityId)];

          
          const position = pickingInfo!.pickedPoint!;
          const boundingBox = archeType.getColumn(c.boundingBox);

          const minY = Math.abs(boundingBox.minY[w.entityManager.getArchTypeId(entityId)]);
          const maxX = Math.abs(boundingBox.maxX[w.entityManager.getArchTypeId(entityId)]);
          const minZ = Math.abs(boundingBox.minZ[w.entityManager.getArchTypeId(entityId)]);

          position.y += minY;
          position.x -= maxX;
          position.z += minZ;
          
          position.x = roundPosition(position.x);
          position.y = roundPosition(position.y);
          position.z = roundPosition(position.z);

          const canDrop = canDropOnContainer({world: w, components: c, entities: e}, entityId, e.worldGrid, position.clone());

          if(!canDrop) {

            if(status == MovementStatus.ALLOWED) {
              const highlightLayer = w.entityManager.getComponent(e.worldGrid, c.highlight)[w.entityManager.getArchTypeId(e.worldGrid)];

              for(let child of mesh.getChildMeshes())
              {
                highlightLayer.removeMesh(child);
                highlightLayer.addMesh(child, Color3.Red());
                
              } 
              archeType.getColumn(c.picked).status[w.entityManager.getArchTypeId(entityId)] = MovementStatus.DISALLOWED; 
            } 
          } else {
            
            if(status == MovementStatus.DISALLOWED) {
              const highlightLayer = w.entityManager.getComponent(e.worldGrid, c.highlight)[w.entityManager.getArchTypeId(e.worldGrid)];

              for(let child of mesh.getChildMeshes())
              {
                highlightLayer.removeMesh(child);
                highlightLayer.addMesh(child, Color3.Green());
              }  
              archeType.getColumn(c.picked).status[w.entityManager.getArchTypeId(entityId)] = MovementStatus.ALLOWED;
            }

            if(Config.blockMovement) {
              mesh.position = position;
            }
          }

          if(!Config.blockMovement) {
            mesh.position = position;
          }
        }
      }
    };


export const dropObject =
  ({ world: w, components: c, entities: e }: ISystem) =>
    () => {

      const archetypes = w.query.get([c.picked], QueryType.WITH);

      if (archetypes.length == 0) {
        return;
      }

      for (let archeType of archetypes) {
        for (
          let index = archeType.getEntities().length() - 1;
          index >= 0;
          index--
        ) {
          const mesh = archeType.getColumn(c.mesh)[index];

          const entityId = archeType.getEntityIdFromIndex(index);
   
          const canDrop = canDropOnContainer({world: w, components: c, entities: e}, entityId, e.worldGrid, mesh.position.clone());

          if(canDrop) {
            w.entityManager.removeComponent(entityId, c.picked);
            w.entityManager.addComponent(entityId, c.pickable);
            w.entityManager.getComponent(e.camera, c.camera)[w.entityManager.getArchTypeId(e.camera)].attachControl(w.canvas);
            updateContainerGrid({world: w, components: c, entities: e}, entityId, e.worldGrid, GridStatus.TAKEN);

            const highlightLayer = w.entityManager.getComponent(e.worldGrid, c.highlight)[w.entityManager.getArchTypeId(e.worldGrid)];

            for(let child of mesh.getChildMeshes())
            {
              child.isPickable = true;
              // child.visibility = 1.0;

              highlightLayer.removeMesh(child);
            }

            if(!w.entityManager.hasComponent(entityId, c.onGrid)) {
              w.entityManager.addComponent(entityId, c.onGrid);
            }

            console.log("dropping, adding pickable");
          } else {
            console.log("can't drop");
          }
        }
      }
    };


export const loadObjects =
  ({ world: w, components: c, entities: e }: ISystem) =>
    async () => {
      const [archeType] = w.query.get([c.loadable, c.grid], QueryType.ONLY);

      if (!archeType) {
        // console.info("[loadObjects]: No archetype found");
        return null;
      }

      for (
        let index = archeType.getEntities().length() - 1;
        index >= 0;
        index--
      ) {

        const entId = archeType.getEntityIdFromIndex(index);

        const path = archeType.getColumn(c.loadable).path[index];

        w.entityManager.removeComponent(entId, c.loadable);

        const result = await SceneLoader.ImportMeshAsync("", path);

        let rootMesh = result.meshes[0];

        const colliders: Array<AbstractMesh> = [];

        const entities = w.query.getEntities([c.mesh], QueryType.WITH);
        
        rootMesh.id = "root_" + entities.length;

        for (const mesh of result.meshes) {      
          if (mesh.name.includes(ObjectHelpers.COLLIDER)) {
            colliders.push(mesh);
          } else if (mesh.name === ObjectHelpers.ROOT) {
            continue;
          } else {
            mesh.id += rootMesh.id;
          }
        }
        w.entityManager.addComponent(entId, c.mesh, rootMesh);

        const dimensions: IDimensions = getDimensions({world: w, components: c, entities: e}, entId);
        const grid: Array<Array<Array<number>>> = [];

        w.entityManager.addComponent(entId, c.dimensions, {width: dimensions.width, height: dimensions.height, depth: dimensions.depth});

        for (let i = 0; i < Math.round(dimensions.width / Config.cellSize); i++) {
          if (!grid[i]) {
            grid[i] = [];
          }
          for (let j = 0; j < Math.round(dimensions.depth / Config.cellSize); j++) {
            if (!grid[i][j]) {
              grid[i][j] = [];
            }
            for (let k = 0; k < Math.round(dimensions.height / Config.cellSize); k++) {
              grid[i][j][k] = (colliders.length === 0) ? 1 : 0;
            }
          }
        }

        w.entityManager.getComponent(entId, c.grid)[w.entityManager.getArchTypeId(entId)] = grid;

        w.entityManager.addComponent(entId, c.pickable);

       setupColliders({world: w, components: c, entities: e}, entId, colliders);
      }
    };


export const loadRoom =
  ({ world: w, components: c, entities: e }: ISystem) =>
    async () => {
      const [archeType] = w.query.get([c.loadable], QueryType.ONLY);

      if (!archeType) {
        console.info("[loadRoom]: No archetype found");
        return null;
      }

      for (
        let index = archeType.getEntities().length() - 1;
        index >= 0;
        index--
      ) {

        const entId = archeType.getEntityIdFromIndex(index);

        const path = archeType.getColumn(c.loadable).path[index];

        w.entityManager.removeComponent(entId, c.loadable);

        const result = await SceneLoader.ImportMeshAsync("", path);

        const colliders : Array<AbstractMesh> = [];

        let mesh = result.meshes[0];

        for (const mesh of result.meshes) {
          mesh.isPickable = false;

          if(mesh.name.includes(ObjectHelpers.PICKABLE_SURFACE)) {
            mesh.isPickable = true;
          } else if (mesh.name.includes(ObjectHelpers.COLLIDER)) {
            mesh.setParent(null);
            colliders.push(mesh);
          }
        }
        
        setupColliders({world: w, components: c, entities: e}, e.worldGrid, colliders);
        w.entityManager.addComponent(entId, c.mesh, mesh);
      }
    };

