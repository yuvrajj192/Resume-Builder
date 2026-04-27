const SUPABASE_URL = 'https://kuymqrxlghqekmsbuspz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1eW1xcnhsZ2hxZWttc2J1c3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNjYzNzAsImV4cCI6MjA5Mjg0MjM3MH0.1AN3l_nw2k-WltpB-3i4z4lHBW9IN5e7KsyXoyS3hdo';

// Prevent redeclaration
if (!window.supabaseClient) {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}

// Make it globally usable
window.supabase = window.supabaseClient;