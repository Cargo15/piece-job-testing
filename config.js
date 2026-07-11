// ========================================
// Piece Job Backend Tester Configuration
// ========================================

const SUPABASE_URL = "https://huvzqqlpbwamouiztfdj.supabase.co";

const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);