import { CameraControls, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Fragment, useEffect, useRef, useState } from "react";
import Actor from "./Actor";
import * as THREE from "three";
import Block from "./Block";

const GAMEPIECE_MODE_POLAR_ANGLE = 0.3;

const block = {
  height: 3,
};

const testMap = {
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
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ],
  },
};

const Scene = () => {
  const cameraControls = useRef<CameraControls>(null);
  const [showActorGamepiece, setShowActorGamepiece] = useState(false);
  //checks camera twice per second to switch actors into game piece mode,
  // not an ideal solution but best I can do :/
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        !showActorGamepiece &&
        cameraControls?.current?.polarAngle &&
        cameraControls.current.polarAngle < GAMEPIECE_MODE_POLAR_ANGLE
      ) {
        setShowActorGamepiece(true);
      } else if (
        showActorGamepiece &&
        cameraControls?.current?.polarAngle &&
        cameraControls.current.polarAngle >= GAMEPIECE_MODE_POLAR_ANGLE
      ) {
        setShowActorGamepiece(false);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [showActorGamepiece]);

  const [, get] = useKeyboardControls();


  useFrame(() => {
   
    if (cameraControls.current) {
      if (get().forward) {
        cameraControls.current.truck(0, -0.3, true);
      }
      if (get().back) {
        cameraControls.current.truck(0, 0.3, true);
      }
      if (get().left) {
        cameraControls.current.truck(-0.3, 0, true);
      }
      if (get().right) {
        cameraControls.current.truck(0.3, 0, true);
      }
    }
  });
  return (
    <Fragment>
      <CameraControls ref={cameraControls} />

      {testMap.blocks.map((arrayx, ix) =>
        arrayx.map((arrayy, iy) =>
          arrayy.map((block, iz) => (
            <Block
              key={`${ix}${iy}${iz}`}
              startingPosition={new THREE.Vector3(ix, iy, iz)}
              height={block.height}
              visible={iz % 2 > 0}
            />
          ))
        )
      )}

      <mesh position={new THREE.Vector3(0, 1, 0.5)}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshBasicMaterial color={"red"} />
      </mesh>
      <mesh position={new THREE.Vector3(0, 2, 0.5)}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshBasicMaterial color={"red"} />
      </mesh>

      <Actor
        startingPosition={new THREE.Vector3(1, 1.5, 1)}
        showGamepiece={showActorGamepiece}
      />
    </Fragment>
  );
};

export default Scene;
