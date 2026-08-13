'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="max-w-sm mx-auto px-5 py-16">
        <h1 className="font-display text-4xl tracking-wide text-bone mb-4">CHECK YOUR EMAIL</h1>
        <p className="text-dim text-sm">
          We sent a confirmation link to <span className="text-bone">{email}</span>. Click it,
          then come back and log in.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <h1 className="font-display text-4xl tracking-wide text-bone mb-6">SIGN UP</h1>
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
            minLength={6}
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
          {loading ? 'CREATING…' : 'CREATE ACCOUNT'}
        </button>
      </form>
      <p className="text-dim text-sm mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-acid hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
