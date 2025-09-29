export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assemblies: {
        Row: {
          date: string
          description: string | null
          id: string
          moderador_id: string | null
          name: string
          register: Json
          secretari_id: string | null
        }
        Insert: {
          date: string
          description?: string | null
          id?: string
          moderador_id?: string | null
          name: string
          register?: Json
          secretari_id?: string | null
        }
        Update: {
          date?: string
          description?: string | null
          id?: string
          moderador_id?: string | null
          name?: string
          register?: Json
          secretari_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assemblies_moderador_id_fkey"
            columns: ["moderador_id"]
            isOneToOne: false
            referencedRelation: "socias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assemblies_secretari_id_fkey"
            columns: ["secretari_id"]
            isOneToOne: false
            referencedRelation: "socias"
            referencedColumns: ["id"]
          },
        ]
      }
      assembly_attendance: {
        Row: {
          assembly_id: string | null
          female_count: number | null
          id: string
          male_count: number | null
          non_binary_count: number | null
        }
        Insert: {
          assembly_id?: string | null
          female_count?: number | null
          id?: string
          male_count?: number | null
          non_binary_count?: number | null
        }
        Update: {
          assembly_id?: string | null
          female_count?: number | null
          id?: string
          male_count?: number | null
          non_binary_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assembly_attendance_assembly_id_fkey"
            columns: ["assembly_id"]
            isOneToOne: true
            referencedRelation: "assemblies"
            referencedColumns: ["id"]
          },
        ]
      }
      interventions: {
        Row: {
          assembly_id: string
          gender: string
          id: string
          timestamp: number
          type: string
        }
        Insert: {
          assembly_id: string
          gender: string
          id?: string
          timestamp?: number
          type: string
        }
        Update: {
          assembly_id?: string
          gender?: string
          id?: string
          timestamp?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_assembly"
            columns: ["assembly_id"]
            isOneToOne: false
            referencedRelation: "assemblies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_assembly_id_fkey"
            columns: ["assembly_id"]
            isOneToOne: false
            referencedRelation: "assemblies"
            referencedColumns: ["id"]
          },
        ]
      }
      socia_assemblies: {
        Row: {
          assembly_id: string
          assisteix: boolean
          created_at: string
          id: string
          socia_id: string
        }
        Insert: {
          assembly_id: string
          assisteix?: boolean
          created_at?: string
          id?: string
          socia_id: string
        }
        Update: {
          assembly_id?: string
          assisteix?: boolean
          created_at?: string
          id?: string
          socia_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "socia_assemblies_assembly_id_fkey"
            columns: ["assembly_id"]
            isOneToOne: false
            referencedRelation: "assemblies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "socia_assemblies_socia_id_fkey"
            columns: ["socia_id"]
            isOneToOne: false
            referencedRelation: "socias"
            referencedColumns: ["id"]
          },
        ]
      }
      socias: {
        Row: {
          cognoms: string
          comissions: string[] | null
          created_at: string
          genere: string
          id: string
          nom: string
          tipo: string
          updated_at: string
        }
        Insert: {
          cognoms: string
          comissions?: string[] | null
          created_at?: string
          genere: string
          id?: string
          nom: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          cognoms?: string
          comissions?: string[] | null
          created_at?: string
          genere?: string
          id?: string
          nom?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
