
import React from 'react';
import { Building, Users, Star } from 'lucide-react';
import UseCaseCard from './UseCaseCard';

const UseCasesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Casos de uso</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
            Descubre cómo distintas organizaciones aprovechan AssembleaTrack
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UseCaseCard 
            icon={<Building className="h-10 w-10 text-blue-600" />}
            title="Empresas"
            description="Mejora la inclusión y diversidad en reuniones corporativas monitorizando la participación por género." 
          />
          <UseCaseCard 
            icon={<Users className="h-10 w-10 text-green-600" />}
            title="Asociaciones"
            description="Garantiza que todas las voces sean escuchadas en asambleas y reuniones comunitarias." 
          />
          <UseCaseCard 
            icon={<Star className="h-10 w-10 text-yellow-600" />}
            title="Instituciones"
            description="Implementa políticas de igualdad efectivas basadas en datos reales de participación." 
          />
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
