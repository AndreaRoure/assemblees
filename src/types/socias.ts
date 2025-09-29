export interface Socia {
  id: string;
  nom: string;
  cognoms: string;
  genere: 'home' | 'dona' | 'trans' | 'no-binari';
  created_at: string;
  updated_at: string;
}

export interface SociaAssembly {
  id: string;
  socia_id: string;
  assembly_id: string;
  assisteix: boolean;
  created_at: string;
}

export interface SociaWithStats extends Socia {
  assemblies_attended: number;
  assemblies_missed: number;
  total_assemblies: number;
  moderations: number;
  secretary_records: number;
}