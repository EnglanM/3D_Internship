import {
MeshBuilder,
Engine,
Camera,
ArcRotateCamera,
Color3,
StandardMaterial,
Texture,
Mesh,
SceneLoader,
SpotLight,
KeyboardEventTypes,
CubeTexture,
Curve3,
DirectionalLight,
TouchCamera,
HemisphericLight
} from '@babylonjs/core';
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/loaders"; // Import loaders
import "@babylonjs/core/Debug/debugLayer"; // Import debug layer for debugging
import "@babylonjs/inspector"; // Import inspector for inspecting scene
import { HemisphericLightPropertyGridComponent } from '@babylonjs/inspector/components/actionTabs/tabs/propertyGrids/lights/hemisphericLightPropertyGridComponent';

export class SolarSystem {
   engine: Engine;
   scene:Scene|undefined;
   cam: ArcRotateCamera|null;
   sun:Mesh|null;
  mercury: Mesh|null;
  venus: Mesh|null;
  earth: Mesh|null;
  mars: Mesh|null;
  jupiter: Mesh|null;
  saturn: Mesh|null;
  uranus: Mesh|null;
  neptune: Mesh|null;
   
   
   //constructor 
   constructor(readonly canvasElement: HTMLCanvasElement) {
    //create a babylon engine
    this.engine= new Engine(canvasElement, true,{deterministicLockstep: true, lockstepMaxSteps: 4},true);
    this.scene=undefined;
    this.cam=null;
    this.sun=null;
    this.mercury=null;
    this.venus=null;
    this.earth=null;
    this.mars=null;
    this.jupiter=null;
    this.saturn=null;
    this.uranus=null;
    this.neptune=null;
    //resize eventlistener to handle the canvas when it is resized
    window.addEventListener('resize', () => {
        this.engine.resize();
    })
   }

   //setup the scene and start the rendering loop
    async run() {
        await this.setupScene();
        this.engine.runRenderLoop(() =>{
            if(!this.scene){
                console.log('Error, the scene is not set up');
                return;
            }
            this.scene.render();
        });
    };
  
    // Function to set up the Babylon.js scene
    // This is where we call all the elemnts of a scene, engine, meshes, camera, light, etc
    setupScene= async()=> {
        this.scene= new Scene(this.engine);//creating the engine
        this.scene.createDefaultLight();//creating a light
        const light=new HemisphericLight('hlight', new Vector3(0,1,0),this.scene);
        light.intensity= 2;
        
        this.setupCamera();//creating a camera
       this.setupSkybox();//
        this.setupEnvironment()
    }
  
    // Function to set up the camera
    setupCamera = () => {
        if(!this.scene){
            return
        }
        const camera= new ArcRotateCamera('camera',1.5,1.6,120,new Vector3(0,0,0),this.scene,true);
        camera.attachControl(this.canvasElement, true);

        this.scene.onKeyboardObservable.add((info) => {
            if (info.type === KeyboardEventTypes.KEYDOWN && info.event.key === "x") {
              this.scene!.debugLayer.show(); // Show the Babylon.js debug layer
            }
          });
    };

    //function to create skybox
    setupSkybox = () => {
        if (!this.scene) {
            return;
        }
    
        const skybox = MeshBuilder.CreateBox('skybox', { size: 2000 }, this.scene);
        const skyboxMaterial = new StandardMaterial('skyboxMaterial', this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
    
        // Log the texture path to verify it's correct
        console.log('Skybox Texture Path:', 'textures/skybox');
    
        skyboxMaterial.reflectionTexture = new Texture('./textures/skybox', this.scene);
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
    }
    
  
    // Function to set up the environment (background and chair)
    setupEnvironment =  () => {
        if(!this.scene){
            return
        }
        const distance=18;
        const sunSize=10;
       this.sun= this.createSun(sunSize);

       this.mercury= this.createPlanetsAndOrbit(distance*0.39, sunSize*0.2, 'mercury');
       this.venus= this.createPlanetsAndOrbit(distance*0.72, sunSize*0.3, 'venus');
       this.earth= this.createPlanetsAndOrbit(distance, sunSize*0.4, 'earth');
       this.mars= this.createPlanetsAndOrbit(distance*1.52, sunSize*0.25, 'mars');
       this.jupiter= this.createPlanetsAndOrbit(distance*5.2, sunSize*0.7, 'jupiter');
       this.saturn= this.createPlanetsAndOrbit(distance*9.54, sunSize*0.6, 'saturn');
       this.uranus= this.createPlanetsAndOrbit(distance*19.52, sunSize*0.45, 'uranus');
       this.neptune= this.createPlanetsAndOrbit(distance*30.06, sunSize*0.47, 'neptune');

    };
    //function to create the sun
    createSun= (sunSize:number):Mesh => {
    const sun2= MeshBuilder.CreateSphere('sun',{diameter: sunSize}, this.scene);
     sun2.position= new Vector3(0,0,0);
     const sunMaterial= new StandardMaterial('sunMaterial', this.scene);
     sunMaterial.diffuseTexture= new Texture('./textures/sun.png');
     sunMaterial.specularColor = new Color3(1, 1, 1);
     sun2.material=sunMaterial;
     return sun2;
    }

    //function to create planets and orbit
    createPlanetsAndOrbit= (distance:number, size:number, name:string):Mesh => {
       const planet= MeshBuilder.CreateSphere(name,{diameter:size},this.scene);
        planet.position= new Vector3(distance,0,0);
        const planetMaterial= new StandardMaterial(`${planet}Material`, this.scene);
        planetMaterial.diffuseTexture= new Texture(`./textures/${name}.jpg`);
       planet.material=planetMaterial;
        
        const orbit= Curve3.ArcThru3Points(new Vector3(distance,0,0), new Vector3(-(distance),0,0), new Vector3(0,distance,0),60, false, true);
        const orbitline= MeshBuilder.CreateLines('arc', {points: orbit.getPoints()});
        return planet;
    }

    // Function to load a 3D model (genie mesh) and position it
    loadDoctor = async () => {
     
    };
  }