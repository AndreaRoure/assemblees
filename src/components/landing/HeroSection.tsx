
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center gap-6">
        <h1 
          className={`text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter max-w-3xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {t('hero.title')}
        </h1>
        <p 
          className={`mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {t('hero.subtitle')}
        </p>
        <div 
          className={`flex flex-col md:flex-row gap-4 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <Button 
            size="lg" 
            onClick={() => navigate('/signup')}
            className="transform transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            {t('hero.cta')}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="transform transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            {t('hero.secondary')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
