import{ Camera,
     Engine,
      Mesh, 
      Scene,
    Vector3,
    HemisphericLight,
    FreeCamera,
    StandardMaterial,
    Texture,
    PickingInfo,
    CannonJSPlugin,
    PhysicsImpostor
 } from '@babylonjs/core'
import { KeyboardEventTypes, MeshBuilder } from '@babylonjs/core';
import { Inspector } from '@babylonjs/inspector';
import { Shape } from './Shape';
import { Shelf } from './Shelf';
import * as CANNON from "cannon";


export class Wardrobe {
    engine:Engine;
    scene: Scene|undefined;
    camera:Camera|undefined|null;
    backgroud:Mesh|null;
    shape:Shape|null;
    container:Map<number,boolean>|null;
    arr: Shape[];
    nrOfMeshes:number;
    shapeName:string|null;
    shelf1:Shelf;
    shelf2:Shelf;
    shelf3:Shelf;
    down: Mesh|null;
    private isCreated:boolean;//check is an object is created
    

    constructor(canvas:HTMLCanvasElement) {
        this.engine= new Engine(canvas,true,{deterministicLockstep:true, lockstepMaxSteps:4});
        this.scene=undefined;
        this.backgroud=null;
        this.shape=null;
        this.isCreated=false;
        this.container=null;
        this.arr=[];
        this.nrOfMeshes=0;
        this.shapeName=null;
        this.down=null;
        this.shelf1=new Shelf("shelf1");
        this.shelf2=new Shelf("shelf2");
        this.shelf3=new Shelf("shelf3");

        window.addEventListener('resize', ()=>{
            this.engine.resize();
        });
    }

