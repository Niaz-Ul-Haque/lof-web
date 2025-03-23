'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { COLORS } from '@/lib/constants';

interface ThreeJSBackgroundProps {
  variant?: 'particles' | 'waves' | 'cosmos' | 'stars' | 'random';
  intensity?: 'low' | 'medium' | 'high';
  color1?: string;
  color2?: string;
}

export const ThreeJSBackground: React.FC<ThreeJSBackgroundProps> = ({
  variant = 'particles',
  intensity = 'low',
  color1 = COLORS.GOLD,
  color2 = COLORS.TEAL,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Object3D | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const starsRef = useRef<THREE.Object3D[]>([]);

  const threeColor1 = new THREE.Color(color1);
  const threeColor2 = new THREE.Color(color2);

  const getParticleCount = () => {
    switch (intensity) {
      case 'high':
        return 1500;
      case 'medium':
        return 800;
      default:
        return 400;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
    }

    if (rendererRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
      containerRef.current.removeChild(rendererRef.current.domElement);
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    renderer.domElement.style.pointerEvents = 'none';
    rendererRef.current = renderer;

    let effectVariant = variant;
    if (variant === 'random') {
      const variants = ['particles', 'waves', 'cosmos', 'stars'];
      effectVariant = variants[Math.floor(Math.random() * variants.length)] as
        | 'particles'
        | 'waves'
        | 'cosmos'
        | 'stars';
      console.log('Random background selected:', effectVariant);
    }

    switch (effectVariant) {
      case 'particles':
        createParticles();
        break;
      case 'waves':
        createWaves();
        break;
      case 'cosmos':
        createCosmos();
        break;
      case 'stars':
        createStarfield();
        break;
      default:
        createMinimalEffect();
    }

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = (timestamp: number) => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      const deltaTime = timestamp - timeRef.current;
      timeRef.current = timestamp;

      if (variant === 'cosmos') {
        animateCosmos(deltaTime);
      } else if (variant === 'stars') {
        animateStars(deltaTime);
      } else if (variant === 'waves') {
        animateWaves(deltaTime);
      } else if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.0003;
        particlesRef.current.rotation.y += 0.0005;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    timeRef.current = performance.now();
    animate(timeRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [variant, intensity, color1, color2]);

  const createParticles = () => {
    if (!sceneRef.current) return;

    const particleCount = getParticleCount();
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;

      const mixRatio = Math.random();
      const mixedColor = new THREE.Color().lerpColors(threeColor1, threeColor2, mixRatio);

      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;

      sizes[i / 3] = Math.random() * 2 + 0.5;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    sceneRef.current.add(particleSystem);
    particlesRef.current = particleSystem;
  };

  const createWaves = () => {
    if (!sceneRef.current) return;

    const geometry = new THREE.PlaneGeometry(120, 120, 60, 60);

    const positions = geometry.attributes.position.array;
    const colors = new Float32Array(positions.length);
    const waveData = new Float32Array(positions.length / 3);

    for (let i = 0, j = 0; i < positions.length; i += 3, j++) {
      const x = positions[i];
      const y = positions[i + 1];

      waveData[j] = positions[i + 2];

      positions[i + 2] = Math.sin(x / 5) * 2 + Math.cos(y / 5) * 2;

      const mixRatio = (Math.sin(x / 10) + 1) / 2;
      const mixedColor = new THREE.Color().lerpColors(threeColor1, threeColor2, mixRatio);

      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.userData.waveData = waveData;

    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 3;
    mesh.position.y = -10;
    sceneRef.current.add(mesh);
    particlesRef.current = mesh;
  };

  const animateWaves = (deltaTime: number) => {
    if (!particlesRef.current || !(particlesRef.current instanceof THREE.Mesh)) return;

    const geometry = particlesRef.current.geometry;
    const positions = geometry.attributes.position.array;
    const time = performance.now() * 0.001;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];

      positions[i + 2] = Math.sin(x / 5 + time) * 2 + Math.cos(y / 5 + time * 0.8) * 2;
    }

    geometry.attributes.position.needsUpdate = true;

    particlesRef.current.rotation.z += 0.0001 * deltaTime;
  };

  const createCosmos = () => {
    if (!sceneRef.current) return;

    const galaxyParams = {
      branches: 3,
      particleCount: getParticleCount() * 2,
      radius: 40,
      spin: 1,
      randomness: 0.2,
      randomnessPower: 3,
      insideColor: threeColor1,
      outsideColor: threeColor2,
    };

    const positions = new Float32Array(galaxyParams.particleCount * 3);
    const colors = new Float32Array(galaxyParams.particleCount * 3);
    const scales = new Float32Array(galaxyParams.particleCount);

    for (let i = 0; i < galaxyParams.particleCount; i++) {
      const i3 = i * 3;

      const radius = Math.random() * galaxyParams.radius;
      const spinAngle = radius * galaxyParams.spin;
      const branchAngle = ((i % galaxyParams.branches) / galaxyParams.branches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), galaxyParams.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        galaxyParams.randomness *
        radius;
      const randomY =
        Math.pow(Math.random(), galaxyParams.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        galaxyParams.randomness *
        radius;
      const randomZ =
        Math.pow(Math.random(), galaxyParams.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        galaxyParams.randomness *
        radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixRatio = radius / galaxyParams.radius;
      const mixedColor = new THREE.Color().lerpColors(
        galaxyParams.insideColor,
        galaxyParams.outsideColor,
        mixRatio
      );

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      scales[i] = Math.random() * 2.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const points = new THREE.Points(geometry, material);
    sceneRef.current.add(points);
    particlesRef.current = points;
  };

  const animateCosmos = (deltaTime: number) => {
    if (!particlesRef.current) return;

    particlesRef.current.rotation.y += 0.0002 * deltaTime;

    const time = performance.now() * 0.001;
    particlesRef.current.scale.x = 1 + Math.sin(time * 0.5) * 0.05;
    particlesRef.current.scale.y = 1 + Math.sin(time * 0.5) * 0.05;
    particlesRef.current.scale.z = 1 + Math.sin(time * 0.5) * 0.05;
  };

  const createStarfield = () => {
    if (!sceneRef.current) return;

    const starsContainer = new THREE.Object3D();

    const layers = 3;
    const starsPerLayer = getParticleCount() / layers;

    for (let layer = 0; layer < layers; layer++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(starsPerLayer * 3);
      const colors = new Float32Array(starsPerLayer * 3);
      const sizes = new Float32Array(starsPerLayer);

      const layerDepth = 50 + layer * 40;

      for (let i = 0; i < starsPerLayer; i++) {
        const i3 = i * 3;

        const radius = layerDepth;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        const layerRatio = layer / layers;
        const colorRand = Math.random() * 0.2;
        const mixRatio = layerRatio + colorRand;
        const mixedColor = new THREE.Color().lerpColors(threeColor1, threeColor2, mixRatio);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        sizes[i] = (1 - layerRatio) * 2 + Math.random();
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 1,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
      });

      const stars = new THREE.Points(geometry, material);
      stars.userData.speed = 0.02 - layer * 0.005;
      stars.userData.layer = layer;

      starsContainer.add(stars);
      starsRef.current.push(stars);
    }

    sceneRef.current.add(starsContainer);
    particlesRef.current = starsContainer;
  };

  const animateStars = (deltaTime: number) => {
    if (!particlesRef.current) return;

    const targetRotationX = 0;
    const targetRotationY = 0;

    starsRef.current.forEach(stars => {
      const speed = stars.userData.speed;
      stars.rotation.y += speed * 0.01 * deltaTime;

      const layer = stars.userData.layer;
      const time = performance.now() * 0.0001;
      const swayAmount = 0.05 - layer * 0.01;

      stars.rotation.x = Math.sin(time) * swayAmount + targetRotationX;
      stars.rotation.z = Math.cos(time * 0.7) * swayAmount + targetRotationY;
    });
  };

  const createMinimalEffect = () => {
    if (!sceneRef.current) return;

    const particleCount = getParticleCount() / 2;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 50;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.5,
      color: color1,
      transparent: true,
      opacity: 0.5,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    sceneRef.current.add(particleSystem);
    particlesRef.current = particleSystem;
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full overflow-hidden z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
};
