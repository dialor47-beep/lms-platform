-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view course materials" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload course materials" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete course materials" ON storage.objects;

-- Create storage bucket for course materials (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-materials', 'course-materials', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies with correct role checking
CREATE POLICY "Anyone can view course materials"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-materials');

CREATE POLICY "Admins can upload course materials"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-materials' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update course materials"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-materials' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete course materials"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-materials' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
