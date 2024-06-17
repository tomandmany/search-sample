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
      channelModels: {
        Row: {
          createdAt: string
          id: string
          name: string
        }
        Insert: {
          createdAt?: string
          id?: string
          name: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      participantChannels: {
        Row: {
          channelModelId: string
          createdAt: string
          id: string
          participantId: string
          url: string
        }
        Insert: {
          channelModelId: string
          createdAt?: string
          id?: string
          participantId: string
          url: string
        }
        Update: {
          channelModelId?: string
          createdAt?: string
          id?: string
          participantId?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "participantChannels_channelModelId_fkey"
            columns: ["channelModelId"]
            isOneToOne: false
            referencedRelation: "channelModels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participantChannels_participantId_fkey"
            columns: ["participantId"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          createdAt: string
          id: string
          name: string | null
        }
        Insert: {
          createdAt?: string
          id?: string
          name?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          createdAt: string
          details: string | null
          endHour: string | null
          endMinutes: string | null
          eventDate: Database["public"]["Enums"]["eventDate"] | null
          genre: Database["public"]["Enums"]["genre"] | null
          id: string
          image: string | null
          isPhotographable: Database["public"]["Enums"]["isPhotographable"]
          message: string | null
          name: string | null
          participantId: string | null
          releaseDay: string | null
          releaseMonth: string | null
          ruby: string | null
          startHour: string | null
          startMinutes: string | null
          venue: Database["public"]["Enums"]["venue"] | null
        }
        Insert: {
          createdAt?: string
          details?: string | null
          endHour?: string | null
          endMinutes?: string | null
          eventDate?: Database["public"]["Enums"]["eventDate"] | null
          genre?: Database["public"]["Enums"]["genre"] | null
          id?: string
          image?: string | null
          isPhotographable?: Database["public"]["Enums"]["isPhotographable"]
          message?: string | null
          name?: string | null
          participantId?: string | null
          releaseDay?: string | null
          releaseMonth?: string | null
          ruby?: string | null
          startHour?: string | null
          startMinutes?: string | null
          venue?: Database["public"]["Enums"]["venue"] | null
        }
        Update: {
          createdAt?: string
          details?: string | null
          endHour?: string | null
          endMinutes?: string | null
          eventDate?: Database["public"]["Enums"]["eventDate"] | null
          genre?: Database["public"]["Enums"]["genre"] | null
          id?: string
          image?: string | null
          isPhotographable?: Database["public"]["Enums"]["isPhotographable"]
          message?: string | null
          name?: string | null
          participantId?: string | null
          releaseDay?: string | null
          releaseMonth?: string | null
          ruby?: string | null
          startHour?: string | null
          startMinutes?: string | null
          venue?: Database["public"]["Enums"]["venue"] | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_participantId_fkey"
            columns: ["participantId"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      eventDate: "3日" | "4日" | "5日"
      genre: "音楽" | "ダンス" | "パフォーマンス"
      isPhotographable: "可" | "不可" | "不明"
      venue: "メインステージ" | "パフォーマンスエリア" | "エントランスエリア"
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
