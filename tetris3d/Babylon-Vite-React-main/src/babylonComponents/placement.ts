/* eslint-disable @typescript-eslint/no-unused-vars */
import { Scene } from '@babylonjs/core/scene';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { ArcRotateCamera, KeyboardEventTypes, Texture } from '@babylonjs/core';
import { Inspector } from '@babylonjs/inspector';

export const placement=function(scene:Scene) {
    const container=createContainer() ;
    const mesh=createShape();
    const mesh2=createShape();
    
    scene.onPointerDown=function(evt, pickInfo) {
        console.log("pickInfo: "+pickInfo.pickedPoint);
        console.log("pickMesh: "+pickInfo.pickedMesh?.name);
        if(pickInfo.pickedMesh?.name==="box"){
            mesh2.position=new Vector3(mesh.position.x, 2,mesh.position.z);
        }else
        mesh.position=new Vector3(pickInfo.pickedPoint?.x, 1, pickInfo.pickedPoint?.z);

    }
};


const createShape=function() {
    const box= MeshBuilder.CreateBox("box", {size:2});
    box.position= new Vector3(-2,0,-2);
    return box;
};
const createContainer=function() {
    const container=new Map<number,boolean>;
    for(let y=1;y<=50;y++){
        for(let z=1;z<=50;z++){
            for(let x=1;x<=50;x++){
                const key= HashableInt(new Vector3(x,y,z));
                 container.set(key,false);
                
            }
        }
    }
    return container;

}

const HashableInt= function(vector:Vector3)
{
	const x = Math.round(vector.x);
	const y = Math.round(vector.y);
	const z = Math.round(vector.z);
	return x * 1000 + z + y * 1000000;
}