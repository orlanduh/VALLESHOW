import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { ShieldCheck, Sparkles, User, Briefcase } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 22 },
  },
};

const features = [
  {
    icon: Sparkles,
    title: 'Estilo e qualidade',
    desc: 'Peças premium das melhores marcas para garantir que você esteja elegante e aquecido.',
  },
  {
    icon: ShieldCheck,
    title: 'Higiene impecável',
    desc: 'Todas as nossas peças passam por rigorosa higienização após cada uso.',
  },
  {
    icon: User,
    title: 'Atendimento personalizado',
    desc: 'Consultoria completa no showroom para ajudar você a montar o look ideal.',
  },
  {
    icon: Briefcase,
    title: 'Praticidade para sua viagem',
    desc: 'Alugue aqui e viaje com a mala mais leve, aproveitando cada momento.',
  },
];

export const FeatureStrip: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="features-section">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="features-grid"
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div key={feature.title} variants={itemVariants} className="feature-item">
              <div className="feature-icon">
                <Icon size={22} />
              </div>
              <h4 className="feature-title">{feature.title}</h4>
              <p className="feature-desc">{feature.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};
