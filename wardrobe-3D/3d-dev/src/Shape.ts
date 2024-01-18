import { MeshBuilder, StandardMaterial, Texture, Vector3,PhysicsImpostor } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core";

export class Shape{
    name:string;
    nr:number;
    mesh:Mesh|null;

    constructor(name:string, nr:number) {
        this.name=name;
        this.nr=nr;
        this.mesh=null;


    }
    create=(x:number,y:number)=>{
        switch(this.name){
            case "box":{
                this.createSquare(x,y);
                break;
            }
            case "rectangle":{
                this.createRectangle(x,y);
                break;
            }
            case "rectangle2":{
                this.createRectangle2(x,y);
                break;
            }
            default:
        }
    }

    static positions=(x:number,y:number, name:string)=>{
        let position: Vector3[];
        switch(name){
            case "box":{
                position=Shape.boxPosition(x,y);
                break;
            }
            case "rectangle":{
                position=Shape.rectanglePosition(x,y);
                break;
            }
            case "rectangle2":{
                position=Shape.rectangle2Position(x,y);
                break;
            }
            default:
                position=[];
        }
        return position;
    }

    private static boxPosition=(x:number, y:number)=>{
        return [new Vector3(x-0.5,y+0.5,0),new Vector3(0.5+x,0.5+y,0),new Vector3(x-0.5,y-0.5,0),new Vector3(0.5+x,y-0.5,0) ];
    }
    private static rectanglePosition=(x:number, y:number)=>{
        return [new Vector3(x-1.5,y,0),new Vector3(x-0.5,y,0),new Vector3(0.5+x,y,0),new Vector3(1.5+x,y,0) ];
    }
    private  static rectangle2Position= (x:number, y:number)=>{
        return [
        new Vector3(x-1.5,2.5+y,0),new Vector3(x-0.5,2.5+y,0),new Vector3(0.5+x,2.5+y,0),new Vector3(1.5+x,2.5+y,0),
        new Vector3(x-1.5,1.5+y,0),new Vector3(x-0.5,1.5+y,0),new Vector3(0.5+x,1.5+y,0),new Vector3(1.5+x,1.5+y,0),
        new Vector3(x-1.5,0.5+y,0),new Vector3(x-0.5,0.5+y,0),new Vector3(0.5+x,0.5+y,0),new Vector3(1.5+x,0.5+y,0),
        new Vector3(x-1.5,y-0.5,0),new Vector3(x-0.5,y-0.5,0),new Vector3(0.5+x,y-0.5,0),new Vector3(1.5+x,y-0.5,0),
        new Vector3(x-1.5,y-1.5,0),new Vector3(x-0.5,y-1.5,0),new Vector3(0.5+x,y-1.5,0),new Vector3(1.5+x,y-1.5,0),
        new Vector3(x-1.5,y-2.5,0),new Vector3(x-0.5,y-2.5,0),new Vector3(0.5+x,y-2.5,0),new Vector3(1.5+x,y-2.5,0)
        ];
    }


    
    
    private createSquare=(x:number,y:number)=> {
        const box= MeshBuilder.CreateBox(`box${this.nr}`,{size:2, depth:2}); 
        box.position= new Vector3(x,y,0);
        const boxMaterial= new StandardMaterial(`boxMaterial`);
        boxMaterial.diffuseTexture=new Texture(`./textures/clothTexture1.jpg`);
        box.material= boxMaterial;
        box.physicsImpostor= new PhysicsImpostor(box,PhysicsImpostor.BoxImpostor,{mass:1,restitution:0});
        this.mesh=box;
    }
    
    
    private createRectangle= (x:number, y:number)=>{
        const rectangle= MeshBuilder.CreateBox(`rectangle${this.nr}`, {width:4,height:1,depth:2});
        rectangle.position= new Vector3(x,y,0);
        const rectangleMaterial= new StandardMaterial(`rectangleMaterial`);
        rectangleMaterial.diffuseTexture=new Texture(`./textures/clothTexture2 .jpg`);
        rectangle.material= rectangleMaterial;
        rectangle.physicsImpostor= new PhysicsImpostor(rectangle,PhysicsImpostor.BoxImpostor,{mass:1,restitution:0});
        this.mesh=rectangle;

    }
    
    
    private createRectangle2= (x:number, y:number)=>{
        const rectangle2= MeshBuilder.CreateBox(`rectangle2|${this.nr}`,{width:4, height:6, depth:3});
        rectangle2.position= new Vector3(x,y,0);
        const rectangle2Material= new StandardMaterial(`rectangle2Material`);
        rectangle2Material.diffuseTexture=new Texture(`./textures/clothTexture3.jpg`);
        rectangle2.material= rectangle2Material;
        rectangle2.physicsImpostor= new PhysicsImpostor(rectangle2,PhysicsImpostor.BoxImpostor,{mass:1,restitution:0});
        this.mesh=rectangle2;
        
    }
    
