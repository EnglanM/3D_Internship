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
  Material,
  FreeCamera,
  PhysicsAggregate,
  PhysicsShapeType,
  HavokPlugin,
  AmmoJSPlugin,
  PhysicsImpostor,
  OimoJSPlugin,
  PhysicsJoint,
  CannonJSPlugin
} from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { Vector2, Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/loaders";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {Object} from "./Object";
import * as CANNON from "cannon";
​
​
​
export class BabylonScene {
  engine: Engine;
  scene: Scene| undefined;
  background: Mesh | null;
  cam: TouchCamera | undefined | null;
  cabinetArray : Boolean[][];
  shape:Object | undefined 
  enablePhysics: any;
  pickObject:any
  pickResult:any
  objectName:string | undefined
  arr: PhysicsImpostor[];
  constructor(readonly canvasElement: HTMLCanvasElement) {
    this.engine = new Engine(canvasElement, true, { deterministicLockstep: true, lockstepMaxSteps: 4 });
    // this.scene = null;
    this.arr=[];
    this.background = null;
    this.cam = null;
    this.cabinetArray = [[],[],[],[],[],[],[],[],[],[]];
    window.addEventListener("resize", () => {
      this.engine.resize();
      
    });
  }
​
  async run() {
    // entry point
    await this.setupScene();
    this.engine.runRenderLoop(() => {
      if (!this.scene) {
        // scene is not yet set up
        console.log('error, scene is not set up')
        return;
      }
      this.scene.render();
    });
  }
​
  setupScene =  () => { 
  
    this.engine.adaptToDeviceRatio = true;
    this.scene = new Scene(this.engine);
     this.setupEnvironment(); // setup bacground and chair in the scene
     this.scene.onKeyboardObservable.add((info) => {  // helper ui for 3d scene
      if (info.type === KeyboardEventTypes.KEYDOWN && info.event.key === "x") {
        this.scene!.debugLayer.show();
      }
      // else if( info.event.key === "w" ){
      //   this.moveraftup();
      // }
      // else if( info.event.key === "s" ){
      //   this.moveraftDownn();
      // }
    });
​
    this.scene?.enablePhysics(new Vector3(0,-10,0), new CannonJSPlugin(true,10,CANNON));
    this.setupLights(); // set up light positioning and corresponding propperties
    this.setupCamera();
    this.setupCabinet();
   
​
    this.scene.onPointerDown = () => {
        this.mousemovef();
        this.scene?.meshes.forEach(element => {
          if(element.physicsImpostor)
          this.arr.push(element.physicsImpostor);
      });
      console.log('len', this.arr)
      this.scene?.meshes.forEach(element => {
          if(element.physicsImpostor)
          element.physicsImpostor.registerOnPhysicsCollide(this.arr!, ()=>{
              element.physicsImpostor?.setMass(0)
          })
      });
        // this.moveraftDownn();
        // this.moveraftup();
    };
​
  }
​
  // moveraftDownn = () =>{
  //   if(!this.scene) return;
  //  const pickObject = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
 
  //    if(pickObject.pickedMesh?.name ==  "raft"){
  //     pickObject.pickedMesh.position = new Vector3(pickObject.pickedMesh.position.x,pickObject.pickedMesh.position.y - 1 ,pickObject.pickedMesh.position.z );
  //     this.shape = new Object( pickObject.pickedMesh?.name,this.scene!,this.pickResult.pickedMesh?.position!);
  //    }
  // }
​
  // moveraftup = () =>{
  //   if(!this.scene) return;
  //  const pickObject = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
 
  //    if(pickObject.pickedMesh?.name ==  "raft"){
  //     pickObject.pickedMesh.position = new Vector3(pickObject.pickedMesh.position.x,pickObject.pickedMesh.position.y +1 ,pickObject.pickedMesh.position.z )
  //    }
  // }
​
  mousemovef = () =>{
​
    if(!this.scene) return;
   this.pickObject = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
​
    if(this.pickObject.pickedMesh?.name == "box" || this.pickObject.pickedMesh?.name == "cuboid"
    || this.pickObject.pickedMesh?.name == "sphere"|| this.pickObject.pickedMesh?.name == "cylinder"
    || this.pickObject.pickedMesh?.name ==  "raft"){                         
      this.objectName! = this.pickObject.pickedMesh?.name; 
    }
       
    this.pickResult = this.scene?.pick(this.scene.pointerX, this.scene.pointerY);
     if (this.pickResult?.hit && this.pickResult.pickedMesh?.name == "cabinetUnit") {
​
      console.log(this.pickResult.pickedMesh.name)
      console.log( this.objectName)
     this.shape = new Object( this.objectName!,this.scene!,this.pickResult.pickedMesh?.position!)
​
    
​
    if(this.objectName == "raft"){
        if(this.checkIfFits(this.shape!)) {this.shape?.createMesh(); }}
        
 
    else if(this.checkIfFitsCylinder(this.shape!) && this.objectName == "cylinder"){ this.shape?.createMesh();}   
​
    else if(this.objectName == "box"
      || this.objectName == "cuboid"
      || this.objectName== "sphere"){ 
        if(this.checkIfFits(this.shape!)) {this.shape?.createMesh();}}        
    }		
​
  }
​
  setupCamera = () => {
    if (!this.scene) {
      // console.log('error, scene is not set up')
      return;
    }
    const camera = new FreeCamera("camera1", new Vector3(5,12,-35), this.scene);
    camera.rotation = new Vector3(0, 0, 0);
    camera.detachControl();
  };
​
  setupEnvironment =  () => {
    if (!this.scene) {
      // console.log('error, scene is not set up')
      return;
    }
​
  };
​
  setupLights =  () => {
    if (!this.scene) {
      // console.log('Scene is not setup')
      return;
    }
​
    const light = new DirectionalLight("SunLight", new Vector3(0, 1, 1), this.scene);
    light.diffuse = new Color3(1, 1, 1);
    light.intensity = 1;
​
  };
​
  setupCabinet= ()=> {
​
    // const cabinet = MeshBuilder.CreatePlane("cabinet",{width:10,height:15});
    // cabinet.position = new Vector3(4.5,7,0);
 let groundMaterial = new StandardMaterial("Ground Material", this.scene);
   groundMaterial.diffuseColor = Color3.Red();
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 25; y++) {
        const cabinetUnit = MeshBuilder.CreatePlane("cabinetUnit",{ width:1, height: 1 });
        cabinetUnit.position = new Vector3(x,y,1);
        cabinetUnit.material = groundMaterial;
        cabinetUnit.physicsImpostor = new PhysicsImpostor(cabinetUnit,PhysicsImpostor.BoxImpostor,{mass:0,restitution:0})
        this.cabinetArray[x][y] = true;   }}
​
        for (let x = 0; x < 10; x++) {    
            const cabinetUnit1 = MeshBuilder.CreatePlane("cabinetUnit",{ width:1, height: 1 });
            cabinetUnit1.position = new Vector3(x,-1,0);
            cabinetUnit1.material = groundMaterial;
    }
      
    
    const leftSide = MeshBuilder.CreateBox("lestSide",{ width:1, height:26,depth:3})
    leftSide.position = new Vector3(-1,11.5,0)
    leftSide.physicsImpostor = new PhysicsImpostor(leftSide,PhysicsImpostor.BoxImpostor,{mass:0,restitution:0})
    const rightSide = MeshBuilder.CreateBox("rightSide",{ width:1, height:26,depth:3})
    rightSide.position = new Vector3(10,11.5,0)
    rightSide.physicsImpostor = new PhysicsImpostor(rightSide,PhysicsImpostor.BoxImpostor,{mass:0,restitution:0})
    const bottom = MeshBuilder.CreateBox("bottom",{ width:10, height:1,depth:3})
    bottom.position = new Vector3(4.5,-1,0)
    bottom.physicsImpostor = new PhysicsImpostor(bottom,PhysicsImpostor.BoxImpostor,{mass:0,restitution:0})
    const up = MeshBuilder.CreateBox("bottom",{ width:10, height:1,depth:3})
    up.position = new Vector3(4.5,24,0)
    up.physicsImpostor = new PhysicsImpostor(up,PhysicsImpostor.BoxImpostor,{mass:0,restitution:0})
    
    // const ground = MeshBuilder.CreatePlane("ground",{ width:10, height:24})
    // ground.position = new Vector3(4.5,12,-3)
    // groundMaterial = new StandardMaterial("groundMaterial",this.scene);
    // groundMaterial.diffuseColor = new Color3(256,256,256);
    // groundMaterial.alpha = 0.3;
    // ground.material = groundMaterial;
    // ground.material.alpha
    // ground.physicsImpostor = new PhysicsImpostor(ground,PhysicsImpostor.BoxImpostor,{mass:0,restitution:0})
​
​
   let sphere = MeshBuilder.CreateSphere("sphere",{ diameter:2});
   sphere.position = new Vector3(13,11,0);
   const box = MeshBuilder.CreateBox("box",{ width:3, height: 3,depth: 2});
   box.position = new Vector3(17,11,0);
   const cuboid = MeshBuilder.CreateBox("cuboid",{ width:4, height: 2,depth: 2});
   cuboid.position = new Vector3(18,5,0);
   const   cylinder = MeshBuilder.CreateCylinder("cylinder",{ diameterTop:1,diameterBottom:1, height: 5 });
   cylinder.position = new Vector3(13,5,0);
   const raft = MeshBuilder.CreateBox("raft",{ width:10, height: 1,depth:3});
   raft.position = new Vector3(-8,3,-0.1);
   let raftMaterial = new StandardMaterial("raftMaterial",this.scene!);
   raftMaterial.diffuseTexture = new Texture("textures.material.jpg");
   raft.material = raftMaterial;
  
      }
