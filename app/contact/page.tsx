'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Status = 'idle' | 'loading' | 'success' | 'error';

function ContactForm() {
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const fd = new FormData(e.currentTarget);
    const body: Record<string, string> = {};
    fd.forEach((v, k) => { body[k] = v as string; });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) { setStatus('success'); setMessage(data.message ?? 'Submitted!'); }
      else        { setStatus('error');   setMessage(data.error   ?? 'Something went wrong. Please try again.'); }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanks for the heads up!</h1>
        <p className="text-gray-500 text-sm max-w-sm">{message}</p>
        <Link href="/" className="mt-6 text-sm font-medium text-avocado-700 hover:underline">← Back to World Cup in SEA</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/" className="text-xs text-avocado-700 hover:underline">← Back to guide</Link>
        <h1 className="text-2xl font-black mt-2">Report an incorrect fan bar</h1>
        <p className="text-sm text-gray-500 mt-1">
          Think a team association is wrong? Let us know and we'll review it.
        </p>
      </div>

      {status === 'error' && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Your name *</label>
          <input
            name="contactName" type="text" required maxLength={100}
            placeholder="Jane Smith"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Your email *</label>
          <input
            name="contactEmail" type="email" required maxLength={200}
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Venue / bar name *</label>
          <input
            name="venueName" type="text" required maxLength={200}
            defaultValue={params.get('venue') ?? ''}
            placeholder="e.g. George & Dragon"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Team incorrectly listed *</label>
          <input
            name="incorrectTeam" type="text" required maxLength={100}
            defaultValue={params.get('team') ?? ''}
            placeholder="e.g. Argentina"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Correct team association *</label>
          <input
            name="correctTeam" type="text" required maxLength={100}
            placeholder="e.g. England"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">How do you know? *</label>
          <textarea
            name="howYouKnow" required maxLength={500} rows={4}
            placeholder="e.g. I'm a regular — they only show Premier League and have no connection to Argentina."
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500 resize-none"
          />
          <p className="text-[11px] text-gray-400 mt-1">Max 500 characters</p>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-avocado-600 text-white font-bold py-3 rounded-lg hover:bg-avocado-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Sending…' : 'Submit correction →'}
        </button>
      </form>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactForm />
    </Suspense>
  );
}
