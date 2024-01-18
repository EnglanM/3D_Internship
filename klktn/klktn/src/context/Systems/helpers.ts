import { AbstractMesh, Vector3 } from "@babylonjs/core";
import { Config, GridHelperColors } from "../constants";
import { GridStatus, ObjectHelpers } from "../enums";
import ISystem, { IDimensions } from "../types";

export const roundDimension = (number: number): number => {
    const roundedValue = Math.round(number / Config.cellSize) * Config.cellSize;
    return roundedValue;
  }
  
  export const roundPosition = (number: number): number => {
    const roundedValue = Math.round(number / (Config.cellSize / 2)) * (Config.cellSize / 2);
    return roundedValue;
  }

  export const getDimensions =
  ({world: w, components: c} : ISystem, entity: number) : IDimensions => {

    
    const object = w.entityManager.getComponent(entity, c.mesh)[w.entityManager.getArchTypeId(entity)];

    let width, height, depth;

    object.refreshBoundingInfo();
    object.computeWorldMatrix();

    if (object.getChildMeshes().length > 0)
    {
      let maxX = -9999;
      let maxY = -9999;
      let maxZ = -9999;
      let minX = 9999;
      let minY = 9999;
      let minZ = 9999;

      for( const child of object.getChildMeshes())
      {
        if (!child.name.includes(ObjectHelpers.COLLIDER)) {
        
          child.refreshBoundingInfo();
          child.computeWorldMatrix();

          if(child.getBoundingInfo().boundingBox.maximum.x > maxX) {
            maxX = child.getBoundingInfo().boundingBox.maximum.x;
          }
          if(child.getBoundingInfo().boundingBox.maximum.z > maxZ) {
            maxZ = child.getBoundingInfo().boundingBox.maximum.z;
          }
          if(child.getBoundingInfo().boundingBox.maximum.y > maxY) {
            maxY = child.getBoundingInfo().boundingBox.maximum.y;
          }

          if(child.getBoundingInfo().boundingBox.minimum.x < minX) {
            minX = child.getBoundingInfo().boundingBox.minimum.x;
          }
          if(object.getBoundingInfo().boundingBox.minimum.z < minZ) {
            minZ = child.getBoundingInfo().boundingBox.minimum.z;
          }
          if(object.getBoundingInfo().boundingBox.minimum.y < minY) {
            minY = child.getBoundingInfo().boundingBox.minimum.y;
          }
        }
      }

      width = roundDimension(maxX - minX);
      depth = roundDimension(maxZ - minZ);
      height = roundDimension(maxY - minY);

      w.entityManager.addComponent(entity, c.boundingBox, {minX, minY, minZ, maxX, maxY, maxZ});
    } else {

      width = roundDimension((object.getBoundingInfo().boundingBox.maximum.x - object.getBoundingInfo().boundingBox.minimum.x));
      depth = roundDimension((object.getBoundingInfo().boundingBox.maximum.z - object.getBoundingInfo().boundingBox.minimum.z));
      height = roundDimension((object.getBoundingInfo().boundingBox.maximum.y - object.getBoundingInfo().boundingBox.minimum.y));
    }
    
    if(width === 0) {
      width = 0.5;
    }
    if(depth === 0) {
      depth = 0.5;
    }
    if(height === 0) {
      height = 0.5;
    }

    return {width, height, depth}
  };

  export const setupColliders =
  ({ world: w, components: c, entities: e } : ISystem, containerEntity: number, colliders : Array<AbstractMesh>) => {
    
    if(colliders.length > 0) {
        for (const collider of colliders) {
        
          const colliderEntity = w.entityManager.create();

          w.entityManager.addComponent(colliderEntity, c.mesh, collider);
          const dimensions = getDimensions({world: w, components: c, entities: e}, colliderEntity);

          w.entityManager.addComponent(colliderEntity, c.dimensions, {width: dimensions.width, height: dimensions.height, depth: dimensions.depth});
          
          const colliderGrid : Array<Array<Array<number>>> = [];
          for (let i = 0; i < Math.round(dimensions.width / Config.cellSize); i++) {
            if(!colliderGrid[i] ) {
              colliderGrid[i] = [];
            }
            for(let j = 0; j < Math.round(dimensions.depth / Config.cellSize); j ++){
              if(!colliderGrid[i][j] ) {
                colliderGrid[i][j] = [];
              }
              for(let k = 0; k < Math.round(dimensions.height / Config.cellSize); k ++){
                colliderGrid[i][j][k] = 0;
              }
            }
          }

          w.entityManager.addComponent(colliderEntity, c.grid, colliderGrid);

          updateContainerGrid({world: w, components: c, entities: e}, colliderEntity, containerEntity, GridStatus.TAKEN);

          w.entityManager.destroy(colliderEntity);
        }
      }
  }
  
  export const canDropOnContainer =
  ({ world: w, components: c, entities: e }: ISystem, objectEntity: number, containerEntity: number, position: Vector3) => {

    const objectGrid = w.entityManager.getComponent(objectEntity, c.grid)[w.entityManager.getArchTypeId(objectEntity)];
    const containerGrid = w.entityManager.getComponent(containerEntity, c.grid)[w.entityManager.getArchTypeId(containerEntity)];

    let containerDimensions: IDimensions = {width: 0, height: 0, depth: 0};

    let dimensionsComponent = w.entityManager.getComponent(containerEntity, c.dimensions);

    containerDimensions.width = roundDimension(dimensionsComponent.width[w.entityManager.getArchTypeId(containerEntity)]);
    containerDimensions.depth = roundDimension(dimensionsComponent.depth[w.entityManager.getArchTypeId(containerEntity)]);
    containerDimensions.height = roundDimension(dimensionsComponent.height[w.entityManager.getArchTypeId(containerEntity)]);

    const objectDimensions: IDimensions = { width: 0, height: 0, depth: 0};

    dimensionsComponent = w.entityManager.getComponent(objectEntity, c.dimensions);

    objectDimensions.width = roundDimension(dimensionsComponent.width[w.entityManager.getArchTypeId(objectEntity)]);
    objectDimensions.depth = roundDimension(dimensionsComponent.depth[w.entityManager.getArchTypeId(objectEntity)]);
    objectDimensions.height = roundDimension(dimensionsComponent.height[w.entityManager.getArchTypeId(objectEntity)]);
    
    position.x = roundPosition(position.x - objectDimensions.width / 2);
    position.z = roundPosition(position.z - objectDimensions.depth / 2);
    position.y = roundPosition(position.y - objectDimensions.height / 2);

    for (let i = 0; i < objectGrid.length; i++) {
      for (let j = 0; j < objectGrid[i].length; j++) {
        for (let k = 0; k < objectGrid[i][j].length; k++) {
          let w1, w2, d1, d2, h1, h2;

         
          if ((containerDimensions.width / 2 / Config.cellSize + position.x / Config.cellSize) % 1 === 0) {
            w1 = Math.round(i + (containerDimensions.width / 2 / Config.cellSize + position.x / Config.cellSize));
            w2 = Math.round(i + (containerDimensions.width / 2 / Config.cellSize + position.x / Config.cellSize) + 1.0);
          } else {
            w1 = Math.round(i + (containerDimensions.width / 2 / Config.cellSize) + position.x / Config.cellSize);
            w2 = w1;
          }


          if(w1 > containerGrid.length || w1 < 0 || w2 > containerGrid.length || w2 < 0) {
            return false;
          }

          if ((containerDimensions.depth / 2 / Config.cellSize + position.z / Config.cellSize) % 1 === 0) {
            d1 = Math.round(j + (containerDimensions.depth / 2 / Config.cellSize + position.z / Config.cellSize));
            d2 = Math.round(j + (containerDimensions.depth / 2 / Config.cellSize + position.z / Config.cellSize) + 1.0);
          } else {
            d1 = Math.round(j + (containerDimensions.depth / 2 / Config.cellSize) + position.z / Config.cellSize);
            d2 = d1;
          }

          if(d1 < 0 || d2 < 0 || d1 >= containerGrid[w1].length || d1 >= containerGrid[w2].length || d2 >= containerGrid[w1].length || d2 >= containerGrid[w2].length) {
            return false;
          }

           if ((containerDimensions.height / 2 / Config.cellSize + position.y / Config.cellSize) % 1 === 0) {
            h1 = Math.round(k + (containerDimensions.height / 2 / Config.cellSize + position.y / Config.cellSize));
            h2 = Math.round(k + (containerDimensions.height / 2 / Config.cellSize + position.y / Config.cellSize) + 1.0);
          } else {
            h1 = Math.round(k + (containerDimensions.height / 2 / Config.cellSize) + position.y / Config.cellSize);
            h2 = h1;
          }

          if(h1 < 0 || h2 < 0 || h1 >= containerGrid[w1][d1].length || h1 >= containerGrid[w1][d2].length || h1 >= containerGrid[w2][d1].length || h1 >= containerGrid[w2][d2].length || h2 >= containerGrid[w1][d1].length || h2 >= containerGrid[w1][d2].length || h2 >= containerGrid[w2][d1].length || h2 >= containerGrid[w2][d2].length) {
            return false;
          }

          //leaving these here just in case needed for debugging
          
          if(containerGrid[w1][d1][h1] === 1) {
            return false;
          }
          if(containerGrid[w1][d1][h2] === 1) {
            return false;
          }
          if(containerGrid[w1][d2][h1] === 1) {
            return false;
          }
          if(containerGrid[w1][d2][h2] === 1) {
            return false;
          }
          if(containerGrid[w2][d1][h1] === 1) {
            return false;
          }
          if(containerGrid[w2][d1][h2] === 1) {
            return false;
          }
          if(containerGrid[w2][d2][h1] === 1) {
            return false;
          }
          if(containerGrid[w2][d2][h2] === 1) {
            return false;
          }
        }
      }
    }
    return true;
  }

