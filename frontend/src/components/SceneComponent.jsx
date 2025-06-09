import { React, useEffect, useRef } from "react";
import { Howl } from "howler";
import ballSoundEffectP1 from "../ressources/sounds/ball_sound_p1.mp3";
import ballSoundEffectP2 from "../ressources/sounds/ball_sound_p2.mp3";

import { Engine, Scene } from "@babylonjs/core";
import {
  SceneLoader,
  ActionManager,
  ExecuteCodeAction,
  ArcRotateCamera,
  CubeTexture,
  Animation,
  Vector3,
  SpotLight,
  ShadowGenerator,
  PBRMaterial,
  Texture,
  Tools,
  Axis,
  Color3,
  Material,
  StandardMaterial,
  AnimationEvent,
  Sound,
} from "@babylonjs/core";

let p1Material;
let p2Material;
let marker;
let shadowGen;

var ballSoundP1 = new Howl({
  src: [ballSoundEffectP1],
  // volume: 0.3,
});

var ballSoundP2 = new Howl({
  src: [ballSoundEffectP2],
});

export const SceneComponent = (props) => {
  const reactCanvas = useRef(null);

  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(canvas);
    const scene = new Scene(engine);
    props.setScene(scene); //Send scene up two layer to parent component

    if (scene.isReady()) {
      onSceneReady(scene, props.setGameEvent, props.localId, props.sessionId);
    } else {
      scene.onReadyObservable.addOnce(() => onSceneReady(scene, props.setGameEvent, props.localId, props.sessionId));
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") scene.getEngine().getDeltaTime();
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [props.antialias, props.engineOptions, props.adaptToDeviceRatio, props.sceneOptions]);

  return <canvas ref={reactCanvas} id="render-canvas" />;
};

async function onSceneReady(scene, setGameEvent, localId, sessionId) {
  const canvas = scene.getEngine().getRenderingCanvas();

  // Camera setup
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 8, new Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  camera.setPosition(new Vector3(6, 5, 0));
  camera.wheelPrecision = 100;
  camera.lowerRadiusLimit = 5;
  camera.upperRadiusLimit = 12;
  camera.panningSensibility = 0;

  const sun = new SpotLight(
    "sun",
    new Vector3(-2.25, 13, -3.65),
    new Vector3(0.14, -0.96, 0.23),
    Math.PI / 2 /*90 Degrees */,
    15
  );
  sun.intensity = 500;
  sun.shadowEnabled = true;
  // sun.shadowMinZ = 0;
  // sun.shadowMaxZ = 40;

  shadowGen = new ShadowGenerator(1024, sun);
  shadowGen.useBlurExponentialShadowMap = true;

  // Disable standard behaviour for arrow-keys
  camera.keysUp = [];
  camera.keysDown = [];
  camera.keysLeft = [];
  camera.keysRight = [];

  // Align Camera on button presses
  scene.actionManager = new ActionManager(scene);
  [" ", "w", "a", "s", "d", 37, 38, 39, 40].forEach((item) => {
    scene.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnKeyDownTrigger,
          parameter: item,
        },
        () => {
          moveCamera(item.toString());
        }
      )
    );
  });

  function moveCamera(key) {
    let newPosition;
    switch (true) {
      case [" ", "s", "40"].includes(key):
        newPosition = new Vector3(0, 5, -6);
        break;
      case ["w", "38"].includes(key):
        newPosition = new Vector3(0, 5, 6);
        break;
      case ["a", "37"].includes(key):
        newPosition = new Vector3(-6, 5, 0);
        break;
      case ["d", "39"].includes(key):
        newPosition = new Vector3(6, 5, 0);
        break;
      default:
        console.log("Erro while assigning key shortcuts");
    }
    camera.setPosition(newPosition);
  }

  // Skybox
  const envTex = CubeTexture.CreateFromPrefilteredData("/assets/roof_garden_skybox.env", scene);

  envTex.gammaSpace = false;
  envTex.rotationY = Math.PI;
  scene.environmentTexture = envTex;
  scene.createDefaultSkybox(envTex, true, 1000, 0.1);

  // Materials
  p1Material = new PBRMaterial("p1Material", scene);
  p1Material.albedoTexture = new Texture("/materials/OrangeMarble/OrangeMarble_COL_1K.jpg", scene);
  p1Material.reflectivityTexture = new Texture("/materials/OrangeMarble/OrangeMarble_REFL_1K.jpg", scene);
  p1Material.microSurfaceTexture = new Texture("/materials/OrangeMarble/OrangeMarble_GLOSS_1K.jpg", scene);

  p2Material = new PBRMaterial("p2Material", scene);
  p2Material.albedoTexture = new Texture("/materials/GreenMarble/GreenMarble_COL_1K.jpg", scene);
  p2Material.reflectivityTexture = new Texture("/materials/GreenMarble/GreenMarble_REFL_1K.jpg", scene);
  p2Material.microSurfaceTexture = new Texture("/materials/GreenMarble/GreenMarble_GLOSS_1K.jpg", scene);

  const outerRimMaterial = new PBRMaterial("outerRimMaterial", scene);
  outerRimMaterial.albedoTexture = new Texture("/materials/WoodFineDark003/WoodFineDark003_COL_2K.jpg", scene);
  outerRimMaterial.reflectivityTexture = new Texture("/materials/WoodFineDark003/WoodFineDark003_REFL_2K.jpg", scene);
  outerRimMaterial.microSurface = 0.8;

  const innerRimMaterial = new PBRMaterial("innerRimMaterial", scene);
  innerRimMaterial.albedoTexture = new Texture("/materials/WoodFineDark001/WoodFineDark001_COL_2K.jpg", scene);
  innerRimMaterial.reflectivityTexture = new Texture("/materials/WoodFineDark001/WoodFineDark001_REFL_2K.jpg", scene);
  innerRimMaterial.microSurface = 0.8;
  innerRimMaterial.useLightmapAsShadowmap = false;

  const floorMaterial = new PBRMaterial("floorMaterial", scene);
  floorMaterial.albedoTexture = new Texture("/materials/WoodFineDark004/WoodFineDark004_COL_2K.jpg", scene);
  floorMaterial.reflectivityTexture = new Texture("/materials/WoodFineDark004/WoodFineDark004_REFL_2K.jpg", scene);
  floorMaterial.microSurface = 0.6;

  const poleMaterial = new PBRMaterial("poleMaterial", scene);
  poleMaterial.albedoTexture = new Texture("/materials/WoodFineDark003/WoodFineDark003_COL_2K.jpg", scene);
  poleMaterial.reflectivityTexture = new Texture("/materials/WoodFineDark003/WoodFineDark003_REFL_2K.jpg", scene);
  poleMaterial.microSurface = 0.8;

  // const markerMaterial = new PBRMaterial("markerMaterial", scene);
  // markerMaterial.albedoTexture = new Texture("/materials/WoodFineDark004/WoodFineDark004_COL_2K_marker.jpg", scene);
  // markerMaterial.diffuseColor = new Color3(255 / 256, 208 / 256, 167 / 256);
  // markerMaterial.reflectivityTexture = new Texture("/materials/WoodFineDark004/WoodFineDark004_REFL_2K.jpg", scene);
  // markerMaterial.microSurface = 0.4;

  const markerMaterial = new PBRMaterial("markerMaterial", scene);
  markerMaterial.albedoColor = new Color3(0.9, 0.9, 0.9);
  markerMaterial.metallic = 0;
  markerMaterial.roughness = 0;

  // Mesh
  let polesMesh = [];
  let boardMesh = [];

  // Creating meshes
  SceneLoader.ImportMesh("", "/assets/", "refined_gameboard.glb", scene, function (loadedMeshes) {
    loadedMeshes[0].getChildMeshes().forEach((mesh) => {
      mesh.id.substring(0, 4) === "pole" ? polesMesh.push(mesh) : boardMesh.push(mesh);
    });

    boardMesh.forEach((element) => {
      switch (element.id) {
        case "floor":
          element.material = floorMaterial;
          break;
        case "outer_rim":
          element.material = outerRimMaterial;
          break;
        case "inner_rim":
          element.material = innerRimMaterial;
          break;
        case "marker":
          marker = element;
          marker.material = markerMaterial;
          marker.isVisible = false;
          marker.position.y = -5;
          break;
        default:
          console.log("Error while creating gameboard objects");
      }
      element.receiveShadows = true;
    });

    polesMesh.forEach((pole) => {
      pole.material = poleMaterial;
      pole.rotate(Axis.Y, Tools.ToRadians(Math.random() * 360));
      pole.actionManager = new ActionManager(scene);
      pole.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          setGameEvent({
            actorId: localId,
            coordinates: [parseInt(pole.id.substring(4, 5)), parseInt(pole.id.substring(5, 6))],
            sessionId: sessionId,
          });
        })
      );
      shadowGen.addShadowCaster(pole);
    });
  });
}

