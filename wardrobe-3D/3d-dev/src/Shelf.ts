import { MeshBuilder, StandardMaterial, Texture, Vector3,PhysicsImpostor, Mesh } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { Shape } from './Shape';

export class Shelf extends Shape{
    mesh:Mesh|null;
    name:string;

    constructor(name:string){
        super(name,1);
        this.mesh=null;
        this.name=name;
    }

    create=(x:number,y:number)=> {
        const box= MeshBuilder.CreateBox(this.name,{width:6,height:1, depth:2}); 
        box.position=new Vector3(x,y,0);
        const boxMaterial= new StandardMaterial(`shelfMaterial`);
        boxMaterial.diffuseTexture=new Texture('./textures/borderTexture.jpg');
        box.material= boxMaterial;
        box.physicsImpostor= new PhysicsImpostor(box,PhysicsImpostor.BoxImpostor,{mass:0,restitution:0});
        this.mesh=box;
        box.checkCollisions=true;
    }
    move=(x:number,y:number)=>{
        if(this.mesh){
            this.mesh.position=this.position(x,y);
        }
       
    }

    freeUpSpace=(container:Map<number,boolean>|null)=>{
      
        if(this.mesh?.position.x===3){
            let y=this.mesh?.position.y;
        let key1=this.HashableInt(new Vector3(0.5,this.mesh?.position.y,0));
        let key2=this.HashableInt(new Vector3(1.5,this.mesh?.position.y,0));
        let key3=this.HashableInt(new Vector3(2.5,this.mesh?.position.y,0));
        let key4=this.HashableInt(new Vector3(3.5,this.mesh?.position.y,0));
        let key5=this.HashableInt(new Vector3(4.5,this.mesh?.position.y,0));
        let key6=this.HashableInt(new Vector3(5.5,this.mesh?.position.y,0));
        container?.set(key1,true);
        container?.set(key2,true);
        container?.set(key3,true);
        container?.set(key4,true);
        container?.set(key5,true);
        container?.set(key6,true);



        let children= this.mesh?.getChildMeshes();
        children?.forEach((element)=>{
            if(element.name.includes("box")){
                this.box2(element.position, container);
            }
            else if(element.name.includes("rectangle")){
                this.rectangle2(element.position, container);
            }
           
           
        });
        }
        

        // for(let y=0;y<18;y++){
        //     for(let x=0;x<6;x++){
        //         let key= this.HashableInt(new Vector3(x+0.5,y+0.5,0));
        //         console.log("value of the container was: "+container?.get(key));      
        //     }
        // }
    }

    takeSpace=(container:Map<number,boolean>|null, y:number)=>{
        let key1=this.HashableInt(new Vector3(0.5,y,0));
        let key2=this.HashableInt(new Vector3(1.5,y,0));
        let key3=this.HashableInt(new Vector3(2.5,y,0));
        let key4=this.HashableInt(new Vector3(3.5,y,0));
        let key5=this.HashableInt(new Vector3(4.5,y,0));
        let key6=this.HashableInt(new Vector3(5.5,y,0));
      
        container?.set(key1,false);
        container?.set(key2,false);
        container?.set(key3,false);
        container?.set(key4,false);
        container?.set(key5,false);
        container?.set(key6,false);
        let children= this.mesh?.getChildMeshes();
        children?.forEach((element)=>{
            if(element.name.includes("box")){
                this.box(element.position, container);
            }
            else if(element.name.includes("rectangle")){
                this.rectangle(element.position, container);
            }
           
           
        });

       

        // for(let y=0;y<18;y++){
        //     for(let x=0;x<6;x++){
        //         let key= this.HashableInt(new Vector3(x+0.5,y+0.5,0));
        //         console.log(y+0.5+" | "+(x+0.5)+" "+container?.get(key));      
        //     }
        // }
        // console.log("___________________");

    }

    private box=(position:Vector3,container:Map<number,boolean>|null)=>{
        let x=position.x;
        let y= position.y;
        let key1=this.HashableInt(new Vector3(x-0.5,y+0.5,0));
        let key2=this.HashableInt(new Vector3(x+0.5,y+0.5,0));
        let key3=this.HashableInt(new Vector3(x-0.5,y-0.5,0));
        let key4=this.HashableInt(new Vector3(x+0.5,y-0.5,0));
        container?.set(key1,false);
        container?.set(key2,false);
        container?.set(key3,false);
        container?.set(key4,false);
        
    }
    private rectangle=(position:Vector3,container:Map<number,boolean>|null)=>{
        let x=position.x;
        let y= position.y;
        let key1=this.HashableInt(new Vector3(x-1.5,y,0));
        let key2=this.HashableInt(new Vector3(x+0.5,y,0));
        let key3=this.HashableInt(new Vector3(x+0.5,y,0));
        let key4=this.HashableInt(new Vector3(x+1.5,y,0));
        container?.set(key1,false);
        container?.set(key2,false);
        container?.set(key3,false);
        container?.set(key4,false);
        
    }


    //////
    private box2=(position:Vector3,container:Map<number,boolean>|null)=>{
        let x=position.x;
        let y= position.y;
        let key1=this.HashableInt(new Vector3(x-0.5,y+0.5,0));
        let key2=this.HashableInt(new Vector3(x+0.5,y+0.5,0));
        let key3=this.HashableInt(new Vector3(x-0.5,y-0.5,0));
        let key4=this.HashableInt(new Vector3(x+0.5,y-0.5,0));
        container?.set(key1,true);
        container?.set(key2,true);
        container?.set(key3,true);
        container?.set(key4,true);
        
    }
    private rectangle2=(position:Vector3,container:Map<number,boolean>|null)=>{
        let x=position.x;
        let y= position.y;
        let key1=this.HashableInt(new Vector3(x-1.5,y,0));
        let key2=this.HashableInt(new Vector3(x+0.5,y,0));
        let key3=this.HashableInt(new Vector3(x+0.5,y,0));
        let key4=this.HashableInt(new Vector3(x+1.5,y,0));
        container?.set(key1,true);
        container?.set(key2,true);
        container?.set(key3,true);
        container?.set(key4,true);
        
    }
    ///
    private position =(x:number, y:number)=>{
        let y2=Math.trunc(y)+0.5;
        return new Vector3(3,y2,0);
    }

    private HashableInt=(vector:Vector3)=>
    {
        let x = Math.round(vector.x);
        let y = Math.round(vector.y);
        let z = Math.round(vector.z);
        return x * 1000 + z + y * 1000000;
    }

}