export const updateContainerGrid =
  ({ world: w, components: c, entities: e }: ISystem, objectEntity: number, containerEntity: number, value: number) => {

    const objectGrid = w.entityManager.getComponent(objectEntity, c.grid)[w.entityManager.getArchTypeId(objectEntity)];
    const containerGrid = w.entityManager.getComponent(containerEntity, c.grid)[w.entityManager.getArchTypeId(containerEntity)];

    let containerDimensions: IDimensions = {width: 0, height: 0, depth: 0};

    let dimensionsComponent = w.entityManager.getComponent(containerEntity, c.dimensions);

    containerDimensions.width = roundDimension(dimensionsComponent.width[w.entityManager.getArchTypeId(containerEntity)]);
    containerDimensions.depth = roundDimension(dimensionsComponent.depth[w.entityManager.getArchTypeId(containerEntity)]);
    containerDimensions.height = roundDimension(dimensionsComponent.height[w.entityManager.getArchTypeId(containerEntity)]);

    const objectMesh = w.entityManager.getComponent(objectEntity, c.mesh)[w.entityManager.getArchTypeId(objectEntity)];

    const objectDimensions: IDimensions = { width: 0, height: 0, depth: 0};

    dimensionsComponent = w.entityManager.getComponent(objectEntity, c.dimensions);

    objectDimensions.width = roundDimension(dimensionsComponent.width[w.entityManager.getArchTypeId(objectEntity)]);
    objectDimensions.depth = roundDimension(dimensionsComponent.depth[w.entityManager.getArchTypeId(objectEntity)]);
    objectDimensions.height = roundDimension(dimensionsComponent.height[w.entityManager.getArchTypeId(objectEntity)]);
    
    const position = objectMesh.position.clone();

    position.x = roundPosition(position.x - objectDimensions.width / 2);
    position.z = roundPosition(position.z - objectDimensions.depth / 2);
    position.y = roundPosition(position.y - objectDimensions.height / 2);

    for (let i = 0; i < objectGrid.length; i++) {
      for (let j = 0; j < objectGrid[i].length; j++) {
        for (let k = 0; k < objectGrid[i][j].length; k++) {
          let w1, w2, d1, d2, h1, h2;

          if ((containerDimensions.width / 2 / Config.cellSize + position.x / Config.cellSize) % 1 === 0) {
            w1 = Math.round(i + (containerDimensions.width / 2 / Config.cellSize + position.x / Config.cellSize));
            w2 = Math.round(i + (containerDimensions.width / 2 / Config.cellSize + position.x / Config.cellSize) + 1.0);
          } else {
            w1 = Math.round(i + (containerDimensions.width / 2 / Config.cellSize) + position.x / Config.cellSize);
            w2 = w1;
          }

          if ((containerDimensions.depth / 2 / Config.cellSize + position.z / Config.cellSize) % 1 === 0) {
            d1 = Math.round(j + (containerDimensions.depth / 2 / Config.cellSize + position.z / Config.cellSize));
            d2 = Math.round(j + (containerDimensions.depth / 2 / Config.cellSize + position.z / Config.cellSize) + 1.0);

          } else {
            d1 = Math.round(j + (containerDimensions.depth / 2 / Config.cellSize) + position.z / Config.cellSize);
            d2 = d1;
          }

          if ((containerDimensions.height / 2 / Config.cellSize + position.y / Config.cellSize) % 1 === 0) {
            h1 = Math.round(k + (containerDimensions.height / 2 / Config.cellSize + position.y / Config.cellSize));
            h2 = Math.round(k + (containerDimensions.height / 2 / Config.cellSize + position.y / Config.cellSize) + 1.0);
          } else {
            h1 = Math.round(k + (containerDimensions.height / 2 / Config.cellSize) + position.y / Config.cellSize);
            h2 = h1;
          }

          //leaving these here just in case needed for debugging
          
          if(containerGrid[w1][d1][h1] !== value) {
            console.log("setting", w1, d1, h1);
            containerGrid[w1][d1][h1] = value;
          }
          if(containerGrid[w1][d1][h2] !== value) {
            console.log("setting", w1, d1, h2);
            containerGrid[w1][d1][h2] = value; 
          }
          if(containerGrid[w1][d2][h1] !== value) {
            console.log("setting", w1, d2, h1);
            containerGrid[w1][d2][h1] = value;
          }
          if(containerGrid[w1][d2][h2] !== value) {
            console.log("setting", w1, d2, h2);
            containerGrid[w1][d2][h2] = value;
          }
          if(containerGrid[w2][d1][h1] !== value) {
            console.log("setting", w2, d1, h1);
            containerGrid[w2][d1][h1] = value;
          }
          if(containerGrid[w2][d1][h2] !== value) {
            console.log("setting", w2, d1, h2);
            containerGrid[w2][d1][h2] = value;
          }
          if(containerGrid[w2][d2][h1] !== value) {
            console.log("setting", w2, d2, h1);
            containerGrid[w2][d2][h1] = value;
          }
          if(containerGrid[w2][d2][h2] !== value) {
            console.log("setting", w2, d2, h2);
            containerGrid[w2][d2][h2] = value;
          }

          if(Config.debug) {
            const meshGrid = w.entityManager.getComponent(e.meshGrid, c.meshGrid)[w.entityManager.getArchTypeId(e.meshGrid)];
            meshGrid[w1][d1][h1].instancedBuffers.color = GridHelperColors[value];
            meshGrid[w1][d1][h2].instancedBuffers.color = GridHelperColors[value];
            meshGrid[w1][d2][h1].instancedBuffers.color = GridHelperColors[value];
            meshGrid[w1][d2][h2].instancedBuffers.color = GridHelperColors[value];
            meshGrid[w2][d1][h1].instancedBuffers.color = GridHelperColors[value];
            meshGrid[w2][d1][h2].instancedBuffers.color = GridHelperColors[value];
            meshGrid[w2][d2][h1].instancedBuffers.color = GridHelperColors[value];
            meshGrid[w2][d2][h2].instancedBuffers.color = GridHelperColors[value];
          }
        }
      }
    }
}
