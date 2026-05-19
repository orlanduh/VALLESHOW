import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Agende seu horário',
    desc: 'Reserve sua visita pelo nosso link online. Atendemos de forma exclusiva com horário marcado.',
  },
  {
    num: '02',
    title: 'Visite o Showroom',
    desc: 'Estamos localizados em Providencia, Santiago. Venha nos visitar no dia e horário agendados.',
  },
  {
    num: '03',
    title: 'Escolha seu look',
    desc: 'Prove as peças com a ajuda de nossas consultoras e monte o visual perfeito para a neve.',
  },
  {
    num: '04',
    title: 'Retire as peças',
    desc: 'Leve seu kit na hora ou agende a retirada para o dia da sua viagem à montanha.',
  },
  {
    num: '05',
    title: 'Devolução',
    desc: 'Após aproveitar a neve, devolva as peças no showroom. Nós cuidamos de toda a higienização.',
  },
];

export const ComoAlugar: React.FC = () => {
  return (
    <section id="como-alugar" style={{ padding: '6rem 1.5rem', background: 'var(--dusk)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="section-eyebrow">Passo a passo</span>
          <h2 className="products-title" style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Como Alugar</h2>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Vertical line for desktop */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255, 255, 255, 0.1)', transform: 'translateX(-50%)', display: window.innerWidth > 768 ? 'block' : 'none' }} />

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24, filter: 'blur(5px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
                transition={{ delay: index * 0.15, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex',
                  flexDirection: window.innerWidth > 768 ? (isEven ? 'row' : 'row-reverse') : 'column',
                  alignItems: 'center',
                  marginBottom: '4rem',
                  gap: '2rem',
                }}
              >
                <div style={{ flex: 1, textAlign: window.innerWidth > 768 ? (isEven ? 'right' : 'left') : 'left', width: '100%' }}>
                  <span style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'rgba(255, 255, 255, 0.1)', display: 'block', lineHeight: 1 }}>{step.num}</span>
                  <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', fontWeight: 500, margin: '0.5rem 0' }}>{step.title}</h3>
                  <p style={{ color: 'var(--glacier)', fontSize: '0.95rem' }}>{step.desc}</p>
                </div>
                
                {window.innerWidth > 768 && (
                  <div style={{ width: '40px', height: '40px', background: 'var(--dusk)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--ink)', borderRadius: '50%' }} />
                  </div>
                )}

                <div style={{ flex: 1, display: window.innerWidth > 768 ? 'block' : 'none' }} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
