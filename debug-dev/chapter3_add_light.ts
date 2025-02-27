import * as THREE from 'three';

import { IMAGE_BASEURL } from './configs/constants';

// 用Three.js创建一个纹理映射立方体
let renderer: THREE.Renderer = null;
let scene: THREE.Scene = null;
let camera: THREE.Camera = null;
let cube: THREE.Object3D = null;

const duration = 5000; // ms
let currentTime = Date.now();
function animate() {
  const now = Date.now();
  const deltat = now - currentTime;
  currentTime = now;
  const fract = deltat / duration;
  const angle = Math.PI * 2 * fract;
  cube.rotation.y += angle;
}

function run() {
  requestAnimationFrame(() => {
    run();
  });

  // Render the scene
  renderer.render(scene, camera);
  // Spin the cube for next frame
  animate();
}

window.onload = () => {
  // 1.
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  document.body.appendChild(canvas);
  // create THREE.js renderer and add to canvas
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });

  // set the viewport Size
  renderer.setSize(canvas.width, canvas.height);

  // create a new scene of ThreeJS
  scene = new THREE.Scene();

  // add a camera so as to see the scene
  camera = new THREE.PerspectiveCamera(
    45,
    canvas.width / canvas.height,
    1,
    4000,
  );
  scene.add(camera);

  // NOTE - 添加光照
  // Add a direationLight to show off thee object
  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  // Position the light out from the scene, pointing at the origin
  light.position.set(0, 0, 1);
  scene.add(light);

  // Create a texture-mapped cube and add it to the scene
  // First, create the texture map
  const mapUrl = `${IMAGE_BASEURL}/crate.jpg`;
  const map: THREE.Texture = THREE.ImageUtils.loadTexture(mapUrl);

  // Now, create a Basic material; pass in the map
  const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
    map,
  });

  // Create the cube geometry
  const geometry: THREE.CubeGeometry = new THREE.CubeGeometry(2, 2, 2);

  // And put the geometry and material together into a mesh
  cube = new THREE.Mesh(geometry, material);

  // Move the mesh back from the camera and tilt it toward the viewer
  cube.position.z = -6;
  cube.rotation.x = Math.PI / 5;
  cube.rotation.y = Math.PI / 5;

  // Finally, add the mesh to our scene
  scene.add(cube);

  // Run the run loop
  run();
};
