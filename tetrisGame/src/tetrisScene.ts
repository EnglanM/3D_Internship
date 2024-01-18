import {
    MeshBuilder,
    Texture,
    StandardMaterial,
    Engine,
    SceneLoader,
    TouchCamera,
    SpotLight,
    Mesh,
    DirectionalLight,
    KeyboardEventTypes,
    Vector3,
    Material
  } from "@babylonjs/core";
  import { Scene } from "@babylonjs/core/scene";
  import "@babylonjs/loaders"; // Import loaders
  import "@babylonjs/core/Debug/debugLayer"; // Import debug layer for debugging
  import "@babylonjs/inspector"; // Import inspector for inspecting scene
import { ArcRotateCamera, Camera } from "@babylonjs/core";
import { GridMaterial } from "babylonjs-materials";
import { Rectangle } from "./Rectangle";
import { T } from "./T";
import { L } from "./L";
import { Square } from "./Square";

  export class tetrisScene {
    engine: Engine;
    scene: Scene|undefined;
    cam: Camera|null;
    container: Mesh|null;
    shape:Square|Rectangle|T|L|null;
    matrix: Map<number, boolean>;
    private reachedBottom:boolean//flag to control reached bottom
    private gameOver:boolean//check if we have surpassed the top
    

    constructor(readonly canvas:HTMLCanvasElement) {
      this.engine= new Engine(canvas, true, {deterministicLockstep:true, lockstepMaxSteps:4});
      this.scene=undefined;
      this.cam=null;
      this.container=null;
      this.shape=null;
      this.matrix=new Map<number,boolean>;
      this.reachedBottom=false;
      this.gameOver=false;

      window.addEventListener('resize',() => {
        this.engine.resize;
      })
    }
    //function to render the scene
    async run() {
    if (!this.gameOver) {
        await this.setupScene();
        this.engine.runRenderLoop(() => {
            if (!this.scene) {
                console.log("there is an error");
                return;
            }
            if (!this.gameOver) {
                this.scene.render();
            } else {
                // Handle game over state, e.g., display a game over screen
                // You can also clean up resources or perform other actions
            }
        });
    } else {
        // Handle game over state, e.g., display a game over screen
        // You can also clean up resources or perform other actions
    }
}


    setupScene = async () => {
      this.scene = new Scene(this.engine); // Create a new scene
  
      this.scene.createDefaultLight();
      const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 25,new Vector3(0,0,0));
      camera.attachControl(this.canvas,true);
      this.createBackground();
      this.buildMatrix();
      //now we will create the shapes and continue untill the game ends
      
        this.createShapes();
     
     

    let shouldFall = false; // Flag to control falling
    // Set an interval to control falling every 1 second
    setInterval(() => {
    shouldFall = true; }, 500);

    this.scene?.onBeforeRenderObservable.add( async()=> {
      
      if(shouldFall){
          this.moveDown();
        }
          shouldFall=false;
        })
//or we can set the interval in this way
        // window.setInterval(()=>{
        //   this.moveDown()
        // }, 500)
    //create new shapes when they reach the bottom
   this.scene.onBeforeRenderObservable.add(()=> {
    
    if(this.reachedBottom){
      this.createShapes();
      this.reachedBottom=false;
    }
    if(this.shape?.positionY()! <= -8.48 || !this.checkerLeftAndRight(0,-1)){
      this.reachedBottom=true;

      //change the state of the box that we landed
      let vector1:Vector3= new Vector3(this.shape?.plane1?.position.x,this.shape?.plane1?.position.y,0);
      let vector2:Vector3 = new Vector3(this.shape?.plane2?.position.x,this.shape?.plane2?.position.y,0);
      let vector3:Vector3 = new Vector3(this.shape?.plane3?.position.x,this.shape?.plane3?.position.y,0);
      let vector4:Vector3= new Vector3(this.shape?.plane4?.position.x,this.shape?.plane4?.position.y,0);
      let key1= this.HashableInt(vector1);
      let key2= this.HashableInt(vector2);
      let key3= this.HashableInt(vector3);
      let key4= this.HashableInt(vector4);
      
      
      this.matrix.set(key1,false);
      this.matrix.set(key2,false);
      this.matrix.set(key3,false);
      this.matrix.set(key4,false);

      this.gameOver=this.checkGameOver(vector1,vector2,vector3,vector4);
      console.log("gameOver outside if: "+this.gameOver);
      if(this.gameOver==true){
        console.log("gameOver inside if: "+this.gameOver);
        console.log('gameOver');
        
      }
    }
   })

    //////////////////////
    if(this.scene)
    this.scene.onKeyboardObservable.add((info)=> { 
      if(info.type===KeyboardEventTypes.KEYDOWN){
        switch(info.event.key){
          case "x":{
            this.scene?.debugLayer.show();
            break;
          }
          case "a":{
            if(this.checkerLeftAndRight(-1,0) && (this.shape?.minPositionX()!-1 >-4)){
              this.shape?.moveToLeft();
            break;
            }else{
              console.log("can't move to left");
              break;
            }
            
          }
          case "d":{
            if(this.checkerLeftAndRight(+1,0) && (this.shape?.maxPosiitonx()!+1 < 4)){
              this.shape?.moveToRight();
            break;
            }else{
              console.log("can't move to right");
              break;
            }
          }
          case "r":{
            if(this.shape?.maxPosiitonx()!+1 < 4 && this.shape?.minPositionX()!-1 >-4){
              this.shape?.rotateToRight();
            break;
            }else{
              console.log("Cant rotate!");
            }
            
          }
          case "l": {if(this.shape?.maxPosiitonx()!+1 < 4 && this.shape?.minPositionX()!-1 >-4){
            this.shape?.rotateToLeft();
          break;
          }else{
            console.log("Cant rotate!");
          }
          }
          default:
        }
      }
    })
    ////////////////////////
   
      

    };

    createBackground= ()=> {

      //here we create a background and the container
      const background = MeshBuilder.CreatePlane("background", { width:46, height:22,sideOrientation:Mesh.DOUBLESIDE }, this.scene);
      background.position=new Vector3(0,0,1);
      const backgroundMaterial= new StandardMaterial('backgroundMaterial',this.scene);
      backgroundMaterial.diffuseTexture= new Texture('./textures/background.jpg');
      background.material= backgroundMaterial;
      const grid= new GridMaterial('gridMaterial', this.scene);
      this.container= MeshBuilder.CreatePlane('container', {width:8, height:12}, this.scene);
      this.container.material= grid as unknown as Material;
      this.container.position.x= 0;
      this.container.position.y=-3;
      grid.majorUnitFrequency=0;

      //here we create a point where po span the shapes
      const cone = MeshBuilder.CreateCylinder("cone", {diameterTop: 0, diameterBottom:5});
      cone.position= new Vector3(0,9,0);
      const coneMaterial= new StandardMaterial('coneMaterial', this.scene);
      coneMaterial.diffuseTexture= new Texture('./textures/coneTexture.jpg');
      cone.material= coneMaterial;

}
createShapes= ()=> {
  let number=0;

  this.choseRandomly(number);
  this.shape?.create();
}

