import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const DEFAULT_STANDING_SIZE = new THREE.Vector3(10, 20, 10);
const DEFAULT_PIECE_SIZE = new THREE.Vector3(10, 10, 1);

const FACING_INDICATOR_HEIGHT = 5.5;
const GAMEPIECE_HEIGHT = 5.1;

export enum Facing {
  north = "north",
  south = "south",
  east = "east",
  west = "west",
}

//North is x > 1, z = 0
const facingZRotation = {
  north: 0,
  south: Math.PI,
  east: -Math.PI / 2,
  west: Math.PI / 2,
};

type ActorProps = {
  startingPosition: THREE.Vector3;
  standingSize?: THREE.Vector3;
  pieceSize?: THREE.Vector3;
  msg?: string;
  showGamepiece: boolean;
  facing: Facing;
};

const Actor = ({
  startingPosition,
  standingSize = DEFAULT_STANDING_SIZE,
  pieceSize = DEFAULT_PIECE_SIZE,
  msg,
  showGamepiece,
  facing,
}: ActorProps) => {
  const standingPlaneRef = useRef<THREE.Mesh>();
  const facingIndicatorRef = useRef<THREE.Mesh>();
  const standingTexture = useTexture("skelly.png");
  standingTexture.magFilter = THREE.NearestFilter;
  const gamepieceTexture = useTexture("skellyport.png");
  gamepieceTexture.magFilter = THREE.NearestFilter;
  const facingIndicatorTexture = useTexture("facing_indicator.png");
  facingIndicatorTexture.magFilter = THREE.NearestFilter;

  const facingMaterial = new THREE.MeshBasicMaterial({
    color: "steelblue",
    side: THREE.DoubleSide,
    map: facingIndicatorTexture,
    transparent: true,
  });

  useFrame((state) => {
    standingPlaneRef.current?.lookAt(
      state.camera.position.x,
      15,
      state.camera.position.z
    );
  });

  return (
    <>
      {/* Facing Indicator */}
      <mesh
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref={facingIndicatorRef}
        material={facingMaterial}
        position={
          new THREE.Vector3(
            startingPosition.x,
            FACING_INDICATOR_HEIGHT,
            startingPosition.z
          )
        }
        rotation={[-Math.PI / 2, 0, facingZRotation[facing]]}
        onClick={() => console.log(msg ?? "no msg")}
      >
        <planeGeometry args={[pieceSize.x, pieceSize.y]} />
      </mesh>

      {!showGamepiece && (
        <mesh
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ref={standingPlaneRef}
          position={startingPosition}
          onClick={() => console.log(msg ?? "no msg")}
        >
          <planeGeometry args={[standingSize.x, standingSize.y]} />
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
            new THREE.Vector3(
              startingPosition.x,
              GAMEPIECE_HEIGHT,
              startingPosition.z
            )
          }
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={() => console.log(msg ?? "no msg")}
        >
          <planeGeometry args={[pieceSize.x, pieceSize.y]} />
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
