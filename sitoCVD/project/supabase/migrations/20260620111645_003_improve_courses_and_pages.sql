/*
# Centro Vela Dervio - Migration v3

1. Miglioramenti Tabella Corsi
- Aggiunti campi per settimane multiple, prezzo diurno e campus
- Opzioni alloggio, pasti, attrezzatura, programma giornaliero

2. Nuova Tabella: course_weeks
- Settimane specifiche per ogni corso con date e prezzi

3. Nuova Tabella: site_pages
- Pagine statiche extra (come trovarci, meteo, faq, etc.)

4. Indici
*/

-- ============================================
-- MIGLIORAMENTI TABELLA COURSES
-- ============================================
ALTER TABLE courses ADD COLUMN IF NOT EXISTS school_period text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS week_start_dates date[];
ALTER TABLE courses ADD COLUMN IF NOT EXISTS weeks_count int DEFAULT 1;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS price_day decimal(10,2) DEFAULT 0;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS price_campus decimal(10,2) DEFAULT 0;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS accommodation_type text DEFAULT 'none' CHECK (accommodation_type IN ('none', 'campus', 'day_only'));
ALTER TABLE courses ADD COLUMN IF NOT EXISTS meal_included boolean DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS accommodation_included boolean DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS day_schedule text DEFAULT 'Lun-Ven 9:00-16:00';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS campus_schedule text DEFAULT 'Lun-Ven 8:00-19:00';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS gear_included text DEFAULT 'mutes, mutande, giubbetto salvagente';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS what_to_bring text DEFAULT 'costume da bagno, crema solare, asciugamano, scarpe da acqua';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS daily_program text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS highlights text[];

-- ============================================
-- NUOVA TABELLA: COURSE_WEEKS
-- ============================================
CREATE TABLE IF NOT EXISTS course_weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  week_number int NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  price_day decimal(10,2) NOT NULL DEFAULT 0,
  price_campus decimal(10,2) NOT NULL DEFAULT 0,
  spots_total int NOT NULL DEFAULT 10,
  spots_booked int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE course_weeks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "course_weeks_select_public" ON course_weeks;
CREATE POLICY "course_weeks_select_public"
  ON course_weeks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "course_weeks_insert_admin" ON course_weeks;
CREATE POLICY "course_weeks_insert_admin"
  ON course_weeks FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

DROP POLICY IF EXISTS "course_weeks_update_admin" ON course_weeks;
CREATE POLICY "course_weeks_update_admin"
  ON course_weeks FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

DROP POLICY IF EXISTS "course_weeks_delete_admin" ON course_weeks;
CREATE POLICY "course_weeks_delete_admin"
  ON course_weeks FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

CREATE INDEX IF NOT EXISTS idx_course_weeks_course ON course_weeks(course_id);
CREATE INDEX IF NOT EXISTS idx_course_weeks_start ON course_weeks(start_date);

-- ============================================
-- NUOVA TABELLA: SITE_PAGES
-- ============================================
CREATE TABLE IF NOT EXISTS site_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  meta_description text,
  icon text,
  nav_group text DEFAULT 'info',
  sort_order int DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_pages_select_public" ON site_pages;
CREATE POLICY "site_pages_select_public"
  ON site_pages FOR SELECT
  TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "site_pages_insert_admin" ON site_pages;
CREATE POLICY "site_pages_insert_admin"
  ON site_pages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "site_pages_update_admin" ON site_pages;
CREATE POLICY "site_pages_update_admin"
  ON site_pages FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "site_pages_delete_admin" ON site_pages;
CREATE POLICY "site_pages_delete_admin"
  ON site_pages FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

CREATE INDEX IF NOT EXISTS idx_site_pages_slug ON site_pages(slug);
CREATE INDEX IF NOT EXISTS idx_site_pages_group ON site_pages(nav_group);

