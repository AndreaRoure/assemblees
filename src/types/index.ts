
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
  type: 'intervencio' | 'dinamitza' | 'interrupcio' | 'llarga' | 'ofensiva';
  timestamp: number;
}

export interface AssemblyStats {
  totalInterventions: number;
  byGender: {
    man: number;
    woman: number;
    trans: number;
    'non-binary': number;
  };
  byType: {
    intervencio: number;
    dinamitza: number;
    interrupcio: number;
    llarga: number;
    ofensiva: number;
  };
}
