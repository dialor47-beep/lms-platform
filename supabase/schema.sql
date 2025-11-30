-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'student');
CREATE TYPE material_type AS ENUM ('pdf', 'word', 'excel', 'ppt', 'video', 'link');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'open');
CREATE TYPE event_type AS ENUM ('class', 'meeting', 'exam');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    thumbnail_url TEXT,
    created_by UUID REFERENCES public.profiles(id),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course materials table
CREATE TABLE public.course_materials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type material_type NOT NULL,
    file_url TEXT,
    external_link TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE public.quizzes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    passing_score INTEGER DEFAULT 70,
    time_limit INTEGER, -- in minutes
    max_attempts INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz questions table
CREATE TABLE public.quiz_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    type question_type NOT NULL,
    options JSONB, -- for multiple choice: ["option1", "option2", ...]
    correct_answer TEXT NOT NULL,
    points INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0
);

-- Quiz attempts table
CREATE TABLE public.quiz_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    answers JSONB NOT NULL, -- {question_id: answer}
    passed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates table
CREATE TABLE public.certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES public.quizzes(id),
    certificate_url TEXT,
    verification_code TEXT UNIQUE,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events/Calendar table
CREATE TABLE public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    event_type event_type NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    meet_link TEXT,
    youtube_link TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE public.enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);

-- Create indexes for better performance
CREATE INDEX idx_courses_created_by ON public.courses(created_by);
CREATE INDEX idx_courses_category ON public.courses(category);
CREATE INDEX idx_course_materials_course_id ON public.course_materials(course_id);
CREATE INDEX idx_quizzes_course_id ON public.quizzes(course_id);
CREATE INDEX idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_events_course_id ON public.events(course_id);
CREATE INDEX idx_events_start_time ON public.events(start_time);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Anyone can view published courses" ON public.courses
    FOR SELECT USING (is_published = true OR created_by = auth.uid());

CREATE POLICY "Admins can create courses" ON public.courses
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can update own courses" ON public.courses
    FOR UPDATE USING (
        created_by = auth.uid() AND 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can delete own courses" ON public.courses
    FOR DELETE USING (
        created_by = auth.uid() AND 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Course materials policies
CREATE POLICY "Users can view materials of enrolled courses" ON public.course_materials
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.enrollments 
            WHERE course_id = course_materials.course_id 
            AND user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.courses 
            WHERE id = course_materials.course_id 
            AND created_by = auth.uid()
        )
    );

CREATE POLICY "Admins can manage course materials" ON public.course_materials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE id = course_materials.course_id 
            AND created_by = auth.uid()
        )
    );

-- Enrollments policies
CREATE POLICY "Users can view own enrollments" ON public.enrollments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can enroll in courses" ON public.enrollments
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own enrollment progress" ON public.enrollments
    FOR UPDATE USING (user_id = auth.uid());

-- Quiz attempts policies
CREATE POLICY "Users can view own quiz attempts" ON public.quiz_attempts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create quiz attempts" ON public.quiz_attempts
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Certificates policies
CREATE POLICY "Users can view own certificates" ON public.certificates
    FOR SELECT USING (user_id = auth.uid());

-- Events policies
CREATE POLICY "Enrolled users can view course events" ON public.events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.enrollments 
            WHERE course_id = events.course_id 
            AND user_id = auth.uid()
        )
        OR created_by = auth.uid()
    );

CREATE POLICY "Admins can manage events" ON public.events
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
