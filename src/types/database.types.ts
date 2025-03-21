export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      questions_hints: {
        Row: {
          content: string | null
          created_at: string
          id: number
          name: string | null
          question_id: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          name?: string | null
          question_id?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          name?: string | null
          question_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_hints_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quizzes_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_submission_answers: {
        Row: {
          created_at: string
          failed_attempts: number | null
          id: number
          is_answered_correctly: boolean | null
          is_skipped: boolean
          question: number | null
          quiz_submission: number | null
          responses: Json | null
          seconds_spent: number | null
        }
        Insert: {
          created_at?: string
          failed_attempts?: number | null
          id?: number
          is_answered_correctly?: boolean | null
          is_skipped?: boolean
          question?: number | null
          quiz_submission?: number | null
          responses?: Json | null
          seconds_spent?: number | null
        }
        Update: {
          created_at?: string
          failed_attempts?: number | null
          id?: number
          is_answered_correctly?: boolean | null
          is_skipped?: boolean
          question?: number | null
          quiz_submission?: number | null
          responses?: Json | null
          seconds_spent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_submission_answers_question_fkey"
            columns: ["question"]
            isOneToOne: false
            referencedRelation: "quizzes_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_submission_answers_quiz_submission_fkey"
            columns: ["quiz_submission"]
            isOneToOne: false
            referencedRelation: "quiz_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_submissions: {
        Row: {
          created_at: string
          id: number
          quiz: number | null
          seconds_spent: number | null
          user: string | null
          xp_gained: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          quiz?: number | null
          seconds_spent?: number | null
          user?: string | null
          xp_gained?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          quiz?: number | null
          seconds_spent?: number | null
          user?: string | null
          xp_gained?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_submissions_quiz_id_fkey"
            columns: ["quiz"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_submissions_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      quizzes: {
        Row: {
          author_id: string | null
          category: number | null
          created_at: string
          credit_cost: number | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty"] | null
          id: number
          image: string | null
          is_featured: boolean
          name: string
          publishing_status: Database["public"]["Enums"]["publishing_status"]
        }
        Insert: {
          author_id?: string | null
          category?: number | null
          created_at?: string
          credit_cost?: number | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"] | null
          id?: number
          image?: string | null
          is_featured?: boolean
          name: string
          publishing_status?: Database["public"]["Enums"]["publishing_status"]
        }
        Update: {
          author_id?: string | null
          category?: number | null
          created_at?: string
          credit_cost?: number | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"] | null
          id?: number
          image?: string | null
          is_featured?: boolean
          name?: string
          publishing_status?: Database["public"]["Enums"]["publishing_status"]
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_author_id_fkey1"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "quizzes_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "quizzes_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes_categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          image: string | null
          is_disabled: boolean | null
          name: string | null
          publishing_status:
            | Database["public"]["Enums"]["publishing_status"]
            | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          is_disabled?: boolean | null
          name?: string | null
          publishing_status?:
            | Database["public"]["Enums"]["publishing_status"]
            | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          is_disabled?: boolean | null
          name?: string | null
          publishing_status?:
            | Database["public"]["Enums"]["publishing_status"]
            | null
        }
        Relationships: []
      }
      quizzes_questions: {
        Row: {
          content: Json | null
          created_at: string
          display_order: number | null
          id: number
          image: string | null
          image_type:
            | Database["public"]["Enums"]["quiz_question_image_type"]
            | null
          layout: string | null
          question: string
          quiz: number | null
          type: Database["public"]["Enums"]["quiz_question_types"] | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          display_order?: number | null
          id?: number
          image?: string | null
          image_type?:
            | Database["public"]["Enums"]["quiz_question_image_type"]
            | null
          layout?: string | null
          question?: string
          quiz?: number | null
          type?: Database["public"]["Enums"]["quiz_question_types"] | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          display_order?: number | null
          id?: number
          image?: string | null
          image_type?:
            | Database["public"]["Enums"]["quiz_question_image_type"]
            | null
          layout?: string | null
          question?: string
          quiz?: number | null
          type?: Database["public"]["Enums"]["quiz_question_types"] | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes-questions_quiz_fkey"
            columns: ["quiz"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes_refunds: {
        Row: {
          cause: string | null
          created_at: string
          id: number
          quiz_id: number | null
          user_id: string | null
        }
        Insert: {
          cause?: string | null
          created_at?: string
          id?: number
          quiz_id?: number | null
          user_id?: string | null
        }
        Update: {
          cause?: string | null
          created_at?: string
          id?: number
          quiz_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_refunds_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_refunds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credit_balance: number
          email: string | null
          is_banned: boolean
          phone: string | null
          user_id: string
          username: string | null
          xp_points: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credit_balance?: number
          email?: string | null
          is_banned?: boolean
          phone?: string | null
          user_id?: string
          username?: string | null
          xp_points?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credit_balance?: number
          email?: string | null
          is_banned?: boolean
          phone?: string | null
          user_id?: string
          username?: string | null
          xp_points?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          user_id: string
          user_role: Database["public"]["Enums"]["user_role_types"] | null
        }
        Insert: {
          user_id?: string
          user_role?: Database["public"]["Enums"]["user_role_types"] | null
        }
        Update: {
          user_id?: string
          user_role?: Database["public"]["Enums"]["user_role_types"] | null
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
      difficulty: "NORMAL" | "MEDIUM" | "HARD"
      publishing_status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      quiz_question_image_type: "normal-image" | "code-snippets" | "none"
      quiz_question_types:
        | "MULTIPLE_CHOICE"
        | "MATCHING_PAIRS"
        | "DEBUG_CODE"
        | "CODE_COMPLETION"
        | "FILL_IN_THE_BLANK"
      user_role_types: "ADMIN" | "USER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

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
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