-- ============================================
-- SEED: CORSI MIGLIORATI
-- ============================================
UPDATE courses SET 
  school_period = '15 Giugno - 14 Agosto',
  week_start_dates = ARRAY['2025-06-15'::date, '2025-06-22'::date, '2025-06-29'::date, '2025-07-06'::date, '2025-07-13'::date, '2025-07-20'::date, '2025-07-27'::date, '2025-08-03'::date],
  weeks_count = 8,
  price_day = 180,
  price_campus = 320,
  accommodation_type = 'campus',
  meal_included = true,
  accommodation_included = true,
  day_schedule = 'Lun-Sab 9:00-16:00',
  campus_schedule = 'Dom-Sab 8:00-19:00',
  gear_included = 'mutes, mutande, giubbetto salvagente, imbarcazione',
  what_to_bring = 'costume, crema solare, scarpe da acqua, asciugamano, berretto',
  daily_program = '08:00 - Colazione e preparazione imbarcazioni\n09:00 - Teoria e preparazione in spiaggia\n09:30 - In acqua con monitor\n12:00 - Pranzo in mensa o al sacco\n13:00 - Pomeriggio libero o giochi\n14:00 - Seconda uscita in acqua\n16:00 - Rientro, lavaggio barche e doccia\n17:00 - Attivita ricreative e divertimento\n19:00 - Cena e serata tematica',
  highlights = ARRAY['Teoria e pratica in acqua', 'Pranzo e cena incluse', 'Alloggio in campus', 'Monitor FIV qualificati', 'Attivita serali', 'Giochi e divertimento', 'Gita in barca']
WHERE slug = 'corso-principianti-optimist';

UPDATE courses SET 
  school_period = '15 Giugno - 14 Agosto',
  week_start_dates = ARRAY['2025-06-15'::date, '2025-06-22'::date, '2025-06-29'::date, '2025-07-06'::date, '2025-07-13'::date, '2025-07-20'::date, '2025-07-27'::date, '2025-08-03'::date],
  weeks_count = 8,
  price_day = 200,
  price_campus = 350,
  accommodation_type = 'campus',
  meal_included = true,
  accommodation_included = true,
  day_schedule = 'Lun-Sab 9:00-16:00',
  campus_schedule = 'Dom-Sab 8:00-19:00',
  gear_included = 'mutes, mutande, giubbetto salvagente, imbarcazione',
  what_to_bring = 'costume, crema solare, scarpe da acqua, asciugamano',
  daily_program = '08:00 - Colazione e briefing\n09:00 - Teoria avanzata\n09:30 - Allenamento in acqua\n12:00 - Pranzo\n13:00 - Video analisi e debriefing\n14:00 - Seconda uscita\n16:00 - Rientro e doccia\n17:00 - Attivita fisica e preparazione\n19:00 - Cena e serata',
  highlights = ARRAY['Allenamento tecnico avanzato', 'Video analisi', 'Preparazione fisica', 'Campus con alloggio', 'Monitor FIV specializzati']
WHERE slug = 'corso-laser-avanzato';

UPDATE courses SET 
  school_period = '15 Giugno - 14 Agosto',
  week_start_dates = ARRAY['2025-06-15'::date, '2025-06-22'::date, '2025-06-29'::date, '2025-07-06'::date, '2025-07-13'::date, '2025-07-20'::date, '2025-07-27'::date, '2025-08-03'::date],
  weeks_count = 8,
  price_day = 200,
  price_campus = 350,
  accommodation_type = 'campus',
  meal_included = true,
  accommodation_included = true,
  day_schedule = 'Lun-Sab 9:00-16:00',
  campus_schedule = 'Dom-Sab 8:00-19:00',
  gear_included = 'mutes, mutande, giubbetto salvagente, imbarcazione',
  what_to_bring = 'costume, crema solare, scarpe da acqua',
  daily_program = '08:00 - Colazione\n09:00 - Teoria e preparazione\n09:30 - In acqua con istruttore\n12:00 - Pranzo in mensa\n13:00 - Tempo libero o giochi\n14:00 - Seconda uscita in acqua\n16:00 - Rientro e doccia\n17:00 - Attivita ricreative\n19:00 - Cena e serata',
  highlights = ARRAY['Corso per adulti', 'Derive leggere', 'Alloggio in campus', 'Pranzo e cena inclusi', 'Monitor FIV qualificati']
