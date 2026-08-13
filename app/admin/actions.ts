'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function assertAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user || !adminEmail || user.email !== adminEmail) {
    throw new Error('Not authorized.');
  }
  return supabase;
}

export async function approveEvent(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('events').update({ status: 'approved' }).eq('id', id);
  if (error) throw error;
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function rejectEvent(id: string, note: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase
    .from('events')
    .update({ status: 'rejected', moderator_note: note || null })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin');
  revalidatePath('/');
}
