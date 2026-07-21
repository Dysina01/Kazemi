import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";

function Blob() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 128, 128]} scale={2.2}>
        <MeshDistortMaterial
          color="#7dd3fc"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
}

export default function Orb() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1.5} />

        <directionalLight position={[2, 2, 5]} />

        <Blob />
      </Canvas>
    </div>
  );
}
