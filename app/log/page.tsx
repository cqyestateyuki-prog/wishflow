/**
 * Log Page / 日志页
 * Connection history and activity log
 * 连接历史和活动日志
 */
'use client';

import { useMemo } from 'react';
import LoginPrompt from '@/components/LoginPrompt';
import PageShell from '../../components/PageShell';
import { useLanguage } from '@/components/LanguageProvider';
import { useLocalConnections } from '@/hooks/useLocalConnections';
import { useLocalWishes } from '@/hooks/useLocalWishes';

export default function LogPage() {
  const { language } = useLanguage();
  const { connections, loading } = useLocalConnections();
  const { wishes } = useLocalWishes();

  const wishTitleById = useMemo(() => {
    return new Map(wishes.map((wish) => [wish.id, wish.title]));
  }, [wishes]);

  const items = useMemo(() => {
    return [...connections].sort(
      (a, b) => new Date(b.connected_at).getTime() - new Date(a.connected_at).getTime()
    );
  }, [connections]);

  return (
    <PageShell titleKey="log_title">
      <div style={{ marginBottom: 16 }}>
        <LoginPrompt
          variant="inline"
          message={language === 'zh'
            ? '连接日志会先保存在本地。登录后可以同步到云端。'
            : 'Your connection log is saved locally first. Sign in to sync it to the cloud.'
          }
        />
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ marginBottom: 14 }}>
          <h1 className="h1" style={{ margin: 0 }}>
            {language === 'zh' ? '连接日志' : 'Connection Log'}
          </h1>
          <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>
            {language === 'zh'
              ? '这里只记录你回来过的瞬间，不显示失败或中断。'
              : 'This only records the moments you came back. No failures, no streak pressure.'}
          </p>
        </div>

        {loading ? (
          <div className="muted">{language === 'zh' ? '加载中...' : 'Loading...'}</div>
        ) : (
          <div className="grid" style={{ gap: 10 }}>
            {items.map((item) => (
              <div key={item.id} className="card" style={{ padding: 12 }}>
                <div style={{ fontWeight: 600 }}>
                  {wishTitleById.get(item.wish_id) ?? item.wish_id}
                </div>
                <div className="muted">
                  {item.level} · {new Date(item.connected_at).toLocaleString()}
                  {item.note ? ` · ${item.note}` : ''}
                </div>
              </div>
            ))}
            {!items.length && (
              <div className="muted">
                {language === 'zh' ? '还没有连接记录。' : 'No connections yet.'}
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}
