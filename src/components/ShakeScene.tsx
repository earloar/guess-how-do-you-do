import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface StickProps {
  position: [number, number, number];
  rotation: [number, number, number];
  isWinning: boolean;
  onAnimationComplete?: () => void;
}

const Stick = ({ position, rotation, isWinning, onAnimationComplete }: StickProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [winStartTime, setWinStartTime] = useState<number | null>(null);
  
  // Physics state for the pop-out animation
  const velocity = useRef(new THREE.Vector3((Math.random() - 0.5) * 3, 8 + Math.random() * 4, 3 + Math.random() * 2));
  const angularVelocity = useRef(new THREE.Vector3(Math.random() * 6 - 3, Math.random() * 6 - 3, Math.random() * 6 - 3));

  useEffect(() => {
    if (isWinning && !winStartTime) {
      setWinStartTime(Date.now());
    }
  }, [isWinning]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (winStartTime) {
      const t = (Date.now() - winStartTime) / 1000;

      if (t < 1.5) {
        // Phase 1: Pop out and fall naturally (parabola)
        velocity.current.y -= 15 * delta; // Gravity
        
        meshRef.current.position.x += velocity.current.x * delta;
        meshRef.current.position.y += velocity.current.y * delta;
        meshRef.current.position.z += velocity.current.z * delta;

        meshRef.current.rotation.x += angularVelocity.current.x * delta;
        meshRef.current.rotation.y += angularVelocity.current.y * delta;
        meshRef.current.rotation.z += angularVelocity.current.z * delta;
      } else {
        // Phase 2: Fly to camera
        const targetPos = camera.position.clone().add(new THREE.Vector3(0, -0.5, -2));
        meshRef.current.position.lerp(targetPos, 0.08);
        
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.PI / 2, 0.08);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.08);
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.08);

        if (meshRef.current.position.distanceTo(targetPos) < 0.2 && onAnimationComplete) {
          onAnimationComplete();
        }
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <cylinderGeometry args={[0.04, 0.04, 4, 8]} />
      <meshStandardMaterial color="#d2b48c" roughness={0.8} />
      {/* Red tip */}
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.041, 0.041, 0.2, 8]} />
        <meshStandardMaterial color="#cc0000" roughness={0.5} />
      </mesh>
    </mesh>
  );
};

