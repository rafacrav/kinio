import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://vkpbfracmnwcdmysgveq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_e8QciD0IJLZhBw4oaDtPCw_S5XH0b-z';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
