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
      boothPrograms: {
        Row: {
          catchphrase: string | null
          createdAt: string
          details: string | null
          endHour: string | null
          endMinutes: string | null
          eventDate: Database["public"]["Enums"]["eventDate"] | null
          genre: Database["public"]["Enums"]["genre"] | null
          id: string
          participantId: string | null
          photographPermission: Database["public"]["Enums"]["photographPermission"]
          programImage: string | null
          programName: string | null
          releaseDay: string | null
          releaseMonth: string | null
          startHour: string | null
          startMinutes: string | null
          venue: Database["public"]["Enums"]["venue"] | null
        }
        Insert: {
          catchphrase?: string | null
          createdAt?: string
          details?: string | null
          endHour?: string | null
          endMinutes?: string | null
          eventDate?: Database["public"]["Enums"]["eventDate"] | null
          genre?: Database["public"]["Enums"]["genre"] | null
          id?: string
          participantId?: string | null
          photographPermission?: Database["public"]["Enums"]["photographPermission"]
          programImage?: string | null
          programName?: string | null
          releaseDay?: string | null
          releaseMonth?: string | null
          startHour?: string | null
          startMinutes?: string | null
          venue?: Database["public"]["Enums"]["venue"] | null
        }
        Update: {
          catchphrase?: string | null
          createdAt?: string
          details?: string | null
          endHour?: string | null
          endMinutes?: string | null
          eventDate?: Database["public"]["Enums"]["eventDate"] | null
          genre?: Database["public"]["Enums"]["genre"] | null
          id?: string
          participantId?: string | null
          photographPermission?: Database["public"]["Enums"]["photographPermission"]
          programImage?: string | null
          programName?: string | null
          releaseDay?: string | null
          releaseMonth?: string | null
          startHour?: string | null
          startMinutes?: string | null
          venue?: Database["public"]["Enums"]["venue"] | null
        }
        Relationships: [
          {
            foreignKeyName: "boothPrograms_participantId_fkey"
            columns: ["participantId"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
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
      outstagePrograms: {
        Row: {
          catchphrase: string
          createdAt: string
          details: string
          eventDate: Database["public"]["Enums"]["eventDate"]
          genre: Database["public"]["Enums"]["genre"]
          id: string
          participantId: string
          photographPermission: Database["public"]["Enums"]["photographPermission"]
          programImage: string | null
          programName: string
          venue: Database["public"]["Enums"]["venue"]
        }
        Insert: {
          catchphrase: string
          createdAt?: string
          details: string
          eventDate: Database["public"]["Enums"]["eventDate"]
          genre: Database["public"]["Enums"]["genre"]
          id?: string
          participantId?: string
          photographPermission: Database["public"]["Enums"]["photographPermission"]
          programImage?: string | null
          programName: string
          venue: Database["public"]["Enums"]["venue"]
        }
        Update: {
          catchphrase?: string
          createdAt?: string
          details?: string
          eventDate?: Database["public"]["Enums"]["eventDate"]
          genre?: Database["public"]["Enums"]["genre"]
          id?: string
          participantId?: string
          photographPermission?: Database["public"]["Enums"]["photographPermission"]
          programImage?: string | null
          programName?: string
          venue?: Database["public"]["Enums"]["venue"]
        }
        Relationships: [
          {
            foreignKeyName: "outstagePrograms_participantId_fkey"
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
          participantName: string | null
          ruby: string | null
        }
        Insert: {
          createdAt?: string
          id?: string
          participantName?: string | null
          ruby?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          participantName?: string | null
          ruby?: string | null
        }
        Relationships: []
      }
      participantSocialMedias: {
        Row: {
          createdAt: string
          id: string
          participantId: string
          socialMediaModelId: string
          url: string
        }
        Insert: {
          createdAt?: string
          id?: string
          participantId: string
          socialMediaModelId: string
          url: string
        }
        Update: {
          createdAt?: string
          id?: string
          participantId?: string
          socialMediaModelId?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "participantSocialMedias_participantId_fkey"
            columns: ["participantId"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participantSocialMedias_socialMediaModelId_fkey"
            columns: ["socialMediaModelId"]
            isOneToOne: false
            referencedRelation: "channelModels"
            referencedColumns: ["id"]
          },
        ]
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
          isPhotographable: Database["public"]["Enums"]["photographPermission"]
          message: string | null
          name: string | null
          participantId: string | null
          releaseDay: string | null
          releaseMonth: string | null
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
          isPhotographable?: Database["public"]["Enums"]["photographPermission"]
          message?: string | null
          name?: string | null
          participantId?: string | null
          releaseDay?: string | null
          releaseMonth?: string | null
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
          isPhotographable?: Database["public"]["Enums"]["photographPermission"]
          message?: string | null
          name?: string | null
          participantId?: string | null
          releaseDay?: string | null
          releaseMonth?: string | null
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
      roomPrograms: {
        Row: {
          catchphrase: string | null
          createdAt: string
          details: string | null
          endHour: string | null
          endMinutes: string | null
          eventDate: Database["public"]["Enums"]["eventDate"] | null
          genre: Database["public"]["Enums"]["genre"] | null
          id: string
          participantId: string | null
          photographPermission: Database["public"]["Enums"]["photographPermission"]
          programImage: string | null
          programName: string | null
          releaseDay: string | null
          releaseMonth: string | null
          startHour: string | null
          startMinutes: string | null
          venue: Database["public"]["Enums"]["venue"] | null
        }
        Insert: {
          catchphrase?: string | null
          createdAt?: string
          details?: string | null
          endHour?: string | null
          endMinutes?: string | null
          eventDate?: Database["public"]["Enums"]["eventDate"] | null
          genre?: Database["public"]["Enums"]["genre"] | null
          id?: string
          participantId?: string | null
          photographPermission?: Database["public"]["Enums"]["photographPermission"]
          programImage?: string | null
          programName?: string | null
          releaseDay?: string | null
          releaseMonth?: string | null
          startHour?: string | null
          startMinutes?: string | null
          venue?: Database["public"]["Enums"]["venue"] | null
        }
        Update: {
          catchphrase?: string | null
          createdAt?: string
          details?: string | null
          endHour?: string | null
          endMinutes?: string | null
          eventDate?: Database["public"]["Enums"]["eventDate"] | null
          genre?: Database["public"]["Enums"]["genre"] | null
          id?: string
          participantId?: string | null
          photographPermission?: Database["public"]["Enums"]["photographPermission"]
          programImage?: string | null
          programName?: string | null
          releaseDay?: string | null
          releaseMonth?: string | null
          startHour?: string | null
          startMinutes?: string | null
          venue?: Database["public"]["Enums"]["venue"] | null
        }
        Relationships: [
          {
            foreignKeyName: "roomPrograms_participantId_fkey"
            columns: ["participantId"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      sampleDnd: {
        Row: {
          columnsOrder: number
          content: string
          createdAt: string
          id: string
          rowsOrder: number
        }
        Insert: {
          columnsOrder: number
          content: string
          createdAt?: string
          id?: string
          rowsOrder: number
        }
        Update: {
          columnsOrder?: number
          content?: string
          createdAt?: string
          id?: string
          rowsOrder?: number
        }
        Relationships: []
      }
      socialMediaModels: {
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      eventDate: "2日" | "3日" | "4日"
      genre: "音楽" | "ダンス" | "パフォーマンス"
      photographPermission: "可" | "不可" | "不明"
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
