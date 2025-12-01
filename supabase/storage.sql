-- Create storage bucket for course materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-materials', 'course-materials', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Anyone can view course materials"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-materials');

CREATE POLICY "Admins can upload course materials"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-materials' AND
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Admins can delete course materials"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-materials' AND
  auth.jwt() ->> 'role' = 'admin'
);
