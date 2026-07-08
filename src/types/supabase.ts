export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          language_preference: string | null;
          first_name: string | null;
          last_name: string | null;
          phone_number: string | null;
          date_of_birth: string | null;
          country: string | null;
          state_province: string | null;
          city: string | null;
          address_line: string | null;
          gender: string | null;
          height_cm: number | null;
          weight_kg: number | null;
          occupation: string | null;
          member_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          language_preference?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          phone_number?: string | null;
          date_of_birth?: string | null;
          country?: string | null;
          state_province?: string | null;
          city?: string | null;
          address_line?: string | null;
          gender?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          occupation?: string | null;
          member_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: Database["public"]["Enums"]["app_role"];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: Database["public"]["Enums"]["app_role"];
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_roles"]["Insert"]>;
        Relationships: [];
      };
      onboarding_data: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          age: number;
          sex: string;
          height_cm: number;
          weight_kg: number;
          main_goal: string;
          secondary_goals: string[] | null;
          sleep_duration: number | null;
          sleep_quality: number;
          stress_level: number;
          energy_level: number;
          hrv: number | null;
          resting_heart_rate: number | null;
          exercise_frequency: string;
          diet_style: string;
          waist_circumference_cm: number | null;
          body_fat_percent: number | null;
          fasting_hours: number | null;
          eating_window_hours: number | null;
          sugar_craving_frequency: string | null;
          afternoon_energy_crash_frequency: string | null;
          focus_level: number | null;
          brain_fog_frequency: string | null;
          caffeine_intake: string | null;
          productivity_goal: string | null;
          alcohol_use: string | null;
          nicotine_use: string | null;
          family_history_notes: string | null;
          longevity_concern: string | null;
          skin_quality: number | null;
          hydration_level: number | null;
          beauty_concern: string | null;
          supplements: string | null;
          medications: string | null;
          peptides: string | null;
          wearables_used: string | null;
          disclaimer_confirmed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          age: number;
          sex: string;
          height_cm: number;
          weight_kg: number;
          main_goal: string;
          secondary_goals?: string[] | null;
          sleep_duration?: number | null;
          sleep_quality: number;
          stress_level: number;
          energy_level: number;
          hrv?: number | null;
          resting_heart_rate?: number | null;
          exercise_frequency: string;
          diet_style: string;
          waist_circumference_cm?: number | null;
          body_fat_percent?: number | null;
          fasting_hours?: number | null;
          eating_window_hours?: number | null;
          sugar_craving_frequency?: string | null;
          afternoon_energy_crash_frequency?: string | null;
          focus_level?: number | null;
          brain_fog_frequency?: string | null;
          caffeine_intake?: string | null;
          productivity_goal?: string | null;
          alcohol_use?: string | null;
          nicotine_use?: string | null;
          family_history_notes?: string | null;
          longevity_concern?: string | null;
          skin_quality?: number | null;
          hydration_level?: number | null;
          beauty_concern?: string | null;
          supplements?: string | null;
          medications?: string | null;
          peptides?: string | null;
          wearables_used?: string | null;
          disclaimer_confirmed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["onboarding_data"]["Insert"]>;
        Relationships: [];
      };
      biomarker_entries: {
        Row: {
          id: string;
          user_id: string;
          fasting_glucose: number | null;
          hba1c: number | null;
          insulin: number | null;
          crp: number | null;
          vitamin_d: number | null;
          testosterone: number | null;
          cortisol: number | null;
          hrv: number | null;
          resting_heart_rate: number | null;
          sleep_duration: number | null;
          deep_sleep: number | null;
          rem_sleep: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          fasting_glucose?: number | null;
          hba1c?: number | null;
          insulin?: number | null;
          crp?: number | null;
          vitamin_d?: number | null;
          testosterone?: number | null;
          cortisol?: number | null;
          hrv?: number | null;
          resting_heart_rate?: number | null;
          sleep_duration?: number | null;
          deep_sleep?: number | null;
          rem_sleep?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["biomarker_entries"]["Insert"]>;
        Relationships: [];
      };
      pillar_scores: {
        Row: {
          id: string;
          user_id: string;
          pillar: string;
          score: number;
          status: string;
          metrics: Json;
          suggested_next_action: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pillar: string;
          score: number;
          status: string;
          metrics?: Json;
          suggested_next_action: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pillar_scores"]["Insert"]>;
        Relationships: [];
      };
      ai_chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          content: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_chat_messages"]["Insert"]>;
        Relationships: [];
      };
      generated_protocols: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          goal: string;
          weakest_pillar: string | null;
          intensity: string;
          protocol_json: Json | null;
          protocol: Json;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          goal: string;
          weakest_pillar?: string | null;
          intensity?: string;
          protocol_json?: Json | null;
          protocol: Json;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["generated_protocols"]["Insert"]>;
        Relationships: [];
      };
      lab_reports: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          file_type: string;
          file_path: string;
          upload_date: string;
          processing_status: string;
          analysis_json: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_name: string;
          file_type: string;
          file_path: string;
          upload_date?: string;
          processing_status?: string;
          analysis_json?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lab_reports"]["Insert"]>;
        Relationships: [];
      };
      memberships: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          join_date: string;
          plan_code: string | null;
          billing_provider: string | null;
          billing_customer_id: string | null;
          billing_subscription_id: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: string;
          join_date?: string;
          plan_code?: string | null;
          billing_provider?: string | null;
          billing_customer_id?: string | null;
          billing_subscription_id?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["memberships"]["Insert"]>;
        Relationships: [];
      };
      member_consents: {
        Row: {
          id: string;
          user_id: string;
          age_certified_at: string;
          educational_content_accepted_at: string;
          terms_accepted_at: string;
          privacy_accepted_at: string;
          consent_version: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          age_certified_at: string;
          educational_content_accepted_at: string;
          terms_accepted_at: string;
          privacy_accepted_at: string;
          consent_version?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["member_consents"]["Insert"]>;
        Relationships: [];
      };
      compliance_audit_logs: {
        Row: {
          id: string;
          user_id: string;
          event_type: string;
          event_data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_type: string;
          event_data?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["compliance_audit_logs"]["Insert"]>;
        Relationships: [];
      };
      member_admin_metadata: {
        Row: {
          user_id: string;
          notes: string | null;
          risk_flags: string[];
          compliance_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          notes?: string | null;
          risk_flags?: string[];
          compliance_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["member_admin_metadata"]["Insert"]>;
        Relationships: [];
      };
      biometrics: {
        Row: {
          id: string;
          user_id: string;
          metric_type: string;
          value: number | null;
          text_value: string | null;
          unit: string | null;
          source: string;
          measured_at: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          metric_type: string;
          value?: number | null;
          text_value?: string | null;
          unit?: string | null;
          source?: string;
          measured_at?: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["biometrics"]["Insert"]>;
        Relationships: [];
      };
      wearable_connections: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          external_user_id: string | null;
          status: string;
          connected_at: string | null;
          last_synced_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          external_user_id?: string | null;
          status?: string;
          connected_at?: string | null;
          last_synced_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["wearable_connections"]["Insert"]>;
        Relationships: [];
      };
      bloodwork_records: {
        Row: {
          id: string;
          user_id: string;
          lab_report_id: string | null;
          panel_name: string | null;
          laboratory_name: string | null;
          collected_at: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lab_report_id?: string | null;
          panel_name?: string | null;
          laboratory_name?: string | null;
          collected_at?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bloodwork_records"]["Insert"]>;
        Relationships: [];
      };
      protocol_history: {
        Row: {
          id: string;
          user_id: string;
          protocol_id: string | null;
          status: string;
          started_at: string;
          completed_at: string | null;
          protocol_snapshot: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          protocol_id?: string | null;
          status?: string;
          started_at?: string;
          completed_at?: string | null;
          protocol_snapshot?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["protocol_history"]["Insert"]>;
        Relationships: [];
      };
      health_goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string | null;
          target_value: number | null;
          target_unit: string | null;
          target_date: string | null;
          status: string;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          category?: string | null;
          target_value?: number | null;
          target_unit?: string | null;
          target_date?: string | null;
          status?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["health_goals"]["Insert"]>;
        Relationships: [];
      };
      biological_insights: {
        Row: {
          id: string;
          user_id: string;
          source_type: string;
          source_id: string | null;
          insight_type: string;
          pillar: string;
          severity: string;
          confidence_score: number;
          title: string;
          summary: string;
          evidence: Json;
          recommended_actions: Json;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_type: string;
          source_id?: string | null;
          insight_type: string;
          pillar: string;
          severity?: string;
          confidence_score?: number;
          title: string;
          summary: string;
          evidence?: Json;
          recommended_actions?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["biological_insights"]["Insert"]>;
        Relationships: [];
      };
      adaptive_missions: {
        Row: {
          id: string;
          user_id: string;
          mission_name: string;
          primary_pillar: string;
          constraint: string;
          confidence: number;
          progress: number;
          phases: Json;
          actions: Json;
          tracking_signals: Json;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          mission_name: string;
          primary_pillar: string;
          constraint: string;
          confidence?: number;
          progress?: number;
          phases?: Json;
          actions?: Json;
          tracking_signals?: Json;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["adaptive_missions"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      has_role: {
        Args: {
          _user_id: string;
          _role: Database["public"]["Enums"]["app_role"];
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "member";
    };
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends { Row: infer R }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends { Row: infer R }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends { Insert: infer I }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends { Insert: infer I }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends { Update: infer U }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends { Update: infer U }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
