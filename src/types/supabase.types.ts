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
      channels: {
        Row: {
          createdAt: string
          id: string
          name: string | null
          participantId: string | null
          url: string | null
        }
        Insert: {
          createdAt?: string
          id?: string
          name?: string | null
          participantId?: string | null
          url?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string | null
          participantId?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "channels_participantId_fkey"
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
          catchphrase: string | null
          createdAt: string
          details: string | null
          endHour: string | null
          endMinutes: string | null
          eventDate: Database["public"]["Enums"]["eventDate"] | null
          id: string
          image: string | null
          isPhotographable:
            | Database["public"]["Enums"]["isPhotographable"]
            | null
          message: string | null
          name: string | null
          participantId: string | null
          releaseDay: string | null
          releaseMonth: string | null
          ruby: string | null
          startHour: string | null
          startMinutes: string | null
          venue: string | null
        }
        Insert: {
          catchphrase?: string | null
          createdAt?: string
          details?: string | null
          endHour?: string | null
          endMinutes?: string | null
          eventDate?: Database["public"]["Enums"]["eventDate"] | null
          id?: string
          image?: string | null
          isPhotographable?:
            | Database["public"]["Enums"]["isPhotographable"]
            | null
          message?: string | null
          name?: string | null
          participantId?: string | null
          releaseDay?: string | null
          releaseMonth?: string | null
          ruby?: string | null
          startHour?: string | null
          startMinutes?: string | null
          venue?: string | null
        }
        Update: {
          catchphrase?: string | null
          createdAt?: string
          details?: string | null
          endHour?: string | null
          endMinutes?: string | null
          eventDate?: Database["public"]["Enums"]["eventDate"] | null
          id?: string
          image?: string | null
          isPhotographable?:
            | Database["public"]["Enums"]["isPhotographable"]
            | null
          message?: string | null
          name?: string | null
          participantId?: string | null
          releaseDay?: string | null
          releaseMonth?: string | null
          ruby?: string | null
          startHour?: string | null
          startMinutes?: string | null
          venue?: string | null
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
      eventDate: "11月3日" | "11月4日" | "11月5日"
      isPhotographable: "可" | "不可"
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