const Hand = ({ isLeft }: { isLeft: boolean }) => {
  const sign = isLeft ? -1 : 1;
  
  const SkinMaterial = () => (
    <meshPhysicalMaterial color="#fcd5b5" roughness={0.4} metalness={0.05} clearcoat={0.1} clearcoatRoughness={0.3} />
  );

  return (
    <group position={[sign * 1.25, -1.8, 0]} rotation={[0, 0, sign * 0.1]}>
      {/* Palm */}
      <mesh position={[0, 0, 0]} scale={[0.25, 1.4, 1.2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <SkinMaterial />
      </mesh>
      
      {/* Fingers */}
      {[0, 1, 2, 3].map((i) => {
        const L1 = 0.45 - Math.abs(i - 1.2) * 0.05;
        const L2 = 0.35 - Math.abs(i - 1.2) * 0.05;
        const L3 = 0.25 - Math.abs(i - 1.2) * 0.05;
        const thickness = 0.16 - i * 0.01;
        
        return (
          <group key={i} position={[-sign * 0.05, 0.5 - i * 0.3, 0.4]} rotation={[0, sign * 0.3, 0]}>
            {/* Proximal phalanx */}
            <mesh position={[-sign * L1 / 2, 0, 0]} rotation={[0, 0, sign * Math.PI / 2]}>
              <capsuleGeometry args={[thickness, L1, 16, 16]} />
              <SkinMaterial />
            </mesh>
            {/* Middle phalanx */}
            <group position={[-sign * L1, 0, 0]} rotation={[0, sign * 0.4, 0]}>
              <mesh position={[-sign * L2 / 2, 0, 0]} rotation={[0, 0, sign * Math.PI / 2]}>
                <capsuleGeometry args={[thickness * 0.9, L2, 16, 16]} />
                <SkinMaterial />
              </mesh>
              {/* Distal phalanx */}
              <group position={[-sign * L2, 0, 0]} rotation={[0, sign * 0.4, 0]}>
                <mesh position={[-sign * L3 / 2, 0, 0]} rotation={[0, 0, sign * Math.PI / 2]}>
                  <capsuleGeometry args={[thickness * 0.8, L3, 16, 16]} />
                  <SkinMaterial />
                </mesh>
              </group>
            </group>
          </group>
        );
      })}
      
      {/* Thumb */}
      <group position={[-sign * 0.05, 0.2, -0.4]} rotation={[0, sign * -0.5, sign * -0.2]}>
        <mesh position={[-sign * 0.2, 0, 0]} rotation={[0, 0, sign * Math.PI / 2]}>
          <capsuleGeometry args={[0.2, 0.4, 16, 16]} />
          <SkinMaterial />
        </mesh>
        <group position={[-sign * 0.4, 0, 0]} rotation={[0, sign * -0.4, 0]}>
          <mesh position={[-sign * 0.15, 0, 0]} rotation={[0, 0, sign * Math.PI / 2]}>
            <capsuleGeometry args={[0.18, 0.3, 16, 16]} />
            <SkinMaterial />
          </mesh>
        </group>
      </group>
    </group>
  );
};

const CylinderGroup = ({ isShaking, hasDrawn, onStickOut }: { isShaking: boolean, hasDrawn: boolean, onStickOut: () => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate random sticks (Increased to 80)
  const [sticks] = useState(() => 
    Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 1.2,
      ] as [number, number, number],
      rotation: [
        (Math.random() - 0.5) * 0.2,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 0.2,
      ] as [number, number, number],
    }))
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    if (isShaking) {
      // Deliberate front-to-back shake animation
      const t = state.clock.elapsedTime * 15;
      groupRef.current.rotation.x = Math.sin(t) * 0.4; // Strong front-to-back pitch
      groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.05; // Very slight side-to-side
      groupRef.current.position.y = Math.cos(t) * 0.2; // Up and down sync with pitch
      groupRef.current.position.z = Math.sin(t) * 0.3; // Forward/backward translation
    } else {
      // Reset position smoothly
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer cylinder */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[1, 0.8, 5, 32, 1, true]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Bottom cap */}
      <mesh position={[0, -4, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
        <meshStandardMaterial color="#6b4226" roughness={0.9} />
      </mesh>
      
      <Hand isLeft={false} />
      <Hand isLeft={true} />

      {/* Sticks */}
      {sticks.map((stick, i) => (
        <Stick
          key={stick.id}
          position={stick.position}
          rotation={stick.rotation}
          isWinning={hasDrawn && i === 0}
          onAnimationComplete={i === 0 ? onStickOut : undefined}
        />
      ))}
    </group>
  );
};

export const ShakeScene = ({ onStickOut }: { onStickOut: () => void }) => {
  const [isShaking, setIsShaking] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [shakeTime, setShakeTime] = useState(0);

  const handlePointerDown = () => {
    if (!hasDrawn) {
      setIsShaking(true);
      setShakeTime(Date.now());
    }
  };

  const handlePointerUp = () => {
    if (isShaking && !hasDrawn) {
      setIsShaking(false);
      // Only draw if shaken for at least 500ms
      if (Date.now() - shakeTime > 500) {
        setHasDrawn(true);
      }
    }
  };

  return (
    <div 
      className="w-full h-full cursor-pointer touch-none relative bg-gradient-to-b from-slate-900 to-slate-800"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
    >
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={45} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffaa00" />
        <Environment preset="sunset" />
        
        <CylinderGroup isShaking={isShaking} hasDrawn={hasDrawn} onStickOut={onStickOut} />
      </Canvas>
      
      {!hasDrawn && (
        <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none">
          <p className="text-amber-400 text-xl font-bold tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-pulse">
            长按屏幕摇动竹筒
          </p>
        </div>
      )}
    </div>
  );
};
