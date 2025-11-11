import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
}

export default function HeroViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Setup function
    const setup = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);

      // Initialize particles
      const particleCount = 120;
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        particlesRef.current.push({
          x,
          y,
          vx: 0,
          vy: 0,
          baseX: x,
          baseY: y,
        });
      }
    };

    // Flow field calculation with fixed loop
    const getFlowField = (x: number, y: number, time: number) => {
      const scale = 0.003;
      
      // Loop duration: 8 seconds at 60fps = 480 frames
      const loopDuration = 480;
      const loopTime = (time % loopDuration) / loopDuration; // 0 to 1
      const smoothTime = loopTime * Math.PI * 2; // Convert to radians for smooth loop

      // Smooth looping flow field using sine waves
      const angle =
        Math.sin(x * scale + smoothTime) *
        Math.cos(y * scale - smoothTime * 0.7) *
        Math.PI * 2;

      return {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
    };

    // Animation loop
    const animate = () => {
      if (isPausedRef.current) return;

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      timeRef.current += prefersReducedMotion ? 0.1 : 1;
      const time = timeRef.current;

      // Update particles
      particlesRef.current.forEach((particle) => {
        const field = getFlowField(particle.x, particle.y, time);

        // Apply flow field
        particle.vx += field.x * 0.05;
        particle.vy += field.y * 0.05;

        // Apply damping
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;
      });

      // Draw connections
      const maxDistance = 100;

      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.4;

            // Gradient from accent to accent-2
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, `rgba(124, 212, 255, ${opacity})`);
            gradient.addColorStop(1, `rgba(139, 92, 246, ${opacity})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        // Draw particle
        ctx.fillStyle = 'rgba(124, 212, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Control frame rate
      if (!prefersReducedMotion) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Low frame rate for reduced motion
        setTimeout(() => {
          animationFrameRef.current = requestAnimationFrame(animate);
        }, 1000);
      }
    };

    // Pause when tab is hidden
    const handleVisibilityChange = () => {
      isPausedRef.current = document.hidden;
      if (!document.hidden && !animationFrameRef.current) {
        animate();
      }
    };

    // Handle resize
    const handleResize = () => {
      setup();
    };

    // Initialize
    setup();
    animate();

    // Event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-full hairline">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
        aria-hidden="true"
        role="img"
        title="Decorative animated visualization"
      />
    </div>
  );
}
