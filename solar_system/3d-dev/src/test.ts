import {
    MeshBuilder,
    Texture,
    StandardMaterial,
    Color3,
    Engine,
    SceneLoader,
    TouchCamera,
    SpotLight,
    Mesh,
    DirectionalLight,
    KeyboardEventTypes,
    Camera,
    UniversalCamera,
    CubeTexture,
    FreeCamera,
    Curve3,
    ArcRotateCamera,
    HemisphericLight
    
    
  } from "@babylonjs/core";
  import { Scene } from "@babylonjs/core/scene";
  import { Inspector } from '@babylonjs/inspector';
  import { Vector3 } from "@babylonjs/core/Maths/math.vector";
  import "@babylonjs/loaders"; // Import loaders
  import "@babylonjs/core/Debug/debugLayer"; // Import debug layer for debugging
  import "@babylonjs/inspector"; // Import inspector for inspecting scene
import { HemisphericLightPropertyGridComponent } from "@babylonjs/inspector/components/actionTabs/tabs/propertyGrids/lights/hemisphericLightPropertyGridComponent";

  let sun: Mesh;
  let mercury: Mesh;
  let venus: Mesh;
  let earth: Mesh;
  let mars: Mesh;
  let jupiter: Mesh;
  let saturn: Mesh;
  let uranus: Mesh;
  let neptune: Mesh;

  const canvas= document.getElementById('renderCanvas')as HTMLCanvasElement;
  const engine= new Engine(canvas, true, { deterministicLockstep: true, lockstepMaxSteps: 4 });

  const createScene= function() {
    const scene= new Scene(engine);

    scene.createDefaultLight();
    const light= new HemisphericLight('hhemilight', new Vector3(0,1,0),scene);
    light.intensity=2;
    const testCamer = new ArcRotateCamera('camera2',1.5,1.6,120,new Vector3(0,0,0),scene);
    testCamer.attachControl(canvas,true);

    // const camera = new ArcRotateCamera("camera1", -Math.PI / 2, Math.PI / 2, 50, new Vector3(0, 0, 0), scene);
    // camera.setTarget(Vector3.Zero());
    // camera.attachControl(canvas, true);
    //background
    // const background= MeshBuilder.CreatePlane('background',{
    //     height:15,
    //     width:32,
    // },scene);
    //  background.position = new Vector3(0,0,1);
    //  background.rotation = new Vector3(0,0,0);      
    //  const backgroundMaterial= new StandardMaterial('backgroundMaterial', scene);
    //  backgroundMaterial.diffuseTexture= new Texture('/textures/backgroud.jpg');
    //  backgroundMaterial.emissiveColor = new Color3(0.886, 0.901, 0.941);
    //  background.material= backgroundMaterial;

    // skybox
    //  const skybox= MeshBuilder.CreateBox('skybox',{size:3000},scene); 
    //  const skyboxMaterial= new StandardMaterial('skyboxMaterial', scene);
    //  skyboxMaterial.backFaceCulling= false;
    //   skyboxMaterial.diffuseColor= new Color3(0,0,0);
    //  skyboxMaterial.specularColor= new Color3(0,0,0);
    //  skyboxMaterial.reflectionTexture= new CubeTexture('textures/skybox', scene);
    //  skyboxMaterial.reflectionTexture.coordinatesMode= Texture.SKYBOX_MODE;
    //  skybox.material= skyboxMaterial;
    //  skybox.infiniteDistance=true;

     //sun
     const distance=18;
     const sunSize=10;
     sun= MeshBuilder.CreateSphere('sun',{diameter:sunSize}, scene);
     sun.position= new Vector3(0,0,0);
     const sunMaterial= new StandardMaterial('sunMaterial', scene);
     sunMaterial.diffuseTexture= new Texture('./textures/sun.png');
     
     sunMaterial.specularColor = new Color3(1, 1, 1);

     sun.material=sunMaterial;
     //mercury
     mercury= MeshBuilder.CreateSphere('mercury',{diameter:sunSize*0.2},scene);
     mercury.position= new Vector3(distance*0.39,0,0);
     const mercuryMaterial= new StandardMaterial('mercuryMaterial', scene);
     mercuryMaterial.diffuseTexture= new Texture('./textures/mercury.jpg');
     mercury.material=mercuryMaterial;
     //orbit
     const orbit= Curve3.ArcThru3Points(new Vector3(distance*0.39,0,0), new Vector3(-(distance*0.39),0,0), new Vector3(0,distance*0.39,0),32, false, true);
     const orbitline= MeshBuilder.CreateLines('arc', {points: orbit.getPoints()});
     

    //  const f = new Vector3(distance*0.39,0,0);
    //  const s = new Vector3(-(distance*0.39),0,0);
    //  const t = new Vector3(0,distance*0.39,0);
     
    //  const arc = Curve3.ArcThru3Points(f, s, t, 60, false, true);
    //  const arcLine = MeshBuilder.CreateLines("arc", {points: arc.getPoints()})
  

     //venus
     venus= MeshBuilder.CreateSphere('venus', {diameter:sunSize*0.3}, scene);
     venus.position= new Vector3(distance*0.72,1,2);
     const venusMaterial= new StandardMaterial('venusMaterial', scene);
     venusMaterial.diffuseTexture= new Texture('./textures/venus.jpg');
     venus.material=venusMaterial;
     //orbit
     const venusOrbit= Curve3.ArcThru3Points(new Vector3(distance*0.72,1,2),new Vector3(-(distance*0.72),1,2),new Vector3(0,distance*0.72,2),60,false,true);
     const venusOrbitLine= MeshBuilder.CreateLines('arc',{points:venusOrbit.getPoints()});
     //earth
     earth= MeshBuilder.CreateSphere('earth',{diameter:sunSize*0.4},scene);
     earth.position=new Vector3(distance,0,0);
     const earthMaterial= new StandardMaterial('earthMaterial', scene);
     earthMaterial.diffuseTexture=new Texture('./textures/earth.jpg');
     earth.material= earthMaterial;
     //orbit
     const orbitEarth= Curve3.ArcThru3Points(new Vector3(distance,0,0),new Vector3(-distance,0,0),new Vector3(0,distance,0),60,false,true);
     const orbitEarthLine= MeshBuilder.CreateLines('arc',{points:orbitEarth.getPoints()});
     //mars
      mars= MeshBuilder.CreateSphere('mars',{diameter:sunSize*0.25},scene);
     mars.position= new Vector3(distance*1.52,2,0);
     const marsMaterial= new StandardMaterial('marsMaterial',scene);
     marsMaterial.diffuseTexture= new Texture('./textures/mars.jpg');
     mars.material=marsMaterial;
     //orbit
     const orbitMars= Curve3.ArcThru3Points(new Vector3(distance*1.52,2,0),new Vector3(-(distance*1.52),2,0),new Vector3(0,distance*1.52,0),60,false,true);
     const orbitMarsLine= MeshBuilder.CreateLines('arc',{points:orbitMars.getPoints()});
     //jupiter
      jupiter= MeshBuilder.CreateSphere('jupiter',{diameter:sunSize*0.7},scene);
     jupiter.position=new Vector3(distance*5.2,5,0);
     const jupiterMaterial= new StandardMaterial('jupiterMaterial',scene);
     jupiterMaterial.diffuseTexture= new Texture('./textures/jupiter.jpg');
     jupiter.material= jupiterMaterial;
     //orbit
     const orbitJupiter= Curve3.ArcThru3Points(new Vector3(distance*5.2,5,0),new Vector3(-(distance*5.2),5,0),new Vector3(0,distance*5.2,0),60,false,true);
     const orbitJupiterLine= MeshBuilder.CreateLines('arc', {points:orbitJupiter.getPoints()});
     //saturn
      saturn= MeshBuilder.CreateSphere('saturn',{diameter:sunSize*0.6},scene);
     saturn.position= new Vector3(distance*9.54,3,1.5);
     const saturnMaterial= new StandardMaterial('saturnMaterial',scene);
     saturnMaterial.diffuseTexture= new Texture('./textures/saturn.jpg');
     saturn.material=saturnMaterial;
     //orbit
     const orbitSaturn= Curve3.ArcThru3Points(new Vector3(distance*9.54,3,1.5),new Vector3(-(distance*9.54),3,1.5),new Vector3(0,distance*9.54,1.5),60,false,true);
     const orbitSaturnLine= MeshBuilder.CreateLines('arc',{points:orbitSaturn.getPoints()});
     //uranus
      uranus= MeshBuilder.CreateSphere('uranus',{diameter:sunSize*0.45},scene);
     uranus.position= new Vector3(distance*19.52,-2,0);
     const uranusMaterial= new StandardMaterial('uranusMateria',scene);
     uranusMaterial.diffuseTexture= new Texture('./textures/uranus.jpg');
     uranus.material= uranusMaterial;
     //orbit
     const orbitUranus= Curve3.ArcThru3Points(new Vector3(distance*19.52,-2,0),new Vector3(-(distance*19.52),-2,0),new Vector3(0,distance*19.52,0),60,false,true);
     const orbitUranusLine= MeshBuilder.CreateLines('arc',{points:orbitUranus.getPoints()});
     
     //neptune
      neptune= MeshBuilder.CreateSphere('neptune',{diameter:sunSize*0.47},scene);
     neptune.position= new Vector3(distance*30.06,0,0);
     const neptuneMaterial= new StandardMaterial('neptuneMaterial', scene);
     neptuneMaterial.diffuseTexture= new Texture('./textures/neptune.jpg');
     neptune.material=neptuneMaterial;
     //orbit
     const orbitNeptune= Curve3.ArcThru3Points(new Vector3(distance*30.06,0,0),new Vector3(-(distance*30.06),0,0),new Vector3(0,distance*30.06,0),60,false,true);
     const orbitNeptuneLine= MeshBuilder.CreateLines('arc',{points:orbitNeptune.getPoints()});
    //test

//     const radius = distance * 30.06; // Adjust the radius as needed

// // Define a direction vector for the desired alignment
// const alignmentDirection = new Vector3(0, 1, 1).normalize(); // Normalize for consistent length

// // Calculate control points based on the desired alignment
// const startControlPoint = alignmentDirection.scale(-radius); // Move in the opposite direction
// const endControlPoint = alignmentDirection.scale(radius);   // Move in the alignment direction
// const centerControlPoint = Vector3.Zero(); // The center point should be at the origin

// // Create a circle aligned with the specified axis
// const orbitNeptune = Curve3.ArcThru3Points(
//     startControlPoint,
//     endControlPoint,
//     centerControlPoint,
//     60,
//     false,
//     true
// );

// const orbitNeptuneLine = MeshBuilder.CreateLines('arc', { points: orbitNeptune.getPoints() });

let counter=1;
let startTime:number,endTime:number ; 
scene.onBeforeStepObservable.add(() => {
  
 startTime = performance.now();
  counter++;
  console.log(counter);
 
if(counter >=1000){
 endTime = performance.now();
  
  const elapsedTime = endTime - startTime;

  console.log(`The action took ${elapsedTime} milliseconds to read: ${counter}`);
}});




    return scene;
  }
 

  window.addEventListener("resize", () => {
    engine.resize();
  });

  const scene=createScene();
