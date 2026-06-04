'use client';

import { useState, useEffect } from 'react';

interface Props {
  venueId: string;
  team: string;
  flag: string;
}

type VoteState = 'idle' | 'confirmed' | 'incorrect' | 'loading';

const LS_KEY = (venueId: string, team: string) => `vote:${venueId}:${team}`;

export default function VoteButtons({ venueId, team, flag }: Props) {
  const [state, setState] = useState<VoteState>('idle');

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
      const next = action === 'confirm' ? 'confirmed' : 'incorrect';
      localStorage.setItem(LS_KEY(venueId, team), action);
      // 409 = already voted from another device — still show the voted state
      setState(res.ok || res.status === 409 ? next : 'idle');
    } catch {
      setState('idle');
    }
  }

  const isLoading = state === 'loading';

  return (
    <div className="flex items-center gap-1 mt-1">
      <span className="text-[10px] text-gray-400">{flag} fan bar?</span>

      {/* Confirm button */}
      <button
        onClick={() => state === 'idle' && vote('confirm')}
        disabled={isLoading || state === 'incorrect'}
        title="Yes, this is a fan bar"
        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
          state === 'confirmed'
            ? 'bg-avocado-600 text-white scale-110'
            : state === 'incorrect'
            ? 'text-gray-200 cursor-default'
            : 'text-gray-400 hover:bg-avocado-50 hover:text-avocado-700'
        } disabled:cursor-default`}
      >
        👍 {state === 'confirmed' && <span>Yes!</span>}
      </button>

      {/* Incorrect button */}
      <button
        onClick={() => state === 'idle' && vote('incorrect')}
        disabled={isLoading || state === 'confirmed'}
        title="This isn't a fan bar for this team"
        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
          state === 'incorrect'
            ? 'bg-red-100 text-red-600 scale-110'
            : state === 'confirmed'
            ? 'text-gray-200 cursor-default'
            : 'text-gray-400 hover:bg-red-50 hover:text-red-500'
        } disabled:cursor-default`}
      >
        👎 {state === 'incorrect' && <span>Noted</span>}
      </button>
    </div>
  );
}
