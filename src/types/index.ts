
export interface Assembly {
  id: string;
  name: string;
  date: string;
  description?: string;
  register: {
    name: string;
    gender: 'man' | 'woman';
  };
}

export interface Intervention {
  id: string;
  assemblyId: string;
  gender: 'man' | 'woman';
  type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva';
  timestamp: number;
}

export interface AssemblyStats {
  totalInterventions: number;
  byGender: {
    man: number;
    woman: number;
  };
  byType: {
    intervencio: number;
    dinamitza: number;
    interrupcio: number;
    llarga: number;
    ofensiva: number;
  };
}
