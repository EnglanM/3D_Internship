import './style.css'
import { Scene, Engine, MeshBuilder, Color3, Color4, StandardMaterial, Camera, Vector3, UniversalCamera } from '@babylonjs/core';
//setup the canvas
const canvas: HTMLCanvasElement | null = document.getElementById('renderCanvas') as HTMLCanvasElement;

//create the engine
const engine= new Engine(canvas);
//create the scene
const createScene = function() {
  const scene= new Scene(engine);

  //creating a camer or light
  //default camera
 // scene.createDefaultCameraOrLight(true, false, true);
  //building a mash
  // const box= MeshBuilder.CreateBox('box', {
  //   size:0.1,
  //   faceColors: [
  //     new Color4(1,0,0,1), 
  //     new Color4(1,0,1,1),
  //     new Color4(1,0,0,1), 
  //     new Color4(1,0,1,1),
      
  //   ]
  // }, scene);
  scene.createDefaultLight();
  const camera= new UniversalCamera('camera', new Vector3(0,5,-10), scene);
  camera.attachControl(true);
  camera.inputs.addMouseWheel();
  camera.setTarget(new Vector3(0,0,0));
  const ground= MeshBuilder.CreateGround('',{
    height:10,
    width:10,
    subdivisions:30
  },scene);

  ground.material=new StandardMaterial('');
  ground.material.wireframe=true;
  return scene;
}

const scene= createScene();
//now we render that scene in the render loop using the engine
engine.runRenderLoop(function() {
  scene.render();
})
