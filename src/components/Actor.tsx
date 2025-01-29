import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type ActorProps = {
  startingPosition: THREE.Vector3;
  size: [width: number, height: number, depth: number];
  msg?: string;
  magFilter?: THREE.MagnificationTextureFilter;
};

const Actor = ({
  startingPosition,
  size,
  msg,
  magFilter = THREE.NearestFilter,
}: ActorProps) => {
  const texture = useTexture("skelly.png");
  texture.magFilter = THREE.NearestFilter;

  return (
    <sprite
      scale={[1, 1, 1]}
      position={[1, 2, 1]}
      onClick={() => console.log(msg ?? 'no msg')}
    >
      <spriteMaterial attach="material" map={texture} />
    </sprite>
  );
};

export default Actor;
