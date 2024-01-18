import { MeshBuilder, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core";

export class Square {
    number:number;
    scene: Scene|undefined;
    plane1:Mesh|null;
    plane2:Mesh|null;
    plane3:Mesh|null;
    plane4:Mesh|null;


    constructor(i:number) {
        this.number=i;
        this.plane1=null;
        this.plane2=null;
        this.plane3=null;
        this.plane4=null;
    }

    create= () => {
       this.plane1= MeshBuilder.CreatePlane(`plane${this.number}`,{size:1});
        this.plane1.position=new Vector3(0.5,7.5,0);
        const plane1Material= new StandardMaterial(`plane${this.number}Material`);
        plane1Material.diffuseTexture=new Texture(`./textures/${this.color()}.jpg`);
        this.plane1.material= plane1Material;

        this.plane2= MeshBuilder.CreatePlane(`plane${this.number}`,{size:1});
        this.plane2.position=new Vector3(0.5,6.5,0);
        const plane2Material= new StandardMaterial(`plane${this.number}Material`);
        plane2Material.diffuseTexture=new Texture(`./textures/${this.color()}.jpg`);
        this.plane2.material= plane2Material;

        this.plane3= MeshBuilder.CreatePlane(`plane${this.number}`,{size:1});
        this.plane3.position=new Vector3(-0.5,7.5,0);
        const plane3Material= new StandardMaterial(`plane${this.number}Material`);
        plane3Material.diffuseTexture=new Texture(`./textures/${this.color()}.jpg`);
        this.plane3.material= plane3Material;

        this.plane4= MeshBuilder.CreatePlane(`plane${this.number}`,{size:1});
        this.plane4.position=new Vector3(-0.5,6.5,0);
        const plane4Material= new StandardMaterial(`plane${this.number}Material`);
        plane4Material.diffuseTexture=new Texture(`./textures/${this.color()}.jpg`);
        this.plane4.material= plane4Material;
        
    }
    rotateToRight=()=>{};
    rotateToLeft=()=>{};

    moveToRight= ()=> {
        if(this.plane1 && this.plane2 && this.plane3 && this.plane4)
        {
            this.plane1.position.x+=1;
            this.plane2.position.x+=1;
            this.plane3.position.x+=1;
            this.plane4.position.x+=1;
        }
    }
    moveToLeft=()=> {
        if(this.plane1 && this.plane2 && this.plane3 && this.plane4)
        {
            this.plane1.position.x-=1;
            this.plane2.position.x-=1;
            this.plane3.position.x-=1;
            this.plane4.position.x-=1;
        }
    }
    private color= () =>{
        return Math.floor(Math.random()*4)+1;
    }
    positionY= ()=> {
        return Math.min(this.plane1?.position.y!,this.plane2?.position.y!,this.plane3?.position.y!,this.plane4?.position.y!);
    }
    minPositionX= ()=> {
        return Math.min(this.plane1?.position.x!,this.plane2?.position.x!,this.plane3?.position.x!,this.plane4?.position.x!);
    }
    maxPosiitonx= ()=> {
        return Math.max(this.plane1?.position.x!,this.plane2?.position.x!,this.plane3?.position.x!,this.plane4?.position.x!);
    }
    moveDown= (nr:number)=> {
        if(this.plane1 &&this.plane2 &&this.plane3 &&this.plane4)
        {
             this.plane1.position.y -=nr;
             this.plane2.position.y -=nr;
             this.plane3.position.y -=nr;
             this.plane4.position.y -=nr;
        }
        }
}