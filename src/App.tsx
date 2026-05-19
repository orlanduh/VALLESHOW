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

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {!hasEntered && (
          <Entry3D key="entry" onEnter={() => setHasEntered(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasEntered && (
          <motion.div
            key="showroom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

