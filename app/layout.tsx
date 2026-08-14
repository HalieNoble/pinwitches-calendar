import type { Metadata } from 'next';
import { Bebas_Neue, Inter, Space_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from './SignOutButton';

const display = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const mono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'PinWitches — Tournaments & Community Events',
  description: 'A global calendar of tournaments, meetups, and celebrations, submitted and moderated by the community.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin = !!user && !!adminEmail && user.email === adminEmail;

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-white/10">
          <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link href="/" className="font-display text-3xl tracking-wide text-bone hover:text-magenta transition-colors">
              PINWITCHES
            </Link>
            <nav className="flex items-center gap-5 text-sm font-mono">
              <Link href="/" className="text-dim hover:text-bone transition-colors">EVENTS</Link>
              {user ? (
                <>
                  <Link href="/submit" className="text-dim hover:text-bone transition-colors">SUBMIT</Link>
                  {isAdmin && (
                    <Link href="/admin" className="text-acid hover:text-bone transition-colors">MODERATE</Link>
                  )}
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className="text-dim hover:text-bone transition-colors">LOG IN</Link>
                  <Link
                    href="/signup"
                    className="bg-magenta text-ink px-3 py-1.5 rounded-sm font-bold hover:bg-acid transition-colors"
                  >
                    SIGN UP
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/10 py-6 mt-16">
          <div className="max-w-5xl mx-auto px-5 text-xs text-dim font-mono">
            Every event here was submitted by a community member and approved by a human. Tilt responsibly.
          </div>
        </footer>
      </body>
    </html>
  );
}

