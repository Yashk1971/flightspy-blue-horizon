// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://okiywdxmdiyerpbbdbjz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9raXl3ZHhtZGl5ZXJwYmJkYmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjAzMTEsImV4cCI6MjA2NjMzNjMxMX0.q21GXSpQe9e05nI1utW1p-ZD6E661jhOe7ngE9Ou4tk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);