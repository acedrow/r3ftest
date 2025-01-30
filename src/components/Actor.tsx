import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type ActorProps = {
  startingPosition: THREE.Vector3;
  size?: [width: number, height: number, depth: number];
  msg?: string;
  magFilter?: THREE.MagnificationTextureFilter;
};

const Actor = ({
  startingPosition,
  size = [1, 2, 1],
  msg,
  magFilter = THREE.NearestFilter,
}: ActorProps) => {
  const texture = useTexture("skelly.png");
  texture.magFilter = magFilter;

  return (
    <sprite
      scale={size}
      position={startingPosition}
      onClick={() => console.log(msg ?? 'no msg')}
    >
      <spriteMaterial attach="material" map={texture} />
    </sprite>
  );
};

export default Actor;
