/**
 * Daily Page / 每日连接页
 * Daily check-in and connection tracking for wishes
 * 每日打卡和愿望连接记录
 */
'use client';

import { useEffect, useState } from 'react';
import AuthGate from '../../components/AuthGate';
import PageShell from '../../components/PageShell';
import { addConnection, fetchWishes } from '../../lib/supabase/queries';
import type { Wish } from '../../lib/types';

export default function DailyPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWishes()
      .then(setWishes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function quickConnect(wish: Wish) {
    try {
      await addConnection({ wish_id: wish.id, level: 'low' });
      alert('Connected.');
    } catch (err: any) {
      setError(err.message || 'Failed to connect');
    }
  }

  return (
    <AuthGate>
      <PageShell titleKey="daily_title">
        <div className="card" style={{ padding: 16 }}>
          {loading && <div className="muted">Loading...</div>}
          {error && <div className="muted">Error: {error}</div>}
          {!loading && !error && (
            <div className="grid" style={{ gap: 10 }}>
              {wishes.slice(0, 3).map((wish) => (
                <div key={wish.id} className="card" style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600 }}>{wish.title}</div>
                  <div className="muted">{wish.end_scene || '—'}</div>
                  <button className="btn primary" style={{ marginTop: 10 }} onClick={() => quickConnect(wish)}>
                    🌑 2 min connection
                  </button>
                </div>
              ))}
              {!wishes.length && <div className="muted">Create a wish first.</div>}
            </div>
          )}
        </div>
      </PageShell>
    </AuthGate>
  );
}
