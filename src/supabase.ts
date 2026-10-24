import {createClient} from '@supabase/supabase-js';
// Public browser configuration. Row Level Security restricts database access.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://hzvysxorvicovdtnmiak.supabase.co',
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_6oJNEm0yy7zDYJz-Zn6hqw_5p4lTJ9f'
);
