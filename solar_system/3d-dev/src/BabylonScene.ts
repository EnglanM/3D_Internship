// Import necessary Babylon.js modules and dependencies
import {
  MeshBuilder,
  Texture,
  StandardMaterial,
  Color3,
  Engine,
  SceneLoader,
  TouchCamera,
  SpotLight,
  Mesh,
  DirectionalLight,
  KeyboardEventTypes,
} from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/loaders"; // Import loaders
import "@babylonjs/core/Debug/debugLayer"; // Import debug layer for debugging
import "@babylonjs/inspector"; // Import inspector for inspecting scene

// Define a class named BabylonScene
export class BabylonScene {
  engine: Engine;
  scene: Scene | null;
  background: Mesh | null;
  cam: TouchCamera | undefined | null;

  constructor(readonly canvasElement: HTMLCanvasElement) {
    // Create a Babylon.js engine with specified options
    this.engine = new Engine(canvasElement, true, { deterministicLockstep: true, lockstepMaxSteps: 4 });
    this.scene = null;
    this.background = null;
    this.cam = null;

    // Add a window resize event listener to handle canvas resizing
    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  async run() {
    // Entry point: Setup the scene and start rendering loop
    await this.setupScene();
    this.engine.runRenderLoop(() => {
      if (!this.scene) {
        // Check if the scene is set up
        console.log('error, scene is not set up');
        return;
      }
      this.scene.render();
    });
  }

  // Function to set up the Babylon.js scene
  setupScene = async () => {
    this.engine.adaptToDeviceRatio = true;
    this.scene = new Scene(this.engine); // Create a new scene

    this.setupCamera(); // Set up the camera
    await this.setupEnvironment(); // Set up the environment (background and chair)
    await this.setupLights(); // Set up lights
    await this.loadDoctor(); // Load a 3D model (genie mesh) with animations and position it

    // Add a keyboard event observer for debugging purposes
    this.scene.onKeyboardObservable.add((info) => {
      if (info.type === KeyboardEventTypes.KEYDOWN && info.event.key === "x") {
        this.scene!.debugLayer.show(); // Show the Babylon.js debug layer
      }
    });
  };

  // Function to set up the camera
  setupCamera = () => {
    if (!this.scene) {
      return;
    }
    const camera = new TouchCamera("camera1", new Vector3(0.0359, 1.211, 1.183), this.scene);
    camera.rotation = new Vector3(0.189, 3.24, 0);
    camera.fov = 0.75;
    camera.detachControl(); // Disable camera control
  };

  // Function to set up the environment (background and chair)
  setupEnvironment = async () => {
    if (!this.scene) {
      return;
    }

    // Create a background plane
    this.background = MeshBuilder.CreatePlane("background", { width: 16, height: 10 }, this.scene);
    this.background.position = new Vector3(0.67, 0.19, -6);
    this.background.rotation = new Vector3(0, 3.3, 0);

    // Create a material for the background plane
    const backgroundMaterial = new StandardMaterial("backgroundMaterial", this.scene);
    backgroundMaterial.diffuseTexture = new Texture("/textures/background.jpg");
    backgroundMaterial.emissiveColor = new Color3(0.886, 0.901, 0.941);
    this.background.material = backgroundMaterial;

    // Load a 3D model (chair) and position it
    const chairMeshes = await SceneLoader.ImportMeshAsync("", "/models/", "Chair.glb", this.scene);
    chairMeshes.meshes[0].position = new Vector3(2.61, 1.801, 1.318);
    chairMeshes.meshes[0].rotation = new Vector3(0, 0.349, 0);
  };

  // Function to set up lights
  setupLights = async () => {
    if (!this.scene) {
      return;
    }

    // Create a directional light
    const light = new DirectionalLight("SunLight", new Vector3(0, -1, -1), this.scene);
    light.diffuse = new Color3(1, 1, 1);
    light.intensity = 1.2;

    // Create spotlights
    const spotlight1 = new SpotLight(
      "RightSide",
      new Vector3(-2.35, 2.17, 0.63),
      new Vector3(1, -0.62, -0.27),
      0.8,
      3,
      this.scene
    );
    spotlight1.diffuse = new Color3(1, 1, 1);
    spotlight1.intensity = 12;

    const spotlight2 = new SpotLight("Center", new Vector3(0, 0.95, 3), new Vector3(0, 0, -1), 1.2, 3.99, this.scene);
    spotlight2.diffuse = new Color3(1, 1, 1);
    spotlight2.intensity = 16;

    // Exclude certain meshes from receiving light
    if (this.background) {
      light.excludedMeshes.push(this.background);
      spotlight1.excludedMeshes.push(this.background);
      spotlight2.excludedMeshes.push(this.background);
    }
  };

  // Function to load a 3D model (genie mesh) and position it
  loadDoctor = async () => {
    if (!this.scene) {
      return;
    }

    // Load a 3D model (genie) and position it
    const doc = await SceneLoader.ImportMeshAsync("", "/models/", "Genie.glb", this.scene);
    doc.meshes[0].position = new Vector3(0.012, 0.011, -0.869);
    doc.meshes[0].rotationQuaternion = null;
    doc.meshes[0].rotation = new Vector3(0, -1.67552, 0);
  };
}
