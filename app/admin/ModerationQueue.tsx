'use client';

import { useState, useTransition } from 'react';
import { approveEvent, rejectEvent } from './actions';

type Event = {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  location: string;
  description: string | null;
  link: string | null;
  tags: string[];
  image_path: string | null;
};

function imageUrl(path: string | null) {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/event-images/${path}`;
}

export default function ModerationQueue({ events }: { events: Event[] }) {
  const [isPending, startTransition] = useTransition();
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [note, setNote] = useState('');

  if (events.length === 0) {
    return (
      <div className="border border-dashed border-white/15 rounded-md p-10 text-center">
        <p className="text-dim font-mono text-sm">Queue's empty. Nothing to review.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => {
        const img = imageUrl(event.image_path);
        return (
          <div key={event.id} className="bg-surface border border-white/10 rounded-md p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-display text-2xl text-bone tracking-wide">{event.title}</h2>
                <p className="text-dim text-sm mt-0.5">
                  {event.event_date}
                  {event.event_time ? ` · ${event.event_time}` : ''} · {event.location}
                </p>
                {event.description && (
                  <p className="text-bone/80 text-sm mt-2">{event.description}</p>
                )}
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-acid hover:underline mt-2 inline-block"
                  >
                    {event.link}
                  </a>
                )}
                {event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] text-magenta border border-magenta/40 rounded-sm px-1.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt="" className="w-24 h-24 object-cover rounded-sm border border-white/10 shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                disabled={isPending}
                onClick={() => startTransition(() => approveEvent(event.id))}
                className="bg-acid text-ink font-bold text-sm rounded-sm px-4 py-1.5 hover:opacity-90 disabled:opacity-50"
              >
                APPROVE
              </button>
              {noteFor === event.id ? (
                <>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="reason (optional)"
                    className="bg-surface2 border border-white/15 rounded-sm px-2 py-1.5 text-sm text-bone flex-1"
                  />
                  <button
                    disabled={isPending}
                    onClick={() =>
                      startTransition(() => {
                        rejectEvent(event.id, note);
                        setNoteFor(null);
                        setNote('');
                      })
                    }
                    className="bg-magenta text-ink font-bold text-sm rounded-sm px-4 py-1.5 hover:opacity-90 disabled:opacity-50"
                  >
                    CONFIRM REJECT
                  </button>
                </>
              ) : (
                <button
                  disabled={isPending}
                  onClick={() => setNoteFor(event.id)}
                  className="border border-white/15 text-dim text-sm rounded-sm px-4 py-1.5 hover:border-magenta hover:text-magenta disabled:opacity-50"
                >
                  REJECT
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
