import React, { useRef, useEffect } from 'react';
import './css/App.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import TV from './model/TV.glb';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import Footer from './footer';

const hdri = new URL("./model/environment.hdr", import.meta.url);
const videoSrc = new URL("./model/video.mp4", import.meta.url);

function TELE() {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7);

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
    const light1 = new THREE.DirectionalLight(0xf18f0f, 10);
    light1.position.set(2, 0, 0);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xf18f0f, 10);
    light2.position.set(-2, 0, 0);
    scene.add(light2);

    // Create video element and texture
    const video = document.createElement('video');
    video.src = videoSrc;
    video.loop = true;
    video.muted = true;
    video.play();

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.needsUpdate = true;
    // videoTexture.wrapS = THREE.ClampToEdgeWrapping;
    // videoTexture.wrapT = THREE.ClampToEdgeWrapping;
    // videoTexture.repeat.y = -1;  // Inverser l'axe Y de la texture
    // videoTexture.repeat.x = -1;

    // Load model
    const loader = new GLTFLoader();
    loader.load(TV, function (gltf) {
      const model = gltf.scene;
      model.scale.set(0.01, 0.01, 0.01);

      model.traverse((child) => {
        if (child.isMesh) {
          const material = child.material;
          if (child.name === 'defaultMaterial002') {
            material.map = videoTexture;
          material.roughness = 0.1;

          } 
          else {
            
          material.color.setHex(0x839baa);
          material.metalness = 1.0;
          material.roughness = 0.1;
          material.needsUpdate = true;
          }
        }
      });

      scene.add(model);
      modelRef.current = model;
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
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      targetRotation.current.y = (mouseX / 4) * Math.PI;
      targetRotation.current.x = (-mouseY / 4) * Math.PI / 2;
    };

    // Handle touch movement to rotate the model
    const handleTouchMove = (event) => {
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        const touchX = (touch.clientX / window.innerWidth) * 2 - 1;
        const touchY = -(touch.clientY / window.innerHeight) * 2 + 1;

        targetRotation.current.y = (touchX / 4) * Math.PI;
        targetRotation.current.x = (-touchY / 4) * Math.PI / 2;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove); // Correctly add the touch event listener

    // Animation loop with easing
    const animate = () => {
      requestAnimationFrame(animate);

      if (modelRef.current) {
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
      window.removeEventListener('touchmove', handleTouchMove); // Correctly remove the touch event listener
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className='Tdiv'>
      <div className='tv' ref={mountRef} />
    </div>
  );
}

export default TELE;
