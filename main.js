// Import Three.js and the GLTF loader
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Create your Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lights to the scene
// Ambient light (soft light from all directions)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional light (sun-like)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true; // Enable shadows
scene.add(directionalLight);

// Optional: Add a point light for more dimension
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(-5, 5, 5);
scene.add(pointLight);

// Create a new GLTF loader
const loader = new GLTFLoader();

// Load your 3D model
loader.load(
    // Resource URL
    'Vaclav.glb',
    
    // Called when the resource is loaded
    function(gltf) {
        // Add the loaded object to your scene
        scene.add(gltf.scene);
        
        // Position the model
        gltf.scene.position.set(0, 0, 0);
        gltf.scene.mat
        
        // Position the camera to see the model
        camera.position.set(0, 10, 20);
        camera.lookAt(0, 0, 0);
    },
    
    // Called while loading is progressing
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    
    // Called when loading has errors
    function(error) {
        console.error('An error happened', error);
    }
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    scene.rotation.z += 0.01;
}
animate();