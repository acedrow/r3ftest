import { useTexture } from "@react-three/drei";
import { useCallback, useState } from "react";
import * as THREE from "three";

type BlockProps = {
  startingPosition: THREE.Vector3;
  height?: number;
  msg?: string;
  magFilter?: THREE.MagnificationTextureFilter;
};

const Block = ({
  startingPosition,
  height = 3,
  msg,
  magFilter = THREE.NearestFilter,
}: BlockProps) => {
  const [hovered, setHovered] = useState(false);

  const topTexture = useTexture("sand_top.png");
  const sideTexture = useTexture("sand_side.png");
  const outlineTexture = useTexture("cube-outline.png");
  //no blur
  topTexture.magFilter = magFilter;
  sideTexture.magFilter = magFilter;

  const handleMouseOn = useCallback(() => {
    setHovered(true);
  }, []);

  const handleMouseOff = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <>
      <mesh
        position={startingPosition}
        onPointerEnter={(e) => {
          handleMouseOn();
          e.stopPropagation();
        }}
        onPointerLeave={(e) => {
          handleMouseOff();
          e.stopPropagation();
        }}
        onClick={(e) => {
          console.log(msg ?? "no msg");
          //use stopPropagation to only react to closest ray intersection, not all objects.
          e.stopPropagation();
        }}
      >
        <boxGeometry args={[1, height / 3, 1]} />

        <meshBasicMaterial attach={"material-2"} map={topTexture} />
        <meshBasicMaterial attach={"material-3"} map={sideTexture} />
        <meshBasicMaterial attach={"material-0"} map={sideTexture} />
        <meshBasicMaterial attach={"material-1"} map={sideTexture} />
        <meshBasicMaterial attach={"material-4"} map={sideTexture} />
        <meshBasicMaterial attach={"material-5"} map={sideTexture} />
      </mesh>
      {hovered && (
        <mesh position={startingPosition}>
          <boxGeometry args={[1.05, height / 3 + 0.05, 1.05]} />
          <meshBasicMaterial map={outlineTexture} transparent={true} />
        </mesh>
      )}
    </>
  );
};

export default Block;
