import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ModerationQueue from './ModerationQueue';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!user) redirect('/login');
  if (!adminEmail || user.email !== adminEmail) {
    return (
      <div className="max-w-md mx-auto px-5 py-16 text-center">
        <h1 className="font-display text-4xl tracking-wide text-bone mb-4">NOT AUTHORIZED</h1>
        <p className="text-dim text-sm">This page is for moderators only.</p>
      </div>
    );
  }

  const { data: pending } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="font-display text-5xl tracking-wide text-bone mb-2">MODERATION QUEUE</h1>
      <p className="text-dim text-sm mb-8">
        {pending?.length ?? 0} event{pending?.length === 1 ? '' : 's'} waiting for review.
      </p>
      <ModerationQueue events={pending ?? []} />
    </div>
  );
}
