import { useTexture } from "@react-three/drei";
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
  const standingTexture = useTexture("skelly.png");
  standingTexture.magFilter = magFilter;
  const gamepieceTexture = useTexture("skellyport.png");
  gamepieceTexture.magFilter = magFilter;
  return (
    <>
      {!showGamepiece && (
        <sprite
          scale={size}
          position={startingPosition}
          onClick={() => console.log(msg ?? "no msg")}
        >
          <spriteMaterial attach="material" map={standingTexture} />
        </sprite>
      )}

      {showGamepiece && (
        <sprite
          scale={[1, 1, 1]}
          position={new THREE.Vector3(startingPosition.x, 0.75, startingPosition.z)}
          onClick={() => console.log(msg ?? "no msg")}
        >
          <spriteMaterial attach="material" map={gamepieceTexture} />
        </sprite>
      )}
    </>
  );
};

export default Actor;
