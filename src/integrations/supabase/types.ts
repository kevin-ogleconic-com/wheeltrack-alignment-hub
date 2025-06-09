export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alignment_records: {
        Row: {
          after_measurements: Json | null
          alignment_type: string | null
          before_measurements: Json | null
          completion_status: string | null
          created_at: string
          customer_name: string | null
          customer_phone: string | null
          front_left_camber: number | null
          front_left_caster: number | null
          front_left_toe: number | null
          front_right_camber: number | null
          front_right_caster: number | null
          front_right_toe: number | null
          id: string
          license_plate: string | null
          mileage: number | null
          notes: string | null
          rear_left_camber: number | null
          rear_left_toe: number | null
          rear_right_camber: number | null
          rear_right_toe: number | null
          service_advisor: string | null
          specifications: Json | null
          technician_name: string | null
          updated_at: string
          user_id: string
          vehicle_make: string
          vehicle_model: string
          vehicle_year: number
          vin: string | null
          work_order_number: string | null
        }
        Insert: {
          after_measurements?: Json | null
          alignment_type?: string | null
          before_measurements?: Json | null
          completion_status?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          front_left_camber?: number | null
          front_left_caster?: number | null
          front_left_toe?: number | null
          front_right_camber?: number | null
          front_right_caster?: number | null
          front_right_toe?: number | null
          id?: string
          license_plate?: string | null
          mileage?: number | null
          notes?: string | null
          rear_left_camber?: number | null
          rear_left_toe?: number | null
          rear_right_camber?: number | null
          rear_right_toe?: number | null
          service_advisor?: string | null
          specifications?: Json | null
          technician_name?: string | null
          updated_at?: string
          user_id: string
          vehicle_make: string
          vehicle_model: string
          vehicle_year: number
          vin?: string | null
          work_order_number?: string | null
        }
        Update: {
          after_measurements?: Json | null
          alignment_type?: string | null
          before_measurements?: Json | null
          completion_status?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          front_left_camber?: number | null
          front_left_caster?: number | null
          front_left_toe?: number | null
          front_right_camber?: number | null
          front_right_caster?: number | null
          front_right_toe?: number | null
          id?: string
          license_plate?: string | null
          mileage?: number | null
          notes?: string | null
          rear_left_camber?: number | null
          rear_left_toe?: number | null
          rear_right_camber?: number | null
          rear_right_toe?: number | null
          service_advisor?: string | null
          specifications?: Json | null
          technician_name?: string | null
          updated_at?: string
          user_id?: string
          vehicle_make?: string
          vehicle_model?: string
          vehicle_year?: number
          vin?: string | null
          work_order_number?: string | null
        }
        Relationships: []
      }
      devices: {
        Row: {
          assigned_at: string | null
          created_at: string | null
          id: string
          status: string | null
          uid: string
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          uid: string
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          uid?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicle_specifications: {
        Row: {
          created_at: string
          front_camber_max: number | null
          front_camber_min: number | null
          front_caster_max: number | null
          front_caster_min: number | null
          front_toe_max: number | null
          front_toe_min: number | null
          id: string
          make: string
          model: string
          rear_camber_max: number | null
          rear_camber_min: number | null
          rear_toe_max: number | null
          rear_toe_min: number | null
          trim_level: string | null
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          front_camber_max?: number | null
          front_camber_min?: number | null
          front_caster_max?: number | null
          front_caster_min?: number | null
          front_toe_max?: number | null
          front_toe_min?: number | null
          id?: string
          make: string
          model: string
          rear_camber_max?: number | null
          rear_camber_min?: number | null
          rear_toe_max?: number | null
          rear_toe_min?: number | null
          trim_level?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          front_camber_max?: number | null
          front_camber_min?: number | null
          front_caster_max?: number | null
          front_caster_min?: number | null
          front_toe_max?: number | null
          front_toe_min?: number | null
          id?: string
          make?: string
          model?: string
          rear_camber_max?: number | null
          rear_camber_min?: number | null
          rear_toe_max?: number | null
          rear_toe_min?: number | null
          trim_level?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_device_to_user: {
        Args: { device_uid: string }
        Returns: {
          assigned_at: string | null
          created_at: string | null
          id: string
          status: string | null
          uid: string
          user_id: string | null
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      update_device_auth_timestamp: {
        Args: { _uid_96bit: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "technical_support" | "standard_user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "technical_support", "standard_user"],
    },
  },
} as const