    async run() {
        await this.setUpScene();
        this.engine.runRenderLoop(()=> {
            if(!this.scene){
            console.log("Error, the scene is not set up yet!!!");
            return;
        }
        this.scene.render();
        });
    }
//here we will set up the scene elements
    setUpScene= async()=> {
        this.engine.adaptToDeviceRatio=true;
        this.scene= new Scene(this.engine);
        this.scene.enablePhysics(new Vector3(0,-9.8,0),new CannonJSPlugin(true, 10, CANNON));
        this.setUpCamera();
        this.setUpBackground();
        this.createContainer();
        
        

        ///////////////////

        this.scene.onPointerDown= (event,pickInfo)=>{
            console.log("x and y: "+pickInfo.pickedPoint?.x!+" | "+pickInfo.pickedPoint?.y!);
            console.log("name: "+pickInfo.pickedMesh?.name!);
            let x= this.xApproximator(pickInfo.pickedPoint?.x!)!;
            let y= this.yApproximator(pickInfo.pickedPoint?.y!)!;

            if(!this.isCreated){
                this.findShapeName(pickInfo);
            }if(this.isCreated){
                if(pickInfo.pickedMesh?.name === "container" && this.checkIfEmpty(x,y)){
                    console.log("shapeName: "+this.shapeName);
                    //check if we created a shelf
                    if(this.shapeName==="shelf1" || this.shapeName==="shelf2" ||this.shapeName==="shelf3"){
                        this.shelfHandler(x,y);
                    }
                    //check if we created a shape
                    else{
                        this.createShape(x,y,this.shapeName!);

                        let physicsImpostorArray: PhysicsImpostor[]=[];
                        physicsImpostorArray.push(this.shelf1.mesh?.physicsImpostor!);
                            physicsImpostorArray.push(this.shelf2.mesh?.physicsImpostor!);
                            physicsImpostorArray.push(this.shelf3.mesh?.physicsImpostor!);
                            physicsImpostorArray.push(this.down?.physicsImpostor!);
                            this.arr.forEach((element)=>{  
                                if(element.mesh?.physicsImpostor){
                                    physicsImpostorArray.push(element.mesh.physicsImpostor);
                                }
                            })
                          

                    
                        this.arr.forEach((element)=>{
                            if(element.mesh?.physicsImpostor)
                            {
                                element.mesh.physicsImpostor.registerOnPhysicsCollide(physicsImpostorArray,(collider, collidedagainst)=>{

                                    if(collider.object.parent === collidedagainst.object){
                                    return;
                                }
                                if (collider.object.parent != null){
                                    return;
                                }
                                
                                else if(collidedagainst.object.parent.name === "reference"){
                                    const posX = collider.object.position.x - collidedagainst.object.position.x;
                                    const posY = collider.object.position.y - collidedagainst.object.position.y;
                                    collider.object.position =new Vector3(posX, posY, 0);
                                    collider.object.parent= collidedagainst.object;
                                    collider.object.parent.name;
                                    
                                   
                                }
                                else if(collidedagainst.object.parent.name === "shelf1" || collidedagainst.object.parent.name === "shelf2" || collidedagainst.object.parent.name === "shelf3"){
                                    // collidedagainst.object.parent.object.position.x
                                    let posX;
                                    let posY;
                                    if(collidedagainst.object.parent.name === "shelf1"){
                                     posX = collider.object.position.x - this.shelf1.mesh?.position.x!;
                                     posY = collider.object.position.y - this.shelf1.mesh?.position.y!;
                                    }else if(collidedagainst.object.parent.name === "shelf2"){
                                     posX = collider.object.position.x - this.shelf2.mesh?.position.x!;
                                     posY = collider.object.position.y - this.shelf2.mesh?.position.y!;
                                    }else if(collidedagainst.object.parent.name === "shelf3"){
                                     posX = collider.object.position.x - this.shelf3.mesh?.position.x!;
                                     posY = collider.object.position.y - this.shelf3.mesh?.position.y!;
                                    }
                                    
                                    collider.object.position =new Vector3(posX, posY, 0);
                                    collider.object.parent= collidedagainst.object.parent;

                                }
                                });
                            }
                        });


                       
                        
                    }
    
                }
            }
            
        }
        
        
        

      

        //setting up key observals
        this.scene.onKeyboardObservable.add((info)=> { 
            if(info.type===KeyboardEventTypes.KEYDOWN){
              switch(info.event.key){
                case "x":{
                    if(this.scene)
                    Inspector.Show(this.scene, {
                        embedMode: true
                      });
                  console.log("x is pressed");
                  break;
                }

                    default:
                }
            }

        })


        //end of setUpScene
    }
    //here we create a camera and light
    setUpCamera=()=> {
        if(!this.scene){
            console.log('scene has not been set up!')
            return;
        }
       
       this.camera= new FreeCamera('camera',new Vector3(3,9,-24),this.scene);
    this.camera.inputs.clear();
  
        const light= new HemisphericLight('hlight',new Vector3(0,1,0), this.scene);
        light.intensity= 1;
    }