//function take 4 positions, for each space in matrix and compares them with the 4 planes of the shape
  //return true if they are all empty
checkerLeftAndRight= (x:number, y:number):boolean=> {
  let plane1X=this.shape?.plane1?.position.x!;
  let plane1Y= this.shape?.plane1?.position.y!;
  let plane2X=this.shape?.plane2?.position.x!;
  let plane2Y= this.shape?.plane2?.position.y!;
  let plane3X=this.shape?.plane3?.position.x!;
  let plane3Y= this.shape?.plane3?.position.y!;
  let plane4X=this.shape?.plane4?.position.x!;
  let plane4Y= this.shape?.plane4?.position.y!;

  let position1= new Vector3(plane1X+x,plane1Y+y,0);
  let position2= new Vector3(plane2X+x,plane2Y+y,0);
  let position3= new Vector3(plane3X+x,plane3Y+y,0);
  let position4= new Vector3(plane4X+x,plane4Y+y,0);

 

  let key1= this.HashableInt(position1);
  let key2= this.HashableInt(position2);
  let key3= this.HashableInt(position3);
  let key4= this.HashableInt(position4);



  if(this.matrix.get(key1)==false || this.matrix.get(key2)==false || this.matrix.get(key3)==false || this.matrix.get(key4)==false) {
    return false;//has and object on the sidesaaa
  }
  return true;//has no obsticle on the sides

}

private moveDown=()=> {
  if(this.shape?.positionY()! > -8.48){
    this.shape?.moveDown(1);
  }
}


private choseRandomly= (nr:number)=> {
  
  let number= Math.floor(Math.random()*4)+1;
  switch(number) {
    case 1:{
      this.shape=new Square(nr) ;
      break;
    }
    case 2:{
      this.shape=new Rectangle(nr);
      break;
    }
    case 3:{
      this.shape=new T(nr);
      break;
    }
    case 4:{
      this.shape=new L(nr);
      break;
    }
    default:
  }

}
//build the matrix
buildMatrix= ()=> {
  for(let y=-9;y<3;y++){
    for(let x=-4;x<4;x++){
      let vector= new Vector3(x+0.5,y+0.5,0);
      let key= this.HashableInt(vector);
      let isEmpty=true;
      this.matrix.set(key,isEmpty);
    }

    }
  }
  private HashableInt=(vector:Vector3)=>{
let  x = Math.round(vector.x);
let  y = Math.round(vector.y);
let  z = Math.round(vector.z);
	return (x * 1000 + z + y * 1000000);
}

private checkGameOver= (v1:Vector3,v2:Vector3,v3:Vector3,v4:Vector3):boolean=> {
  if(v1.y > 3 || v2.y > 3 || v3.y > 3 || v4.y > 3 ){
    return true;
  }
  return false;
}



//end of class
}