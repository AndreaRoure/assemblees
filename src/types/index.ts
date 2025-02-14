
export interface Assembly {
  id: string;
  name: string;
  date: string;
  description?: string;
  register: {
    name: string;
    gender: 'man' | 'woman' | 'trans' | 'non-binary';
  };
}

export interface Intervention {
  id: string;
  assemblyId: string;
  gender: 'man' | 'woman' | 'trans' | 'non-binary';
  type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva' | 'explica';
  timestamp: number;
}

interface GenderStats {
  intervencio: number;
  dinamitza: number;
  interrupcio: number;
  llarga: number;
  ofensiva: number;
  explica: number;
}

export interface AssemblyStats {
  totalInterventions: number;
  byGender: {
    man: GenderStats;
    woman: GenderStats;
    trans: GenderStats;
    'non-binary': GenderStats;
  };
  byType: {
    intervencio: number;
    dinamitza: number;
    interrupcio: number;
    llarga: number;
    ofensiva: number;
    explica: number;
  };
}