//Inspector.Show(scene, {});
scene.onKeyboardObservable.add((info) => {
  if (info.type === KeyboardEventTypes.KEYDOWN){
    switch (info.event.key) {
      case "x":{
           scene!.debugLayer.show();
      break;
        }
      case "z":{
        scene!.debugLayer.hide();
      break;
      }
      default:
        break;
    }
};
} );

scene.beforeRender= function() {
  const rotationAroundSelf= 0.01;
  const rotationAroundSun= Math.PI/1200;
  const rotatoinAxis= new Vector3(0,0,1);
   sun.position=new Vector3(0,0,0);
  sun.rotation.y = sun.rotation.y + 0.01;

  mercury.rotateAround(sun.position,rotatoinAxis, rotationAroundSun*8.87);
  mercury.rotation.y+=rotationAroundSelf*1.74*scene.deltaTime; 
  console.log(mercury.rotate)
   venus.rotateAround(sun.position,rotatoinAxis, rotationAroundSun* (-6.48));
   venus.rotation.y+= rotationAroundSelf*scene.deltaTime; 
  earth.rotateAround(sun.position,rotatoinAxis, rotationAroundSun* 5.51);
   earth.rotation.y+= rotationAroundSelf*242.15*scene.deltaTime; 
  
   mars.rotateAround(sun.position,rotatoinAxis, rotationAroundSun*4.46);
   mars.rotation.y+= rotationAroundSelf*133.2*scene.deltaTime; 
   jupiter.rotateAround(sun.position,rotatoinAxis, rotationAroundSun* 2.42);
   jupiter.rotation.y+= rotationAroundSelf* 7012.76*scene.deltaTime; 
   saturn.rotateAround(sun.position,rotatoinAxis, rotationAroundSun*1.79);
   saturn.rotation.y+= rotationAroundSelf*5667.69*scene.deltaTime; 
   uranus.rotateAround(sun.position,rotatoinAxis,rotationAroundSun*(-1.25));
   uranus.rotation.y+= rotationAroundSelf*2276*scene.deltaTime; 
   neptune.rotateAround(sun.position,rotatoinAxis, rotationAroundSun);
   neptune.rotation.y+= rotationAroundSelf*1495.23*scene.deltaTime; 

}

engine.runRenderLoop( function() {
    scene.render();
  })
