import {tetrisScene} from './tetrisScene'

window.addEventListener('DOMContentLoaded', async() => {

  let canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
  const app = new tetrisScene(canvas)

  await app.run()
});