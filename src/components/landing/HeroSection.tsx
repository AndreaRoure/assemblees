
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center gap-6">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter max-w-3xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          {t('hero.title')}
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Button size="lg" onClick={() => navigate('/signup')}>
            {t('hero.cta')}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            {t('hero.secondary')}
          </Button>
        </div>
        <div className="w-full max-w-3xl mt-6 md:mt-10 relative">
          <img
            src="/placeholder.svg"
            alt="Screenshot of AssembleaTrack dashboard"
            className="rounded-lg border border-gray-200 shadow-lg dark:border-gray-800"
            width={1200}
            height={600}
          />
          <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <span className="text-sm md:text-base font-medium">
              Perspectiva de género
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