        // positionY=()=>{
        //     let y;
        //     switch(this.shape){
        //         case "box":{
        //            y= this.squarePositionY();
        //             console.log("klejdi");
        //             break;
        //         }
        //         case "rectangle":{
        //             y= this.squarePositionY();
        //             break;
        //         }
        //         case "rectangle2":{
        //            y=this.rectangle2PositionY();
        //             break;
        //         }
        //         default:
        //     }
        //     return y;
    
        // }
        // maxPositionX=()=>{
        //     let maxX;
        //     switch(this.shape){
        //         case "box":{
        //             maxX=this.squareMaxPositionx();
        //             break;
        //         }
        //         case "rectangle":{
        //            maxX= this.squareMaxPositionx();
        //             break;
        //         }
        //         case "rectangle2":{
        //             maxX=this.rectangle2MaxPositionx();
        //             break;
        //         }
        //         default:
        //     }
        //     return maxX;
        // }
    
        // minPositionX=()=>{
        //     let minX;
        //     switch(this.shape){
        //         case "box":{
        //            minX= this.squareMinPositionX();
        //             break;
        //         }
        //         case "rectangle":{
        //            minX= this.squareMinPositionX();
        //             break;
        //         }
        //         case "rectangle2":{
        //             minX=this.rectangle2MinPositionX();
        //             break;
        //         }
        //         default:
        //     }
        //     return minX;
        // }
    
    
//     private squarePositionY= ()=> {
//         return Math.min(this.plane1?.position.y!,this.plane2?.position.y!,this.plane3?.position.y!,this.plane4?.position.y!);
//     }
//     private squareMinPositionX= ()=> {
    //         return Math.min(this.plane1?.position.x!,this.plane2?.position.x!,this.plane3?.position.x!,this.plane4?.position.x!);
//     }
//     private squareMaxPositionx= ()=> {
//         return Math.max(this.plane1?.position.x!,this.plane2?.position.x!,this.plane3?.position.x!,this.plane4?.position.x!);
//     }

//     private rectangle2PositionY= ()=> {
//         return Math.min(this.plane1?.position.y!,this.plane2?.position.y!,this.plane3?.position.y!,this.plane4?.position.y!
//             ,this.plane5?.position.y!,this.plane6?.position.y!,this.plane7?.position.y!,this.plane8?.position.y!,
//             this.plane9?.position.y!,this.plane10?.position.y!,this.plane11?.position.y!,this.plane12?.position.y!
//             ,this.plane13?.position.y!,this.plane14?.position.y!,this.plane15?.position.y!,this.plane16?.position.y!,
//             this.plane17?.position.y!,this.plane18?.position.y!,this.plane19?.position.y!,this.plane20?.position.y!
//             ,this.plane21?.position.y!,this.plane22?.position.y!,this.plane23?.position.y!,this.plane24?.position.y!);
//     }
//     private  rectangle2MinPositionX= ()=> {
//         return Math.min(this.plane1?.position.x!,this.plane2?.position.x!,this.plane3?.position.x!,this.plane4?.position.x!
//             ,this.plane5?.position.x!,this.plane6?.position.x!,this.plane7?.position.x!,this.plane8?.position.x!,
//             this.plane9?.position.x!,this.plane10?.position.x!,this.plane11?.position.x!,this.plane12?.position.x!
//             ,this.plane13?.position.x!,this.plane14?.position.x!,this.plane15?.position.x!,this.plane16?.position.x!,
//             this.plane17?.position.x!,this.plane18?.position.x!,this.plane19?.position.x!,this.plane20?.position.x!
//             ,this.plane21?.position.x!,this.plane22?.position.x!,this.plane23?.position.x!,this.plane24?.position.x!);
//     }
//    private  rectangle2MaxPositionx= ()=> {
//         return Math.max(this.plane1?.position.x!,this.plane2?.position.x!,this.plane3?.position.x!,this.plane4?.position.x!
//             ,this.plane5?.position.x!,this.plane6?.position.x!,this.plane7?.position.x!,this.plane8?.position.x!,
//             this.plane9?.position.x!,this.plane10?.position.x!,this.plane11?.position.x!,this.plane12?.position.x!
//             ,this.plane13?.position.x!,this.plane14?.position.x!,this.plane15?.position.x!,this.plane16?.position.x!,
//             this.plane17?.position.x!,this.plane18?.position.x!,this.plane19?.position.x!,this.plane20?.position.x!
//             ,this.plane21?.position.x!,this.plane22?.position.x!,this.plane23?.position.x!,this.plane24?.position.x!);
//     }






    //end of the class

}