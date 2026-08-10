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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      availability_slots: {
        Row: {
          created_at: string
          day_of_week: number
          doctor_id: string
          end_time: string
          id: string
          is_active: boolean
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          doctor_id: string
          end_time: string
          id?: string
          is_active?: boolean
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          doctor_id?: string
          end_time?: string
          id?: string
          is_active?: boolean
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_leaves: {
        Row: {
          created_at: string
          doctor_id: string
          end_date: string
          id: string
          reason: string | null
          start_date: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          end_date: string
          id?: string
          reason?: string | null
          start_date: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          end_date?: string
          id?: string
          reason?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_leaves_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          area: string | null
          bio: string | null
          consultation_fee: number | null
          created_at: string
          district: string | null
          experience_years: number | null
          full_name: string
          gender: string | null
          hospital_name: string | null
          id: string
          languages: string[] | null
          profile_image_url: string | null
          room_number: string | null
          specialization: string | null
          state: string | null
          status: string
          updated_at: string
          user_id: string | null
          clinic_id: string | null
          qualification: string | null
        }
        Insert: {
          area?: string | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          district?: string | null
          experience_years?: number | null
          full_name?: string
          gender?: string | null
          hospital_name?: string | null
          id?: string
          languages?: string[] | null
          profile_image_url?: string | null
          room_number?: string | null
          specialization?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          clinic_id?: string | null
          qualification?: string | null
        }
        Update: {
          area?: string | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          district?: string | null
          experience_years?: number | null
          full_name?: string
          gender?: string | null
          hospital_name?: string | null
          id?: string
          languages?: string[] | null
          profile_image_url?: string | null
          room_number?: string | null
          specialization?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          clinic_id?: string | null
          qualification?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          }
        ]
      }
      ratings: {
        Row: {
          id: string
          user_id: string
          target_id: string
          target_type: string
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_id: string
          target_type: string
          rating: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_id?: string
          target_type?: string
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      clinics: {
        Row: {
          id: string
          user_id: string
          name: string
          address: string | null
          state: string | null
          district: string | null
          latitude: number | null
          longitude: number | null
          contact_number: string | null
          is_approved: boolean | null
          created_at: string | null
          updated_at: string | null
          logo_url: string | null
          description: string | null
          registration_number: string | null
          year_established: number | null
          country: string | null
          city: string | null
          area: string | null
          landmark: string | null
          pincode: string | null
          google_maps_url: string | null
          contact_person: string | null
          alternate_number: string | null
          email: string | null
          website: string | null
          whatsapp_number: string | null
          clinic_type: string | null
          services: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          address?: string | null
          state?: string | null
          district?: string | null
          latitude?: number | null
          longitude?: number | null
          contact_number?: string | null
          is_approved?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          logo_url?: string | null
          description?: string | null
          registration_number?: string | null
          year_established?: number | null
          country?: string | null
          city?: string | null
          area?: string | null
          landmark?: string | null
          pincode?: string | null
          google_maps_url?: string | null
          contact_person?: string | null
          alternate_number?: string | null
          email?: string | null
          website?: string | null
          whatsapp_number?: string | null
          clinic_type?: string | null
          services?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          address?: string | null
          state?: string | null
          district?: string | null
          latitude?: number | null
          longitude?: number | null
          contact_number?: string | null
          is_approved?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          logo_url?: string | null
          description?: string | null
          registration_number?: string | null
          year_established?: number | null
          country?: string | null
          city?: string | null
          area?: string | null
          landmark?: string | null
          pincode?: string | null
          google_maps_url?: string | null
          contact_person?: string | null
          alternate_number?: string | null
          email?: string | null
          website?: string | null
          whatsapp_number?: string | null
          clinic_type?: string | null
          services?: string[] | null
        }
        Relationships: []
      }
      ambulances: {
        Row: {
          id: string
          user_id: string
          provider_type: string
          is_approved: boolean | null
          created_at: string | null
          updated_at: string | null
          name: string
          organization_name: string | null
          description: string | null
          logo_url: string | null
          country: string | null
          state: string | null
          district: string | null
          city: string | null
          area: string | null
          base_hospital: string | null
          address: string | null
          landmark: string | null
          pincode: string | null
          google_maps_url: string | null
          latitude: number | null
          longitude: number | null
          emergency_number: string
          alternate_number: string | null
          control_room_number: string | null
          email: string | null
          website: string | null
          ambulance_types: string[] | null
          fleet_size: number | null
          coverage_area: string | null
          medical_facilities: string[] | null
          is_24_7: boolean | null
          operating_days: string | null
          operating_hours: string | null
          current_status: string | null
          response_time: string | null
          service_features: string[] | null
          govt_department_name: string | null
          license_number: string | null
          year_started: number | null
          contact_person_name: string | null
          whatsapp_number: string | null
          vehicle_type: string | null
          vehicle_model: string | null
          vehicle_registration: string | null
          vehicle_color: string | null
          passenger_capacity: number | null
          has_ac: boolean | null
          driver_name: string | null
          driver_mobile: string | null
          driver_experience_years: number | null
          driver_photo_url: string | null
          driver_emergency_contact: string | null
          base_fare: number | null
          charge_per_km: number | null
          night_charges: number | null
          waiting_charges: number | null
          service_radius_km: number | null
          cities_covered: string | null
          areas_covered: string | null
          has_sos_button: boolean | null
          has_female_driver: boolean | null
          is_wheelchair_accessible: boolean | null
          has_first_aid: boolean | null
          has_phone_charging: boolean | null
          aadhaar_card_url: string | null
          night_service_available: boolean | null
        }
        Insert: {
          id?: string
          user_id: string
          provider_type: string
          is_approved?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          name: string
          organization_name?: string | null
          description?: string | null
          logo_url?: string | null
          country?: string | null
          state?: string | null
          district?: string | null
          city?: string | null
          area?: string | null
          base_hospital?: string | null
          address?: string | null
          landmark?: string | null
          pincode?: string | null
          google_maps_url?: string | null
          latitude?: number | null
          longitude?: number | null
          emergency_number: string
          alternate_number?: string | null
          control_room_number?: string | null
          email?: string | null
          website?: string | null
          ambulance_types?: string[] | null
          fleet_size?: number | null
          coverage_area?: string | null
          medical_facilities?: string[] | null
          is_24_7?: boolean | null
          operating_days?: string | null
          operating_hours?: string | null
          current_status?: string | null
          response_time?: string | null
          service_features?: string[] | null
          govt_department_name?: string | null
          license_number?: string | null
          year_started?: number | null
          contact_person_name?: string | null
          whatsapp_number?: string | null
          vehicle_type?: string | null
          vehicle_model?: string | null
          vehicle_registration?: string | null
          vehicle_color?: string | null
          passenger_capacity?: number | null
          has_ac?: boolean | null
          driver_name?: string | null
          driver_mobile?: string | null
          driver_experience_years?: number | null
          driver_photo_url?: string | null
          driver_emergency_contact?: string | null
          base_fare?: number | null
          charge_per_km?: number | null
          night_charges?: number | null
          waiting_charges?: number | null
          service_radius_km?: number | null
          cities_covered?: string | null
          areas_covered?: string | null
          has_sos_button?: boolean | null
          has_female_driver?: boolean | null
          is_wheelchair_accessible?: boolean | null
          has_first_aid?: boolean | null
          has_phone_charging?: boolean | null
          aadhaar_card_url?: string | null
          night_service_available?: boolean | null
        }
        Update: {
          id?: string
          user_id?: string
          provider_type?: string
          is_approved?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          name?: string
          organization_name?: string | null
          description?: string | null
          logo_url?: string | null
          country?: string | null
          state?: string | null
          district?: string | null
          city?: string | null
          area?: string | null
          base_hospital?: string | null
          address?: string | null
          landmark?: string | null
          pincode?: string | null
          google_maps_url?: string | null
          latitude?: number | null
          longitude?: number | null
          emergency_number?: string
          alternate_number?: string | null
          control_room_number?: string | null
          email?: string | null
          website?: string | null
          ambulance_types?: string[] | null
          fleet_size?: number | null
          coverage_area?: string | null
          medical_facilities?: string[] | null
          is_24_7?: boolean | null
          operating_days?: string | null
          operating_hours?: string | null
          current_status?: string | null
          response_time?: string | null
          service_features?: string[] | null
          govt_department_name?: string | null
          license_number?: string | null
          year_started?: number | null
          contact_person_name?: string | null
          whatsapp_number?: string | null
          vehicle_type?: string | null
          vehicle_model?: string | null
          vehicle_registration?: string | null
          vehicle_color?: string | null
          passenger_capacity?: number | null
          has_ac?: boolean | null
          driver_name?: string | null
          driver_mobile?: string | null
          driver_experience_years?: number | null
          driver_photo_url?: string | null
          driver_emergency_contact?: string | null
          base_fare?: number | null
          charge_per_km?: number | null
          night_charges?: number | null
          waiting_charges?: number | null
          service_radius_km?: number | null
          cities_covered?: string | null
          areas_covered?: string | null
          has_sos_button?: boolean | null
          has_female_driver?: boolean | null
          is_wheelchair_accessible?: boolean | null
          has_first_aid?: boolean | null
          has_phone_charging?: boolean | null
          aadhaar_card_url?: string | null
          night_service_available?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          district: string | null
          full_name: string | null
          id: string
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          district?: string | null
          full_name?: string | null
          id?: string
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          district?: string | null
          full_name?: string | null
          id?: string
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "doctor" | "patient" | "clinic" | "ambulance"
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
    Enums: {
      app_role: ["admin", "doctor", "patient", "clinic", "ambulance"],
    },
  },
} as const