WHERE slug = 'corso-adulti-deriva';

UPDATE courses SET 
  school_period = '15 Giugno - 14 Agosto',
  week_start_dates = ARRAY['2025-06-15'::date, '2025-06-22'::date, '2025-06-29'::date, '2025-07-06'::date, '2025-07-13'::date, '2025-07-20'::date, '2025-07-27'::date, '2025-08-03'::date],
  weeks_count = 8,
  price_day = 190,
  price_campus = 330,
  accommodation_type = 'campus',
  meal_included = true,
  accommodation_included = true,
  day_schedule = 'Lun-Sab 9:00-16:00',
  campus_schedule = 'Dom-Sab 8:00-19:00',
  gear_included = 'mutes, mutande, giubbetto salvagente, imbarcazione',
  what_to_bring = 'costume, crema solare, scarpe da acqua',
  daily_program = '08:00 - Colazione\n09:00 - Teoria e briefing equipaggio\n09:30 - In acqua con istruttore\n12:00 - Pranzo in mensa\n13:00 - Analisi video e tattica\n14:00 - Seconda uscita\n16:00 - Rientro e doccia\n17:00 - Preparazione fisica\n19:00 - Cena e serata',
  highlights = ARRAY['Perfezionamento equipaggi', 'Comunicazione tra equipaggio', 'Tattica di regata', 'Campus con alloggio', 'Video analisi']
WHERE slug = 'corso-intermedio-420';

UPDATE courses SET 
  school_period = '15 Giugno - 14 Agosto',
  week_start_dates = ARRAY['2025-06-15'::date, '2025-06-22'::date, '2025-06-29'::date, '2025-07-06'::date, '2025-07-13'::date, '2025-07-20'::date, '2025-07-27'::date, '2025-08-03'::date],
  weeks_count = 8,
  price_day = 220,
  price_campus = 380,
  accommodation_type = 'campus',
  meal_included = true,
  accommodation_included = true,
  day_schedule = 'Lun-Sab 8:00-17:00',
  campus_schedule = 'Dom-Sab 7:00-20:00',
  gear_included = 'mutes, mutande, giubbetto salvagente, imbarcazione',
  what_to_bring = 'costume, crema solare, scarpe da acqua, muta',
  daily_program = '07:00 - Colazione e briefing\n08:00 - Preparazione fisica\n09:00 - Teoria avanzata\n09:30 - Allenamento in acqua\n12:00 - Pranzo\n13:00 - Video analisi\n14:00 - Seconda uscita\n17:00 - Rientro e doccia\n18:00 - Preparazione fisica\n20:00 - Cena e serata',
  highlights = ARRAY['Allenamento agonistico', 'Preparazione fisica intensa', 'Video analisi', 'Selezione regate', 'Campus con alloggio']
WHERE slug = 'corso-agonistico-skiff';

UPDATE courses SET 
  school_period = '15 Giugno - 14 Agosto',
  week_start_dates = ARRAY['2025-06-15'::date, '2025-06-22'::date, '2025-06-29'::date, '2025-07-06'::date, '2025-07-13'::date, '2025-07-20'::date, '2025-07-27'::date, '2025-08-03'::date],
  weeks_count = 8,
  price_day = 150,
  price_campus = 280,
  accommodation_type = 'campus',
  meal_included = true,
  accommodation_included = true,
  day_schedule = 'Lun-Sab 9:00-13:00',
  campus_schedule = 'Dom-Sab 8:00-17:00',
  gear_included = 'mutes, mutande, giubbetto salvagente, imbarcazione',
  what_to_bring = 'costume, crema solare, scarpe da acqua',
  daily_program = '08:00 - Colazione\n09:00 - Teoria e giochi in spiaggia\n09:30 - In acqua con giochi e vela giocata\n12:00 - Pranzo in mensa\n13:00 - Attivita ricreative e pomeriggio\n17:00 - Merenda e giochi\n19:00 - Cena e serata',
  highlights = ARRAY['Vela giocata per bambini', 'Giochi in acqua', 'Rispetto dell ambiente', 'Attivita ricreative', 'Campus con alloggio']