export function createBallMesh(indices, turn, myScene) {
  SceneLoader.ImportMeshAsync("", "/assets/", "ball.glb").then(({ meshes }) => {
    // Unpacking mesh
    const meshRoot = meshes[0];
    const meshChild = meshes[1];

    // Converting coordinates
    const [xIdx, yIdx, zIdx] = indices;

    const coordinates = {
      x: -1.5 + yIdx,
      y: -1.5 + xIdx,
      z: 0.315 + zIdx * 0.5,
    };

    // Assign Material
    meshChild.material = [p1Material, p2Material][turn];
    meshRoot.rotate(Axis.Y, Tools.ToRadians(Math.random() * 360));
    meshChild.receiveShadows = true;
    shadowGen.addShadowCaster(meshChild);

    // Animations
    const fps = 60;

    const fadeFrames = [];
    fadeFrames.push({ frame: 0, value: 0 });
    fadeFrames.push({ frame: 120, value: 0 });
    fadeFrames.push({ frame: 180, value: 1 });

    const fadeAnimation = new Animation(
      "fadeAnimation",
      "visibility",
      fps,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    fadeAnimation.setKeys(fadeFrames);

    const fallFrames = [];
    fallFrames.push({
      frame: 0,
      value: new Vector3(coordinates["x"], 3, coordinates["y"]),
    }); //2.5
    fallFrames.push({
      frame: 60,
      value: new Vector3(coordinates["x"], coordinates["z"], coordinates["y"]),
    });

    const fallAnimation = new Animation(
      "fallAnimation",
      "position",
      fps,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    fallAnimation.setKeys(fallFrames);
    fallAnimation.addEvent(
      new AnimationEvent(
        33,
        () => {
          turn === 0 ? ballSoundP1.play() : ballSoundP2.play();
        },
        true
      )
    );

    myScene.beginDirectAnimation(meshRoot, [fallAnimation], 0, 60, false);

    marker.position = new Vector3(-coordinates["x"], 2.08844, coordinates["y"]);
    marker.isVisible = true;
    myScene.beginDirectAnimation(marker, [fadeAnimation], 0, 180, false);
  });
}
