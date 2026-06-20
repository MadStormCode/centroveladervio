/*
# Centro Vela Dervio - Database Schema v1

1. New Tables
- `profiles` - Profili utente con ruoli (collegati a auth.users)
- `courses` - Corsi di vela con dettagli, prezzi, disponibilità
- `regattas` - Regate e eventi con bandi, risultati, foto
- `enrollments` - Iscrizioni ai corsi e regate
- `news` - Articoli e notizie del centro
- `photo_albums` - Album fotografici
- `photos` - Foto singole all'interno degli album
- `documents` - Documenti interni (statuto, moduli FIV, ecc.)
- `site_settings` - Impostazioni globali del sito
- `course_schedules` - Orari specifici dei corsi
- `regatta_results` - Risultati delle regate

2. Security
- RLS abilitato su tutte le tabelle
- Policy per admin: accesso totale alle tabelle tramite ruolo
- Policy per pubblico: lettura dei dati pubblici (corsi, regate, news, gallery)
- Ruoli: admin, segreteria, istruttore, editor, socio
*/

-- ============================================
-- PROFILES (utenti con ruoli)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'socio' CHECK (role IN ('admin', 'segreteria', 'istruttore', 'editor', 'socio')),
  fiv_number text,
  birth_date date,
  address text,
  city text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete_admin" ON profiles;
CREATE POLICY "profiles_delete_admin"
  ON profiles FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ============================================
-- COURSES
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  level text NOT NULL DEFAULT 'principiante' CHECK (level IN ('principiante', 'intermedio', 'avanzato', 'agonistico')),
  category text NOT NULL DEFAULT 'optimist' CHECK (category IN ('optimist', 'laser', '420', 'skiff', 'adulti', 'bambini', 'deriva', 'crociera')),
  age_min int DEFAULT 6,
  age_max int DEFAULT 99,
  price decimal(10,2) NOT NULL DEFAULT 0,
  max_participants int NOT NULL DEFAULT 10,
  current_participants int NOT NULL DEFAULT 0,
  period_start date,
  period_end date,
  duration_days int,
  schedule_description text,
  instructor text,
  image_url text,
  gallery_urls text[],
  is_active boolean NOT NULL DEFAULT true,
  registrations_open boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "courses_select_public" ON courses;
CREATE POLICY "courses_select_public"
  ON courses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "courses_insert_admin" ON courses;
CREATE POLICY "courses_insert_admin"
  ON courses FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

DROP POLICY IF EXISTS "courses_update_admin" ON courses;
CREATE POLICY "courses_update_admin"
  ON courses FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

DROP POLICY IF EXISTS "courses_delete_admin" ON courses;
CREATE POLICY "courses_delete_admin"
  ON courses FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

-- ============================================
-- REGATTAS
-- ============================================
CREATE TABLE IF NOT EXISTS regattas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  location text,
  start_date date NOT NULL,
  end_date date,
  registration_deadline date,
  notice_of_race_url text,
  sailing_instructions_url text,
  results_url text,
  image_url text,
  gallery_urls text[],
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE regattas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "regattas_select_public" ON regattas;
CREATE POLICY "regattas_select_public"
  ON regattas FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "regattas_insert_admin" ON regattas;
CREATE POLICY "regattas_insert_admin"
  ON regattas FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "regattas_update_admin" ON regattas;
CREATE POLICY "regattas_update_admin"
  ON regattas FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "regattas_delete_admin" ON regattas;
CREATE POLICY "regattas_delete_admin"
  ON regattas FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

-- ============================================
-- REGATTA RESULTS
-- ============================================
CREATE TABLE IF NOT EXISTS regatta_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regatta_id uuid NOT NULL REFERENCES regattas(id) ON DELETE CASCADE,
  category text,
  position int,
  team_name text,
  sailor_name text,
  boat_number text,
  points int,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE regatta_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "results_select_public" ON regatta_results;
CREATE POLICY "results_select_public"
  ON regatta_results FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "results_insert_admin" ON regatta_results;
CREATE POLICY "results_insert_admin"
  ON regatta_results FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "results_update_admin" ON regatta_results;
CREATE POLICY "results_update_admin"
  ON regatta_results FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "results_delete_admin" ON regatta_results;
CREATE POLICY "results_delete_admin"
  ON regatta_results FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

-- ============================================
-- ENROLLMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  regatta_id uuid REFERENCES regattas(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Dati dell'iscritto (per iscrizioni senza account)
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  birth_date date,
  fiv_number text,
  address text,
  city text,
  zip_code text,
  emergency_contact text,
  emergency_phone text,
  medical_notes text,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'completed', 'refunded')),
  payment_amount decimal(10,2) DEFAULT 0,
  payment_method text,
  notes text,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'waitlist')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "enrollments_select_admin" ON enrollments;
