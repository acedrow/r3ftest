import { useTexture } from "@react-three/drei";
import { useCallback, useState } from "react";
import * as THREE from "three";
import { useDebounce } from "@uidotdev/usehooks";
import { BlockData, TerrainType } from "../types/MapTypes";

type BlockProps = {
  data: BlockData;
  magFilter?: THREE.MagnificationTextureFilter;
  visible?: boolean;
};

const BLOCK_SIZE = 10;
const OUTLINE_MARGIN = 0.1;

const Block = ({ data, visible = true }: BlockProps) => {
  const { terrainHeight, coordinates } = data || { terrainHeight: 3 };
  const [hovered, setHovered] = useState(false);

  const debouncedHovered = useDebounce(hovered, 50);

  const topTexture = useTexture("sand_top.png");
  const sideTexture = useTexture("sand_side.png");
  const outlineTexture = useTexture("cube-outline.png");

  //no blur
  topTexture.magFilter = THREE.NearestFilter;
  sideTexture.magFilter = THREE.NearestFilter;
  outlineTexture.magFilter = THREE.NearestFilter;

  const handleMouseOn = useCallback(() => {
    setHovered(true);
  }, []);

  const handleMouseOff = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <>
      {data.terrainType !== TerrainType.air && (
        <>
          <mesh
            position={
              new THREE.Vector3(
                coordinates.x * 10,
                coordinates.y * 10,
                coordinates.z * 10
              )
            }
            onPointerEnter={(e) => {
              handleMouseOn();
              e.stopPropagation();
            }}
            onPointerLeave={(e) => {
              handleMouseOff();
              e.stopPropagation();
            }}
            onClick={(e) => {
              console.log(
                `hi I'm ${data.coordinates.x}, ${data.coordinates.y}, ${data.coordinates.z}`
              );
              console.log(`my neighbors are:`);
              console.log(data.neighbors);
              //use stopPropagation to only react to closest ray intersection, not all objects.
              e.stopPropagation();
            }}
          >
            <boxGeometry args={[BLOCK_SIZE, terrainHeight / 0.3, BLOCK_SIZE]} />

            {/* meshBasicMaterial is not affected by light, meshStandardMaterial is */}
            {/* TODO: once we have coordinates and boundaries in here, need to only render the necessary sides - e.g. don't render any sides for internal blocks */}
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
            <mesh
              position={
                new THREE.Vector3(
                  coordinates.x * 10,
                  coordinates.y * 10,
                  coordinates.z * 10
                )
              }
            >
              <boxGeometry
                args={[
                  BLOCK_SIZE + OUTLINE_MARGIN,
                  terrainHeight / 0.3 + OUTLINE_MARGIN,
                  BLOCK_SIZE + OUTLINE_MARGIN,
                ]}
              />
              <meshBasicMaterial map={outlineTexture} transparent={true} />
            </mesh>
          )}
        </>
      )}
    </>
  );
};

export default Block;
