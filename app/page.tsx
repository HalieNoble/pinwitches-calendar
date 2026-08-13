import { createClient } from '@/lib/supabase/server';
import EventCard from './EventCard';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  let query = supabase
    .from('events')
    .select('*')
    .eq('status', 'approved')
    .gte('event_date', today)
    .order('event_date', { ascending: true });

  if (searchParams.tag) {
    query = query.contains('tags', [searchParams.tag]);
  }

  const { data: events, error } = await query;

  const allTags = Array.from(
    new Set((events ?? []).flatMap((e) => e.tags as string[]))
  ).sort();

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="mb-10">
        <h1 className="font-display text-5xl md:text-6xl tracking-wide leading-none text-bone">
          UPCOMING <span className="text-magenta">EVENTS</span>
        </h1>
        <p className="text-dim mt-2 max-w-xl">
          Tournaments, meetups, and celebrations from the community, worldwide. Every
          listing here was submitted by a member and approved by a moderator.
        </p>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
          <a
            href="/"
            className={`px-2.5 py-1 rounded-sm border ${
              !searchParams.tag
                ? 'bg-acid text-ink border-acid'
                : 'border-white/20 text-dim hover:border-white/40'
            }`}
          >
            ALL
          </a>
          {allTags.map((tag) => (
            <a
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
              className={`px-2.5 py-1 rounded-sm border ${
                searchParams.tag === tag
                  ? 'bg-acid text-ink border-acid'
                  : 'border-white/20 text-dim hover:border-white/40'
              }`}
            >
              {tag.toUpperCase()}
            </a>
          ))}
        </div>
      )}

      {error && (
        <p className="text-magenta font-mono text-sm">
          Couldn't load events. Check that the database is set up (see README).
        </p>
      )}

      {!error && events && events.length === 0 && (
        <div className="border border-dashed border-white/15 rounded-md p-10 text-center">
          <p className="text-dim font-mono text-sm">
            No upcoming events yet. Be the first to submit one.
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {events?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
