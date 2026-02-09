/**
 * Wishes Page / 愿望管理页
 * Create, view, and manage all wishes
 * 创建、查看和管理所有愿望
 */
'use client';

import { useEffect, useState } from 'react';
import AuthGate from '../../components/AuthGate';
import PageShell from '../../components/PageShell';
import { createWish, fetchWishes, updateWish } from '../../lib/supabase/queries';
import type { Wish } from '../../lib/types';

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [endScene, setEndScene] = useState('');
  const [domain, setDomain] = useState('other');
  const [stage, setStage] = useState('lifelong');
  const [willSource, setWillSource] = useState('care');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWishes();
      setWishes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate() {
    if (!title.trim()) return;
    try {
      await createWish({
        title: title.trim(),
        end_scene: endScene.trim(),
        domain,
        stage,
        will_source: willSource
      });
      setTitle('');
      setEndScene('');
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to create');
    }
  }

  async function togglePin(wish: Wish) {
    try {
      await updateWish(wish.id, { pinned: !wish.pinned });
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to update');
    }
  }

  return (
    <AuthGate>
      <PageShell titleKey="wishes_title">
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="h2">Quick create</div>
          <div className="grid" style={{ marginTop: 12, gap: 10 }}>
            <input
              className="card"
              style={{ padding: '10px 12px', borderRadius: 12 }}
              placeholder="Wish title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="card"
              style={{ padding: '10px 12px', borderRadius: 12 }}
              placeholder="End scene (one sentence)"
              value={endScene}
              onChange={(e) => setEndScene(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <select
                className="card"
                style={{ padding: '10px 12px', borderRadius: 12 }}
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              >
                <option value="family">family</option>
                <option value="money">money</option>
                <option value="career">career</option>
                <option value="love">love</option>
                <option value="health">health</option>
                <option value="create">create</option>
                <option value="other">other</option>
              </select>
              <select
                className="card"
                style={{ padding: '10px 12px', borderRadius: 12 }}
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                <option value="13-18">13-18</option>
                <option value="18-25">18-25</option>
                <option value="25-35">25-35</option>
                <option value="35-50">35-50</option>
                <option value="50+">50+</option>
                <option value="lifelong">lifelong</option>
              </select>
              <input
                className="card"
                style={{ padding: '10px 12px', borderRadius: 12 }}
                placeholder="Will source"
                value={willSource}
                onChange={(e) => setWillSource(e.target.value)}
              />
              <button className="btn primary" onClick={handleCreate}>
                Create
              </button>
            </div>
          </div>
          {error && <div className="muted" style={{ marginTop: 8 }}>Error: {error}</div>}
        </div>

        <div className="grid two">
          {loading && <div className="muted">Loading...</div>}
          {!loading &&
            wishes.map((wish) => (
              <div key={wish.id} className="card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ fontWeight: 700 }}>{wish.title}</div>
                  <button className="btn" onClick={() => togglePin(wish)}>
                    {wish.pinned ? 'Pinned' : 'Pin'}
                  </button>
                </div>
                <div className="muted" style={{ marginTop: 8 }}>{wish.end_scene || '—'}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <span className="badge">{wish.domain || 'other'}</span>
                  <span className="badge">{wish.stage || 'lifelong'}</span>
                </div>
              </div>
            ))}
          {!loading && !wishes.length && <div className="muted">No wishes yet.</div>}
        </div>
      </PageShell>
    </AuthGate>
  );
}
