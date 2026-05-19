import React from 'react';
import { motion } from 'framer-motion';
import { Check, ShoppingBag } from 'lucide-react';

const kits = [
  {
    title: 'Kit Premium',
    price: 'R$ 380',
    period: 'por semana',
    desc: 'O essencial para a neve com qualidade superior e design elegante.',
    features: ['Macacão ou Conjunto Premium', 'Isolamento térmico padrão', 'Impermeabilidade garantida', 'Consultoria de estilo'],
    highlight: false,
  },
  {
    title: 'Super Premium',
    price: 'R$ 480',
    period: 'por semana',
    desc: 'As peças mais cobiçadas da temporada para máxima presença.',
    features: ['Marcas exclusivas (Wepink, etc)', 'Alta tecnologia térmica', 'Design fashion e modelagem única', 'Consultoria VIP no showroom'],
    highlight: true,
  },
  {
    title: 'Kids & Casuais',
    price: 'Sob consulta',
    period: 'avulso',
    desc: 'Looks completos para crianças (até 12 anos) e peças casuais avulsas.',
    features: ['Macacões Infantis forrados', 'Casacos de lã casuais', 'Luvas de couro e gorros', 'MoonBoots avulsas'],
    highlight: false,
  },
];

export const KitsValores: React.FC = () => {
  return (
    <section id="kits" className="features-section" style={{ padding: '6rem 1.5rem', background: 'var(--snow)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="section-eyebrow">Investimento</span>
          <h2 className="products-title" style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Kits e Valores</h2>
          <p className="products-intro" style={{ margin: '1rem auto' }}>
            Aluguel semanal com peças higienizadas e prontas para uso.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {kits.map((kit, index) => (
            <motion.div
              key={kit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: kit.highlight ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${kit.highlight ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)'}`,
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {kit.highlight && (
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ice)', marginBottom: '1rem', display: 'block' }}>
                  Mais procurado
                </span>
              )}
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 500, marginBottom: '0.5rem' }}>{kit.title}</h3>
              <p style={{ color: 'var(--ice)', fontSize: '0.9rem', marginBottom: '2rem' }}>{kit.desc}</p>
              
              <div style={{ marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 400 }}>{kit.price}</span>
                <span style={{ color: 'var(--cold)', fontSize: '0.9rem', marginLeft: '0.5rem' }}>/ {kit.period}</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', flex: 1 }}>
                {kit.features.map(feat => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', color: 'var(--glacier)', fontSize: '0.9rem' }}>
                    <Check size={16} style={{ color: 'var(--ice)', flexShrink: 0, marginTop: '0.15rem' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://valleshowroomagendamento.as.me/schedule/6ecdcf70/appointment/72004509/calendar/11215975"
                target="_blank"
                rel="noopener noreferrer"
                className="entry-btn primary"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem', background: kit.highlight ? 'var(--ink)' : 'transparent', color: kit.highlight ? 'var(--snow)' : 'var(--ink)', border: '1px solid var(--ink)' }}
              >
                <ShoppingBag size={18} />
                Agendar provador
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
