/**
 * Fragments Page / 碎片记录页
 * Quick notes and fragments collection
 * 快速记录碎片化的想法和感受
 */
'use client';

import { useState } from 'react';
import LoginPrompt from '@/components/LoginPrompt';
import PageShell from '../../components/PageShell';
import { useLanguage } from '@/components/LanguageProvider';
import { useLocalFragments } from '@/hooks/useLocalFragments';

export default function FragmentsPage() {
  const { language } = useLanguage();
  const { fragments, addFragment, loading } = useLocalFragments();
  const [content, setContent] = useState('');

  async function handleAdd() {
    if (!content.trim()) return;
    addFragment(content.trim(), 'quick_note');
    setContent('');
  }

  return (
    <PageShell titleKey="fragments_title">
      <div style={{ marginBottom: 16 }}>
        <LoginPrompt
          variant="inline"
          message={language === 'zh'
            ? '碎片会先保存在本地。登录后可以同步到云端。'
            : 'Fragments are saved locally first. Sign in to sync them to the cloud.'
          }
        />
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div className="h2">{language === 'zh' ? '随手记' : 'Quick note'}</div>
        <textarea
          className="card"
          style={{ width: '100%', minHeight: 90, padding: 12, borderRadius: 12, marginTop: 10 }}
          placeholder={language === 'zh' ? '写下一句碎片想法...' : 'Write a fragment...'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div style={{ marginTop: 10 }}>
          <button className="btn primary" onClick={handleAdd}>
            {language === 'zh' ? '保存碎片' : 'Save'}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        {loading && <div className="muted">{language === 'zh' ? '加载中...' : 'Loading...'}</div>}
        {!loading && fragments.map((item) => (
          <div key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600 }}>{item.content.slice(0, 80)}</div>
            <div className="muted">{new Date(item.created_at).toLocaleString()}</div>
          </div>
        ))}
        {!loading && !fragments.length && (
          <div className="muted">{language === 'zh' ? '还没有碎片。' : 'No fragments yet.'}</div>
        )}
      </div>
    </PageShell>
  );
}
