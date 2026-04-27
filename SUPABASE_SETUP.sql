-- ============================================
-- SUPABASE DATABASE SETUP FOR RESUME BUILDER
-- ============================================

-- Create resume_drafts table
CREATE TABLE public.resume_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resume_history table
CREATE TABLE public.resume_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content JSONB NOT NULL,
  template TEXT NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_resume_drafts_user_id ON public.resume_drafts(user_id);
CREATE INDEX idx_resume_history_user_id ON public.resume_history(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.resume_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for resume_drafts
CREATE POLICY "Users can view their own drafts"
  ON public.resume_drafts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts"
  ON public.resume_drafts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts"
  ON public.resume_drafts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts"
  ON public.resume_drafts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for resume_history
CREATE POLICY "Users can view their own history"
  ON public.resume_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history"
  ON public.resume_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history"
  ON public.resume_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STORAGE SETUP
-- ============================================

-- Create a storage bucket for resume PDFs
-- Note: You need to do this via Supabase Dashboard or uncomment if available
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resume-pdfs', 'resume-pdfs', false);

-- Create RLS policy for resume-pdfs bucket
-- Note: Configure these policies in the Supabase Dashboard under Storage
