import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Preciso agendar para visitar o showroom?',
    a: 'Sim, nosso atendimento é exclusivo por agendamento prévio para garantir que você tenha tempo e suporte das consultoras para provar e escolher seus looks com tranquilidade.',
  },
  {
    q: 'Posso alugar peças avulsas em vez do kit completo?',
    a: 'Sim, além dos kits, oferecemos o aluguel de peças avulsas, incluindo casacos, calças, macacões, luvas e botas.',
  },
  {
    q: 'Vocês realizam a higienização das peças?',
    a: 'Sim. A higiene é um dos nossos maiores pilares. Todas as peças passam por um processo rigoroso de higienização profissional após cada devolução.',
  },
  {
    q: 'Vocês têm roupas para crianças?',
    a: 'Sim, possuímos a linha Kids, com looks de neve completos para crianças de até 12 anos.',
  },
  {
    q: 'Posso reservar os looks antes de viajar?',
    a: 'Sugerimos agendar seu horário no showroom com antecedência. A escolha exata das peças é feita presencialmente para garantir o caimento perfeito.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" style={{ padding: '6rem 1.5rem', background: 'var(--snow)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '4rem' }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <span className="section-eyebrow">Dúvidas</span>
          <h2 className="products-title" style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Perguntas Frequentes</h2>
        </motion.div>

        <motion.div 
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div 
                key={index} 
                variants={fadeUp}
                style={{ 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--ink)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.1rem',
                  }}
                >
                  {faq.q}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: 'var(--glacier)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
