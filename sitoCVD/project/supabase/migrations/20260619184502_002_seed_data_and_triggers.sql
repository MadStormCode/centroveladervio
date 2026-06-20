/*
# Centro Vela Dervio - Seed Data & Triggers

1. Seed Data
- Inserisce i dati di default per site_settings (logo, contatti, orari, social, footer)
- Inserisce corsi di esempio
- Inserisce regate di esempio
- Inserisce news di esempio
- Inserisce album fotografici di esempio
- Inserisce documenti di esempio

2. Triggers
- Funzione per creare automaticamente il profilo utente dopo la registrazione
- Funzione per aggiornare updated_at automaticamente
*/

-- ============================================
-- FUNZIONE: aggiorna updated_at automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers per updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_regattas_updated_at ON regattas;
CREATE TRIGGER update_regattas_updated_at BEFORE UPDATE ON regattas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_enrollments_updated_at ON enrollments;
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_photo_albums_updated_at ON photo_albums;
CREATE TRIGGER update_photo_albums_updated_at BEFORE UPDATE ON photo_albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNZIONE: crea profilo dopo registrazione
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'role', 'socio'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED: Site Settings
-- ============================================
INSERT INTO site_settings (key, value, group_name) VALUES
  ('site_name', 'Centro Vela Dervio', 'general'),
  ('site_description', 'Scuola vela sul Lago di Como - Corsi, regate e attività per tutti', 'general'),
  ('site_logo', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300', 'general'),
  ('contact_email', 'info@centroveladervio.it', 'contact'),
  ('contact_phone', '+39 0341 123456', 'contact'),
  ('contact_address', 'Via Lungolago, 1 - 23824 Dervio (LC)', 'contact'),
  ('contact_fax', '+39 0341 123457', 'contact'),
  ('schedule_weekday', 'Lun-Ven: 9:00 - 18:00', 'schedule'),
  ('schedule_weekend', 'Sab-Dom: 9:00 - 13:00', 'schedule'),
  ('social_facebook', 'https://facebook.com/centroveladervio', 'social'),
  ('social_instagram', 'https://instagram.com/centroveladervio', 'social'),
  ('social_youtube', 'https://youtube.com/centroveladervio', 'social'),
  ('footer_text', 'Centro Vela Dervio - Società Sportiva Dilettantistica - P.IVA 01234567890', 'footer'),
  ('seo_title', 'Centro Vela Dervio - Scuola di Vela sul Lago di Como', 'seo'),
  ('seo_description', 'Corsi di vela per tutti i livelli, regate, eventi e attività nautiche sul Lago di Como', 'seo')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- SEED: Courses
-- ============================================
INSERT INTO courses (title, slug, description, short_description, level, category, age_min, age_max, price, max_participants, period_start, period_end, duration_days, schedule_description, instructor, image_url, is_active, registrations_open) VALUES
  ('Corso Principianti Optimist', 'corso-principianti-optimist', 
   'Corso base per bambini e ragazzi che vogliono avvicinarsi alla vela con l''Optimist. Si impareranno le basi della navigazione, il maneggio del timone e delle vele, e la sicurezza in mare.', 
   'Corso base per bambini 8-12 anni con l''Optimist', 
   'principiante', 'optimist', 8, 12, 350.00, 15, 
   '2025-06-15', '2025-07-15', 10, 'Lun-Ven 9:00-13:00', 'Marco Bianchi', 
   'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', true, true),
  
  ('Corso Laser Avanzato', 'corso-laser-avanzato', 
   'Corso avanzato per velisti che vogliono perfezionare la tecnica sul singolo Laser. Focus sulla tattica di regata, affinamento delle manovre e preparazione fisica.', 
   'Perfezionamento tecnico su Laser per velisti agonisti', 
   'avanzato', 'laser', 14, 65, 450.00, 10, 
   '2025-06-01', '2025-08-31', 15, 'Mar-Gio 14:00-18:00', 'Laura Rossi', 
   'https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?w=800', true, true),
  
  ('Corso Adulti Deriva', 'corso-adulti-deriva', 
   'Corso per adulti che vogliono imparare la vela su derive leggere. Dalle basi della navigazione alle prime uscite autonome, con focus sulla sicurezza e il divertimento.', 
   'Vela per adulti principianti su derive leggere', 
   'principiante', 'deriva', 18, 99, 400.00, 12, 
   '2025-06-01', '2025-09-15', 12, 'Sab-Dom 9:00-13:00', 'Giuseppe Verdi', 
   'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800', true, true),
  
  ('Corso Intermedio 420', 'corso-intermedio-420', 
   'Corso per equipaggi che vogliono migliorare la tecnica su 420. Lavoro sulla comunicazione tra equipaggio, manovre avanzate e tattica di regata.', 
   'Perfezionamento equipaggi 420', 
   'intermedio', '420', 12, 18, 380.00, 8, 
   '2025-07-01', '2025-08-15', 10, 'Lun-Ven 14:00-18:00', 'Anna Neri', 
   'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?w=800', true, true),
  
  ('Corso Agonistico Skiff', 'corso-agonistico-skiff', 
   'Corso ad alta intensità per velisti agonisti su skiff. Preparazione fisica, allenamenti tecnici e partecipazione a regate di selezione.', 
   'Allenamento agonistico su skiff per atleti', 
   'agonistico', 'skiff', 16, 35, 550.00, 6, 
   '2025-05-01', '2025-09-30', 20, 'Lun-Sab 8:00-13:00', 'Roberto Marini', 
   'https://images.unsplash.com/photo-1520454974749-611b7248ffc6?w=800', true, true),
  
  ('Corso Bambini Vela Giocata', 'corso-bambini-vela-giocata', 
   'Corso divertente per bambini 6-8 anni. Giochi in acqua, prime nozioni di vela, rispetto dell''ambiente e del lago. Un modo allegro per avvicinarsi al mondo nautico.', 
   'Vela giocata per bambini 6-8 anni', 
   'principiante', 'bambini', 6, 8, 250.00, 12, 
   '2025-06-15', '2025-08-15', 8, 'Lun-Ven 9:00-11:00', 'Elena Gialli', 
   'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800', true, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED: Regattas
-- ============================================
INSERT INTO regattas (title, slug, description, short_description, location, start_date, end_date, registration_deadline, status, is_public, image_url) VALUES
  ('Trofeo Lago di Como', 'trofeo-lago-como', 
   'La regata più attesa del Lago di Como. Velisti da tutta Italia si sfidano nelle acque di Dervio in un weekend di sport e competizione. Classi: Optimist, Laser, 420, Skiff.', 
   'Regata internazionale sul Lago di Como', 
   'Dervio, Lago di Como', '2025-06-20', '2025-06-22', '2025-06-15', 'upcoming', true,
   'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800'),
  
  ('Regata Optimist Dervio', 'regata-optimist-dervio', 
   'Regata dedicata ai giovani velisti della classe Optimist. Tre giorni di competizione con prove tecniche e tattiche. Premi speciali per i più giovani.', 
   'Regata giovanile Optimist a Dervio', 
   'Dervio, Lago di Como', '2025-07-10', '2025-07-12', '2025-07-05', 'upcoming', true,
   'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'),
  
  ('Campionato Regionale Laser', 'campionato-regionale-laser', 
   'Campionato regionale della classe Laser Standard e Radial. Qualificazione per il campionato italiano. Prove tecniche in acqua e terra.', 
   'Campionato regionale Laser', 
   'Dervio, Lago di Como', '2025-08-05', '2025-08-07', '2025-07-30', 'upcoming', true,
   'https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?w=800'),
  
  ('Regata Sociale 2025', 'regata-sociale-2025', 
   'Tradizionale regata sociale del Centro Vela Dervio. Aperta a soci, istruttori e amici. Un pomeriggio di vela divertente con premiazione e grigliata finale.', 
   'Regata sociale annuale del Centro Vela', 
   'Dervio, Lago di Como', '2025-09-20', '2025-09-20', '2025-09-15', 'upcoming', true,
   'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED: News
-- ============================================
INSERT INTO news (title, slug, content, excerpt, category, status, published_at, featured, image_url) VALUES
  ('Aperte le iscrizioni per l''estate 2025', 'aperte-iscrizioni-estate-2025', 
   'Sono ufficialmente aperte le iscrizioni per i corsi di vela dell''estate 2025! Quest''anno proponiamo 6 corsi diversi, dai principianti ai corsi agonistici. I posti sono limitati, non perdete l''occasione di trascorrere un''estate indimenticabile sul Lago di Como.

I corsi disponibili includono:
- Corso Principianti Optimist (8-12 anni)
- Corso Laser Avanzato (14+ anni)
- Corso Adulti Deriva (18+ anni)
- Corso Intermedio 420 (12-18 anni)
- Corso Agonistico Skiff (16-35 anni)
- Corso Bambini Vela Giocata (6-8 anni)

Per informazioni e iscrizioni contattate la segreteria o compilate il modulo online.', 
   'Sono aperte le iscrizioni per i corsi estivi 2025. Corsi per tutti i livelli e le età.', 
   'corsi', 'published', now(), true,
   'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?w=800'),
  
  ('Trofeo Lago di Como: si avvicina la data', 'trofeo-lago-como-avvicina', 
   'Mancano poche settimane al Trofeo Lago di Como 2025. La regata internazionale che vedrà sfidarsi i migliori velisti del panorama nazionale e internazionale sulle acque di Dervio.

Il programma include:
- Venerdì: registrazione e briefing
- Sabato: 3 prove
- Domenica: 2 prove e premiazione

Le iscrizioni chiudono il 15 giugno. Non mancate!', 
   'La regata internazionale del Lago di Como si avvicina. Iscrivetevi entro il 15 giugno.', 
   'regate', 'published', now(), true,
   'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800'),
  
  ('Nuovo istruttore al Centro Vela', 'nuovo-istruttore-centro-vela', 
   'Diamo il benvenuto al nuovo istruttore Roberto Marini, che si unisce al nostro team per la stagione 2025. Roberto vanta un''esperienza decennale nella vela agonistica e porterà un approccio innovativo ai corsi agonistici.

Roberto sarà responsabile del Corso Agonistico Skiff e collaborerà agli allenamenti del Corso Laser Avanzato.

Benvenuto Roberto!', 
   'Roberto Marini si unisce al team di istruttori per la stagione 2025.', 
   'soci', 'published', now(), false,
   'https://images.unsplash.com/photo-1520454974749-611b7248ffc6?w=800'),
  
  ('Manutenzione flotta: aggiornamento', 'manutenzione-flotta-aggiornamento', 
   'La flotta del Centro Vela è stata completamente revisionata durante l''inverno. Sono stati effettuati:
- Svernamento e manutenzione di tutte le imbarcazioni
- Sostituzione di 4 Optimist nuovi
- Revisione completa dei Laser
- Acquisto di 2 nuovi 420

La flotta è ora pronta per la stagione 2025. Grazie al lavoro dei nostri tecnici!', 
   'La flotta è stata completamente revisionata e aggiornata per la stagione 2025.', 
   'generale', 'published', now(), false,
   'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?w=800')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED: Photo Albums
-- ============================================
INSERT INTO photo_albums (title, description, cover_image_url, category, event_date, is_public, sort_order) VALUES
  ('Trofeo Lago di Como 2024', 'Le immagini più belle del Trofeo Lago di Como 2024. Giornate di regate mozzafiato e premiazione.', 
   'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800', 'regate', '2024-06-22', true, 1),
  
  ('Corsi Estate 2024', 'Giornate di vela e divertimento durante i corsi estivi 2024. Bambini, ragazzi e adulti alla scoperta della vela.', 
   'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'corsi', '2024-08-15', true, 2),
  
  ('Regata Sociale 2024', 'Momenti della tradizionale regata sociale con premiazione e grigliata finale.', 
   'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800', 'eventi', '2024-09-20', true, 3),
  
  ('Giornata del Socio 2024', 'La festa annuale dedicata ai soci del Centro Vela Dervio. Vela, cibo e buona compagnia.', 
   'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?w=800', 'soci', '2024-07-15', true, 4)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED: Photos
-- ============================================
INSERT INTO photos (album_id, url, caption, sort_order) VALUES
  ((SELECT id FROM photo_albums WHERE title = 'Trofeo Lago di Como 2024' LIMIT 1), 
   'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800', 'Partenza della prima prova', 1),
  ((SELECT id FROM photo_albums WHERE title = 'Trofeo Lago di Como 2024' LIMIT 1), 
   'https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?w=800', 'Laser in azione', 2),
  ((SELECT id FROM photo_albums WHERE title = 'Trofeo Lago di Como 2024' LIMIT 1), 
   'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?w=800', 'Premiazione finale', 3),
  
  ((SELECT id FROM photo_albums WHERE title = 'Corsi Estate 2024' LIMIT 1), 
   'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'Optimist e bambini', 1),
  ((SELECT id FROM photo_albums WHERE title = 'Corsi Estate 2024' LIMIT 1), 
   'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800', 'Lezione in spiaggia', 2),
  
  ((SELECT id FROM photo_albums WHERE title = 'Regata Sociale 2024' LIMIT 1), 
   'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800', 'La partenza', 1),
  ((SELECT id FROM photo_albums WHERE title = 'Regata Sociale 2024' LIMIT 1), 
   'https://images.unsplash.com/photo-1520454974749-611b7248ffc6?w=800', 'La grigliata', 2)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED: Documents
-- ============================================
INSERT INTO documents (title, description, file_url, file_type, category, is_public, expiry_date) VALUES
  ('Statuto Centro Vela Dervio', 'Statuto aggiornato della società sportiva dilettantistica', 
   'https://example.com/statuto.pdf', 'pdf', 'statuto', true, null),
  ('Modulo Iscrizione FIV', 'Modulo ufficiale per l''iscrizione alla Federazione Italiana Vela', 
   'https://example.com/fiv-modulo.pdf', 'pdf', 'moduli_fiv', true, '2025-12-31'),
  ('Regolamento Corsi 2025', 'Regolamento interno dei corsi di vela per la stagione 2025', 
   'https://example.com/regolamento-corsi.pdf', 'pdf', 'regolamenti', true, '2025-12-31'),
  ('Certificato Assicurativo', 'Certificato assicurativo RC della società', 
   'https://example.com/assicurazione.pdf', 'pdf', 'documenti_interni', false, '2026-01-31'),
  ('Comunicazione Riunioni 2025', 'Calendario delle riunioni soci per il 2025', 
   'https://example.com/riunioni.pdf', 'pdf', 'comunicazioni', true, '2025-12-31')
ON CONFLICT DO NOTHING;
