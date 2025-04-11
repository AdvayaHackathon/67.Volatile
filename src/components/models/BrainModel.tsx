import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Brain regions with colors and descriptions
const brainRegions = [
  { 
    name: 'Frontal Lobe',
    id: 'frontal',
    color: '#9c27b0',
    position: [0, 0.7, 0.7],
    scale: [1.2, 0.8, 0.8],
    description: 'Controls executive functions, emotions, and behavior'
  },
  { 
    name: 'Parietal Lobe',
    id: 'parietal',
    color: '#3f51b5',
    position: [0, 0.7, -0.3],
    scale: [1.2, 0.8, 0.8],
    description: 'Processes sensory information and spatial awareness'
  },
  { 
    name: 'Temporal Lobe',
    id: 'temporal',
    color: '#4caf50',
    position: [1, 0, 0],
    scale: [0.7, 0.7, 1],
    description: 'Handles memory, hearing, and language'
  },
  { 
    name: 'Temporal Lobe',
    id: 'temporal',
    color: '#4caf50',
    position: [-1, 0, 0],
    scale: [0.7, 0.7, 1],
    description: 'Handles memory, hearing, and language'
  },
  { 
    name: 'Occipital Lobe',
    id: 'occipital',
    color: '#ffc107',
    position: [0, 0, -1],
    scale: [1, 0.8, 0.6],
    description: 'Processes visual information'
  },
  { 
    name: 'Cerebellum',
    id: 'cerebellum',
    color: '#f44336',
    position: [0, -0.8, -0.8],
    scale: [1, 0.5, 0.6],
    description: 'Controls balance and coordination'
  },
  { 
    name: 'Brain Stem',
    id: 'brainstem',
    color: '#795548',
    position: [0, -1.2, -0.3],
    scale: [0.4, 0.6, 0.4],
    description: 'Controls basic life functions'
  }
];

// Brain region component
const BrainRegion = ({ name, color, position, scale, pulsate = false, isActive = false }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      if (isActive) {
        // Enhanced pulsating effect for active (stressed) regions
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        mesh.current.scale.set(scale[0] * pulse, scale[1] * pulse, scale[2] * pulse);
      } else if (pulsate) {
        // Normal subtle pulsating effect
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        mesh.current.scale.set(scale[0] * pulse, scale[1] * pulse, scale[2] * pulse);
      }
    }
  });
  
  return (
    <mesh ref={mesh} position={position} scale={scale} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.4} 
        metalness={0.1}
        emissive={color}
        emissiveIntensity={isActive ? 0.5 : 0.2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

// Brain model component
const Brain = ({ activeRegions = [] }) => {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      // Rotate slowly
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <group ref={group}>
      {/* Brain regions */}
      {brainRegions.map((region, index) => (
        <BrainRegion 
          key={index}
          name={region.name}
          color={region.color}
          position={region.position}
          scale={region.scale}
          pulsate={index % 3 === 0}
          isActive={activeRegions.includes(region.id)}
        />
      ))}
      
      {/* Labels for main regions */}
      <Text position={[0, 1.2, 0.7]} fontSize={0.15} color="white">Frontal</Text>
      <Text position={[0, 1.2, -0.5]} fontSize={0.15} color="white">Parietal</Text>
      <Text position={[1.5, 0, 0]} fontSize={0.15} color="white">Temporal</Text>
      <Text position={[0, 0, -1.5]} fontSize={0.15} color="white">Occipital</Text>
      <Text position={[0, -1.2, -0.8]} fontSize={0.15} color="white">Cerebellum</Text>
      
      {/* Corpus callosum (connection between hemispheres) */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1.8, 32, 1, true]} />
        <meshStandardMaterial 
          color="#e0e0e0" 
          roughness={0.4} 
          metalness={0.1}
          side={THREE.DoubleSide}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Brain division line */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// Main component that sets up the 3D scene
const BrainModel = ({ activeRegions = [] }) => {
  return (
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Brain activeRegions={activeRegions} />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={8}
        autoRotate={false}
      />
    </Canvas>
  );
};

export default BrainModel;