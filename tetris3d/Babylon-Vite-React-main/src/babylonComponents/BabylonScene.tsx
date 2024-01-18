/* eslint-disable react-hooks/exhaustive-deps */
import './canvas.css'
import { useEffect, useRef, useState } from 'react'
import { Engine } from '@babylonjs/core/Engines/engine'
import { WebGPUEngine } from '@babylonjs/core/Engines/WebGPUEngine';
import "@babylonjs/core/Materials/standardMaterial";
import { createScene } from './SceneUtilities';

function BabylonScene() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isWebGpu, setIsWebGpu] = useState(false); // find a way to check if webgpu is supported by browser
  
  const canvasActive = () => {
    canvasRef.current?.focus();
  }
  const canvasInactive = () => {
    canvasRef.current?.blur();
  }
  let active=false;

  
  useEffect(() => {
   
   
    if(active){return}
    const createEngine = async () => { 
       
      active=true;
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        let engine: WebGPUEngine | Engine;
        
        // if webgpu is supported, set isWebGpu to true
        if(isWebGpu){
          engine = new WebGPUEngine(canvas);
          if(engine instanceof WebGPUEngine)
          await engine.initAsync();
        }
        else{
          engine = new Engine(canvas, true);
          window.addEventListener("resize",()=>{
            engine.resize();
          });
        }

        // create and render scene
        const scene = await createScene(canvas, engine);
        engine.runRenderLoop(() => {
          scene.render();
        });

        // garbage collection
        return () => {
          engine.stopRenderLoop();
          scene.dispose();
          engine.dispose();
        };
      }
    };
    createEngine();
  }, [isWebGpu]);

  return <canvas onMouseEnter={canvasActive} onMouseLeave={canvasInactive} ref={canvasRef} className='canvas'></canvas>
}

export default BabylonScene;
