import { useTexture } from "@react-three/drei";
import { useCallback, useState } from "react";
import * as THREE from "three";
import { useDebounce } from "@uidotdev/usehooks";

type BlockProps = {
  startingPosition: THREE.Vector3;
  height?: number;
  msg?: string;
  magFilter?: THREE.MagnificationTextureFilter;
  visible?: boolean;
};

const BLOCK_SIZE = 10;
const OUTLINE_MARGIN = 0.1;

const Block = ({
  startingPosition,
  height = 3,
  msg,
  magFilter = THREE.NearestFilter,
  visible = true,
}: BlockProps) => {
  const [hovered, setHovered] = useState(false);

  const debouncedHovered = useDebounce(hovered, 50);

  const topTexture = useTexture("sand_top.png");
  const sideTexture = useTexture("sand_side.png");
  const outlineTexture = useTexture("cube-outline.png");
  //no blur
  topTexture.magFilter = magFilter;
  sideTexture.magFilter = magFilter;
  outlineTexture.magFilter = magFilter;

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
        <boxGeometry args={[BLOCK_SIZE, height / 0.3, BLOCK_SIZE]} />

        {/* meshBasicMaterial is not affected by light, meshStandardMaterial is */}
        <meshBasicMaterial
          attach={"material-2"}
          map={topTexture}
          color={visible ? "white" : "gray"}
        />
        <meshBasicMaterial
          attach={"material-3"}
          map={sideTexture}
          color={visible ? "white" : "gray"}
        />
        <meshBasicMaterial
          attach={"material-0"}
          map={sideTexture}
          color={visible ? "white" : "gray"}
        />
        <meshBasicMaterial
          attach={"material-1"}
          map={sideTexture}
          color={visible ? "white" : "gray"}
        />
        <meshBasicMaterial
          attach={"material-4"}
          map={sideTexture}
          color={visible ? "white" : "gray"}
        />
        <meshBasicMaterial
          attach={"material-5"}
          map={sideTexture}
          color={visible ? "white" : "gray"}
        />
      </mesh>

      {debouncedHovered && (
        <mesh position={startingPosition}>
          <boxGeometry
            args={[
              BLOCK_SIZE + OUTLINE_MARGIN,
              height / 0.3 + OUTLINE_MARGIN,
              BLOCK_SIZE + OUTLINE_MARGIN,
            ]}
          />
          <meshBasicMaterial map={outlineTexture} transparent={true} />
        </mesh>
      )}
    </>
  );
};

export default Block;
