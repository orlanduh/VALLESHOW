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
  const [hasEntered, setHasEntered] = useState(false);

  const handleEnter = () => {
    setHasEntered(true);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  };

  return (
    <div className="app-container">
      <div className={hasEntered ? "main-visible" : "main-behind-intro"}>
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
        {!hasEntered && (
          <motion.div
            key="entry-wrapper"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="intro-wrapper"
          >
            <Entry3D onEnter={handleEnter} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

