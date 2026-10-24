import {createClient} from '@supabase/supabase-js';
// Only public browser configuration belongs here. Never add provider secrets.
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hzvysxorvicovdtnmiak.supabase.co';
export const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_6oJNEm0yy7zDYJz-Zn6hqw_5p4lTJ9f';
const callbackParams = new URLSearchParams(window.location.hash.slice(1));
export const oauthFailed = callbackParams.has('error') || new URLSearchParams(window.location.search).has('error');
export const supabase = createClient(supabaseUrl, supabaseKey);
