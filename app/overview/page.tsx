/**
 * Overview Page / 概览页 · 星图/河流地图
 * Dashboard showing all wishes on a visual map
 * 仪表盘 - 用星图或河流可视化显示所有愿望
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import LoginPrompt from '@/components/LoginPrompt';
import { StarMap, RiverMap } from '@/components/WishMap';
import WishCard from '@/components/WishCard';
import WishDetail from '@/components/WishCard/WishDetail';
import { useLocalWishes } from '@/hooks/useLocalWishes';
import { useLanguage } from '@/components/LanguageProvider';
import { LocalWish, clearSampleData } from '@/lib/localStore';
import { DOMAINS, STAGES, CONNECTION_LEVELS } from '@/lib/constants';
import { ConnectionIcon, StarIcon, WaveIcon } from '@/components/Icons';
import { supabase } from '@/lib/supabase/client';
import styles from '@/components/WishMap/WishMap.module.css';

type ViewMode = 'star' | 'river';

// Translate domain name based on language
function getDomainLabel(domain: string | null, language: string): string {
  if (!domain) return '';
  if (language === 'en') {
    const domainEntry = DOMAINS.find(d => d.label === domain);
    return domainEntry?.labelEn || domain;
  }
  return domain;
}

// Translate stage based on language
function getStageLabel(stage: string | null, language: string): string {
  if (!stage) return '';
  if (language === 'en') {
    const stageEntry = STAGES.find(s => s.label === stage);
    return stageEntry?.labelEn || stage;
  }
  return stage;
}

export default function OverviewPage() {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { wishes, loading, togglePin, recordConnection, filterWishes, reload } = useLocalWishes();
  
  const [viewMode, setViewMode] = useState<ViewMode>('star');
  const [selectedWish, setSelectedWish] = useState<LocalWish | null>(null);
  const [detailWish, setDetailWish] = useState<LocalWish | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [stageFilter, setStageFilter] = useState<string>('');

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

  // Filter wishes based on search and filters
  const filteredWishes = filterWishes({
    search: searchQuery,
    domain: domainFilter || undefined,
    level: levelFilter || undefined,
    stage: stageFilter || undefined,
  });

  // Handle wish selection on map
  const handleWishSelect = useCallback((wish: LocalWish) => {
    setSelectedWish(wish);
  }, []);

  // Handle wish click to open detail
  const handleWishClick = useCallback((wish: LocalWish) => {
    setDetailWish(wish);
  }, []);

  // Handle connection
  const handleConnect = useCallback((wishId: string, level: string, note?: string) => {
    recordConnection(wishId, level, note);
  }, [recordConnection]);

  // Handle pin toggle
  const handlePinToggle = useCallback((wishId: string) => {
    togglePin(wishId);
  }, [togglePin]);

  // Loading state (checking auth)
  if (isLoggedIn === null) {
    return (
      <PageShell titleKey="overview_title">
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <p className="muted">{language === 'zh' ? '加载中...' : 'Loading...'}</p>
        </div>
      </PageShell>
    );
  }

  // Logged out visitors without local wishes see a demo map. Once they save a
  // wish from /try, the real local-first map takes over without requiring login.
  if (!isLoggedIn && !loading && wishes.length === 0) {
    // Create demo wishes for visualization - specific and concrete examples
    const demoWishes = [
      {
        id: 'demo-1',
        title: language === 'zh' ? '全家人去一次邮轮旅行' : 'Family Cruise Trip Together',
        domain: '家人',
        stage: '25-35',
        last_level: 'normal',
        last_connected_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        pinned: false,
      },
      {
        id: 'demo-2',
        title: language === 'zh' ? '攒下人生第一个 $1000' : 'Save My First $1000',
        domain: '钱',
        stage: '18-25',
        last_level: 'deep',
        last_connected_at: new Date().toISOString(),
        pinned: true,
      },
      {
        id: 'demo-3',
        title: language === 'zh' ? '做出自己的产品并上线' : 'Build and Launch My Own Product',
        domain: '创造',
        stage: '25-35',
        last_level: 'deep',
        last_connected_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        pinned: true,
      },
      {
        id: 'demo-4',
        title: language === 'zh' ? '找到人生伴侣' : 'Find My Life Partner',
        domain: '爱',
        stage: '25-35',
        last_level: 'normal',
        last_connected_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        pinned: false,
      },
      {
        id: 'demo-5',
        title: language === 'zh' ? '减重 15 斤并保持' : 'Lose 15 lbs and Maintain',
        domain: '健康',
        stage: '25-35',
        last_level: 'minimum',
        last_connected_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        pinned: false,
      },
      {
        id: 'demo-6',
        title: language === 'zh' ? '升职成为 Manager' : 'Get Promoted to Manager',
        domain: '事业',
        stage: '25-35',
        last_level: 'normal',
        last_connected_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        pinned: false,
      },
    ] as LocalWish[];

    return (
      <PageShell titleKey="overview_title">
        {/* Title */}
        <div style={{ marginBottom: 18 }}>
          <h1 className="h1" style={{ margin: 0 }}>
            {language === 'zh' ? '愿力地图' : 'Wish Map'}
          </h1>
          <p className="muted" style={{ marginTop: 4, fontSize: 13 }}>
            {language === 'zh' 
              ? '登录后创建你自己的愿力宇宙。' 
              : 'Sign in to create your own wish universe.'
            }
          </p>
        </div>

        {/* Demo map layout */}
        <div className={styles.layout}>
          {/* Left sidebar - Demo wish list */}
          <aside className={styles.sidebar}>
            <div>
              <h2>{language === 'zh' ? '你的愿望' : 'Your Wishes'}</h2>
              <p className={styles.sidebarDesc}>
                {language === 'zh' 
                  ? '梦想没有截止日期。只要它一直在你身边。' 
                  : "There's no deadline for a dream. Just keep it close."
                }
              </p>
            </div>

            {/* Demo wish list - clickable to show login prompt */}
            <div className={styles.wishList}>
              {demoWishes.map((wish) => {
                const levelInfo = CONNECTION_LEVELS.find((l: { id: string; label: string; labelEn: string }) => l.id === wish.last_level);
                return (
                  <div
                    key={wish.id}
                    className={styles.wishItem}
                    style={{ opacity: 0.7, cursor: 'pointer' }}
                    onClick={() => setShowLoginPrompt(true)}
                  >
                    <b>{wish.title}</b>
                    <div className={styles.wishItemMeta}>
                      <span style={{ fontSize: 11, opacity: 0.7 }}>
                        {getDomainLabel(wish.domain, language)} · {getStageLabel(wish.stage, language)}
                      </span>
                      {levelInfo && (
                        <span className={styles.levelBadge} style={{ flexShrink: 0 }}>
                          <ConnectionIcon levelId={levelInfo.id} size={10} />
                          {language === 'zh' ? levelInfo.label : levelInfo.labelEn}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ 
              marginTop: 24, 
              padding: 16, 
              background: 'rgba(248, 246, 252, 0.6)',
              borderRadius: 14,
              fontSize: 12,
              color: 'var(--text)',
              opacity: 0.8,
            }}>
              {language === 'zh' ? '愿望会陪你一辈子。' : 'Wishes stay with you forever.'}
            </div>
          </aside>

          {/* Right side - Demo Map */}
          <section>
            {/* Demo map - clickable to show login prompt */}
            <div 
              style={{ opacity: 0.85, cursor: 'pointer', position: 'relative' }}
              onClick={() => setShowLoginPrompt(true)}
            >
              {/* View toggle inside map */}
              <div 
                style={{ 
                  position: 'absolute',
                  top: 56,
                  right: 16,
                  zIndex: 10,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.viewToggle}>
                  <button 
                    className={viewMode === 'star' ? 'active' : ''} 
                    onClick={() => setViewMode('star')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <StarIcon size={14} />
                    {language === 'zh' ? '星图' : 'Star'}
                  </button>
                  <button 
                    className={viewMode === 'river' ? 'active' : ''} 
                    onClick={() => setViewMode('river')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <WaveIcon size={14} />
                    {language === 'zh' ? '河流' : 'River'}
                  </button>
                </div>
              </div>
              
              <div style={{ pointerEvents: 'none' }}>
                {viewMode === 'star' ? (
                  <StarMap
                    wishes={demoWishes}
                    selectedWishId={null}
                    onWishSelect={() => {}}
                    onWishClick={() => {}}
                  />
                ) : (
                  <RiverMap
                    wishes={demoWishes}
                    selectedWishId={null}
                    onWishSelect={() => {}}
                    onWishClick={() => {}}
                  />
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 24,
            }}
            onClick={() => setShowLoginPrompt(false)}
          >
            <div 
              className="card"
              style={{
                maxWidth: 420,
                width: '100%',
                padding: '32px 28px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.98)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ 
                width: 64, 
                height: 64, 
                margin: '0 auto 20px',
                borderRadius: '50%',
                background: 'rgba(155, 143, 196, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="14" cy="14" r="6" stroke="#6B5C8E" strokeWidth="2" fill="none" />
                  <path d="M14 3 L14 9" stroke="#6B5C8E" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M14 19 L14 25" stroke="#6B5C8E" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M3 14 L9 14" stroke="#6B5C8E" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M19 14 L25 14" stroke="#6B5C8E" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h2 style={{ margin: '0 0 12px', fontSize: 20, color: 'var(--ink)' }}>
                {language === 'zh' ? '登录以使用完整功能' : 'Sign in to access full features'}
              </h2>
              <p className="muted" style={{ margin: '0 0 24px', fontSize: 14 }}>
                {language === 'zh' 
                  ? '创建账号后，你可以创建愿望、追踪连接历史，并在星图和河流中查看你的人生愿望。' 
                  : 'Create an account to make wishes, track connections, and view your life wishes in star maps and rivers.'
                }
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button 
                  className="btn"
                  onClick={() => setShowLoginPrompt(false)}
                  style={{ padding: '10px 20px' }}
                >
                  {language === 'zh' ? '稍后' : 'Later'}
                </button>
                <Link href="/login">
                  <button className="btn-primary-large" style={{ padding: '10px 24px' }}>
                    {language === 'zh' ? '登录 / 注册' : 'Sign In / Sign Up'}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </PageShell>
    );
  }

  return (
    <PageShell titleKey="overview_title">
      {isLoggedIn === false && (
        <div style={{ marginBottom: 16 }}>
          <LoginPrompt
            variant="inline"
            message={language === 'zh'
              ? '当前展示的是本地愿望地图。登录后可以同步到云端。'
              : 'This map is using your local wishes. Sign in to sync it to the cloud.'
            }
          />
        </div>
      )}

      {/* Title */}
      <div style={{ marginBottom: 18 }}>
        <h1 className="h1" style={{ margin: 0 }}>
          {language === 'zh' ? '愿力地图' : 'Wish Map'}
        </h1>
        <p className="muted" style={{ marginTop: 4, fontSize: 13 }}>
          {language === 'zh' 
            ? '你写下的愿望不会消失，它们会变成星星存在于这片宇宙中。' 
            : 'Your wishes will never disappear. They become stars that watch over you.'
          }
        </p>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <p className="muted">{language === 'zh' ? '加载中...' : 'Loading...'}</p>
        </div>
      ) : (
        <div className={styles.layout}>
          {/* Left sidebar - Wish list */}
          <aside className={styles.sidebar}>
            <div>
              <h2>{language === 'zh' ? '你的愿望' : 'Your Wishes'}</h2>
              <p className={styles.sidebarDesc}>
                {language === 'zh' 
                  ? '梦想没有截止日期。只要它一直在你身边。' 
                  : "There's no deadline for a dream. Just keep it close."
                }
              </p>
            </div>

            {/* Search */}
            <div className={styles.search}>
              <span style={{ color: 'rgba(74,85,104,0.8)', fontSize: 14 }}>⌕</span>
              <input
                className={styles.searchInput}
                placeholder={language === 'zh' ? '搜索愿望...' : 'Search wishes...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                style={{ 
                  padding: '6px 28px 6px 10px', 
                  borderRadius: 12, 
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.6)',
                  fontSize: 12,
                  color: 'var(--text)',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L5 5L9 1\' stroke=\'%236B5C8E\' stroke-width=\'1.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                }}
              >
                <option value="">{language === 'zh' ? '全部阶段' : 'All stages'}</option>
                {STAGES.map((s: { id: string; label: string; labelEn: string }) => (
                  <option key={s.id} value={s.id}>{language === 'zh' ? s.label : s.labelEn}</option>
                ))}
              </select>
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                style={{ 
                  padding: '6px 28px 6px 10px', 
                  borderRadius: 12, 
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.6)',
                  fontSize: 12,
                  color: 'var(--text)',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L5 5L9 1\' stroke=\'%236B5C8E\' stroke-width=\'1.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                }}
              >
                <option value="">{language === 'zh' ? '全部领域' : 'All domains'}</option>
                {DOMAINS.map((d: { id: string; label: string; labelEn: string }) => (
                  <option key={d.id} value={d.label}>{language === 'zh' ? d.label : d.labelEn}</option>
                ))}
              </select>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                style={{ 
                  padding: '6px 28px 6px 10px', 
                  borderRadius: 12, 
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.6)',
                  fontSize: 12,
                  color: 'var(--text)',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L5 5L9 1\' stroke=\'%236B5C8E\' stroke-width=\'1.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                }}
              >
                <option value="">{language === 'zh' ? '全部连接' : 'All levels'}</option>
                {CONNECTION_LEVELS.map((l: { id: string; label: string; labelEn: string }) => (
                  <option key={l.id} value={l.id}>{language === 'zh' ? l.label : l.labelEn}</option>
                ))}
              </select>
            </div>

            {/* Wish list */}
            <div className={styles.wishList}>
              {filteredWishes.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text)' }}>
                  {language === 'zh' ? '没有找到愿望' : 'No wishes found'}
                </div>
              ) : (
                filteredWishes.map((wish: LocalWish) => {
                  const levelInfo = wish.last_level 
                    ? CONNECTION_LEVELS.find((l: { id: string; label: string; labelEn: string }) => l.id === wish.last_level)
                    : null;
                  return (
                    <div
                      key={wish.id}
                      className={`${styles.wishItem} ${selectedWish?.id === wish.id ? styles.wishItemActive : ''}`}
                      onClick={() => {
                        setSelectedWish(wish);
                        setDetailWish(wish);
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <b style={{ display: 'block', fontSize: 13, lineHeight: 1.35, marginBottom: 3 }}>{wish.title}</b>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            {wish.domain && (
                              <span style={{
                                fontSize: 10,
                                color: 'var(--wish)',
                                background: 'rgba(107, 92, 142, 0.1)',
                                padding: '1px 6px',
                                borderRadius: 4,
                              }}>
                                {getDomainLabel(wish.domain, language)}
                              </span>
                            )}
                            {wish.stage && (
                              <span style={{ fontSize: 10, color: 'var(--text)' }}>{getStageLabel(wish.stage, language)}</span>
                            )}
                          </div>
                        </div>
                        {levelInfo ? (
                          <span className={styles.levelBadge} style={{ flexShrink: 0 }}>
                            <ConnectionIcon levelId={levelInfo.id} size={10} />
                            {language === 'zh' ? levelInfo.label : levelInfo.labelEn}
                          </span>
                        ) : (
                          <span className={styles.levelBadge} style={{ flexShrink: 0, opacity: 0.5 }}>
                            {language === 'zh' ? '未连接' : 'Not connected'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className={styles.whisper}>
              {language === 'zh' ? '你可以慢慢来。' : 'Take your time.'}<br/>
              {language === 'zh' ? '愿望会陪你一辈子。' : 'Wishes stay with you forever.'}
            </div>
          </aside>

          {/* Right side - Map */}
          <section>
            {/* Map with view toggle inside */}
            <div style={{ position: 'relative' }}>
              {/* View toggle inside map */}
              <div 
                style={{ 
                  position: 'absolute',
                  top: 56,
                  right: 16,
                  zIndex: 10,
                }}
              >
                <div className={styles.viewToggle}>
                  <button 
                    className={viewMode === 'star' ? 'active' : ''} 
                    onClick={() => setViewMode('star')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <StarIcon size={14} />
                    {language === 'zh' ? '星图' : 'Star'}
                  </button>
                  <button 
                    className={viewMode === 'river' ? 'active' : ''} 
                    onClick={() => setViewMode('river')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <WaveIcon size={14} />
                    {language === 'zh' ? '河流' : 'River'}
                  </button>
                </div>
              </div>
              
              {viewMode === 'star' ? (
                <StarMap
                  wishes={filteredWishes}
                  selectedWishId={selectedWish?.id}
                  onWishSelect={handleWishSelect}
                  onWishClick={handleWishClick}
                />
              ) : (
                <RiverMap
                  wishes={filteredWishes}
                  selectedWishId={selectedWish?.id}
                  onWishSelect={handleWishSelect}
                  onWishClick={handleWishClick}
                />
              )}
            </div>
          </section>
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
