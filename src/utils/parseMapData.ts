import * as THREE from "three";
import {
  SerializedBlockData,
  BlockData,
  SerializedMapData,
  MapData,
  TerrainType,
} from "../types/MapTypes";


//de-serialize JSON map data into MapData objects
const deserializeBlockData = (
  block: SerializedBlockData | undefined,
  coordinates: THREE.Vector3
): BlockData => {
  return {
    coordinates: coordinates,
    terrainType: block?.terrainType || TerrainType.air,
    terrainHeight: block?.terrainHeight || 3,
    neighbors: {
      n: undefined,
      ne: undefined,
      e: undefined,
      se: undefined,
      s: undefined,
      sw: undefined,
      w: undefined,
      nw: undefined,
      up: undefined,
      down: undefined,
    },
    edges: {
      n: undefined,
      w: undefined,
      s: undefined,
      e: undefined,
      up: undefined,
      down: undefined,
    },
  };
};

const populateNeighbors = (
  block: BlockData,
  blocks: BlockData[][][],
  mapBounds: THREE.Vector3
) => {
  block.neighbors = {
    n:
      block.coordinates.z < mapBounds.z - 1
        ? blocks[block.coordinates.x][block.coordinates.y][
            block.coordinates.z + 1
          ]
        : undefined,
    ne:
      block.coordinates.z < mapBounds.z - 1 && block.coordinates.x > 0
        ? blocks[block.coordinates.x - 1][block.coordinates.y][
            block.coordinates.z + 1
          ]
        : undefined,
    e:
      block.coordinates.x > 0
        ? blocks[block.coordinates.x - 1][block.coordinates.y][
            block.coordinates.z
          ]
        : undefined,
    se:
      block.coordinates.x > 0 && block.coordinates.z > 0
        ? blocks[block.coordinates.x - 1][block.coordinates.y][
            block.coordinates.z - 1
          ]
        : undefined,
    s:
      block.coordinates.z > 0
        ? blocks[block.coordinates.x][block.coordinates.y][
            block.coordinates.z - 1
          ]
        : undefined,
    sw:
      block.coordinates.x < mapBounds.x - 1 && block.coordinates.z > 0
        ? blocks[block.coordinates.x + 1][block.coordinates.y][
            block.coordinates.z - 1
          ]
        : undefined,
    w:
      block.coordinates.x < mapBounds.x - 1
        ? blocks[block.coordinates.x][block.coordinates.y][
            block.coordinates.z + 1
          ]
        : undefined,
    nw:
      block.coordinates.z < mapBounds.z - 1 &&
      block.coordinates.x < mapBounds.x - 1
        ? blocks[block.coordinates.x][block.coordinates.y][
            block.coordinates.z + 1
          ]
        : undefined,
    up:
      block.coordinates.y < mapBounds.y - 1
        ? blocks[block.coordinates.x][block.coordinates.y + 1][
            block.coordinates.z
          ]
        : undefined,
    down:
      block.coordinates.y > 0
        ? blocks[block.coordinates.x][block.coordinates.y - 1][
            block.coordinates.z
          ]
        : undefined,
  };
};

// loads serialized map data into data structure
const parseMapData = (mapData: SerializedMapData): MapData => {
  if (!mapData) {
    throw new Error(`failed to parse map data - mapData is ${mapData}`);
  }
  if (
    mapData.blocks.length > mapData.bounds.x ||
    mapData.blocks[0].length > mapData.bounds.y ||
    mapData.blocks[0][0].length > mapData.bounds.y
  ) {
    throw new Error(`failed to parse map data, blocks size exceeds bounds`);
  }

  const blocks: BlockData[][][] = [[[]]];

  for (let mapx = 0; mapx < mapData.bounds.x; mapx++) {
    if (!blocks[mapx]) {
      blocks[mapx] = []
    }
    for (let mapy = 0; mapy < mapData.bounds.y; mapy++) {
      if (!blocks[mapx][mapy]) {
        blocks[mapx][mapy] = []
      }
      for (let mapz = 0; mapz < mapData.bounds.z; mapz++) {
        blocks[mapx][mapy].push(deserializeBlockData(
          mapData.blocks[mapx][mapy][mapz],
          new THREE.Vector3(mapx, mapy, mapz)
        ));
      }
    }
  }

  blocks.map((blocksX) =>
    blocksX.map((blocksY) =>
      blocksY.map((block) => populateNeighbors(block, blocks, mapData.bounds))
    )
  );
  return {
    bounds: mapData.bounds,
    blocks: blocks,
  };
};

export default parseMapData;
