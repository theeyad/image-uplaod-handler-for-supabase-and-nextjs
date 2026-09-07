-- This file sets up storage policies. You can modify the bucket name and policies as needed.
-- then run in supabase dashboard SQL editor.

-- 1. Create a public storage bucket named 'uploads' (this could be 'categories', 'products', etc.)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read access to everyone (those can be your customers in an e-commerce app, for example)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- 3. Allow authenticated users to upload/insert images (those can be your admin users)
CREATE POLICY "Authenticated Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads');

-- 4. Allow authenticated users to update/delete images (also those can be your admin users)
CREATE POLICY "Authenticated Manage Access"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'uploads');
