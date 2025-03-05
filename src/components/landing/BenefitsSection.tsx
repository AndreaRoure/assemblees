
import React from 'react';
import { Eye, Users, BarChart3 } from 'lucide-react';
import BenefitCard from './BenefitCard';
import { useLanguage } from '@/contexts/LanguageContext';

const BenefitsSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">{t('benefits.title')}</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
            {t('benefits.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BenefitCard 
            icon={<Eye className="h-10 w-10 text-pink-500" />}
            title={t('benefits.card1.title')}
            description={t('benefits.card1.description')} 
          />
          <BenefitCard 
            icon={<Users className="h-10 w-10 text-indigo-500" />}
            title={t('benefits.card2.title')}
            description={t('benefits.card2.description')} 
          />
          <BenefitCard 
            icon={<BarChart3 className="h-10 w-10 text-blue-500" />}
            title={t('benefits.card3.title')}
            description={t('benefits.card3.description')} 
          />
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
