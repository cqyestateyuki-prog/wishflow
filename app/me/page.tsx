/**
 * Me Page / 个人中心
 * User profile, settings, and data management
 * 用户资料、设置和数据管理
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import PageShell from '@/components/PageShell';
import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/hooks/useSettings';
import { useLocalWishes } from '@/hooks/useLocalWishes';
import { useLocalConnections } from '@/hooks/useLocalConnections';
import { useLocalFragments } from '@/hooks/useLocalFragments';
import { exportAllData, clearAllLocalData } from '@/lib/localStore';
import { supabase } from '@/lib/supabase/client';
import { formatLastSync, getLastSyncError, getLastSyncTime, hasUnsyncedData, syncAllData, SyncStatus } from '@/lib/syncData';

export default function MePage() {
  const { language, setLanguage } = useLanguage();
  const { settings, updateSettings, toggleAnimation, setVisualIntensity } = useSettings();
  const { wishes } = useLocalWishes();
  const { connections, getStats } = useLocalConnections();
  const { fragments } = useLocalFragments();
  
  const [user, setUser] = useState<any>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [hasPendingSync, setHasPendingSync] = useState(false);
  const [syncErrorAt, setSyncErrorAt] = useState<string | null>(null);

  // Refresh sync banner when local data changes (e.g. after auto-sync on login)
  useEffect(() => {
    const refresh = () => {
      setLastSync(getLastSyncTime());
      setHasPendingSync(hasUnsyncedData());
      setSyncErrorAt(getLastSyncError()?.at ?? null);
    };
    refresh();
    window.addEventListener('wishflow:local-data-changed', refresh);
    return () => window.removeEventListener('wishflow:local-data-changed', refresh);
  }, []);

  // Check auth status
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Get stats
  const stats = getStats();

  // Export data as JSON file
  const handleExport = useCallback(() => {
    setExporting(true);
    try {
      const data = exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wishflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }, []);

  // Clear all local data
  const handleClearData = useCallback(() => {
    clearAllLocalData();
    setShowClearConfirm(false);
    window.location.reload();
  }, []);

  const handleSync = useCallback(async () => {
    setSyncStatus('syncing');
    setSyncMessage('');
    const result = await syncAllData();
    setSyncStatus(result.status);
    setLastSync(getLastSyncTime());
    setHasPendingSync(hasUnsyncedData());
    setSyncErrorAt(getLastSyncError()?.at ?? null);
    setSyncMessage(result.status === 'success'
      ? (language === 'zh'
        ? `同步完成：上传 ${result.wishesUploaded} 个愿望、${result.connectionsUploaded} 条连接、${result.fragmentsUploaded} 个碎片。`
        : `Synced: ${result.wishesUploaded} wishes, ${result.connectionsUploaded} connections, ${result.fragmentsUploaded} fragments uploaded.`)
      : (result.error || (language === 'zh' ? '同步失败' : 'Sync failed'))
    );
  }, [language]);

  // Sign out
  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  }, []);

  // Permanently delete the account and all cloud data (App Store 5.1.1(v))
  const handleDeleteAccount = useCallback(async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setDeleteError(language === 'zh' ? '会话已过期，请重新登录。' : 'Session expired — please sign in again.');
        setDeleting(false);
        return;
      }
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setDeleteError(
          body.error ||
            (language === 'zh' ? '删除失败，请稍后重试。' : 'Could not delete the account. Please try again.')
        );
        setDeleting(false);
        return;
      }
      await supabase.auth.signOut();
      clearAllLocalData();
      window.location.href = '/';
    } catch {
      setDeleteError(language === 'zh' ? '网络错误，请稍后重试。' : 'Network error — please try again.');
      setDeleting(false);
    }
  }, [language]);

  return (
    <PageShell titleKey="me_title">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="h1" style={{ margin: 0 }}>
          {language === 'zh' ? '个人中心' : 'Settings'}
        </h1>
        <p className="muted" style={{ marginTop: 4, fontSize: 13 }}>
          {language === 'zh' 
            ? '管理你的偏好设置和数据' 
            : 'Manage your preferences and data'}
        </p>
      </div>

      {/* Account Section */}
      <section className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>
          {language === 'zh' ? '账号' : 'Account'}
        </h3>
        
        {user ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                background: 'var(--wish)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 20,
                fontWeight: 600,
              }}>
                {user.email?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{user.email}</div>
                <div className="muted" style={{ fontSize: 12 }}>
                  {language === 'zh' ? '已登录' : 'Signed in'}
                </div>
              </div>
            </div>
            <button className="btn" onClick={handleSignOut}>
              {language === 'zh' ? '退出登录' : 'Sign Out'}
            </button>

            {/* Delete Account */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 500, marginBottom: 4, color: '#c53030' }}>
                {language === 'zh' ? '删除账号' : 'Delete Account'}
              </div>
              <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
                {language === 'zh'
                  ? '永久删除账号以及云端的所有愿望、连接和碎片。此操作不可撤销。'
                  : 'Permanently delete your account and all wishes, connections, and fragments stored in the cloud. This cannot be undone.'}
              </div>
              {!showDeleteConfirm ? (
                <button
                  className="btn"
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ borderColor: '#c53030', color: '#c53030' }}
                >
                  {language === 'zh' ? '删除账号' : 'Delete Account'}
                </button>
              ) : (
                <div style={{
                  padding: 16,
                  background: 'rgba(197, 48, 48, 0.08)',
                  borderRadius: 14,
                  border: '1px solid rgba(197, 48, 48, 0.2)',
                }}>
                  <p style={{ margin: '0 0 12px', fontSize: 13, color: '#c53030' }}>
                    {language === 'zh'
                      ? '确定要永久删除账号吗？云端数据将全部移除，无法恢复。如需备份，请先导出数据。'
                      : 'Delete your account permanently? All cloud data will be removed and cannot be recovered. Export your data first if you want a backup.'}
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                      {language === 'zh' ? '取消' : 'Cancel'}
                    </button>
                    <button
                      className="btn"
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      style={{ background: '#c53030', color: 'white', borderColor: '#c53030' }}
                    >
                      {deleting
                        ? (language === 'zh' ? '删除中...' : 'Deleting...')
                        : (language === 'zh' ? '确认删除账号' : 'Confirm Delete')}
                    </button>
                  </div>
                  {deleteError && (
                    <p style={{ margin: '10px 0 0', fontSize: 12, color: '#c53030' }}>{deleteError}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p className="muted" style={{ marginBottom: 12 }}>
              {language === 'zh' 
                ? '登录后可以同步数据到云端，跨设备访问。' 
                : 'Sign in to sync data to cloud and access from any device.'}
            </p>
            <a href="/login" className="btn primary">
              {language === 'zh' ? '登录 / 注册' : 'Sign In / Sign Up'}
            </a>
          </div>
        )}
      </section>

      {/* Statistics */}
      <section className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>
          {language === 'zh' ? '数据统计' : 'Statistics'}
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16 }}>
          <div style={{ textAlign: 'center', padding: 12, background: 'rgba(230, 225, 240, 0.2)', borderRadius: 14 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--wish)' }}>{wishes.length}</div>
            <div className="muted" style={{ fontSize: 12 }}>{language === 'zh' ? '愿望' : 'Wishes'}</div>
          </div>
          <div style={{ textAlign: 'center', padding: 12, background: 'rgba(230, 225, 240, 0.2)', borderRadius: 14 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--wish)' }}>{stats.total}</div>
            <div className="muted" style={{ fontSize: 12 }}>{language === 'zh' ? '连接' : 'Connections'}</div>
          </div>
          <div style={{ textAlign: 'center', padding: 12, background: 'rgba(230, 225, 240, 0.2)', borderRadius: 14 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--wish)' }}>{stats.thisWeek}</div>
            <div className="muted" style={{ fontSize: 12 }}>{language === 'zh' ? '本周' : 'This Week'}</div>
          </div>
          <div style={{ textAlign: 'center', padding: 12, background: 'rgba(230, 225, 240, 0.2)', borderRadius: 14 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--wish)' }}>{fragments.length}</div>
            <div className="muted" style={{ fontSize: 12 }}>{language === 'zh' ? '碎片' : 'Fragments'}</div>
          </div>
        </div>
      </section>

      {/* Visual Settings */}
      <section className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>
          {language === 'zh' ? '视觉设置' : 'Visual Settings'}
        </h3>
        
        {/* Animation Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 500 }}>{language === 'zh' ? '动画效果' : 'Animations'}</div>
            <div className="muted" style={{ fontSize: 12 }}>
              {language === 'zh' ? '流动线条和过渡动画' : 'Flowing lines and transitions'}
            </div>
          </div>
          <button 
            className={settings.animationEnabled ? 'btn primary' : 'btn'}
            onClick={toggleAnimation}
            style={{ minWidth: 60 }}
          >
            {settings.animationEnabled 
              ? (language === 'zh' ? '开启' : 'On') 
              : (language === 'zh' ? '关闭' : 'Off')
            }
          </button>
        </div>

        {/* Visual Intensity */}
        <div>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>
            {language === 'zh' ? '视觉强度' : 'Visual Intensity'}
          </div>
          <div className="muted" style={{ fontSize: 12, marginBottom: 12 }}>
            {language === 'zh' ? '调整界面的雾感和对比度' : 'Adjust fog and contrast levels'}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['low', 'medium', 'high'] as const).map((level) => (
              <button
                key={level}
                className={settings.visualIntensity === level ? 'btn primary' : 'btn'}
                onClick={() => setVisualIntensity(level)}
                style={{ flex: 1 }}
              >
                {level === 'low' && (language === 'zh' ? '低刺激' : 'Low')}
                {level === 'medium' && (language === 'zh' ? '中等' : 'Medium')}
                {level === 'high' && (language === 'zh' ? '高对比' : 'High')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Language */}
      <section className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>
          {language === 'zh' ? '语言' : 'Language'}
        </h3>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={language === 'zh' ? 'btn primary' : 'btn'}
            onClick={() => setLanguage('zh')}
            style={{ flex: 1 }}
          >
            中文
          </button>
          <button
            className={language === 'en' ? 'btn primary' : 'btn'}
            onClick={() => setLanguage('en')}
            style={{ flex: 1 }}
          >
            English
          </button>
        </div>
      </section>

      {/* Data Management */}
      <section className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>
          {language === 'zh' ? '数据管理' : 'Data Management'}
        </h3>

        {/* Sync */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            {language === 'zh' ? '云端同步' : 'Cloud Sync'}
          </div>
          <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
            {user
              ? (language === 'zh'
                ? `上次同步：${formatLastSync(lastSync, language)}${hasPendingSync ? ' · 有待同步数据' : ''}`
                : `Last sync: ${formatLastSync(lastSync, language)}${hasPendingSync ? ' · unsynced data pending' : ''}`)
              : (language === 'zh'
                ? '登录后可以把本地愿望、连接和碎片同步到云端。'
                : 'Sign in to sync local wishes, connections, and fragments to the cloud.')}
          </div>
          {user && syncErrorAt && syncStatus !== 'syncing' && (
            <div style={{
              padding: '10px 12px',
              marginBottom: 8,
              borderRadius: 12,
              background: 'rgba(230, 225, 240, 0.35)',
              border: '1px solid var(--border)',
              fontSize: 12,
              color: 'var(--text)',
              lineHeight: 1.7,
            }}>
              {language === 'zh'
                ? '上次自动同步没有完成。你的数据仍然安全地保存在这台设备上，可以随时在下方重试。'
                : "The last automatic sync didn't finish. Your data is safe on this device — you can retry below whenever you like."}
            </div>
          )}
          {user ? (
            <button className="btn primary" onClick={handleSync} disabled={syncStatus === 'syncing'}>
              {syncStatus === 'syncing'
                ? (language === 'zh' ? '同步中...' : 'Syncing...')
                : (language === 'zh' ? '立即同步' : 'Sync Now')}
            </button>
          ) : (
            <a href="/login" className="btn primary">
              {language === 'zh' ? '登录 / 注册' : 'Sign In / Sign Up'}
            </a>
          )}
          {syncMessage && (
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              {syncMessage}
            </div>
          )}
        </div>
        
        {/* Export */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            {language === 'zh' ? '导出数据' : 'Export Data'}
          </div>
          <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
            {language === 'zh' 
              ? '下载所有愿望、连接记录和设置的备份文件' 
              : 'Download a backup file of all your wishes, connections, and settings'}
          </div>
          <button className="btn" onClick={handleExport} disabled={exporting}>
            {exporting 
              ? (language === 'zh' ? '导出中...' : 'Exporting...') 
              : (language === 'zh' ? '导出 JSON' : 'Export JSON')
            }
          </button>
        </div>

        {/* Clear Data */}
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4, color: '#c53030' }}>
            {language === 'zh' ? '清除本地数据' : 'Clear Local Data'}
          </div>
          <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
            {language === 'zh' 
              ? '删除所有本地存储的数据。此操作不可撤销。' 
              : 'Delete all locally stored data. This cannot be undone.'}
          </div>
          
          {!showClearConfirm ? (
            <button 
              className="btn" 
              onClick={() => setShowClearConfirm(true)}
              style={{ borderColor: '#c53030', color: '#c53030' }}
            >
              {language === 'zh' ? '清除数据' : 'Clear Data'}
            </button>
          ) : (
            <div style={{ 
              padding: 16, 
              background: 'rgba(197, 48, 48, 0.08)', 
              borderRadius: 14,
              border: '1px solid rgba(197, 48, 48, 0.2)',
            }}>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#c53030' }}>
                {language === 'zh' 
                  ? '确定要清除所有本地数据吗？此操作无法撤销。' 
                  : 'Are you sure you want to clear all local data? This cannot be undone.'}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => setShowClearConfirm(false)}>
                  {language === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button 
                  className="btn" 
                  onClick={handleClearData}
                  style={{ background: '#c53030', color: 'white', borderColor: '#c53030' }}
                >
                  {language === 'zh' ? '确认清除' : 'Confirm Clear'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section className="card" style={{ padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>
          {language === 'zh' ? '关于' : 'About'}
        </h3>
        
        <div className="muted" style={{ fontSize: 13, lineHeight: 1.8 }}>
          <p style={{ margin: '0 0 8px' }}>
            <b>Wishflow · 愿航</b>
          </p>
          <p style={{ margin: 0 }}>
            {language === 'zh' 
              ? '用流动、抖动的线条，为愿望定形的人生导航系统。' 
              : 'A lifelong wish navigation system with flowing, trembling lines.'}
          </p>
        </div>

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--wish)', fontSize: 13, margin: 0, fontStyle: 'italic' }}>
            {language === 'zh'
              ? '愿航不是帮你变得更快，而是让你在任何状态下，都没有离开自己的人生方向。'
              : 'Wishflow doesn\'t help you go faster. It helps you stay on your life path, no matter your state.'}
          </p>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
          <a href="/privacy" className="muted" style={{ fontSize: 12, textDecoration: 'underline' }}>
            {language === 'zh' ? '隐私政策' : 'Privacy Policy'}
          </a>
          <a href="/terms" className="muted" style={{ fontSize: 12, textDecoration: 'underline' }}>
            {language === 'zh' ? '服务条款' : 'Terms of Service'}
          </a>
        </div>
      </section>
    </PageShell>
  );
}
