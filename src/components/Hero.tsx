import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { useParallax } from '../hooks/useParallax';

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.16, delayChildren: 0.25 },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

const SnowCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const updateSize = () => {
      const scale = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * scale);
      canvas.height = Math.floor(height * scale);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.55 + 0.16,
      opacity: Math.random() * 0.45 + 0.25,
      angle: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.angle += 0.008;
        particle.y += particle.speed;
        particle.x += Math.sin(particle.angle) * 0.28;

        if (particle.y > height + 8) {
          particle.y = -8;
          particle.x = Math.random() * width;
        }

        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="snow-canvas" />;
};

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress, scrollY } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const backgroundParallax = useParallax(scrollY, 150, 0.3);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <section ref={heroRef} className="hero-section">
      <SnowCanvas />
      <motion.div style={{ y: backgroundParallax }} className="hero-organic-bg">
        <div className="hero-abstract-shape shape-1" />
        <div className="hero-abstract-shape shape-2" />
        <div className="hero-abstract-shape shape-3" />
      </motion.div>

      <motion.div style={{ opacity: cardOpacity, y: cardY }} className="hero-content hero-content-center">
        <motion.div 
          variants={staggerContainerVariants} 
          initial="hidden" 
          animate="visible" 
          className="hero-center-card"
        >
          <motion.div variants={lineVariants} className="hero-tag">
            Valle Showroom
          </motion.div>
          
          <motion.div variants={lineVariants} className="hero-kicker">
            <Sparkles size={16} />
            Showroom em Providencia • Santiago, Chile
          </motion.div>
          
          <motion.h1 variants={lineVariants} className="hero-title">
            O frio nunca<br />foi tão <span>sofisticado</span>.
          </motion.h1>
          
          <motion.p variants={lineVariants} className="hero-subtitle">
            Aluguel premium de roupas de neve em Santiago, Chile, com looks selecionados, atendimento agendado e uma experiência completa para sua viagem.
          </motion.p>
          
          <motion.div variants={lineVariants} className="hero-actions hero-actions-center">
            <a href="https://valleshowroomagendamento.as.me/schedule/6ecdcf70/appointment/72004509/calendar/11215975" className="hero-primary" target="_blank" rel="noopener noreferrer">
              Agendar minha data
            </a>
            <a href="#products" className="hero-secondary">
              Ver catálogo
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      <a href="#products" className="hero-scroll" aria-label="Descer para coleção">
        <ArrowDown size={18} />
      </a>
    </section>
  );
};
