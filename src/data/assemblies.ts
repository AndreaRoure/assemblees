
import { Assembly, Intervention, AssemblyStats } from '@/types';

export const assemblies: Assembly[] = [];
export const interventions: Intervention[] = [];

export const addAssembly = (assembly: Omit<Assembly, 'id'>) => {
  const newAssembly = {
    ...assembly,
    id: Math.random().toString(36).substring(7),
  };
  assemblies.unshift(newAssembly);
  return newAssembly;
};

export const addIntervention = (intervention: Omit<Intervention, 'id' | 'timestamp'>) => {
  const newIntervention = {
    ...intervention,
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
  };
  interventions.push(newIntervention);
  return newIntervention;
};

export const getAssemblyStats = (assemblyId: string): AssemblyStats => {
  const assemblyInterventions = interventions.filter(i => i.assemblyId === assemblyId);
  
  return {
    totalInterventions: assemblyInterventions.length,
    byGender: {
      man: assemblyInterventions.filter(i => i.gender === 'man').length,
      woman: assemblyInterventions.filter(i => i.gender === 'woman').length,
    },
    byType: {
      short: assemblyInterventions.filter(i => i.type === 'short').length,
      long: assemblyInterventions.filter(i => i.type === 'long').length,
      interruption: assemblyInterventions.filter(i => i.type === 'interruption').length,
      question: assemblyInterventions.filter(i => i.type === 'question').length,
    },
  };
};
