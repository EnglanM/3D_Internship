import { AbstractMesh, ActionManager, ExecuteCodeAction, Mesh, MeshBuilder, PhysicsImpostor, Scene, StandardMaterial, Texture, Vector2 ,Vector3} from "@babylonjs/core";
​
export class Object extends Mesh{
    scene:Scene | undefined
    cabinetPosition:Vector3 | undefined 
    shapeData:Vector2[] | undefined;// where first element is center of object
    sphere = MeshBuilder.CreateSphere("sphere",{ diameter:2});
    box = MeshBuilder.CreateBox("box",{ width:3, height: 3,depth: 2});
    cuboid = MeshBuilder.CreateBox("cuboid",{ width:4, height: 2,depth: 2});
    cylinder = MeshBuilder.CreateCylinder("cylinder",{ diameterTop:1,diameterBottom:1, height: 5 });
    raft = MeshBuilder.CreateBox("raft",{ width:10, height: 1,depth:3});
//    raftMaterial :StandardMaterial;
   
    arr: PhysicsImpostor[];
​
    constructor(name:string,scene:Scene,cabinetPosition:Vector3){
        super(name);
        this.scene = scene;
        this.cabinetPosition = cabinetPosition;
        this.sphere.position = new Vector3(13,11,-0.1);
        
        this.box.position = new Vector3(17,11,-0.1);
        this.cuboid.position = new Vector3(18,5,-0.1);
        this.cylinder.position = new Vector3(13,5,-0.1);
        this.raft.position = new Vector3(-8,3,-0.1);
        let raftMaterial = new StandardMaterial("raftMaterial",this.scene!);
        raftMaterial.diffuseTexture = new Texture("textures.material.jpg");
        this.raft.material = raftMaterial;
        this.arr = [];
        this.createShape();
       
    }
     createShape(){
//  debugger
        switch (this.name) {
            case "sphere":
            this.shapeData=this.createSphere();
            break;
​
            case "box":
                this.shapeData=this.createBox();
            break;
​
            case "cuboid":
                this.shapeData=this.createCuboid();
                break;
​
            case "cylinder":
                this.shapeData=this.createCylinder();
                break;
            case "raft":
            this.shapeData=this.createRaft();
            break;
            default:
                break;
        }
   
    } 
    createRaft(): Vector2[]  {
        return [new Vector2(0,0),
            new Vector2(1,0),
             new Vector2(2,0),
             new Vector2(3,0),
             new Vector2(4,0),
             new Vector2(5,0),
             new Vector2(6,0),
             new Vector2(7,0),
             new Vector2(8,0),
             new Vector2(9,0)
         ]
        
    }
​
   createCylinder():Vector2[] {
        return [new Vector2(0,0),
           new Vector2(0,-1),
            new Vector2(0,-2),
            new Vector2(0,-3),
            new Vector2(0,-4),
            new Vector2(1,0),
           new Vector2(1,-1),
            new Vector2(1,-2),
            new Vector2(1,-3),
            new Vector2(1,-4)
        ]
    
    }
    createCuboid():Vector2[] {
        return [new Vector2(0,1),
            new Vector2(1,1),
             new Vector2(2,1),
             new Vector2(3,1),
             new Vector2(0,0), 
              new Vector2(1,0),
             new Vector2(2,0),
             new Vector2(3,0)
            
          
            ]
    }
    createBox():Vector2[]  {
        return [new Vector2(0,0),
             new Vector2(1,0),
              new Vector2(2,0),
               new Vector2(0,-1),
             new Vector2(1,-1), 
              new Vector2(2,-1),
             new Vector2(0,-2),
            new Vector2(1,-2),
             new Vector2(2,-2)
            ]
        
    }
    createSphere():Vector2[]  {
        return [new Vector2(0,0),
            new Vector2(0,-1),
             new Vector2(1,-1),
             new Vector2(1,0)
            ]
      
    }
    tableData():Vector3[]{
        let tableData:Vector3[] = [];
        // console.log(this.shapeData)
        for (let index = 0; index < this.shapeData!.length; index++) {
            tableData[index] = new Vector3(this.shapeData![index].x + this.cabinetPosition!.x,
                                          this.shapeData![index].y + this.cabinetPosition!.y,
                                            -0.1)}
                                            return tableData;
​
    }
    createMesh():Mesh |undefined{
        
        
        switch (this.name){
            case "sphere":
                // console.log(1)
                this.sphere.setAbsolutePosition(new Vector3(this.tableData()[0].x + 0.5,this.tableData()[0].y - 0.5,this.tableData()[0].z - 0.1)) ;
                this.scene?.enablePhysics(new Vector3(0,10,0));
                this.sphere.physicsImpostor = new PhysicsImpostor(this.sphere,PhysicsImpostor.SphereImpostor,{mass:10,restitution:0});
               
                //this.sphere.physicsImpostor.registerOnPhysicsCollide(this.arr!, ()=>{debugger})
              
                // this.scene?.registerBeforeRender(()=>{
​
                //     this.sphere.physicsImpostor?.coll
​
                //     if(this.sphere!.physicsImpostor == null){return  } 
                //     //  console.log("1",this.sphere.intersectsMesh(this.raft))
                //     console.log(this.sphere, this.raft)
​
                // if(this.sphere.intersectsMesh(this.raft,true)){
                //     debugger
                //     // console.log(this.sphere, this.raft)
                //     this.sphere.physicsImpostor.setMass(0);
              
                //     }
                // })
​
         
​
                return this.sphere
            case "box":
               
            this.box.position = new Vector3(this.tableData()[0].x + 0.5,this.tableData()[0].y - 1,this.tableData()[0].z - 0.1);
            this.scene?.enablePhysics(new Vector3(0,10,0));
            this.box.physicsImpostor = new PhysicsImpostor(this.box,PhysicsImpostor.BoxImpostor,{mass:10,restitution:0});
                return this.box
       
​
            case "cuboid":
                
            this.cuboid.position = new Vector3(this.tableData()[0].x + 1.5,this.tableData()[0].y - 1.5,this.tableData()[0].z - 0.1);
            this.scene?.enablePhysics(new Vector3(0,10,0));
            this.cuboid.physicsImpostor = new PhysicsImpostor(this.cuboid,PhysicsImpostor.BoxImpostor,{mass:10,restitution:0})
                return this.cuboid
             
​
            case "cylinder":
                
            this.cylinder.position = new Vector3(this.tableData()[0].x,this.tableData()[0].y - 1.5,this.tableData()[0].z - 0.1);
            this.scene?.enablePhysics(new Vector3(0,10,0));
            this.cylinder.physicsImpostor = new PhysicsImpostor(this.cylinder,PhysicsImpostor.CylinderImpostor,{mass:0,restitution:0})
                return this.cylinder
              
​
            case "raft":
            this.raft = MeshBuilder.CreateBox("raft",{ width:10, height: 1,depth:3});
            this.raft.position = new Vector3(this.tableData()[0].x + 4.5,this.tableData()[0].y ,this.tableData()[0].z-0.1 );
            const raftMaterial = new StandardMaterial("raftMaterial",this.scene!);
            raftMaterial.diffuseTexture = new Texture("textures.material.jpg");
            this.raft.material = raftMaterial;
            this.raft.physicsImpostor = new PhysicsImpostor(this.raft,PhysicsImpostor.BoxImpostor,{mass: 0,restitution:0})
            console.log(this.arr)
            console.log(this.raft.physicsImpostor)
            this.arr.push(this.raft.physicsImpostor);
            console.log(this.arr)
            return this.raft
          
            default:
                break;
        }
​
    }
​
    DetectTrigger():void{
            }
​
    
}