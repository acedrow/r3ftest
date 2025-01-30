import { useMemo } from "react";
import "./App.css";
import {
  KeyboardControls,
  KeyboardControlsEntry,
  Stars,
} from "@react-three/drei";
import Scene from "./components/Scene";
import { Canvas } from "@react-three/fiber";

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  jump = "jump",
  l = 'l'
}

function App() {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
      { name: Controls.l, keys: ["l"] },
    ],
    []
  );

  return (
    <KeyboardControls map={map}>
      <div style={{ width: "90vw", height: "90vh" }}>
        <Canvas>
          <color attach="background" args={["black"]} />

          <Stars
            radius={100}
            depth={50}
            count={2500}
            factor={15}
            saturation={0}
            fade
            speed={1}
          />
          <Scene />
        </Canvas>
      </div>
    </KeyboardControls>
  );
}

export default App;
