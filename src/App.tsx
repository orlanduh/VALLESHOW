import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { ProductGrid } from './components/ProductGrid';
import { KitsValores } from './components/KitsValores';
import { FeatureStrip } from './components/FeatureStrip';
import { ComoAlugar } from './components/ComoAlugar';
import { Editorial } from './components/Editorial';
import { Location } from './components/Location';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Entry3D } from './components/Entry3D';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isEntering, setIsEntering] = useState(false);

  const handleEnter = () => {
    if (isEntering) return;
    setIsEntering(true);
    
    setTimeout(() => {
      setShowIntro(false);
      setIsEntering(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 450);
  };

  return (
    <div className="app-container">
      <div className={showIntro ? "main-prepared" : "main-visible"}>
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <ProductGrid />
          <KitsValores />
          <FeatureStrip />
          <ComoAlugar />
          <Editorial />
          <Location />
          <FAQ />
        </main>
        <Footer />
      </div>

      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="entry-wrapper"
            exit={{ 
              opacity: 0, 
              scale: 0.985, 
              transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } 
            }}
            className="intro-wrapper"
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#0A0A0A' }}
          >
            <Entry3D onEnter={handleEnter} isEnteringProp={isEntering} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

