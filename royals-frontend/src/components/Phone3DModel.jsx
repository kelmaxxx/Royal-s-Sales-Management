import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { useScroll, useTransform, useMotionValue } from 'framer-motion';
import * as THREE from 'three';

// 3D Phone Model Component
function PhoneModel({ scrollProgress, isInView }) {
  const group = useRef();
  const { scene } = useGLTF('/iphone.glb');
  
  // Base rotation for idle state
  const [baseRotation, setBaseRotation] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (scene) {
      // Ensure the model is properly lit
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  useFrame((state) => {
    if (!group.current) return;
    
    const time = state.clock.getElapsedTime();
    
    if (isInView) {
      // When in view and scrolling: tilt based on scroll
      const scrollTilt = scrollProgress * Math.PI * 0.3; // Tilt up to ~54 degrees
      const scrollRotateY = scrollProgress * Math.PI * 0.2; // Rotate sideways
      
      // Smooth interpolation
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        baseRotation.x + scrollTilt,
        0.1
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        baseRotation.y + scrollRotateY + Math.sin(time * 0.5) * 0.1,
        0.1
      );
    } else {
      // When section is in view but static: subtle floating animation
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        Math.sin(time * 0.5) * 0.05,
        0.05
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        Math.sin(time * 0.3) * 0.1,
        0.05
      );
    }
    
    // Gentle floating animation on Y axis
    group.current.position.y = Math.sin(time * 0.8) * 0.1;
  });

  return (
    <group ref={group} position={[0.3, 0.2, 0]} rotation={[-15, -45, -10]}> 
      <primitive object={scene} scale={4.0} />
    </group>
  );
}

// Main Canvas Wrapper with Scroll Detection
const Phone3DModel = () => {
  const containerRef = useRef(null);
  const [isInSection, setIsInSection] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if section is in viewport
      const inView = rect.top < windowHeight && rect.bottom > 0;
      setIsInSection(inView);
      
      // Calculate scroll progress within the section
      if (inView) {
        // When section enters from bottom (rect.top = windowHeight) to leaving top (rect.bottom = 0)
        const sectionHeight = rect.height;
        const visibleTop = Math.max(0, windowHeight - rect.top);
        const visibleBottom = Math.min(windowHeight, rect.bottom);
        const visibleHeight = visibleBottom - visibleTop;
        
        // Progress from 0 (just entering) to 1 (leaving)
        const progress = Math.max(0, Math.min(1, 
          (windowHeight - rect.top) / (windowHeight + sectionHeight)
        ));
        
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-[500px] relative"
      style={{ perspective: '1000px' }}
    >
      <Canvas
        shadows
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        className="bg-transparent"
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          castShadow
        />
        <spotLight
          position={[-10, -10, -10]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
        />
        <pointLight position={[0, 5, 0]} intensity={0.8} />
        
        {/* Environment for reflections */}
        <Environment preset="city" />
        
        {/* 3D Phone Model */}
        <PhoneModel 
          scrollProgress={scrollProgress} 
          isInView={isInSection}
        />
      </Canvas>
      
      {/* Debug Info (remove in production) */}
      {/* <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs p-2 rounded">
        Scroll: {(scrollProgress * 100).toFixed(0)}%
        <br />
        In View: {isInSection ? 'Yes' : 'No'}
      </div> */}
    </div>
  );
};

// Preload the model
useGLTF.preload('/iphone.glb');

export default Phone3DModel;
