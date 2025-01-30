import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type ActorProps = {
  startingPosition: THREE.Vector3;
  size?: [width: number, height: number, depth: number];
  msg?: string;
  magFilter?: THREE.MagnificationTextureFilter;
  cameraRotation?: THREE.Euler;
  showGamepiece: boolean;
};

const Actor = ({
  startingPosition,
  size = [1, 2, 1],
  msg,
  magFilter = THREE.NearestFilter,
  showGamepiece,
}: ActorProps) => {
  const planeRef = useRef<THREE.Mesh>();
  const standingTexture = useTexture("skelly.png");
  standingTexture.magFilter = magFilter;
  const gamepieceTexture = useTexture("skellyport.png");
  gamepieceTexture.magFilter = magFilter;

  useFrame((state) => {
    planeRef.current?.lookAt(
      state.camera.position.x,
      1.5,
      state.camera.position.z
    );
  });

  return (
    <>
      {!showGamepiece && (
        <mesh
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ref={planeRef}
          position={startingPosition}
          onClick={() => console.log(msg ?? "no msg")}
        >
          <planeGeometry args={[size[0], size[1]]} />
          <meshBasicMaterial
            attach="material"
            map={standingTexture}
            transparent={true}
          />
        </mesh>
      )}

      {showGamepiece && (
        <mesh
          position={
            new THREE.Vector3(startingPosition.x, 0.55, startingPosition.z)
          }
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={() => console.log(msg ?? "no msg")}
        >
          <planeGeometry args={[size[0], 1]} />
          <meshBasicMaterial
            attach="material"
            map={gamepieceTexture}
            transparent={true}
          />
        </mesh>
      )}
    </>
  );
};

export default Actor;
