type Event = {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  venue_name: string;
  street_address: string | null;
  city: string;
  state_province: string;
  country: string | null;
  description: string | null;
  link: string | null;
  tags: string[];
  image_path: string | null;
  status: string;
  moderator_note?: string | null;
  distance?: number | null;
};

function imageUrl(path: string | null) {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/event-images/${path}`;
}

function formatDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
  };
}

function formatLocation(e: Event) {
  return [e.venue_name, e.city, e.state_province].filter(Boolean).join(', ');
}

export default function EventCard({ event }: { event: Event }) {
  const { month, day, weekday } = formatDate(event.event_date);
  const img = imageUrl(event.image_path);
  return (
    <article className="bg-surface border border-white/10 rounded-md overflow-hidden flex hover:border-magenta/40 transition-colors">
      <div className="dot-matrix bg-surface2 w-20 shrink-0 flex flex-col items-center justify-center py-4 border-r border-white/10">
        <span className="font-mono text-[10px] text-dim">{weekday}</span>
        <span className="font-display text-3xl text-acid leading-none">{day}</span>
        <span className="font-mono text-[10px] text-dim">{month}</span>
      </div>
      <div className="p-4 flex-1 min-w-0">
        <h2 className="font-display text-2xl tracking-wide text-bone leading-tight">
          {event.title}
        </h2>
        <p className="text-dim text-sm mt-1">
          {formatLocation(event)}
          {event.event_time ? ` · ${event.event_time}` : ''}
          {typeof event.distance === 'number' ? ` · ${event.distance.toFixed(1)} mi away` : ''}
        </p>
        {event.description && (
          <p className="text-bone/80 text-sm mt-2 line-clamp-3">{event.description}</p>
        )}
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt=""
            className="mt-3 rounded-sm border border-white/10 w-full max-h-40 object-cover"
          />
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] text-magenta border border-magenta/40 rounded-sm px-1.5 py-0.5"
              >
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
          {event.link && (
            
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-acid hover:underline shrink-0"
            >
              DETAILS →
            </a>
          )}
        </div>
      </div>
    </article>
  );
}