    //set up background and container
    setUpBackground= ()=>{
        if(!this.scene){
            console.log("scene hasn't been setup");
            return;
        }
        this.backgroud= MeshBuilder.CreatePlane('background',{width:45.5,height:23},this.scene);
        this.backgroud.position=new Vector3(3,8.5,2);
        const material= new StandardMaterial('backgroundMaterial',this.scene);
        material.diffuseTexture=new Texture('./textures/wallColor3.jpg');
        this.backgroud.material=material;
        //set up container
        const container2= MeshBuilder.CreateBox('container',{width:6,height:19},this.scene);
        container2.position=new Vector3(3,9,1);
        const containerMaterial= new StandardMaterial('containerMaterial',this.scene);
        containerMaterial.diffuseTexture= new Texture('./textures/wardrobeTexture.jpg');
        container2.material=containerMaterial; 

        //create ground from physics
        const ground = MeshBuilder.CreateGround("ground",{width:40,height:40, },this.scene);
        ground.position= new Vector3(3,0, 5);
        ground.isVisible=false;
        ground.checkCollisions = true;
       ground.physicsImpostor= new PhysicsImpostor(ground,PhysicsImpostor.PlaneImpostor,{mass:0,restitution:0}, this.scene);
    //    ground.dispose();
        //create the boundries
        const borderMaterial= new StandardMaterial("borderMaterial", this.scene);
        const leftSide= MeshBuilder.CreateBox("leftSide",{width:0.5,height:18, depth:3},this.scene);
        leftSide.position= new Vector3(-0.25,9,0);
        borderMaterial.diffuseTexture= new Texture('./textures/borderTexture.jpg');
        leftSide.material= borderMaterial;
        // leftSide.isVisible=false;
        leftSide.physicsImpostor= new PhysicsImpostor(leftSide,PhysicsImpostor.BoxImpostor,{mass:0,restitution:0});

        const rightSide= MeshBuilder.CreateBox("rightSide",{width:0.5,height:18, depth:3},this.scene);
        rightSide.position= new Vector3(6.25,9,0);
        rightSide.material= borderMaterial;
        // leftSide.isVisible=false;
        rightSide.physicsImpostor= new PhysicsImpostor(rightSide,PhysicsImpostor.BoxImpostor,{mass:0,restitution:0});

        const up= MeshBuilder.CreateBox("up",{height:0.5, width:7, depth:3},this.scene);
        up.position= new Vector3(3,18.25,0);
        up.material= borderMaterial;
        up.physicsImpostor=  new PhysicsImpostor(up,PhysicsImpostor.BoxImpostor,{mass:0,restitution:0});

        this.down= MeshBuilder.CreateBox("down",{height:0.5, width:7, depth:3},this.scene);
        this.down.position= new Vector3(3,-0.25,0);
        this.down.material= borderMaterial;
        this.down.physicsImpostor=  new PhysicsImpostor(this.down,PhysicsImpostor.BoxImpostor,{mass:0,restitution:0});

        //create 3 shelfs
        this.shelf1.create(14,14);
        this.shelf2.create(14,12);
        this.shelf3.create(14,10);
        // this.arr.push(this.shelf1);
        // this.arr.push(this.shelf2);
        // this.arr.push(this.shelf3);

       
      
        //creating object's demos
        const box= MeshBuilder.CreateBox('box',{size:2},this.scene);
       box.position= new Vector3(10,1,0);
        const boxMaterial= new StandardMaterial('boxMaterial',this.scene);
        boxMaterial.diffuseTexture=new Texture('./textures/clothTexture1.jpg');
       box.material=boxMaterial;
       
        const rectangle= MeshBuilder.CreateBox('rectangle',{width:4,height:1},this.scene);
        rectangle.position= new Vector3(14,0.5,0);
        const rectangleMaterial= new StandardMaterial('rectangleMaterial',this.scene);
        rectangleMaterial.diffuseTexture=new Texture('./textures/clothTexture2 .jpg');
        rectangle.material=rectangleMaterial;
        
        const rectangle2= MeshBuilder.CreateBox('rectangle2', {width:4, height:6}, this.scene);
        rectangle2.position= new Vector3(19, 3,0);
        const rectangle2Material= new StandardMaterial('rectangle2Material',this.scene);
        rectangle2Material.diffuseTexture=new Texture('./textures/clothTexture3.jpg');
        rectangle2.material=rectangle2Material;
        ////////////////////
        this.backgroud.isPickable = true;

        const referenceShape= MeshBuilder.CreateBox("reference",{size:0.5});
        referenceShape.position= Vector3.Zero();
        referenceShape.isVisible=false;
        referenceShape.isPickable=false;
        //giving each point of collision a reference to a small point, in order to check using the name of the parent, which in this case is referenceShape
        if(this.shelf1.mesh &&this.shelf2.mesh &&this.shelf3.mesh){
            this.shelf1.mesh.parent=referenceShape;
            this.shelf2.mesh.parent=referenceShape;
            this.shelf3.mesh.parent=referenceShape;
            this.down.parent=referenceShape;

       }
    }
   private createShape= (x:number, y:number,name:string)=>{

        this.shape= new Shape(name, this.nrOfMeshes);
        this.shape.create(x,y);
        this.nrOfMeshes++;
        this.isCreated= false;
        //save every shape created into our array
        this.arr.push(this.shape);
        this.shapeName=null;
        
    }

