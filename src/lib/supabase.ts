import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yanrazdpowdcizqyleaf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbnJhemRwb3dkY2l6cXlsZWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MjE0NDAsImV4cCI6MjA1OTQ5NzQ0MH0.Kuf80uCP7So37XboF37mhM44FE7iqcIuKnrWtfIy0Do';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);