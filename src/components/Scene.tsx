import { CameraControls, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { Fragment, useEffect, useRef, useState } from "react";
import Actor from "./Actor";
import * as THREE from "three";
import Block from "./Block";
import parseMapData from "../utils/parseMapData";
import {
  Facing,
  MapData,
  SerializedBlockData,
  SerializedMapData,
  TerrainType,
} from "../types/MapTypes";

const MIN_CAMERA_DISTANCE = 30;
const MAX_CAMERA_DISTANCE = 150;
const MAX_CAMERA_POLAR_ANGLE = Math.PI / 2;

const block: SerializedBlockData = {
  terrainHeight: 3,
  terrainType: TerrainType.sand,
};
const wall = {
  height: 6,
};

const testMap: SerializedMapData = {
  bounds: new THREE.Vector3(5, 5, 5),
  blocks: [
    [[block, block, block, block, block], [], [], [], []],
    [[block, block, block, block, block], [], [], [], []],
    [[block, block, block, block, block], [], [], [], []],
    [[block, block, block, block, block], [], [], [], []],
    [[block, block, block, block, block], [], [], [], []],
  ],
  edges: {
    x: [
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ],
    y: [
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ],
    z: [
      [[undefined, wall], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ],
  },
};

const GAMEPIECE_MODE_DEGREES = 180;
const CAMERA_MOVE_SPEED = 2;

const Scene = () => {
  const cameraControls = useRef<CameraControls>(null);
  const cameraAngleLock = useRef<boolean>(false);
  const [showGamepieces, setShowGamepieces] = useState(false);
  const gameMap: MapData = parseMapData(testMap);

  //sets default camera position
  useThree(({ camera }) => {
    camera.position.y = 50;
    camera.position.x = -50;
    camera.position.z = -70;

    camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    if (cameraControls.current) {
      cameraControls.current.maxPolarAngle = Math.PI / 2;
    }
  }, []);

  //checks camera twice per second to switch actors into game piece mode,
  // not an ideal solution but best I can do :/
  useEffect(() => {
    const interval = setInterval(() => {
      const camAngleDegrees =
        (cameraControls?.current?.polarAngle || 0 / -Math.PI) * 180 + 90;

      if (!showGamepieces && camAngleDegrees < GAMEPIECE_MODE_DEGREES) {
        setShowGamepieces(true);
      } else if (showGamepieces && camAngleDegrees >= GAMEPIECE_MODE_DEGREES) {
        setShowGamepieces(false);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [showGamepieces]);

  const [, get] = useKeyboardControls();

  //Control bindings
  useFrame(() => {
    if (cameraControls.current) {
      cameraControls.current.enabled = !cameraAngleLock.current;

      //camera controls
      if (get().forward) {
        cameraControls.current.truck(0, -CAMERA_MOVE_SPEED, true);
      }
      if (get().back) {
        cameraControls.current.truck(0, CAMERA_MOVE_SPEED, true);
      }
      if (get().left) {
        cameraControls.current.truck(-CAMERA_MOVE_SPEED, 0, true);
      }
      if (get().right) {
        cameraControls.current.truck(CAMERA_MOVE_SPEED, 0, true);
      }
    }
  });
  return (
    <Fragment>
      <CameraControls
        ref={cameraControls}
        maxDistance={MAX_CAMERA_DISTANCE}
        minDistance={MIN_CAMERA_DISTANCE}
        maxPolarAngle={MAX_CAMERA_POLAR_ANGLE}
      />

      {gameMap.blocks.map((arrayx, ix) =>
        arrayx.map((arrayy, iy) =>
          arrayy.map((block, iz) => (
            <React.Fragment key={`${ix}${iy}${iz}`}>
              {block && <Block key={`${ix}${iy}${iz}`} data={block} />}
            </React.Fragment>
          ))
        )
      )}

      <mesh position={new THREE.Vector3(0, 10, 5)}>
        <boxGeometry args={[10, 10, 1]} />
        <meshBasicMaterial color={"red"} />
      </mesh>
      <mesh position={new THREE.Vector3(0, 20, 5)}>
        <boxGeometry args={[10, 10, 1]} />
        <meshBasicMaterial color={"red"} />
      </mesh>

      <Actor
        startingPosition={new THREE.Vector3(10, 15, 10)}
        showGamepiece={showGamepieces}
        facing={Facing.north}
      />
    </Fragment>
  );
};

export default Scene;
