import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dlltdbrlwblhtubiwusx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbHRkYnJsd2JsaHR1Yml3dXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDcxMjgsImV4cCI6MjA4ODMyMzEyOH0.sKsJYah9jwM69zqgWQ4Yk9-Df6L7BmLzIzWRbYNZDas';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Submit feedback for a calculator
export async function submitFeedback(calculatorId, comment) {
  const { data, error } = await supabase
    .from('calculator_feedback')
    .insert({ calculator_id: calculatorId, comment });
  return { data, error };
}

// Get all feedback for a calculator
export async function getFeedback(calculatorId) {
  const { data, error } = await supabase
    .from('calculator_feedback')
    .select('comment, created_at')
    .eq('calculator_id', calculatorId)
    .order('created_at', { ascending: true });
  return { data, error };
}
