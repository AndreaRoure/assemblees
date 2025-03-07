
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
    <div className="flex items-center">
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
            <SelectItem 
              key={key} 
              value={key}
              className="cursor-pointer transition-colors hover:bg-purple-50"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