WHERE slug = 'corso-bambini-vela-giocata';

-- ============================================
-- SEED: COURSE_WEEKS
-- ============================================
INSERT INTO course_weeks (course_id, week_number, start_date, end_date, price_day, price_campus, spots_total, notes)
SELECT id, 1, '2025-06-15', '2025-06-21', price_day, price_campus, max_participants, 'Settimana 1'
FROM courses WHERE is_active = true;
INSERT INTO course_weeks (course_id, week_number, start_date, end_date, price_day, price_campus, spots_total, notes)
SELECT id, 2, '2025-06-22', '2025-06-28', price_day, price_campus, max_participants, 'Settimana 2'
FROM courses WHERE is_active = true;
INSERT INTO course_weeks (course_id, week_number, start_date, end_date, price_day, price_campus, spots_total, notes)
SELECT id, 3, '2025-06-29', '2025-07-05', price_day, price_campus, max_participants, 'Settimana 3'
FROM courses WHERE is_active = true;
INSERT INTO course_weeks (course_id, week_number, start_date, end_date, price_day, price_campus, spots_total, notes)
SELECT id, 4, '2025-07-06', '2025-07-12', price_day, price_campus, max_participants, 'Settimana 4'
FROM courses WHERE is_active = true;
INSERT INTO course_weeks (course_id, week_number, start_date, end_date, price_day, price_campus, spots_total, notes)
SELECT id, 5, '2025-07-13', '2025-07-19', price_day, price_campus, max_participants, 'Settimana 5'
FROM courses WHERE is_active = true;
INSERT INTO course_weeks (course_id, week_number, start_date, end_date, price_day, price_campus, spots_total, notes)
SELECT id, 6, '2025-07-20', '2025-07-26', price_day, price_campus, max_participants, 'Settimana 6'
FROM courses WHERE is_active = true;
INSERT INTO course_weeks (course_id, week_number, start_date, end_date, price_day, price_campus, spots_total, notes)
SELECT id, 7, '2025-07-27', '2025-08-02', price_day, price_campus, max_participants, 'Settimana 7'
FROM courses WHERE is_active = true;
INSERT INTO course_weeks (course_id, week_number, start_date, end_date, price_day, price_campus, spots_total, notes)
SELECT id, 8, '2025-08-03', '2025-08-09', price_day, price_campus, max_participants, 'Settimana 8'
FROM courses WHERE is_active = true;

