
import React from 'react';
import { BarChart3, Users, ClipboardList, Shield, Zap, ChevronRight } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';

const FeaturesSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">{t('features.title')}</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
            {t('features.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<BarChart3 className="h-10 w-10 text-primary" />}
            title={t('features.card1.title')}
            description={t('features.card1.description')} 
          />
          <FeatureCard 
            icon={<Users className="h-10 w-10 text-primary" />}
            title={t('features.card2.title')}
            description={t('features.card2.description')} 
          />
          <FeatureCard 
            icon={<ClipboardList className="h-10 w-10 text-primary" />}
            title={t('features.card3.title')}
            description={t('features.card3.description')} 
          />
          <FeatureCard 
            icon={<Shield className="h-10 w-10 text-primary" />}
            title={t('features.card4.title')}
            description={t('features.card4.description')} 
          />
          <FeatureCard 
            icon={<Zap className="h-10 w-10 text-primary" />}
            title={t('features.card5.title')}
            description={t('features.card5.description')} 
          />
          <div className="flex items-center justify-center p-8 rounded-lg border bg-card shadow-sm">
            <Button variant="outline" className="w-full">
              {t('features.more')}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
