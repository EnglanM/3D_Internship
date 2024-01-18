/* eslint-disable @typescript-eslint/no-unused-vars */
import { Scene } from '@babylonjs/core/scene';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Engine } from '@babylonjs/core/Engines/engine';
import { WebGPUEngine } from '@babylonjs/core/Engines/WebGPUEngine';
import "@babylonjs/core/Materials/Textures/Loaders/ddsTextureLoader";
import "@babylonjs/core/Materials/Textures/Loaders/hdrTextureLoader";
import "@babylonjs/core/Helpers/sceneHelpers";
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { ArcRotateCamera, KeyboardEventTypes, Texture } from '@babylonjs/core';
import { Inspector } from '@babylonjs/inspector';
import { placement } from './placement';

export const createScene = async (canvas: HTMLCanvasElement, engine: Engine | WebGPUEngine) => {
  const scene = new Scene(engine);

  createLights(scene);
  await createEnvironment(scene);
  const camera: ArcRotateCamera = createMainCamera(scene);
  camera.attachControl(canvas, true);
  createGround(scene);
  placement(scene);

  scene.onKeyboardObservable.add((info)=>{
    if(info.type=== KeyboardEventTypes.KEYDOWN){
      switch(info.event.key){
        case "x":{
          Inspector.Show(scene, {
            embedMode: true
          });
          console.log("x is pressed");
          break;
        }
        default:{
          break;
        }
      }
    }
  });

  return scene;
};

const createLights = (scene: Scene) => {
  const light1 = new HemisphericLight('light1', new Vector3(1, 1, 0), scene);
  light1.intensity = 0.6;
};

const createMainCamera = (scene: Scene): ArcRotateCamera => {
  const cam = new ArcRotateCamera("camera", -0.8060,1.3147,129, new Vector3(25,25,25), scene);
  cam.attachControl(true);
  cam.speed = 0.15;
  cam.minZ = 0.15;
  cam.fov=0.7;
  cam.upperBetaLimit= 1.6;
  return cam;
};

const createEnvironment = async (scene: Scene) => {
  scene.clearColor = new Color4(0.2, 0.3, 0.3, 0.7);
}


const createGround = (scene: Scene) => {
  const ground = MeshBuilder.CreateGround('ground', { width: 50, height: 50 }, scene);
  const groundMaterial = new StandardMaterial('groundMaterial', scene);
  groundMaterial.diffuseTexture=new Texture('./public/textures/parquet.jpg');

  ground.material = groundMaterial;
  ground.position = new Vector3(25,0,25);
//create walls
const wallMaterial= new StandardMaterial("wallMaterial",scene);
wallMaterial.diffuseTexture=new Texture('./public/textures/wall.jpg');

const wall1= MeshBuilder.CreateBox("wall1",{width:1, height:50, depth:50},scene);
wall1.position=new Vector3(-0.5,25,25);
wall1.material=wallMaterial;

const wall2= MeshBuilder.CreateBox("wall2",{width:50, height:50},scene);
wall2.position=new Vector3(25,25,50.5);
wall2.material=wallMaterial;

  return ground;
};