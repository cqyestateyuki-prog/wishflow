/**
 * Fragments Page / 碎片记录页
 * Quick notes and fragments collection
 * 快速记录碎片化的想法和感受
 */
'use client';

import { useEffect, useState } from 'react';
import AuthGate from '../../components/AuthGate';
import PageShell from '../../components/PageShell';
import { addFragment, fetchFragments } from '../../lib/supabase/queries';
import type { Fragment } from '../../lib/types';

export default function FragmentsPage() {
  const [items, setItems] = useState<Fragment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchFragments();
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd() {
    if (!content.trim()) return;
    try {
      await addFragment({ content: content.trim() });
      setContent('');
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to add');
    }
  }

  return (
    <AuthGate>
      <PageShell titleKey="fragments_title">
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="h2">Quick note</div>
          <textarea
            className="card"
            style={{ width: '100%', minHeight: 90, padding: 12, borderRadius: 12, marginTop: 10 }}
            placeholder="Write a fragment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div style={{ marginTop: 10 }}>
            <button className="btn primary" onClick={handleAdd}>Save</button>
          </div>
          {error && <div className="muted" style={{ marginTop: 8 }}>Error: {error}</div>}
        </div>

        <div className="card" style={{ padding: 16 }}>
          {loading && <div className="muted">Loading...</div>}
          {!loading && items.map((item) => (
            <div key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600 }}>{item.content.slice(0, 80)}</div>
              <div className="muted">{new Date(item.created_at).toLocaleString()}</div>
            </div>
          ))}
          {!loading && !items.length && <div className="muted">No fragments yet.</div>}
        </div>
      </PageShell>
    </AuthGate>
  );
}
