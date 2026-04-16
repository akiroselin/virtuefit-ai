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

function AsianFemaleModel() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Skin tone for Asian female
  const skinColor = '#f5d0b5';
  const hairColor = '#1a1a1a';
  const outfitColor = '#2a2a4a';
  const dressColor = '#667eea';

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={meshRef}>

        {/* Hair - Long black hair */}
        <mesh position={[0, 2.95, -0.05]} castShadow>
          <sphereGeometry args={[0.27, 32, 32]} />
          <meshStandardMaterial color={hairColor} roughness={0.8} />
        </mesh>
        
        {/* Hair back - longer */}
        <mesh position={[0, 2.4, -0.12]} castShadow>
          <capsuleGeometry args={[0.24, 0.5, 8, 16]} />
          <meshStandardMaterial color={hairColor} roughness={0.8} />
        </mesh>
        
        {/* Side hair left */}
        <mesh position={[-0.25, 2.2, -0.05]} rotation={[0.1, 0, 0.2]} castShadow>
          <capsuleGeometry args={[0.06, 0.6, 8, 16]} />
          <meshStandardMaterial color={hairColor} roughness={0.8} />
        </mesh>
        
        {/* Side hair right */}
        <mesh position={[0.25, 2.2, -0.05]} rotation={[0.1, 0, -0.2]} castShadow>
          <capsuleGeometry args={[0.06, 0.6, 8, 16]} />
          <meshStandardMaterial color={hairColor} roughness={0.8} />
        </mesh>

        {/* Head - smaller, more delicate for female */}
        <mesh position={[0, 2.75, 0]} castShadow>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>

        {/* Face - subtle features */}
        <mesh position={[0, 2.72, 0.18]} castShadow>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>

        {/* Eyes - left */}
        <mesh position={[-0.07, 2.78, 0.2]} castShadow>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color='#2a1810' roughness={0.3} />
        </mesh>
        
        {/* Eyes - right */}
        <mesh position={[0.07, 2.78, 0.2]} castShadow>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color='#2a1810' roughness={0.3} />
        </mesh>

        {/* Nose - smaller, more delicate */}
        <mesh position={[0, 2.72, 0.22]} castShadow>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>

        {/* Lips - subtle pink */}
        <mesh position={[0, 2.67, 0.22]} castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color='#e8a0a0' roughness={0.4} />
        </mesh>

        {/* Neck - slender */}
        <mesh position={[0, 2.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.2, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>

        {/* Shoulders - narrower for female */}
        <mesh position={[0, 2.15, 0]} castShadow>
          <capsuleGeometry args={[0.25, 0.15, 8, 16]} />
          <meshStandardMaterial color={dressColor} roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Upper body / Dress top */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <capsuleGeometry args={[0.22, 0.5, 8, 16]} />
          <meshStandardMaterial color={dressColor} roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Waist - cinched for female figure */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <capsuleGeometry args={[0.18, 0.25, 8, 16]} />
          <meshStandardMaterial color={dressColor} roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Hips / Lower dress - A-line skirt */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.4, 0.7, 16]} />
          <meshStandardMaterial color={dressColor} roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Skirt hem */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.42, 0.1, 16]} />
          <meshStandardMaterial color={dressColor} roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Left arm - slender */}
        <mesh position={[-0.35, 1.75, 0]} rotation={[0, 0, 0.4]} castShadow>
          <capsuleGeometry args={[0.05, 0.5, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        
        {/* Left hand */}
        <mesh position={[-0.42, 1.35, 0]} castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>

        {/* Right arm - slender */}
        <mesh position={[0.35, 1.75, 0]} rotation={[0, 0, -0.4]} castShadow>
          <capsuleGeometry args={[0.05, 0.5, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        
        {/* Right hand */}
        <mesh position={[0.42, 1.35, 0]} castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>

        {/* Left leg - slender */}
        <mesh position={[-0.1, 0.15, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.7, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>

        {/* Left foot / heel */}
        <mesh position={[-0.1, -0.45, 0.05]} castShadow>
          <boxGeometry args={[0.08, 0.15, 0.2]} />
          <meshStandardMaterial color='#1a1a2e' roughness={0.3} />
        </mesh>

        {/* Right leg - slender */}
        <mesh position={[0.1, 0.15, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.7, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>

        {/* Right foot / heel */}
        <mesh position={[0.1, -0.45, 0.05]} castShadow>
          <boxGeometry args={[0.08, 0.15, 0.2]} />
          <meshStandardMaterial color='#1a1a2e' roughness={0.3} />
        </mesh>

        {/* Hair bangs */}
        <mesh position={[0, 2.85, 0.15]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.35, 0.08, 0.05]} />
          <meshStandardMaterial color={hairColor} roughness={0.8} />
        </mesh>

      </group>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.8, 4]} fov={45} />
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate={true}
        autoRotateSpeed={0.5}
        minDistance={2}
        maxDistance={8}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <pointLight position={[-5, 3, -5]} intensity={0.6} color="#667eea" />
      <pointLight position={[5, 3, -5]} intensity={0.6} color="#764ba2" />
      <pointLight position={[0, 4, 3]} intensity={0.4} color="#ffffff" />

      {/* Environment */}
      <Environment preset="city" />

      {/* Model */}
      <Suspense fallback={<Loader />}>
        <AsianFemaleModel />
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

        {/* Model info badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full glass-effect text-xs">
          <span className="w-2 h-2 rounded-full bg-pink-500" />
          <span className="text-text-secondary">Asian Female Model</span>
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
