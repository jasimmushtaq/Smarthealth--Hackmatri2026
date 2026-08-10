
-- Create storage bucket for doctor profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('doctor-photos', 'doctor-photos', true);

-- Anyone can view doctor photos
CREATE POLICY "Doctor photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'doctor-photos');

-- Authenticated users can upload their own doctor photos
CREATE POLICY "Doctors can upload their own photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'doctor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Doctors can update their own photos
CREATE POLICY "Doctors can update their own photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'doctor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Doctors can delete their own photos
CREATE POLICY "Doctors can delete their own photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'doctor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
