
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  
  return (
    <footer className="py-10 border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/51fa830a-0b72-4202-b42d-31a2e9040448.png"
              alt="Logo"
              className="h-8"
            />
            <span className="text-lg font-bold">AssembleaTrack</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {year} AssembleaTrack. {t('footer.rights')}.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
