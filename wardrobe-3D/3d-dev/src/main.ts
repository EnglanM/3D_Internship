import { Wardrobe } from "./Wardrobe";

window.addEventListener('DOMContentLoaded', async() => {

  let canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
  const app = new Wardrobe(canvas)

  await app.run()
});