​
      checkIfFits(obj:Object):boolean{
        let tabledata = obj.tableData();
        let flag = true;
​
        for (let j = 0; j < tabledata.length; j++) {
       console.log((this.cabinetArray[tabledata[j].x][tabledata[j].y]))
          if(!(this.cabinetArray[tabledata[j].x][tabledata[j].y])){ flag = false;}
          } 
        if(flag){
          for (let j = 0; j < tabledata.length; j++) {
           this.cabinetArray[tabledata[j].x][tabledata[j].y] = false
            }
             console.log(this.cabinetArray)
          }
       console.log(flag );
        return flag
        }
​
        checkIfFitsCylinder(obj:Object):boolean{
          let tabledata = obj.tableData();
          let flag = true;
  
          for (let j = 0; j < tabledata.length; j++) {
            if(!(this.cabinetArray[tabledata[j].x][tabledata[j].y])){ flag = false;}
            } 
            console.log(flag  &&  this.cabinetArray[tabledata[0].x][tabledata[0].y + 1] == false  );
          if(flag  &&  this.cabinetArray[tabledata[0].x][tabledata[0].y + 1] == false && obj.name == "raft"){
            for (let j = 0; j < tabledata.length; j++) {
             this.cabinetArray[tabledata[j].x][tabledata[j].y] = false
              }
            }
            else if(!(flag  &&  this.cabinetArray[tabledata[0].x][tabledata[0].y + 1] == false)){flag = false;}
         console.log(flag );
          return flag
          }
      }
      
​
​
    
​
        
​
​
​
  
      
​