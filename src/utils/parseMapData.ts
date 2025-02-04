import * as THREE from "three";
import {
  SerializedBlockData,
  BlockData,
  SerializedMapData,
  MapData,
} from "../types/MapTypes";

const block: SerializedBlockData = {
  terrainHeight: 3,
};
const wall = {
  height: 6,
};

export const testMap: SerializedMapData = {
  bounds: new THREE.Vector3(5, 5, 5),
  blocks: [
    [[block, block, block, block, block], [], [], [], []],
    [[block, block, block, block, block], [], [], [], []],
    [[block, block, block, block, block], [], [], [], []],
    [[block, block, block, block, block], [], [], [], []],
    [[block, block, block, block, block], [], [], [], []],
  ],
  edges: {
    x: [
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ],
    y: [
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ],
    z: [
      [[undefined, wall], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ],
  },
};

//de-serialize JSON map data into MapData objects
const deserializeBlockData = (
  block: SerializedBlockData | undefined,
  coordinates: THREE.Vector3
): BlockData => {
  return {
    coordinates: coordinates,
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
      block.coordinates.z < mapBounds.z - 1 && block.coordinates.x < mapBounds.x - 1
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
  const blocks = mapData.blocks.map((mapDataX, ix) =>
    mapDataX.map((mapDataY, iy) =>
      mapDataY.map((blockdata, iz) =>
        deserializeBlockData(blockdata, new THREE.Vector3(ix, iy, iz))
      )
    )
  );

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
