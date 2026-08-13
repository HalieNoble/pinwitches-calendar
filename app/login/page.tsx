'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <h1 className="font-display text-4xl tracking-wide text-bone mb-6">LOG IN</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-dim font-mono text-xs">EMAIL</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-surface border border-white/15 rounded-sm px-3 py-2 text-bone focus:border-acid"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-dim font-mono text-xs">PASSWORD</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-surface border border-white/15 rounded-sm px-3 py-2 text-bone focus:border-acid"
          />
        </label>
        {error && <p className="text-magenta text-sm font-mono">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-magenta text-ink font-bold rounded-sm py-2.5 hover:bg-acid transition-colors disabled:opacity-50"
        >
          {loading ? 'LOGGING IN…' : 'LOG IN'}
        </button>
      </form>
      <p className="text-dim text-sm mt-6">
        No account?{' '}
        <Link href="/signup" className="text-acid hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
