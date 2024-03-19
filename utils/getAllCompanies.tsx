import { createServerSupabaseClient } from '@/app/supabase-server';

const getAllCompanies = async () => {
  const supabase = createServerSupabaseClient();

  let { data, error } = await supabase.from('companies').select('*');

  return { data, error };
};

export default getAllCompanies;
