/**
 * Wishes Page / 愿望管理页 · 愿力卡库
 * Create, view, and manage all wishes in a gallery
 * 创建、查看和管理所有愿望 - 画廊模式
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import LoginPrompt from '@/components/LoginPrompt';
import WishCard from '@/components/WishCard';
import WishDetail from '@/components/WishCard/WishDetail';
import { useLocalWishes } from '@/hooks/useLocalWishes';
import { useLanguage } from '@/components/LanguageProvider';
import { LocalWish, clearSampleData } from '@/lib/localStore';
import { DOMAINS, STAGES, WILL_SOURCES, CONNECTION_LEVELS } from '@/lib/constants';
import { supabase } from '@/lib/supabase/client';
import cardStyles from '@/components/WishCard/WishCard.module.css';

type SortOption = 'recent' | 'created' | 'pinned';

export default function WishesPage() {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { 
    wishes, 
    loading, 
    addWish, 
    togglePin, 
    recordConnection, 
    deleteWish,
    filterWishes, 
    getSorted,
    reload
  } = useLocalWishes();
  
  const [detailWish, setDetailWish] = useState<LocalWish | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('pinned');
  const [domainFilter, setDomainFilter] = useState('');
  
  // Create form state
  const [newTitle, setNewTitle] = useState('');
  const [newEndScene, setNewEndScene] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newStage, setNewStage] = useState('25-35');
  const [newWillSource, setNewWillSource] = useState('');
  const [creating, setCreating] = useState(false);

  // Check auth state and clear sample data on login
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        clearSampleData();
        reload();
      }
      setIsLoggedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        clearSampleData();
        reload();
      }
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, [reload]);

  // Filter and sort wishes
  const filteredWishes = filterWishes({
    search: searchQuery,
    domain: domainFilter || undefined,
  });
  const sortedWishes = getSorted(sortBy).filter(w => 
    filteredWishes.some(fw => fw.id === w.id)
  );

  // Handle wish creation
  const handleCreate = useCallback(async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const title = newTitle.trim();
      const endScene = newEndScene.trim();
      addWish({
        title,
        description: endScene || title,
        end_scene: endScene || null,
        domain: newDomain || null,
        stage: newStage || null,
        will_source: newWillSource || null,
        time_scope: 'long',
        target_time: 'years',
        svg_pattern: newDomain || null,
        svg_data: null,
        keywords: [],
        mood: null,
        line_seed: null,
        pinned: false,
        last_connected_at: null,
        last_level: null,
      });
      // Reset form
      setNewTitle('');
      setNewEndScene('');
      setNewDomain('');
      setNewStage('25-35');
      setNewWillSource('');
      setShowCreateForm(false);
    } finally {
      setCreating(false);
    }
  }, [addWish, newTitle, newEndScene, newDomain, newStage, newWillSource]);

  // Handle connection
  const handleConnect = useCallback((wishId: string, level: string, note?: string) => {
    recordConnection(wishId, level, note);
  }, [recordConnection]);

  // Handle pin toggle
  const handlePinToggle = useCallback((wishId: string) => {
    togglePin(wishId);
  }, [togglePin]);

  // Count stats
  const pinnedCount = wishes.filter(w => w.pinned).length;
  const totalCount = wishes.length;

  // Loading state (checking auth)
  if (isLoggedIn === null) {
    return (
      <PageShell titleKey="wishes_title">
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <p className="muted">{language === 'zh' ? '加载中...' : 'Loading...'}</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell titleKey="wishes_title">
      {isLoggedIn === false && (
        <div style={{ marginBottom: 16 }}>
          <LoginPrompt
            variant="inline"
            message={language === 'zh'
              ? '这些愿望安全地保存在这台设备上。想跨设备继续，可以'
              : 'These wishes are kept safely on this device. To carry them across devices,'
            }
          />
        </div>
      )}

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <h1 className="h1" style={{ margin: 0 }}>
            {language === 'zh' ? '愿力卡库' : 'Wish Gallery'}
          </h1>
          <p className="muted" style={{ marginTop: 4, fontSize: 13 }}>
            {language === 'zh' 
              ? `${totalCount} 个愿望 · ${pinnedCount} 个置顶` 
              : `${totalCount} wishes · ${pinnedCount} pinned`
            }
          </p>
        </div>
        <button 
          className="btn primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm 
            ? (language === 'zh' ? '取消' : 'Cancel')
            : (language === 'zh' ? '+ 新建愿望' : '+ New Wish')
          }
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>
            {language === 'zh' ? '创建新愿望' : 'Create New Wish'}
          </h3>
          
          <div style={{ display: 'grid', gap: 12 }}>
            <input
              type="text"
              placeholder={language === 'zh' ? '愿望标题（必填）' : 'Wish title (required)'}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                padding: '12px 14px',
                borderRadius: 14,
                border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.6)',
                fontSize: 14,
              }}
            />
            
            <textarea
              placeholder={language === 'zh' 
                ? '终局画面 - 描述实现时的感觉/场景' 
                : 'End scene - describe how it feels when achieved'
              }
              value={newEndScene}
              onChange={(e) => setNewEndScene(e.target.value)}
              rows={2}
              style={{
                padding: '12px 14px',
                borderRadius: 14,
                border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.6)',
                fontSize: 14,
                resize: 'none',
              }}
            />
            
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <select
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.6)',
                  fontSize: 13,
                  flex: 1,
                  minWidth: 120,
                }}
              >
                <option value="">{language === 'zh' ? '选择领域' : 'Select domain'}</option>
                {DOMAINS.map(d => (
                  <option key={d.id} value={d.label}>
                    {language === 'zh' ? d.label : d.labelEn}
                  </option>
                ))}
              </select>
              
              <select
                value={newStage}
                onChange={(e) => setNewStage(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.6)',
                  fontSize: 13,
                  flex: 1,
                  minWidth: 120,
                }}
              >
                {STAGES.map(s => (
                  <option key={s.id} value={s.id}>
                    {language === 'zh' ? s.label : s.labelEn}
                  </option>
                ))}
              </select>
              
              <select
                value={newWillSource}
                onChange={(e) => setNewWillSource(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.6)',
                  fontSize: 13,
                  flex: 1,
                  minWidth: 120,
                }}
              >
                <option value="">{language === 'zh' ? '愿力源' : 'Will source'}</option>
                {WILL_SOURCES.map(w => (
                  <option key={w.id} value={w.label}>
                    {language === 'zh' ? w.label : w.labelEn}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              className="btn primary"
              onClick={handleCreate}
              disabled={!newTitle.trim() || creating}
              style={{ marginTop: 8 }}
            >
              {creating 
                ? (language === 'zh' ? '创建中...' : 'Creating...') 
                : (language === 'zh' ? '创建愿望' : 'Create Wish')
              }
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        marginBottom: 20, 
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <input
          type="text"
          placeholder={language === 'zh' ? '搜索愿望...' : 'Search wishes...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 14,
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.6)',
            fontSize: 13,
            flex: 1,
            minWidth: 200,
          }}
        />
        
        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          style={{
            padding: '10px 32px 10px 14px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.6)',
            fontSize: 12,
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L5 5L9 1\' stroke=\'%236B5C8E\' stroke-width=\'1.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
          }}
        >
          <option value="">{language === 'zh' ? '全部领域' : 'All domains'}</option>
          {DOMAINS.map(d => (
            <option key={d.id} value={d.label}>
              {language === 'zh' ? d.label : d.labelEn}
            </option>
          ))}
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          style={{
            padding: '10px 32px 10px 14px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.6)',
            fontSize: 12,
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L5 5L9 1\' stroke=\'%236B5C8E\' stroke-width=\'1.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
          }}
        >
          <option value="pinned">{language === 'zh' ? '置顶优先' : 'Pinned first'}</option>
          <option value="recent">{language === 'zh' ? '最近连接' : 'Recent'}</option>
          <option value="created">{language === 'zh' ? '创建时间' : 'Created'}</option>
        </select>
      </div>

      {/* Wish Gallery */}
      {loading ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <p className="muted">{language === 'zh' ? '加载中...' : 'Loading...'}</p>
        </div>
      ) : sortedWishes.length === 0 ? (
        <div className={cardStyles.emptyState}>
          <div className={cardStyles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="16" stroke="#B5A8D0" strokeWidth="2" fill="none" opacity="0.5" />
              <circle cx="24" cy="24" r="10" stroke="#6B5C8E" strokeWidth="2.5" fill="none" />
              <circle cx="24" cy="24" r="3" fill="#6B5C8E" />
            </svg>
          </div>
          <h3 className={cardStyles.emptyTitle}>
            {searchQuery || domainFilter 
              ? (language === 'zh' ? '没有找到匹配的愿望' : 'No matching wishes')
              : (language === 'zh' ? '还没有愿望' : 'No wishes yet')
            }
          </h3>
          <p className={cardStyles.emptyDesc}>
            {searchQuery || domainFilter 
              ? (language === 'zh' ? '尝试调整搜索条件' : 'Try adjusting your search')
              : (
                <>
                  {language === 'zh' ? (
                    <>还可以先在 <Link href="/try" style={{ color: 'var(--wish)' }}>体验页</Link> 生成一张愿望图，或点击「新建愿望」。</>
                  ) : (
                    <>Start at <Link href="/try" style={{ color: 'var(--wish)' }}>/try</Link> to generate a wish map, or click &quot;New Wish&quot;.</>
                  )}
                </>
              )
            }
          </p>
        </div>
      ) : (
        <div className={cardStyles.gallery}>
          {sortedWishes.map((wish) => (
            <div key={wish.id} className={cardStyles.galleryCard}>
              <WishCard
                wish={wish}
                compact={true}
                onPinToggle={handlePinToggle}
                onClick={() => setDetailWish(wish)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Wish Detail Modal */}
      {detailWish && (
        <WishDetail
          wish={detailWish}
          onClose={() => setDetailWish(null)}
          onConnect={handleConnect}
          onPinToggle={handlePinToggle}
        />
      )}
    </PageShell>
  );
}
