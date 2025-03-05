
import React from 'react';
import { Building, Users, Star } from 'lucide-react';
import UseCaseCard from './UseCaseCard';
import { useLanguage } from '@/contexts/LanguageContext';

const UseCasesSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">{t('usecases.title')}</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
            {t('usecases.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UseCaseCard 
            icon={<Building className="h-10 w-10 text-blue-600" />}
            title={t('usecases.card1.title')}
            description={t('usecases.card1.description')} 
          />
          <UseCaseCard 
            icon={<Users className="h-10 w-10 text-green-600" />}
            title={t('usecases.card2.title')}
            description={t('usecases.card2.description')} 
          />
          <UseCaseCard 
            icon={<Star className="h-10 w-10 text-yellow-600" />}
            title={t('usecases.card3.title')}
            description={t('usecases.card3.description')} 
          />
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
