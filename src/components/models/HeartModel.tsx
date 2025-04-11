import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Heart model component
const Heart = ({ heartRate = 75, state = 'normal' }) => {
  const group = useRef<THREE.Group>(null);
  const heartMaterial = useRef<THREE.MeshStandardMaterial>(null);
  
  // Calculate pulse frequency based on heart rate (beats per minute)
  const pulseFrequency = heartRate / 60;
  
  // State-specific configurations
  const stateConfigs = {
    normal: {
      color: '#ff4560',
      emissiveIntensity: 0.8,
      pulseScale: 0.05
    },
    gym: {
      color: '#ff2000',
      emissiveIntensity: 1.2,
      pulseScale: 0.08
    },
    sleeping: {
      color: '#ff4560',
      emissiveIntensity: 0.5,
      pulseScale: 0.03
    },
    anxiety: {
      color: '#ff4560',
      emissiveIntensity: 1.0,
      pulseScale: 0.07
    }
  };
  
  const config = stateConfigs[state];
  
  useFrame((state) => {
    if (group.current) {
      // Pulse effect - scale based on heart rate and state
      const scale = 1 + Math.sin(state.clock.elapsedTime * Math.PI * 2 * pulseFrequency) * config.pulseScale;
      group.current.scale.set(scale, scale, scale);
      
      // Rotate slowly
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    
    // Pulse color effect for the heart
    if (heartMaterial.current) {
      const intensity = config.emissiveIntensity + 
        Math.sin(state.clock.elapsedTime * Math.PI * 2 * pulseFrequency) * 0.2;
      heartMaterial.current.emissiveIntensity = intensity;
    }
  });

  return (
    <group ref={group}>
      {/* Left Ventricle */}
      <mesh position={[0.5, 0, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          ref={heartMaterial}
          color={config.color}
          roughness={0.3} 
          metalness={0.2}
          emissive={config.color}
          emissiveIntensity={config.emissiveIntensity}
        />
        <Text
          position={[1, 0, 0]}
          fontSize={0.15}
          color="white"
          anchorX="left"
        >
          LV
        </Text>
      </mesh>
      
      {/* Right Ventricle */}
      <mesh position={[-0.5, 0, 0]} castShadow>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial 
          color={config.color}
          roughness={0.3} 
          metalness={0.2}
          emissive={config.color}
          emissiveIntensity={config.emissiveIntensity * 0.8}
        />
        <Text
          position={[-1, 0, 0]}
          fontSize={0.15}
          color="white"
          anchorX="right"
        >
          RV
        </Text>
      </mesh>
      
      {/* Left Atrium */}
      <mesh position={[0.3, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color="#0000ff"  // Blue color as shown in the legend
          roughness={0.3} 
          metalness={0.2}
          emissive="#0000ff"
          emissiveIntensity={config.emissiveIntensity * 0.6}
        />
        <Text
          position={[0.3, 1.4, 0]}
          fontSize={0.15}
          color="white"
        >
          LA
        </Text>
      </mesh>
      
      {/* Right Atrium */}
      <mesh position={[-0.3, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial 
          color="#000080"  // Dark blue color as shown in the legend
          roughness={0.3} 
          metalness={0.2}
          emissive="#000080"
          emissiveIntensity={config.emissiveIntensity * 0.6}
        />
        <Text
          position={[-0.3, 1.4, 0]}
          fontSize={0.15}
          color="white"
        >
          RA
        </Text>
      </mesh>
      
      {/* Aorta */}
      <mesh position={[0, 1.2, -0.2]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1, 32]} />
        <meshStandardMaterial 
          color={config.color}
          roughness={0.3} 
          metalness={0.2}
          emissive={config.color}
          emissiveIntensity={config.emissiveIntensity * 0.4}
        />
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.15}
          color="white"
          rotation={[-Math.PI / 4, 0, 0]}
        >
          Aorta
        </Text>
      </mesh>
    </group>
  );
};

// Main component that sets up the 3D scene
const HeartModel = ({ heartRate = 75, state = 'normal' }) => {
  return (
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Heart heartRate={heartRate} state={state} />
      
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

export default HeartModel;