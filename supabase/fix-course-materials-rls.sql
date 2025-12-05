-- Comprehensive fix for course_materials RLS policies
-- Run this script in Supabase SQL Editor
-- Step 1: Drop ALL existing policies on course_materials
DROP POLICY IF EXISTS "Users can view materials of enrolled courses" ON public.course_materials;
DROP POLICY IF EXISTS "Admins can manage course materials" ON public.course_materials;
DROP POLICY IF EXISTS "Admins can insert course materials" ON public.course_materials;
DROP POLICY IF EXISTS "Admins can update course materials" ON public.course_materials;
DROP POLICY IF EXISTS "Admins can delete course materials" ON public.course_materials;
-- Step 2: Recreate the SELECT policy for students
CREATE POLICY "Users can view materials of enrolled courses" ON public.course_materials FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.enrollments
            WHERE course_id = course_materials.course_id
                AND user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1
            FROM public.courses
            WHERE id = course_materials.course_id
                AND created_by = auth.uid()
        )
        OR EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- Step 3: Create INSERT policy for admins
CREATE POLICY "Admins can insert course materials" ON public.course_materials FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- Step 4: Create UPDATE policy for admins
CREATE POLICY "Admins can update course materials" ON public.course_materials FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- Step 5: Create DELETE policy for admins
CREATE POLICY "Admins can delete course materials" ON public.course_materials FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- Step 6: Verify the policies were created
SELECT schemaname,
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'course_materials'
ORDER BY policyname;