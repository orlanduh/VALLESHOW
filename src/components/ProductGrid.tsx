import React, { useEffect, useMemo, useRef, useState, MouseEvent } from 'react';
import { AnimatePresence, motion, useInView, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, ShieldCheck, ShoppingBag, Snowflake, Thermometer, X } from 'lucide-react';
import { categoryLabels, products, type Product, type ProductCategory } from '../data/products';

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 180, damping: 24, delay: i * 0.08 },
  }),
};

const categories: Array<ProductCategory | 'todos'> = ['todos', 'exclusive-collection', 'super-premium', 'premium', 'kids', 'casuais', 'botas', 'acessorios'];

const ProductArt: React.FC<{ product: Product }> = ({ product }) => (
  <div
    className={`product-art product-art-${product.category}`}
    style={{
      '--tone-a': product.palette[0],
      '--tone-b': product.palette[1],
      '--tone-c': product.palette[2],
    } as React.CSSProperties}
  >
    <div className="product-art-shadow" />
    <div className="product-art-piece" />
    <div className="product-art-line" />
  </div>
);

const ProductCard: React.FC<{
  product: Product;
  index: number;
  hasAnimated: boolean;
  onInspect: (product: Product) => void;
  onReserve: () => void;
}> = ({ product, index, hasAnimated, onInspect, onReserve }) => (
  <motion.article 
    custom={index}
    variants={cardVariants} 
    initial={hasAnimated ? false : "hidden"}
    animate="visible"
    exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
    whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
    className="product-card" 
    layout
  >
    <div className="product-image-container">
      {product.image ? (
        <img src={product.image} alt={product.name} className="product-image" />
      ) : (
        <ProductArt product={product} />
      )}
      <span className={`product-badge ${product.badge === 'Exclusive' ? 'product-badge-exclusive' : ''}`}>{product.badge}</span>
      <button className="product-inspect" onClick={() => onInspect(product)} aria-label={`Ver ${product.name}`}>
        <Eye size={17} />
      </button>
    </div>

    <div className="product-info">
      <div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-material">{product.material}</p>
      </div>
      <p className="product-price">{product.price}</p>
    </div>

    <div className="product-meta">
      <span>
        <Thermometer size={14} />
        {product.temperature}
      </span>
      <span>{product.origin}</span>
    </div>

    <button className="product-add-btn" onClick={() => window.location.href = 'https://valleshowroomagendamento.as.me/schedule/6ecdcf70/appointment/72004509/calendar/11215975'}>
      <ShoppingBag size={16} />
      Agendar para provar
    </button>
  </motion.article>
);

export const ProductGrid: React.FC = () => {
  const ref = useRef(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const productsAreaRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'todos'>('todos');
  const [animatedFilters, setAnimatedFilters] = useState<Set<string>>(new Set(['todos']));
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reservationCount, setReservationCount] = useState(0);

  // Drag to scroll logic
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    // Reset scroll when category changes
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    // Mark filter as animated after it has been seen once
    setAnimatedFilters(prev => new Set(prev).add(activeCategory));
  }, [activeCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProduct(null);
    };

    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProduct]);

  const handleMouseDown = (e: MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollByAmount = (amount: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleViewExclusiveCollection = () => {
    setActiveCategory('exclusive-collection');

    requestAnimationFrame(() => {
      setTimeout(() => {
        const element = productsAreaRef.current;
        if (!element) return;

        const headerOffset = window.innerWidth < 768 ? 84 : 96;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        if (carouselRef.current) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }, 100);
    });
  };

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'todos') return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="products" className="products-section">
      <motion.div 
        className="products-header"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12, margin: "0px 0px -80px 0px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="products-title">Escolha seu look para a neve</h2>
        <p className="products-intro">
          Conheça uma curadoria de roupas, botas e acessórios disponíveis na Valle Showroom. Nossa coleção completa conta com mais de 50 modelos e variações de cores no espaço físico.
        </p>
      </motion.div>

      <motion.div 
        className="exclusive-spotlight"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12, margin: "0px 0px -80px 0px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="spotlight-content">
          <motion.span 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="spotlight-tag"
          >
            LANÇAMENTO INVERNO 2026
          </motion.span>
          <motion.h3 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="spotlight-title"
          >
            Exclusive Collection
          </motion.h3>
          <motion.h4 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="spotlight-subtitle"
          >
            A nova linha premium da Valle Showroom.
          </motion.h4>
          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="spotlight-text"
          >
            Uma coleção exclusiva de looks de neve criados para unir proteção térmica, estilo e presença. Macacões, conjuntos, botas e acessórios pensados para transformar sua experiência no Chile em um momento inesquecível.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="spotlight-btn" 
            onClick={handleViewExclusiveCollection}
          >
            Ver Exclusive Collection
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        className="collection-toolbar" 
        ref={productsAreaRef}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12, margin: "0px 0px -40px 0px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="category-tabs" aria-label="Categorias">
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? 'active' : ''}
              onClick={() => setActiveCategory(category)}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
        <div className="reservation-pill">
          <ShoppingBag size={16} />
          <span>{reservationCount}</span>
        </div>
      </motion.div>

      <div className="carousel-wrapper" ref={ref}>
        <button className="carousel-arrow left" onClick={() => scrollByAmount(-360)} aria-label="Anterior">
          <ChevronLeft size={24} />
        </button>
        
        <motion.div
          ref={carouselRef}
          variants={gridVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className={`products-carousel ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                hasAnimated={animatedFilters.has(activeCategory)}
                onInspect={setSelectedProduct}
                onReserve={() => setReservationCount((count) => count + 1)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <button className="carousel-arrow right" onClick={() => scrollByAmount(360)} aria-label="Próximo">
          <ChevronRight size={24} />
        </button>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="product-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="product-modal"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="product-modal-close" onClick={() => setSelectedProduct(null)} aria-label="Fechar visualização do produto">
                <X size={20} />
              </button>

              <div className="product-modal-image">
                {selectedProduct.image ? (
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="product-image-modal" />
                ) : (
                  <ProductArt product={selectedProduct} />
                )}
              </div>

              <div className="product-modal-content">
                <span className={`product-badge modal-badge ${selectedProduct.badge === 'Exclusive' ? 'product-badge-exclusive' : ''}`}>{selectedProduct.badge}</span>
                <h3>{selectedProduct.name}</h3>
                <p>{selectedProduct.detail}</p>
                
                <div className="modal-specs">
                  <span><Snowflake size={15} /> {selectedProduct.temperature}</span>
                  <span><ShieldCheck size={15} /> {selectedProduct.stock}</span>
                </div>

                <dl>
                  <div>
                    <dt>Origem</dt>
                    <dd>{selectedProduct.origin}</dd>
                  </div>
                  <div>
                    <dt>Composição</dt>
                    <dd>{selectedProduct.composition}</dd>
                  </div>
                </dl>

                <button className="modal-action" onClick={() => window.location.href = 'https://valleshowroomagendamento.as.me/schedule/6ecdcf70/appointment/72004509/calendar/11215975'}>
                  <ShoppingBag size={16} />
                  Agendar minha data
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
