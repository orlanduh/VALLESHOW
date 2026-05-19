import React, { useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';

const navVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const links = [
  { name: 'Início', href: '#' },
  { name: 'Catálogo', href: '#products' },
  { name: 'Kits e Valores', href: '#kits' },
  { name: 'Como Alugar', href: '#como-alugar' },
  { name: 'Localização', href: '#localizacao' },
];

export const Nav: React.FC = () => {
  const { scrollY } = useScroll();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const backgroundColor = useTransform(scrollY, [0, 120], ['rgba(5, 5, 5, 0)', 'rgba(5, 5, 5, 0.9)']);
  const borderColor = useTransform(scrollY, [0, 120], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)']);
  const backdropFilter = useTransform(scrollY, [0, 120], ['blur(0px)', 'blur(18px)']);

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      style={{ backgroundColor, backdropFilter, borderColor }}
      className="nav-container nav-grid"
    >
      <div className="nav-left">
        <a className="nav-logo" href="#" aria-label="Valle Showroom">
          <img src="/logo-valle-completa.png" alt="Valle Showroom" className="brand-emblem-full" />
        </a>
      </div>

      <div className="nav-center nav-desktop">
        <ul className="nav-links">
          {links.map((link, i) => (
            <li
              key={link.name}
              className="nav-item"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <a href={link.href}>{link.name}</a>
              <AnimatePresence>
                {hoveredIndex === i && (
                  <motion.div
                    layoutId="nav-underline"
                    className="nav-underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>

      <div className="nav-right nav-desktop">
        <a
          href="https://api.whatsapp.com/send/?phone=5587996195708&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-button whatsapp-btn"
          aria-label="Falar com a Valle Showroom no WhatsApp"
        >
          <MessageCircle size={18} />
        </a>
        <a className="nav-reserve" href="https://valleshowroomagendamento.as.me/schedule/6ecdcf70/appointment/72004509/calendar/11215975" target="_blank" rel="noopener noreferrer">
          Agendar minha data
        </a>
      </div>

      <button className="nav-menu-button" onClick={() => setIsOpen((value) => !value)} aria-label="Abrir menu">
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {links.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsOpen(false)}>
                {link.name}
              </a>
            ))}
            <div className="mobile-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <a href="https://valleshowroomagendamento.as.me/schedule/6ecdcf70/appointment/72004509/calendar/11215975" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.8rem', background: 'var(--ink)', color: '#050505', borderRadius: '4px', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }} onClick={() => setIsOpen(false)}>
                Agendar minha data
              </a>
              <a href="https://api.whatsapp.com/send/?phone=5587996195708&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--ink)', borderRadius: '4px', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }} onClick={() => setIsOpen(false)}>
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
