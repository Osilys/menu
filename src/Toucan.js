import React, { useRef, useEffect, useState } from 'react';
import './css/App.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import toucanModel from './model/toucan.gltf';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const hdri = new URL("./model/environment.hdr", import.meta.url);

function App() {
  const mountRef = useRef(null);
  const modelRef = useRef(null);  // Reference to the model
  const targetRotation = useRef({ x: 0, y: 0 }); // Target rotation for easing

  useEffect(() => {
    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.5, 5);

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

    // Add lights to illuminate the model's faces
    const light1 = new THREE.DirectionalLight(0x3498db, 10);
    light1.position.set(2, 0, 0);  // Position the light on one side
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x3498db, 10);
    light2.position.set(-2, 0, 0);  // Position the light on the opposite side
    scene.add(light2);

    // Load model
    const loader = new GLTFLoader();
    loader.load(toucanModel, function (gltf) {
      const model = gltf.scene;
      model.scale.set(1.25, 1.25, 1.25);

      model.traverse((child) => {
        if (child.isMesh) {
          const material = child.material;
          material.color.setHex(0x7a7a7a);
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

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Handle mouse movement to rotate the model
    const handleMouseMove = (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Normalized between -1 and 1
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Normalized between -1 and 1

      // Update target rotation
      targetRotation.current.y = (mouseX / 4) * Math.PI; // Rotate around Y axis
      targetRotation.current.x = (-mouseY / 4) * Math.PI / 2; // Rotate around X axis, limited to 90 degrees
    };

    // Handle touch movement to rotate the model
    const handleTouchMove = (event) => {
      if (event.touches.length === 1) {  // Single touch
        const touch = event.touches[0];
        const touchX = (touch.clientX / window.innerWidth) * 2 - 1; // Normalized between -1 and 1
        const touchY = -(touch.clientY / window.innerHeight) * 2 + 1; // Normalized between -1 and 1

        // Update target rotation
        targetRotation.current.y = (touchX / 4) * Math.PI; // Rotate around Y axis
        targetRotation.current.x = (-touchY / 4) * Math.PI / 2; // Rotate around X axis, limited to 90 degrees
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove); // Add touch event listener

    // Animation loop with easing
    const animate = () => {
      requestAnimationFrame(animate);

      if (modelRef.current) {
        // Easing towards the target rotation
        modelRef.current.rotation.y += (targetRotation.current.y - modelRef.current.rotation.y) * 0.05;
        modelRef.current.rotation.x += (targetRotation.current.x - modelRef.current.rotation.x) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove); // Remove touch event listener
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className='mainDiv'>
      <div className='Tdiv' ref={mountRef} />
      {/* <h1 className="titre">Neosi</h1> */}
      <div className='background-text' style={{display: "inline-block"}}>Votez NOMBDE</div>
      <div className='background-text background-text-delay' style={{display: "inline-block"}}>Votez NOMBDE</div>
      <main>
        <div className="welcome">
          <div className="left"><a className="btn btn--big" id="btn-discover" href=""><span>Bouton 1</span></a></div>
          <div className='center'></div>
          <div className="right"><a className="btn btn--big" id="btn-booknow" href=""><span>Bouton 2</span></a></div>
        </div>
      </main>
    </div>
  );
}

export default App;