    private findShapeName=(pickInfo:PickingInfo)=>{
        if(pickInfo.pickedMesh?.name === "box"){
            this.shapeName="box";
            this.isCreated=true;
        }else if(pickInfo.pickedMesh?.name === "rectangle"){
            this.shapeName="rectangle";
            this.isCreated=true;
        }else if(pickInfo.pickedMesh?.name === "rectangle2"){
            this.shapeName="rectangle2";
            this.isCreated=true;
        }
        else if(pickInfo.pickedMesh?.name === "shelf1" || pickInfo.pickedMesh?.name === "shelf2"|| pickInfo.pickedMesh?.name === "shelf3"){
            this.shapeName=pickInfo.pickedMesh?.name;
            console.log("inside else if name: "+this.shapeName);
            this.isCreated= true;
            
        }
       
    }

    //approximator for x and y positions
    private xApproximator=(x:number)=>{
         let fullPart=Math.floor(x);
         let fullPart2= Math.trunc(x)
         let fullPart3=Math.round(x);

        if(this.shapeName=== "box"){
            if(fullPart+1 >=6)
            {
                fullPart=5;
                return fullPart;
    
            }
            else if(fullPart-1<=0){
                fullPart=1;
                return fullPart;
            }
            else{
                return fullPart3;
            }
        }
        else if(this.shapeName=== "rectangle"){
            if(fullPart+2 >=6)
            {
                fullPart=4;
                return fullPart;
    
            }
            else if(fullPart-2<=0){
                fullPart=2;
                return fullPart;
            }
            else{
                return fullPart3;
            }
        }
        else if(this.shapeName=== "rectangle2"){
            if(fullPart+2 >=6)
            {
                fullPart=4;
                return fullPart;
    
            }
            else if(fullPart-2<=0){
                fullPart=2;
                return fullPart;
            }
            else{
                return fullPart3;
            }
        }
        else if(this.shapeName=== "shelf1" || this.shapeName=== "shelf2" || this.shapeName=== "shelf3"){
            return 3;
        }
        return x;
        }

    private yApproximator=(y:number)=>{
        let fullPart=Math.floor(y);
        let fullPart2= Math.trunc(y);
        let fullPart3=Math.round(y);

        if(this.shapeName==="box"){
            if(fullPart+1 >=18)
            {
                fullPart=17;
                return fullPart;
            }else if(fullPart-1<=0){
                fullPart=1;
                return fullPart;
            }
            else{
                return fullPart3;
            }

        }
        else if(this.shapeName === "rectangle"){
            if(fullPart+0.5 >=18)
            {
                fullPart=17.5;
                return fullPart;
            }else if(fullPart-0.5<=0){
                fullPart=0.5;
                return fullPart;
            }
            else{
                return fullPart2+0.5;
            }
        }
        else if(this.shapeName === "rectangle2"){
            if(fullPart+3 >=18)
            {
                fullPart=15;
                return fullPart;
            }else if(fullPart-3<=0){
                fullPart=3;
                return fullPart;
            }
            else{
                return fullPart3;
            }
        }
        else if(this.shapeName === "shelf1" || this.shapeName === "shelf2" || this.shapeName === "shelf3" ){
           return fullPart2+0.5;
        }
        return y;
       
    }

