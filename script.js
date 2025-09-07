/*
  script.js
  This file contains JavaScript used across the site.  Currently it initializes
  an interactive 3D representation of a dielectric cylinder with a rotating
  ring of sources on the photonics page.  It loads once the DOM is ready and
  only executes if the placeholder element with id `cylinder-viewer` is found.
*/

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cylinder-viewer');
  if (!container) return;

  // Create scene, camera and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Dielectric cylinder: semi‑transparent to let the source ring shine through
  const cylRadius = 2;
  const cylHeight = 6;
  const cylinderGeometry = new THREE.CylinderGeometry(cylRadius, cylRadius, cylHeight, 64, 1, true);
  const cylinderMaterial = new THREE.MeshPhongMaterial({
    color: 0x2952a3,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
  });
  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  scene.add(cylinder);

  // Ring of point sources: small orange spheres rotating around the z‑axis
  const ringGroup = new THREE.Group();
  const ringRadius = cylRadius;
  const numPoints = 40;
  const pointGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xf5a623 });
  for (let i = 0; i < numPoints; i++) {
    const theta = (i / numPoints) * Math.PI * 2;
    const x = ringRadius * Math.cos(theta);
    const y = ringRadius * Math.sin(theta);
    const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
    pointMesh.position.set(x, y, 0);
    ringGroup.add(pointMesh);
  }
  scene.add(ringGroup);

  // Lighting: ambient and directional for soft highlights
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight(0xffffff, 0.6);
  directional.position.set(5, 10, 7);
  scene.add(directional);

  // Position camera
  camera.position.set(0, 5, 12);
  camera.lookAt(0, 0, 0);

  // Animation loop: slowly rotate the cylinder and the ring
  function animate() {
    requestAnimationFrame(animate);
    cylinder.rotation.y += 0.003;
    ringGroup.rotation.z -= 0.04;
    renderer.render(scene, camera);
  }
  animate();

  // Handle window resize events
  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  // Simple orbit controls: allow the user to drag to rotate the scene
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  container.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;
  });
  container.addEventListener('mousemove', (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;
    const rotationSpeed = 0.005;
    scene.rotation.y += deltaX * rotationSpeed;
    scene.rotation.x += deltaY * rotationSpeed;
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });
});