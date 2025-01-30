import { CameraControls, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Fragment, useEffect, useRef, useState } from "react";
import Actor, { Facing } from "./Actor";
import * as THREE from "three";
import Block from "./Block";

const GAMEPIECE_MODE_DEGREES = 180;

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
  const cameraAngleLock = useRef<boolean>(false);
  const [showGamepieces, setShowGamepieces] = useState(false);

  //sets default camera position
  useThree(({ camera }) => {
    camera.position.y = 50;
    camera.position.x = -50;
    camera.position.z = 70;

    camera.lookAt(0, 0, 0);
  });
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
              startingPosition={new THREE.Vector3(ix * 10, iy * 10, iz * 10)}
              height={block.height}
              visible={iz % 2 > 0}
            />
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
        facing={Facing.east}
      />
      {/* <Actor
        startingPosition={new THREE.Vector3(10, 15, 20)}
        showGamepiece={showGamepieces}
        facing={Facing.west}
      />
      <Actor
        startingPosition={new THREE.Vector3(20, 15, 10)}
        showGamepiece={showGamepieces}
        facing={Facing.east}
      />
      <Actor
        startingPosition={new THREE.Vector3(10, 15, 30)}
        showGamepiece={showGamepieces}
        facing={Facing.north}
      />
      <Actor
        startingPosition={new THREE.Vector3(30, 15, 10)}
        showGamepiece={showGamepieces}
        facing={Facing.south}
      /> */}
    </Fragment>
  );
};

export default Scene;