    //function to create a key out of a vector3
   private HashableInt=(vector:Vector3)=>
{
	let x = Math.round(vector.x);
	let y = Math.round(vector.y);
	let z = Math.round(vector.z);
	return x * 1000 + z + y * 1000000;
}
    //create the map
    createContainer=()=>{
        this.container= new Map<number,boolean>;
        for(let y=0;y<18;y++){
            for(let x=0;x<6;x++){
                let key= this.HashableInt(new Vector3(x+0.5,y+0.5,0));
                const containerUnit= MeshBuilder.CreatePlane(`containerUnit${x}|${y}`,{height:1,width:1})
                containerUnit.position=new Vector3(x+0.5,y+0.5,2);
                containerUnit.isVisible=false;
                containerUnit.physicsImpostor= new PhysicsImpostor(containerUnit,PhysicsImpostor.BoxImpostor,{mass:0,restitution:0});
                this.container.set(key,true);                
            }
        }

    }
    //funciton to check if those elements in map are empty
    private checkIfEmpty=(x:number,y:number)=>{
        let positions: Vector3[];
        switch(this.shapeName){
            case "box":{
                positions= Shape.positions(x,y, this.shapeName)!;
                break;
            }
            case "rectangle": {
                positions= Shape.positions(x,y, this.shapeName)!;
                break;
            }
            case "rectangle2": {
                positions= Shape.positions(x,y, this.shapeName)!;
                break;
            }
            default:
                positions=[];
        }
        //now that we got the vector with the positions 
        //we want to check, lets check if they are all empty

        for(let i=0;i<positions.length;i++){
            let key= this.HashableInt(positions[i]);
            console.log(this.container?.get(key));
            if(this.container?.get(key) === false){
                return false;
            }
        }
        return true;
    }

    private shelfHandler(x:number, y:number){
        switch(this.shapeName){
            case "shelf1" :{
              this.nrOfMeshes++;
              this.isCreated= false;
              this.shapeName=null;
              if(y<this.shelf2.mesh?.position.y!-1 && y<this.shelf3.mesh?.position.y!){
                 this.shelf1.freeUpSpace(this.container);
                let meshes= this.shelf1.mesh?.getChildMeshes();
                //set mass to 0 for all
                meshes?.forEach((element)=>{
                    if(element.physicsImpostor){
                        element.physicsImpostor.setMass(0);
                        console.log("name of element before moving: "+element);
                        console.log("mass right before moving: "+element.physicsImpostor.getParam("mass"));
                    }
                });

                 this.shelf1.move(x,y);
                 //set mass to 1 for all
                //  meshes?.forEach((element)=>{
                //     if(element.physicsImpostor){
                //         element.physicsImpostor.setMass(1);
                //         console.log("mass right before moving: "+element.physicsImpostor.getParam("mass"));
                //     }
                // });
                 this.shelf1.takeSpace(this.container,y);
                 for(let y=0;y<18;y++){
                    for(let x=0;x<6;x++){
                        let key= this.HashableInt(new Vector3(x+0.5,y+0.5,0));
                       console.log("value of container: "+this.container?.get(key)) ;                
                    }
                }
              }
             break;
       
            }
            case "shelf2" :{
            console.log("shelf2 name is: "+this.shapeName);
              this.nrOfMeshes++;
              this.isCreated= false;
              this.shapeName=null;
              if(y>this.shelf1.mesh?.position.y!+1.5 && y<this.shelf3.mesh?.position.y!){
                 this.shelf2.freeUpSpace(this.container);
                 let meshes= this.shelf2.mesh?.getChildMeshes();
                //set mass to 0 for all
                meshes?.forEach((element)=>{
                    if(element.physicsImpostor){
                        element.physicsImpostor.setMass(0);
                        console.log("name of element before moving: "+element);
                        console.log("mass right before moving: "+element.physicsImpostor.getParam("mass"));
                    }
                });
                 this.shelf2.move(x,y);
                 this.shelf2.takeSpace(this.container,y);
              }
              
              break;
                
            }
            case "shelf3" :{
             this.nrOfMeshes++;
             this.isCreated= false;
             this.shapeName=null;
             if(y>this.shelf2.mesh?.position.y!+1.5 && y> this.shelf1.mesh?.position.y!){
                this.shelf3.freeUpSpace(this.container);
                let meshes= this.shelf3.mesh?.getChildMeshes();
                //set mass to 0 for all
                meshes?.forEach((element)=>{
                    if(element.physicsImpostor){
                        element.physicsImpostor.setMass(0);
                        console.log("name of element before moving: "+element);
                        console.log("mass right before moving: "+element.physicsImpostor.getParam("mass"));
                    }
                });
                 this.shelf3.move(x,y);
                 this.shelf3.takeSpace(this.container,y);
             }
             
             break;
            }
            default:
                break;
        }

    }

    




    






    //end of the class

}