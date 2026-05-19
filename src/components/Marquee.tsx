import React from 'react';
import { motion, type Variants } from 'framer-motion';

const marqueeItems = [
  'VALLE SHOWROOM',
  'SANTIAGO, CHILE',
  'PROVIDENCIA',
  'ALUGUEL DE ROUPAS DE NEVE',
  'ATENDIMENTO AGENDADO',
  'MAIS DE 50 MODELOS',
  'KITS PREMIUM',
  'LOOKS PARA NEVE',
  'INVERNO 2026',
];

const marqueeVariants: Variants = {
  animate: {
    x: ['0%', '-50%'],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 22,
        ease: 'linear',
      },
    },
  },
};

export const Marquee: React.FC = () => (
  <div className="marquee-container">
    <motion.div variants={marqueeVariants} animate="animate" className="marquee-content">
      {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
        <div key={`${item}-${i}`} className="marquee-item">
          <span className="marquee-text">{item}</span>
          <span className="marquee-dot">·</span>
        </div>
      ))}
    </motion.div>
  </div>
);
