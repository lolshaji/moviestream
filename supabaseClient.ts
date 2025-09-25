import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rqpltcdkcllsriunkewr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcGx0Y2RrY2xsc3JpdW5rZXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTI2NTYsImV4cCI6MjA3NDM2ODY1Nn0.NyzCGCG7q10AcURrUI7MfZSfZ7-NozeB75LuTzTWrf4";

export const supabase = createClient(supabaseUrl, supabaseKey);
