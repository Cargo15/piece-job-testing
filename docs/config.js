// ========================================
// Piece Job Backend Tester Configuration
// ========================================

const SUPABASE_URL = "https://huvzqqlpbwamouiztfdj.supabase.co";

const SUPABASE_ANON_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1dnpxcWxwYndhbW91aXp0ZmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzgyMzQsImV4cCI6MjA5ODE1NDIzNH0.ntaIQJ34iHmUlpJCHPEBRtNRe7SYzEI5cy6GVb9RCjo"

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);