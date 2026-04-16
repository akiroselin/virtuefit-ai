'use client';

import { useRef, useState, useEffect, Suspense, Component, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows, 
  PerspectiveCamera,
  OrbitControls,
  useProgress,
  Html
} from '@react-three/drei';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface ModelViewerProps {
  currentOutfit?: {
    id: string;
    images: string[];
    prompt: string;
    style: string;
    createdAt: Date;
  };
}

interface ModelViewerState {
  hasError: boolean;
  error?: string;
}

// Error Boundary Component
class ModelViewerErrorBoundary extends Component<{ children: ReactNode }, ModelViewerState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ModelViewer Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-dark-purple rounded-xl">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-text-secondary text-center px-4">
            3D Viewer failed to load. Please refresh the page.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
        <p className="text-text-secondary font-mono text-sm">{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

function VirtualModel() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
      <group ref={meshRef}>
        {/* Head */}
        <mesh position={[0, 2.8, 0]} castShadow>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#f0d0c0" roughness={0.6} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 2.4, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.2, 16]} />
          <meshStandardMaterial color="#f0d0c0" roughness={0.6} />
        </mesh>

        {/* Torso */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Hips */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <capsuleGeometry args={[0.35, 0.4, 8, 16]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Left Arm */}
        <mesh position={[-0.45, 1.6, 0]} rotation={[0, 0, 0.3]} castShadow>
          <capsuleGeometry args={[0.07, 0.7, 8, 16]} />
          <meshStandardMaterial color="#f0d0c0" roughness={0.6} />
        </mesh>

        {/* Right Arm */}
        <mesh position={[0.45, 1.6, 0]} rotation={[0, 0, -0.3]} castShadow>
          <capsuleGeometry args={[0.07, 0.7, 8, 16]} />
          <meshStandardMaterial color="#f0d0c0" roughness={0.6} />
        </mesh>

        {/* Left Leg */}
        <mesh position={[-0.15, 0.2, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
          <meshStandardMaterial color="#f0d0c0" roughness={0.6} />
        </mesh>

        {/* Right Leg */}
        <mesh position={[0.15, 0.2, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
          <meshStandardMaterial color="#f0d0c0" roughness={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

function Scene() {
  const [webgpuSupported, setWebgpuSupported] = useState(false);

  useEffect(() => {
    const checkWebGPU = () => {
      try {
        // @ts-expect-error WebGPU API not in TypeScript lib
        if (navigator.gpu) {
          // @ts-expect-error WebGPU API not in TypeScript lib
          navigator.gpu.requestAdapter().then((adapter: any) => {
            setWebgpuSupported(!!adapter);
          }).catch(() => {
            setWebgpuSupported(false);
          });
        }
      } catch {
        setWebgpuSupported(false);
      }
    };
    checkWebGPU();
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={50} />
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#667eea" />
      <pointLight position={[5, 3, -5]} intensity={0.5} color="#764ba2" />

      {/* Environment */}
      <Environment preset="city" />

      {/* Model */}
      <Suspense fallback={<Loader />}>
        <VirtualModel />
      </Suspense>

      {/* Floor shadow */}
      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      {/* Grid floor */}
      <gridHelper args={[20, 20, '#333355', '#222244']} position={[0, -0.5, 0]} />
    </>
  );
}

export default function ModelViewer({ currentOutfit }: ModelViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-purple rounded-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
          <p className="text-text-secondary">Initializing 3D Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <ModelViewerErrorBoundary>
      <div className="w-full h-full relative">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false,
          }}
          style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #14141f 100%)' }}
          onCreated={({ gl }) => {
            gl.setClearColor('#0a0a0f');
          }}
        >
          <Scene />
        </Canvas>

        {/* WebGPU Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full glass-effect text-xs">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-text-secondary">3D Ready</span>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-20 left-4 text-xs text-text-secondary">
          <p>🖱️ Drag to rotate</p>
          <p>⚲ Scroll to zoom</p>
        </div>
      </div>
    </ModelViewerErrorBoundary>
  );
}
