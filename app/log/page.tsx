/**
 * Log Page / 日志页
 * Connection history and activity log
 * 连接历史和活动日志
 */
'use client';

import { useEffect, useState } from 'react';
import AuthGate from '../../components/AuthGate';
import PageShell from '../../components/PageShell';
import { fetchConnections } from '../../lib/supabase/queries';

export default function LogPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConnections()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGate>
      <PageShell titleKey="log_title">
        <div className="card" style={{ padding: 16 }}>
          {loading && <div className="muted">Loading...</div>}
          {error && <div className="muted">Error: {error}</div>}
          {!loading && !error && (
            <div className="grid" style={{ gap: 10 }}>
              {items.map((item) => (
                <div key={item.id} className="card" style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600 }}>{item.wishes?.title ?? item.wish_id}</div>
                  <div className="muted">{item.level} · {new Date(item.connected_at).toLocaleString()}</div>
                </div>
              ))}
              {!items.length && <div className="muted">No connections yet.</div>}
            </div>
          )}
        </div>
      </PageShell>
    </AuthGate>
  );
}
