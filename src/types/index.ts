
export interface Assembly {
  id: string;
  name: string;
  date: string;
  description?: string;
}

export interface Intervention {
  id: string;
  assemblyId: string;
  gender: 'man' | 'woman';
  type: 'short' | 'long' | 'interruption' | 'question';
  timestamp: number;
}

export interface AssemblyStats {
  totalInterventions: number;
  byGender: {
    man: number;
    woman: number;
  };
  byType: {
    short: number;
    long: number;
    interruption: number;
    question: number;
  };
}
