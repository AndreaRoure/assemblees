
export interface Assembly {
  id: string;
  name: string;
  date: string;
  description?: string;
  register: {
    name: string;
    gender: 'man' | 'woman' | 'non-binary';
  };
}

export interface Intervention {
  id: string;
  assembly_id: string;
  gender: 'man' | 'woman' | 'non-binary';
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
