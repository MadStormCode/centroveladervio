import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          phone: string | null;
          role: string;
          fiv_number: string | null;
          birth_date: string | null;
          address: string | null;
          city: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          level: string;
          category: string;
          age_min: number;
          age_max: number;
          price: number;
          max_participants: number;
          current_participants: number;
          period_start: string | null;
          period_end: string | null;
          duration_days: number | null;
          schedule_description: string | null;
          instructor: string | null;
          image_url: string | null;
          gallery_urls: string[] | null;
          is_active: boolean;
          registrations_open: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      regattas: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          location: string | null;
          start_date: string;
          end_date: string | null;
          registration_deadline: string | null;
          notice_of_race_url: string | null;
          sailing_instructions_url: string | null;
          results_url: string | null;
          image_url: string | null;
          gallery_urls: string[] | null;
          status: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          course_id: string | null;
          regatta_id: string | null;
          user_id: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          birth_date: string | null;
          fiv_number: string | null;
          address: string | null;
          city: string | null;
          zip_code: string | null;
          emergency_contact: string | null;
          emergency_phone: string | null;
          medical_notes: string | null;
          payment_status: string;
          payment_amount: number;
          payment_method: string | null;
          notes: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
      };
      news: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          image_url: string | null;
          author_id: string | null;
          category: string;
          status: string;
          published_at: string | null;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      photo_albums: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          cover_image_url: string | null;
          category: string;
          event_date: string | null;
          is_public: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
      };
      photos: {
        Row: {
          id: string;
          album_id: string;
          url: string;
          caption: string | null;
          sort_order: number;
          created_at: string;
        };
      };
      documents: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          file_url: string;
          file_type: string;
          category: string;
          is_public: boolean;
          expiry_date: string | null;
          download_count: number;
          created_at: string;
          updated_at: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string | null;
          group_name: string;
          created_at: string;
          updated_at: string;
        };
      };
      regatta_results: {
        Row: {
          id: string;
          regatta_id: string;
          category: string | null;
          position: number | null;
          team_name: string | null;
          sailor_name: string | null;
          boat_number: string | null;
          points: number | null;
          created_at: string;
        };
      };
    };
  };
};
