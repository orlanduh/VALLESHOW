import React from 'react';
import { Camera, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer id="footer" className="footer-section">
    <div className="footer-watermark">
      <img src="/logo valleshow.png" alt="" />
    </div>

    <div className="footer-content">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/logo-valle-completa.png" alt="Valle Showroom" className="footer-logo-img" />
          </div>
          <p className="footer-desc">
            A Valle Showroom oferece a melhor experiência em aluguel de roupas de neve premium em Santiago. Proteção térmica, conforto e muito estilo para a sua viagem.
          </p>
          <div className="footer-signature">Providencia, Santiago</div>
        </div>

        <div className="footer-col">
          <h5 className="footer-title">Navegação</h5>
          <a href="#products" className="footer-link">
            Catálogo
          </a>
          <a href="#kits" className="footer-link">
            Kits e Valores
          </a>
          <a href="#como-alugar" className="footer-link">
            Como Alugar
          </a>
          <a href="#faq" className="footer-link">
            Perguntas Frequentes
          </a>
        </div>

        <div className="footer-col">
          <h5 className="footer-title">Contato</h5>
          <a href="https://api.whatsapp.com/send/?phone=5587996195708&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="footer-link">
            <Phone size={15} />
            WhatsApp
          </a>
          <span className="footer-text">
            <MapPin size={15} />
            Providencia, Santiago
          </span>
          <a
            href="https://www.instagram.com/valleshowroom/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
          >
            <Camera size={16} />
            Instagram
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Valle Showroom</span>
        <span>Todos os direitos reservados</span>
      </div>
    </div>
  </footer>
);
