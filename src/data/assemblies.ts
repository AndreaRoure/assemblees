
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

export const deleteAssembly = (id: string) => {
  const index = assemblies.findIndex(a => a.id === id);
  if (index !== -1) {
    assemblies.splice(index, 1);
    // Also delete related interventions
    const filteredInterventions = interventions.filter(i => i.assemblyId !== id);
    interventions.length = 0;
    interventions.push(...filteredInterventions);
  }
};

export const updateAssembly = (id: string, updates: Partial<Omit<Assembly, 'id'>>) => {
  const assembly = assemblies.find(a => a.id === id);
  if (assembly) {
    Object.assign(assembly, updates);
  }
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

export const removeIntervention = (assemblyId: string, type: string, gender: string) => {
  const intervention = [...interventions]
    .reverse()
    .find(i => i.assemblyId === assemblyId && i.type === type && i.gender === gender);
  
  if (intervention) {
    const index = interventions.indexOf(intervention);
    interventions.splice(index, 1);
  }
};

export const getAssemblyStats = (assemblyId: string): AssemblyStats => {
  const assemblyInterventions = interventions.filter(i => i.assemblyId === assemblyId);
  
  return {
    totalInterventions: assemblyInterventions.length,
    byGender: {
      man: assemblyInterventions.filter(i => i.gender === 'man').length,
      woman: assemblyInterventions.filter(i => i.gender === 'woman').length,
      trans: assemblyInterventions.filter(i => i.gender === 'trans').length,
      'non-binary': assemblyInterventions.filter(i => i.gender === 'non-binary').length,
    },
    byType: {
      intervencio: assemblyInterventions.filter(i => i.type === 'intervencio').length,
      dinamitza: assemblyInterventions.filter(i => i.type === 'dinamitza').length,
      interrupcio: assemblyInterventions.filter(i => i.type === 'interrupcio').length,
      llarga: assemblyInterventions.filter(i => i.type === 'llarga').length,
      ofensiva: assemblyInterventions.filter(i => i.type === 'ofensiva').length,
      explica: assemblyInterventions.filter(i => i.type === 'explica').length,
    },
  };
};
