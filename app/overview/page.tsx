/**
 * Overview Page / 概览页
 * Dashboard showing all wishes overview
 * 仪表盘 - 显示所有愿望的概览
 */
'use client';

import { useEffect, useState } from 'react';
import AuthGate from '../../components/AuthGate';
import PageShell from '../../components/PageShell';
import { fetchWishes } from '../../lib/supabase/queries';
import type { Wish } from '../../lib/types';

export default function OverviewPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishes()
      .then(setWishes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGate>
      <PageShell titleKey="overview_title">
        <div className="card" style={{ padding: 16 }}>
          {loading && <div className="muted">Loading wishes...</div>}
          {error && <div className="muted">Error: {error}</div>}
          {!loading && !error && (
            <div className="grid" style={{ gap: 10 }}>
              {wishes.map((wish) => (
                <div key={wish.id} className="card" style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600 }}>{wish.title}</div>
                  <div className="muted">{wish.end_scene || '—'}</div>
                </div>
              ))}
              {!wishes.length && <div className="muted">No wishes yet.</div>}
            </div>
          )}
        </div>
      </PageShell>
    </AuthGate>
  );
}
