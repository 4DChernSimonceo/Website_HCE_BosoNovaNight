/*
  floquet-visual.js
  Provides an animated illustration of Floquet theory for the mental models page.
  A dot moves along a helical path on a set of repeating elliptical rings, representing
  the repeated energy zones in a periodically driven quantum system.  No external
  libraries are required.
*/

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('floquetCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    // Resize canvas to match its CSS size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  function draw() {
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    const centreX = width / 2;
    const centreY = height / 2;
    const radiusX = Math.min(width, height) * 0.25;
    const radiusY = radiusX * 0.5;
    const spacing = radiusY * 1.5;
    const numReplicas = 5;

    // Draw the elliptical rings representing Floquet replicas
    for (let i = 0; i < numReplicas; i++) {
      const y = centreY + (i - (numReplicas - 1) / 2) * spacing;
      ctx.beginPath();
      ctx.ellipse(centreX, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(41,82,163,0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Compute dot position on the helix
    // progress measures how many full turns have been completed; one turn corresponds to one replica spacing
    const progress = t * 0.02; // adjust speed here
    const angle = 2 * Math.PI * progress;
    const yOffset = spacing * (progress % numReplicas - (numReplicas - 1) / 2);
    const x = centreX + radiusX * Math.cos(angle);
    const y = centreY + yOffset;
    // Draw the moving dot
    ctx.beginPath();
    ctx.fillStyle = '#f5a623';
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();

    t += 1;
    requestAnimationFrame(draw);
  }
  draw();
});