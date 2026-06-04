'use client';

import { useState, useEffect } from 'react';

interface Props {
  venueId: string;
  team: string;
  flag: string;
}

type VoteState = 'idle' | 'confirmed' | 'incorrect' | 'loading' | 'already_voted';

const LS_KEY = (venueId: string, team: string) => `vote:${venueId}:${team}`;

export default function VoteButtons({ venueId, team, flag }: Props) {
  const [state, setState] = useState<VoteState>('idle');

  // Check localStorage on mount — disable buttons if already voted
  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY(venueId, team));
    if (stored === 'confirm') setState('confirmed');
    else if (stored === 'incorrect') setState('incorrect');
  }, [venueId, team]);

  async function vote(action: 'confirm' | 'incorrect') {
    setState('loading');
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venueId, team, action }),
      });
      if (res.status === 409) {
        // Already voted (IP blocked) — record locally too
        localStorage.setItem(LS_KEY(venueId, team), action);
        setState('already_voted');
        return;
      }
      if (res.ok) {
        localStorage.setItem(LS_KEY(venueId, team), action);
        setState(action === 'confirm' ? 'confirmed' : 'incorrect');
      }
    } catch {
      setState('idle');
    }
  }

  if (state === 'confirmed') {
    return <span className="text-[10px] text-avocado-600 font-semibold">✓ Thanks for confirming</span>;
  }
  if (state === 'incorrect') {
    return <span className="text-[10px] text-gray-400 font-semibold">Got it — we'll review</span>;
  }
  if (state === 'already_voted') {
    return <span className="text-[10px] text-gray-300">Already voted</span>;
  }

  return (
    <div className="flex items-center gap-1.5 mt-0.5">
      <span className="text-[10px] text-gray-300">{flag} fan bar?</span>
      <button
        onClick={() => vote('confirm')}
        disabled={state === 'loading'}
        className="text-[10px] font-semibold text-avocado-600 hover:text-avocado-700 disabled:opacity-40 transition-colors"
        title="Confirm this is a fan bar"
      >
        👍
      </button>
      <button
        onClick={() => vote('incorrect')}
        disabled={state === 'loading'}
        className="text-[10px] font-semibold text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors"
        title="This isn't a fan bar for this team"
      >
        👎
      </button>
    </div>
  );
}
