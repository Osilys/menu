import React, { useRef, useEffect } from 'react';
import './App.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import toucanModel from './model/toucan.gltf';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const hdri = new URL("./model/environment.hdr", import.meta.url);

function App() {
  const mountRef = useRef(null);
  const modelRef = useRef(null);  // Reference to the model

  useEffect(() => {
    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // Load environment texture
    const Env = new RGBELoader();
    Env.load(hdri, function (texture) {
      texture.mapping = THREE.EquirectangularRefractionMapping;
      scene.environment = texture;
    });

    // Load model
    const loader = new GLTFLoader();
    loader.load(toucanModel, function (gltf) {
      const model = gltf.scene;
      model.scale.set(1.25, 1.25, 1.25);

      model.traverse((child) => {
        if (child.isMesh) {
          const material = child.material;
          material.color.setHex(0xffc0c0c0);
          material.metalness = 1.0;
          material.roughness = 0.1;
          material.needsUpdate = true;
        }
      });

      scene.add(model);
      modelRef.current = model;  // Save the model reference
    }, undefined, function (error) {
      console.error(error);
    });

    camera.position.z = 5;

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Handle scroll event to rotate the model
    const handleScroll = () => {
      if (modelRef.current) {
        const scrollPosition = window.scrollY;
        modelRef.current.rotation.y = scrollPosition * 0.005; // Adjust the rotation speed as needed
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className='mainDiv'>
      <div className='Tdiv' ref={mountRef} />
      <h1 class="titre">Neosi</h1>
    </div>
  );
}

export default App;
