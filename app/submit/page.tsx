'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const SUGGESTED_TAGS = ['TOURNAMENT', 'MEETUP', 'CELEBRATION', 'CONFERENCE', 'LEAGUE', 'FUNDRAISER'];

export default function SubmitPage() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setCheckingAuth(false);
    });
  }, [supabase]);

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function addCustomTag() {
    const t = customTag.trim().toUpperCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setCustomTag('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);

    try {
      let image_path: string | null = null;

      if (image) {
        const ext = image.name.split('.').pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(path, image);
        if (uploadError) throw uploadError;
        image_path = path;
      }

      const { error: insertError } = await supabase.from('events').insert({
        user_id: user.id,
        title,
        event_date: eventDate,
        event_time: eventTime || null,
        location,
        description: description || null,
        link: link || null,
        tags,
        image_path,
        status: 'pending',
      });

      if (insertError) throw insertError;

      setDone(true);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingAuth) return null;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-5 py-16 text-center">
        <h1 className="font-display text-4xl tracking-wide text-bone mb-4">LOG IN TO SUBMIT</h1>
        <p className="text-dim text-sm mb-6">You need an account to submit an event.</p>
        <Link href="/login" className="bg-magenta text-ink font-bold rounded-sm px-5 py-2.5 inline-block hover:bg-acid transition-colors">
          LOG IN
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-5 py-16 text-center">
        <h1 className="font-display text-4xl tracking-wide text-bone mb-4">SUBMITTED</h1>
        <p className="text-dim text-sm mb-6">
          Your event is in the queue for moderator review. It'll appear on the calendar once approved.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-surface border border-white/15 rounded-sm px-5 py-2.5 text-bone hover:border-acid transition-colors"
        >
          BACK TO EVENTS
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <h1 className="font-display text-5xl tracking-wide text-bone mb-2">SUBMIT AN EVENT</h1>
      <p className="text-dim text-sm mb-8">
        Goes to a moderator for review before it's public. Keep it factual — who, what, where, when.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-dim font-mono text-xs">TITLE *</span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-surface border border-white/15 rounded-sm px-3 py-2 text-bone focus:border-acid"
            placeholder="Northwest Witches Winter Tournament"
          />
        </label>

        <div className="flex gap-4">
          <label className="flex flex-col gap-1.5 text-sm flex-1">
            <span className="text-dim font-mono text-xs">DATE *</span>
            <input
              required
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="bg-surface border border-white/15 rounded-sm px-3 py-2 text-bone focus:border-acid"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm flex-1">
            <span className="text-dim font-mono text-xs">TIME</span>
            <input
              type="text"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              placeholder="7:00 PM"
              className="bg-surface border border-white/15 rounded-sm px-3 py-2 text-bone focus:border-acid"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-dim font-mono text-xs">LOCATION *</span>
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Wedge Head, Portland, OR"
            className="bg-surface border border-white/15 rounded-sm px-3 py-2 text-bone focus:border-acid"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-dim font-mono text-xs">DESCRIPTION</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="bg-surface border border-white/15 rounded-sm px-3 py-2 text-bone focus:border-acid resize-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-dim font-mono text-xs">LINK (registration, event page, etc.)</span>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://…"
            className="bg-surface border border-white/15 rounded-sm px-3 py-2 text-bone focus:border-acid"
          />
        </label>

        <div className="flex flex-col gap-1.5 text-sm">
          <span className="text-dim font-mono text-xs">TAGS</span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_TAGS.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`font-mono text-[10px] rounded-sm px-2 py-1 border ${
                  tags.includes(tag)
                    ? 'bg-magenta text-ink border-magenta'
                    : 'border-white/20 text-dim hover:border-white/40'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-1">
            <input
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomTag();
                }
              }}
              placeholder="add a custom tag"
              className="bg-surface border border-white/15 rounded-sm px-3 py-1.5 text-sm text-bone flex-1 focus:border-acid"
            />
            <button
              type="button"
              onClick={addCustomTag}
              className="border border-white/15 rounded-sm px-3 text-sm text-dim hover:border-acid"
            >
              ADD
            </button>
          </div>
          {tags.filter((t) => !SUGGESTED_TAGS.includes(t)).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {tags.filter((t) => !SUGGESTED_TAGS.includes(t)).map((tag) => (
                <span
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="font-mono text-[10px] rounded-sm px-2 py-1 bg-magenta text-ink cursor-pointer"
                >
                  {tag} ✕
                </span>
              ))}
            </div>
          )}
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-dim font-mono text-xs">IMAGE (flyer, poster, photo)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="text-sm text-dim file:mr-3 file:bg-surface2 file:border file:border-white/15 file:rounded-sm file:px-3 file:py-1.5 file:text-bone file:text-xs"
          />
        </label>

        {error && <p className="text-magenta text-sm font-mono">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-magenta text-ink font-bold rounded-sm py-3 hover:bg-acid transition-colors disabled:opacity-50"
        >
          {submitting ? 'SUBMITTING…' : 'SUBMIT FOR REVIEW'}
        </button>
      </form>
    </div>
  );
}
