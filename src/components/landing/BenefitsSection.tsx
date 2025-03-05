
import React from 'react';
import { Eye, Users, BarChart3 } from 'lucide-react';
import BenefitCard from './BenefitCard';

const BenefitsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Beneficios con perspectiva de género</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
            Descubre cómo AssembleaTrack puede transformar tus reuniones y asambleas
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BenefitCard 
            icon={<Eye className="h-10 w-10 text-pink-500" />}
            title="Visibiliza desigualdades"
            description="Detecta y visualiza patrones de participación desigual basados en género en tus asambleas y reuniones." 
          />
          <BenefitCard 
            icon={<Users className="h-10 w-10 text-indigo-500" />}
            title="Promueve la diversidad"
            description="Fomenta la participación equilibrada de todos los géneros en tus espacios de toma de decisiones." 
          />
          <BenefitCard 
            icon={<BarChart3 className="h-10 w-10 text-blue-500" />}
            title="Datos desagregados"
            description="Analiza tendencias y comportamientos según género para identificar áreas de mejora." 
          />
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
