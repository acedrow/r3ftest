import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type PolygonProps = {
  startingPosition: THREE.Vector3;
  size: [width: number, height: number, depth: number];
  msg?: string;
  magFilter?: THREE.MagnificationTextureFilter;
};

const Polygon = ({
  startingPosition,
  size,
  msg,
  magFilter = THREE.NearestFilter,
}: PolygonProps) => {
  const topTexture = useTexture("sand_top.png");
  const sideTexture = useTexture("sand_side.png");

  //no blur
  topTexture.magFilter = magFilter;
  sideTexture.magFilter = magFilter;

  return (
    <mesh
      position={startingPosition}
      onClick={(e) => {
        console.log(msg ?? "no msg");
        //use stopPropagation to only react to closest ray intersection, not all objects.
        e.stopPropagation();
      }}
      //material={material}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial attach={"material-2"} map={topTexture} /> {/* top  */}
      <meshBasicMaterial attach={"material-3"} map={sideTexture} /> {/* bottom  */}
      <meshBasicMaterial attach={"material-0"} map={sideTexture} />
      <meshBasicMaterial attach={"material-1"} map={sideTexture} />
      <meshBasicMaterial attach={"material-4"} map={sideTexture} />
      <meshBasicMaterial attach={"material-5"} map={sideTexture} />
    </mesh>
  );
};

export default Polygon;