CREATE POLICY "enrollments_select_admin"
  ON enrollments FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'istruttore'))
  );

DROP POLICY IF EXISTS "enrollments_select_own" ON enrollments;
CREATE POLICY "enrollments_select_own"
  ON enrollments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "enrollments_insert_public" ON enrollments;
CREATE POLICY "enrollments_insert_public"
  ON enrollments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "enrollments_update_admin" ON enrollments;
CREATE POLICY "enrollments_update_admin"
  ON enrollments FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

DROP POLICY IF EXISTS "enrollments_delete_admin" ON enrollments;
CREATE POLICY "enrollments_delete_admin"
  ON enrollments FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

-- ============================================
-- NEWS
-- ============================================
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  image_url text,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  category text NOT NULL DEFAULT 'generale' CHECK (category IN ('generale', 'corsi', 'regate', 'soci', 'eventi', 'comunicazioni')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "news_select_public" ON news;
CREATE POLICY "news_select_public"
  ON news FOR SELECT
  TO anon, authenticated USING (status = 'published');

DROP POLICY IF EXISTS "news_select_admin" ON news;
CREATE POLICY "news_select_admin"
  ON news FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "news_insert_admin" ON news;
CREATE POLICY "news_insert_admin"
  ON news FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "news_update_admin" ON news;
CREATE POLICY "news_update_admin"
  ON news FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "news_delete_admin" ON news;
CREATE POLICY "news_delete_admin"
  ON news FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

-- ============================================
-- PHOTO ALBUMS
-- ============================================
CREATE TABLE IF NOT EXISTS photo_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  cover_image_url text,
  category text NOT NULL DEFAULT 'generale' CHECK (category IN ('generale', 'corsi', 'regate', 'eventi', 'soci')),
  event_date date,
  is_public boolean NOT NULL DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "albums_select_public" ON photo_albums;
CREATE POLICY "albums_select_public"
  ON photo_albums FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "albums_insert_admin" ON photo_albums;
CREATE POLICY "albums_insert_admin"
  ON photo_albums FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "albums_update_admin" ON photo_albums;
CREATE POLICY "albums_update_admin"
  ON photo_albums FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "albums_delete_admin" ON photo_albums;
CREATE POLICY "albums_delete_admin"
  ON photo_albums FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

-- ============================================
-- PHOTOS
-- ============================================
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES photo_albums(id) ON DELETE CASCADE,
  url text NOT NULL,
  caption text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "photos_select_public" ON photos;
CREATE POLICY "photos_select_public"
  ON photos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "photos_insert_admin" ON photos;
CREATE POLICY "photos_insert_admin"
  ON photos FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "photos_update_admin" ON photos;
CREATE POLICY "photos_update_admin"
  ON photos FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "photos_delete_admin" ON photos;
CREATE POLICY "photos_delete_admin"
  ON photos FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

-- ============================================
-- DOCUMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text NOT NULL,
  category text NOT NULL DEFAULT 'interno' CHECK (category IN ('statuto', 'moduli_fiv', 'documenti_interni', 'regolamenti', 'comunicazioni', 'altro')),
  is_public boolean NOT NULL DEFAULT true,
  expiry_date date,
  download_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "documents_select_public" ON documents;
CREATE POLICY "documents_select_public"
  ON documents FOR SELECT
  TO anon, authenticated USING (is_public = true);

DROP POLICY IF EXISTS "documents_select_admin" ON documents;
CREATE POLICY "documents_select_admin"
  ON documents FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "documents_insert_admin" ON documents;
CREATE POLICY "documents_insert_admin"
  ON documents FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "documents_update_admin" ON documents;
CREATE POLICY "documents_update_admin"
  ON documents FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "documents_delete_admin" ON documents;
CREATE POLICY "documents_delete_admin"
  ON documents FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

-- ============================================
-- SITE SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  group_name text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings_select_public" ON site_settings;
CREATE POLICY "settings_select_public"
  ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "settings_insert_admin" ON site_settings;
CREATE POLICY "settings_insert_admin"
  ON site_settings FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "settings_update_admin" ON site_settings;
CREATE POLICY "settings_update_admin"
  ON site_settings FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "settings_delete_admin" ON site_settings;
CREATE POLICY "settings_delete_admin"
  ON site_settings FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(is_active);
CREATE INDEX IF NOT EXISTS idx_regattas_status ON regattas(status);
CREATE INDEX IF NOT EXISTS idx_regattas_dates ON regattas(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_regatta ON enrollments(regatta_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_photos_album ON photos(album_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
