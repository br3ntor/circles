// This would be great to make into a HOF
// that would just run the function at the interval
export function changeParticlesSequential(
  particles: import("./Classes").Particle[]
) {
  let i = 0;

  const interval = setInterval(() => {
    particles[i].velocity.x = (Math.random() - 0.5) * 6;
    particles[i].velocity.y = (Math.random() - 0.5) * 6;

    if (i++ >= particles.length - 1) {
      i = 0;
      // clearInterval(interval);
    }
  }, 300);

  return interval;
}

export function changeParticlesConcurrent(
  particles: import("./Classes").Particle[]
) {
  const moveSequence = [
    [2, 0],
    [0, 1],
    [-2, 0],
    [0, -1],
  ];
  let i = 0;

  const interval = setInterval(() => {
    particles.forEach((p) => {
      p.velocity.x = moveSequence[i][0];
      p.velocity.y = moveSequence[i][1];
    });

    if (i >= moveSequence.length - 1) {
      i = 0;
    } else {
      i++;
    }
  }, 2000);

  return interval;
}
