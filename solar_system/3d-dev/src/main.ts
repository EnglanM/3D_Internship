import { SolarSystem } from './SolarSystem'

window.addEventListener('DOMContentLoaded', async() => {

  let canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
  const app = new SolarSystem(canvas)

  await app.run()
});