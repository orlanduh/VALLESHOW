import React, { useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ShieldCheck, Sparkles, User, Briefcase } from 'lucide-react';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
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
  return (
    <section id="features" className="features-section">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
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
