import { CameraControls, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Fragment, useRef } from "react";
import Actor from "./Actor";
import * as THREE from 'three'
import Block from "./Block";

const block = {
  height: 3,
};

const testMap = {
  blocks: [
    [[block, block, block], [], []],
    [[block, block, block], [], []],
    [[block, block, block], [], []],
  ],
};

console.log(JSON.stringify(testMap));

const Scene = () => {
  const cameraControls = useRef<CameraControls>(null);
  const [, get] = useKeyboardControls();
  const ref = useRef()

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

      <ambientLight intensity={0.3} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={0.6}
      />
      <pointLight position={[0, 10, 0]} decay={0.3} intensity={0.5} />

      {testMap.blocks.map((arrayx, ix) =>
        arrayx.map((arrayy, iy) =>
          arrayy.map((block, iz) => (
            <Block
              key={`${ix}${iy}${iz}`}
              startingPosition={new THREE.Vector3(ix, iy, iz)}
              height={block.height}
            />
          ))
        )
      )}

      <Actor />
    </Fragment>
  );
};

export default Scene;
