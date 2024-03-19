import { createServerSupabaseClient } from '@/app/supabase-server';

const getAllSignUpRequests = async () => {
  const supabase = createServerSupabaseClient();

  let { data, error } = await supabase.from('signup_requests').select('*');

  return { data, error };
};

export default getAllSignUpRequests;
