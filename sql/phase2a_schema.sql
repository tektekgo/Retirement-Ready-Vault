
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.retirement_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  personal_info JSONB DEFAULT '{}'::jsonb,
  monthly_expenses JSONB DEFAULT '{}'::jsonb,
  assets JSONB DEFAULT '{}'::jsonb,
  income_sources JSONB DEFAULT '{}'::jsonb,
  
  analysis_results JSONB DEFAULT '{}'::jsonb,
  
  wizard_completion_status JSONB DEFAULT '{"step1": false, "step2": false, "step3": false, "step4": false, "step5": false}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.uploaded_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  
  document_type TEXT, -- 'financial_statement' | 'budget_export' | 'other'
  
  parsed_data JSONB,
  parsing_status TEXT DEFAULT 'pending', -- 'pending' | 'processing' | 'completed' | 'failed'
  ai_confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  
  user_reviewed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.shared_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  link_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  password_hash TEXT,
  
  access_count INTEGER DEFAULT 0,
  max_access_count INTEGER DEFAULT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.api_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  
  api_provider TEXT NOT NULL, -- 'openrouter' | 'resend'
  operation_type TEXT NOT NULL, -- 'document_parsing' | 'chat' | 'email_send'
  
  tokens_used INTEGER,
  cost_usd DECIMAL(10,4),
  
  request_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  response_status TEXT,
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS public.system_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  reminder_type TEXT NOT NULL, -- 'api_key_rotation' | 'usage_alert'
  scheduled_date DATE,
  message TEXT,
  
  completed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retirement_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_reminders ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own retirement data" ON public.retirement_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own retirement data" ON public.retirement_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own retirement data" ON public.retirement_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own retirement data" ON public.retirement_data
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own documents" ON public.uploaded_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON public.uploaded_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.uploaded_documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON public.uploaded_documents
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own shared links" ON public.shared_links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shared links" ON public.shared_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shared links" ON public.shared_links
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shared links" ON public.shared_links
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own API usage" ON public.api_usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System reminders admin only" ON public.system_reminders
  FOR ALL USING (false); -- Only accessible via service role


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_retirement_data_updated_at ON public.retirement_data;
CREATE TRIGGER update_retirement_data_updated_at 
  BEFORE UPDATE ON public.retirement_data 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();


/*
BUCKET: user-documents
- Public: false
- File size limit: 10MB
- Allowed MIME types: application/pdf, text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
- Purpose: Temporary storage for uploaded documents (deleted after extraction)

BUCKET: generated-reports
- Public: false
- File size limit: 5MB
- Allowed MIME types: application/pdf, text/csv
- Purpose: Generated PDF and CSV reports
- Retention: 90 days

STORAGE RLS POLICIES:
1. Users can upload to their own folder in user-documents
2. Users can access their own generated reports
3. Shared links can access specific files when valid
*/


CREATE INDEX IF NOT EXISTS idx_retirement_data_user_id ON public.retirement_data(user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_documents_user_id ON public.uploaded_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_links_user_id ON public.shared_links(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_user_id ON public.api_usage_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_api_usage_logs_timestamp ON public.api_usage_logs(request_timestamp);
CREATE INDEX IF NOT EXISTS idx_uploaded_documents_created_at ON public.uploaded_documents(created_at);

CREATE INDEX IF NOT EXISTS idx_shared_links_token ON public.shared_links(link_token);

CREATE INDEX IF NOT EXISTS idx_uploaded_documents_status ON public.uploaded_documents(parsing_status);


CREATE OR REPLACE FUNCTION get_user_api_costs(
  p_user_id UUID,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  api_provider TEXT,
  total_cost DECIMAL,
  total_tokens INTEGER,
  request_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    api_usage_logs.api_provider,
    SUM(cost_usd) as total_cost,
    SUM(tokens_used) as total_tokens,
    COUNT(*) as request_count
  FROM public.api_usage_logs
  WHERE user_id = p_user_id
    AND request_timestamp >= p_start_date
    AND request_timestamp <= p_end_date
  GROUP BY api_usage_logs.api_provider;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION cleanup_old_documents()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  UPDATE public.uploaded_documents
  SET deleted_at = NOW()
  WHERE created_at < NOW() - INTERVAL '7 days'
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


INSERT INTO public.system_reminders (reminder_type, scheduled_date, message, completed)
VALUES (
  'api_key_rotation',
  CURRENT_DATE + INTERVAL '90 days',
  'Time to rotate OpenRouter and Resend API keys for security',
  false
)
ON CONFLICT DO NOTHING;
