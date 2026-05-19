import React from 'react';
import { CreditCard, MapPin, Clock, Map } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
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

export const Location: React.FC = () => {
  return (
    <section id="localizacao" className="location-section">
      <div className="location-container">
        <motion.div 
          className="location-content"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.span variants={fadeUp} className="section-eyebrow">Localização</motion.span>
          <motion.h2 variants={fadeUp} className="location-title">Onde nos encontrar</motion.h2>
          <motion.p variants={fadeUp} className="location-intro">
            Nosso showroom está localizado em Providencia, uma das regiões mais práticas e acessíveis de Santiago. Um espaço pensado para você escolher suas peças com conforto antes de subir a montanha.
          </motion.p>

          <div className="location-info-blocks">
            <motion.div variants={fadeUp} className="info-block">
              <div className="info-icon">
                <MapPin size={24} color="var(--ink)" />
              </div>
              <div className="info-text">
                <strong>Valle Showroom</strong>
                <span>Av. Providencia 1208, Oficina 213<br/>Providencia, Santiago, Chile</span>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="info-block">
              <div className="info-icon">
                <Clock size={24} color="var(--ink)" />
              </div>
              <div className="info-text">
                <strong>Horário</strong>
                <span>Todos os dias, das 12h às 22h</span>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="info-block">
              <div className="info-icon">
                <CreditCard size={24} color="var(--ink)" />
              </div>
              <div className="info-text">
                <strong>Pagamento facilitado</strong>
                <span>Dinheiro em Real, Peso Chileno e Dólar, cartão de crédito com parcelamento e Pix.</span>
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="location-actions">
            <a 
              href="https://www.google.com/maps?q=Valle+Showroom+-+Av.+Providencia+1208,+Oficina+213,+7500571+Providencia,+Regi%C3%B3n+Metropolitana,+Chile&ftid=0x9662cff855e483d5:0xba546f5a04dcc066&entry=gps&shh=CAE&lucs=,94297699,94284496,94231188,94280568,47071704,94266209,94218641,94282134,94286869&g_ep=CAISEjI2LjA4LjIuODcwOTc4MTE2MBgAINeCAypRLDk0Mjk3Njk5LDk0Mjg0NDk2LDk0MjMxMTg4LDk0MjgwNTY4LDQ3MDcxNzA0LDk0MjY2MjA5LDk0MjE4NjQxLDk0MjgyMTM0LDk0Mjg2ODY5QgJCUg%3D%3D&skid=9eb4dafe-7b70-45a5-90d1-dcf62ac18988&g_st=iw" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="location-btn secondary"
            >
              <Map size={18} />
              Ver rota no Google Maps
            </a>
            <a 
              href="https://valleshowroomagendamento.as.me/schedule/6ecdcf70/appointment/72004509/calendar/11215975" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="location-btn primary"
            >
              Agendar minha visita
            </a>
          </motion.div>
        </motion.div>

        <motion.div 
          className="location-map"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <iframe
            title="Localização Valle Showroom"
            src="https://www.google.com/maps?q=Valle%20Showroom%20Av.%20Providencia%201208%20Oficina%20213%20Providencia%20Chile&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
};
