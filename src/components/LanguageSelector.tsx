
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleValueChange = (value: string) => {
    // Apply animation before changing language
    const html = document.querySelector('html');
    if (html) {
      html.classList.add('language-transition');
      setTimeout(() => {
        setLanguage(value as 'es' | 'ca' | 'en');
        html.classList.remove('language-transition');
      }, 300);
    } else {
      setLanguage(value as 'es' | 'ca' | 'en');
    }
  };

  const languageLabels = {
    es: "Español",
    ca: "Català",
    en: "English"
  };

  return (
    <motion.div 
      className="flex items-center"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Select 
        value={language} 
        onValueChange={handleValueChange}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger className={`w-[120px] transition-all duration-300 ${isOpen ? 'ring-2 ring-purple-500' : ''}`}>
          <SelectValue placeholder={t('language')} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languageLabels).map(([key, label]) => (
            <motion.div key={key} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <SelectItem 
                value={key}
                className="cursor-pointer transition-colors hover:bg-purple-50"
              >
                {label}
              </SelectItem>
            </motion.div>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
};

export default LanguageSelector;
