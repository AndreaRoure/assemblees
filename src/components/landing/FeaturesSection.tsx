
import React from 'react';
import { BarChart3, Users, ClipboardList, Shield, Zap, ChevronRight } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { Button } from "@/components/ui/button";

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Todo lo que necesitas para gestionar tus asambleas</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
            Herramientas potentes para el seguimiento y análisis de la participación democrática
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<BarChart3 className="h-10 w-10 text-primary" />}
            title="Análisis en tiempo real"
            description="Obtén información instantánea sobre patrones de participación y duración de intervenciones por género." 
          />
          <FeatureCard 
            icon={<Users className="h-10 w-10 text-primary" />}
            title="Seguimiento de asistencia"
            description="Monitoriza quién asiste a tus asambleas y haz seguimiento de su participación a lo largo del tiempo." 
          />
          <FeatureCard 
            icon={<ClipboardList className="h-10 w-10 text-primary" />}
            title="Registro de intervenciones"
            description="Registra y analiza quién habla, durante cuánto tiempo y sobre qué temas, desglosado por género." 
          />
          <FeatureCard 
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="Datos seguros"
            description="Tus datos de asamblea se almacenan de forma segura y solo son accesibles para usuarios autorizados." 
          />
          <FeatureCard 
            icon={<Zap className="h-10 w-10 text-primary" />}
            title="Configuración rápida"
            description="Comienza en minutos con nuestra interfaz intuitiva y configuración guiada." 
          />
          <div className="flex items-center justify-center p-8 rounded-lg border bg-card shadow-sm">
            <Button variant="outline" className="w-full">
              Explorar todas las funciones
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
