import { CameraControls, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Fragment, useRef } from "react";
import Polygon from "./Polygon";
import { Vector3 } from "three";

const Scene = () => {
  const cameraControls = useRef<CameraControls>(null);
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

      <ambientLight intensity={0.3} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={0.6}
      />
      <pointLight position={[0, 10, 0]} decay={0.3} intensity={0.5} />

      <Polygon startingPosition={new Vector3(1, 1, 1)} size={[1, 1, 1]} msg="blarpo" />
      <Polygon startingPosition={new Vector3(2, 1, 1)} size={[1, 1, 1]} />
      <Polygon startingPosition={new Vector3(2, 1, 2)} size={[1, 1, 1]} />
      <Polygon startingPosition={new Vector3(1, 1, 2)} size={[1, 1, 1]} />
      <Polygon startingPosition={new Vector3(1, 1, 3)} size={[1, 1, 1]} />
      <Polygon startingPosition={new Vector3(1, 1.66, 3)} size={[1, 0.33, 1]} />
      <Polygon startingPosition={new Vector3(2, 1, 3)} size={[1, 1, 1]} />



    </Fragment>
  );
};

export default Scene;