-- ============================================
-- SEED: PAGINE STATICHE
-- ============================================
INSERT INTO site_pages (slug, title, content, meta_description, icon, nav_group, sort_order, is_active) VALUES
  ('come-trovarci', 'Come Trovarci', 
   'Dervio e situata sulla riva orientale del Lago di Como, tra i comuni di Bellano e Colico.

**In auto**
- Dall autostrada A9 Milano-Chiasso: uscita Lecco, seguire per Lecco e poi per Bellano-Dervio.
- Dall autostrada A9: uscita Como Nord, seguire per Lecco e poi per Bellano-Dervio.
- Dall autostrada A4 Torino-Trieste: uscita Bergamo, seguire per Lecco e poi per Dervio.
- Tempo di percorrenza: circa 1h da Milano, 1.5h da Bergamo, 40min da Lecco.

**In treno**
- Stazione di Dervio sulla linea Milano-Tirano (Trenord). 
- Dalla stazione 10 minuti a piedi verso il lungolago.
- Treni frequenti da Milano Centrale (circa 1h15).

**In aereo**
- Aeroporto di Orio al Serio (BG): 1h15 in auto.
- Aeroporto di Milano Linate: 1h30 in auto.
- Aeroporto di Milano Malpensa: 1h45 in auto.
- Aeroporto di Lugano: 1h in auto.

**Come raggiungere il Centro Vela**
Il Centro Vela Dervio si trova in Via Lungolago, 1. Dalla stazione ferroviaria, proseguire a piedi verso il lungolago in direzione sud. Siamo circa 800 metri dalla stazione. In auto, parcheggio disponibile in zona.', 
   'Come raggiungere il Centro Vela Dervio: indicazioni stradali, treno, aereo', 'MapPin', 'info', 1, true),
   
  ('dove-dormire', 'Dove Dormire', 
   'Il Centro Vela Dervio offre un campus per i corsi estivi, ma esistono diverse opzioni di alloggio per chi desidera soggiornare in modo indipendente.

**Campus Centro Vela**
- Alloggio in camerate condivise (max 6 persone)
- Pasti inclusi (colazione, pranzo, cena)
- Docce e spogliatoi
- Disponibile per i corsi estivi
- Prenotazione tramite iscrizione corso

**Hotel e B&B**
- Hotel in centro a Dervio a 5 minuti a piedi
- B&B con vista lago nella zona
- Residence con appartamenti per famiglie
- Agriturismi nelle vicinanze

**Camping**
- Camping vicino al lago a 2 km
- Piazzole per tende e camper
- Disponibilita tutto l anno

**Dove mangiare**
- Mensa del Centro Vela (per corsi con campus)
- Ristoranti sul lungolago
- Pizzerie e trattorie locali
- Bar e caffetterie in centro', 
   'Opzioni di alloggio a Dervio: campus, hotel, B&B, camping e ristoranti', 'Bed', 'info', 2, true),
   
  ('faq', 'Domande Frequenti', 
   '**Quando iniziano i corsi?**
I corsi estivi iniziano la terza settimana di giugno e terminano la seconda settimana di agosto. Le settimane vanno dal lunedi al sabato.

**Qual e la differenza tra corso diurno e campus?**
Il corso diurno include solo le ore di attivita nautiche (dalle 9 alle 16). Il campus include alloggio, pasti, attivita serali e assistenza 24h.

**Cosa serve portare?**
Costume da bagno, crema solare, scarpe da acqua, asciugamano, berretto. L attrezzatura nautica e fornita dal centro.

**E necessario saper nuotare?**
Si, per tutti i corsi e richiesta la capacita di nuotare. I bambini devono superare un test di nuoto iniziale.

**Esistono sconti per famiglie?**
Si, offriamo sconti del 10% per il secondo fratello/sorella e del 15% per il terzo.

**Cosa succede in caso di maltempo?**
In caso di condizioni meteo avverse, le attivita vengono sostituite con teoria, giochi, video analisi o attivita ricreative al chiuso.

**E possibile fare una prova?**
Organizziamo giornate di prova gratuite ogni prima domenica di giugno. Prenotazione obbligatoria.', 
   'FAQ Centro Vela Dervio: domande frequenti su corsi, iscrizioni, alloggi', 'HelpCircle', 'info', 3, true),
   
  ('associazione', 'L Associazione', 
   'Il Centro Vela Dervio e una Societa Sportiva Dilettantistica affiliata alla Federazione Italiana Vela.

**Storia**
Fondato nel 1975, il Centro Vela Dervio ha formato migliaia di velisti nel corso di quasi 50 anni di attivita. La nostra scuola e riconosciuta dalla FIV e offre corsi per tutti i livelli.

**Missione**
Promuovere la vela e la cultura nautica, formare velisti competenti e responsabili, rispettare l ambiente del Lago di Como, creare una comunita di appassionati.

**Organizzazione**
- Presidente: Marco Bianchi
- Direttore Sportivo: Laura Rossi
- Consiglio Direttivo: 7 membri eletti dai soci
- Segreteria: dal lunedi al venerdi 9:00-18:00

**Tesseramento**
Per partecipare alle attivita e necessario tesserarsi. La quota associativa annua e di 50 euro e include l assicurazione RC.

**Sponsor**
Ringraziamo i nostri partner che ci sostengono: [nomi sponsor].', 
   'Associazione Centro Vela Dervio: storia, missione, organizzazione, tesseramento', 'Users', 'info', 4, true)
ON CONFLICT (slug) DO NOTHING;
