import * as THREE from "three";

export enum Facing {
  north = "north",
  south = "south",
  east = "east",
  west = "west",
}


//Data types representing blocks in serialized JSON object
export type SerializedBlockData = {
  terrainHeight: number;
};
export type SerializedEdgeData = {
  height: number;
};

export type SerializedMapData = {
  bounds: THREE.Vector3;
  blocks: (SerializedBlockData | undefined)[][][];
  edges: {
    x: (SerializedEdgeData | undefined)[][][];
    y: (SerializedEdgeData | undefined)[][][];
    z: (SerializedEdgeData | undefined)[][][];
  };
};


//Data Types for deserialized in-engine objects:
export type EdgeData = {
  blocks: BlockData[];
};

export type BlockData = {
  coordinates: THREE.Vector3
  terrainHeight: number;
  neighbors: {
    n: BlockData | undefined;
    ne: BlockData | undefined;
    e: BlockData | undefined;
    se: BlockData | undefined;
    s: BlockData | undefined;
    sw: BlockData | undefined;
    w: BlockData | undefined;
    nw: BlockData | undefined;
    up: BlockData | undefined;
    down: BlockData | undefined;
  };
  edges: {
    n: EdgeData | undefined;
    w: EdgeData | undefined;
    s: EdgeData | undefined;
    e: EdgeData | undefined;
    up: EdgeData | undefined;
    down: EdgeData | undefined;
  };
};

export type MapData = {
  bounds: THREE.Vector3,
  blocks: BlockData[][][]
}
