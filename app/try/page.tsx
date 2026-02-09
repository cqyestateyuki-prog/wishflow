/**
 * Try Page / 体验页
 * Free trial for wish visualization without login
 * 无需登录即可体验愿望可视化功能
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../components/LanguageProvider';

// 生成随机的流动线条路径
function generateWavePath(seed: number) {
  const paths = [
    'M40 120 C 130 40, 240 190, 330 110 S 540 80, 680 130',
    'M110 190 C 200 150, 170 90, 260 80 S 340 140, 420 95 S 520 40, 610 85',
    'M40 120 C 150 20, 260 210, 360 110 S 560 60, 680 140',
    'M80 140 C 160 80, 220 180, 300 120 S 450 90, 620 140',
    'M50 150 C 140 60, 250 200, 340 110 S 500 70, 660 130',
  ];
  return paths[seed % paths.length];
}

// 生成随机的装饰元素
function generateDecorations(seed: number) {
  const decorations = [
    { type: 'triangle', d: 'M100 130 L140 100 L180 130 L100 130' },
    { type: 'circle', cx: 400, cy: 120, r: 30 },
    { type: 'star', d: 'M400 100 L410 130 L440 130 L415 150 L425 180 L400 160 L375 180 L385 150 L360 130 L390 130 Z' },
    { type: 'house', d: 'M100 130 L140 100 L180 130 L100 130 M110 130 L110 165 L170 165 L170 130' },
  ];
  return decorations[seed % decorations.length];
}

export default function TryPage() {
  const { lang } = useLanguage();
  const [title, setTitle] = useState('');
  const [endScene, setEndScene] = useState('');
  const [generated, setGenerated] = useState(false);
  const [wishImage, setWishImage] = useState({ path: '', decoration: null as any });

  function handleGenerate() {
    if (!title.trim()) return;
    
    // 基于标题生成一个简单的种子值
    const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    setWishImage({
      path: generateWavePath(seed),
      decoration: generateDecorations(seed)
    });
    setGenerated(true);
  }

  function handleReset() {
    setTitle('');
    setEndScene('');
    setGenerated(false);
  }

  return (
    <div className="container" style={{ paddingTop: 48, maxWidth: 920 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Link href="/" className="muted" style={{ fontSize: 13 }}>
          ← {lang === 'en' ? 'Back to home' : '返回首页'}
        </Link>
        <h1 className="h1" style={{ marginTop: 16 }}>
          {lang === 'en' ? 'Try Wish Visualization' : '试试愿望可视化'}
        </h1>
        <p className="muted" style={{ marginTop: 12 }}>
          {lang === 'en' 
            ? 'Enter your wish and see it transform into a visual form. No sign-up needed.' 
            : '输入你的愿望，看它转化为可视化形式。无需注册。'}
        </p>
      </div>

      {!generated ? (
        <div className="card" style={{ padding: 28 }}>
          <div className="grid" style={{ gap: 18 }}>
            <div>
              <label className="muted" style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                {lang === 'en' ? 'Wish Title' : '愿望标题'}
              </label>
              <input
                className="card"
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: 14,
                  fontSize: 16,
                  outline: 'none'
                }}
                placeholder={lang === 'en' ? 'e.g., Take parents on a cruise' : '例如：带爸爸妈妈去邮轮旅行'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>

            <div>
              <label className="muted" style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                {lang === 'en' ? 'End Vision (Optional)' : '终局画面（可选）'}
              </label>
              <textarea
                className="card"
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: 14,
                  fontSize: 14,
                  outline: 'none',
                  minHeight: 80,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: 1.6
                }}
                placeholder={lang === 'en' ? 'Describe the end vision in one sentence...' : '用一句话描述终局画面...'}
                value={endScene}
                onChange={(e) => setEndScene(e.target.value)}
              />
            </div>

            <button 
              className="btn dark" 
              onClick={handleGenerate}
              disabled={!title.trim()}
              style={{ 
                padding: '14px 24px',
                fontSize: 16,
                opacity: !title.trim() ? 0.5 : 1,
                cursor: !title.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {lang === 'en' ? 'Generate Wish Image' : '生成愿望图'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
              <div 
                className="card" 
                style={{ 
                  padding: 20,
                  background: 'var(--paper)',
                  minHeight: 260,
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="100%" 
                  height="220" 
                  viewBox="0 0 720 220"
                  style={{ overflow: 'visible' }}
                >
                  <path 
                    d={wishImage.path}
                    stroke="var(--ink)" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    strokeDasharray="8 10"
                    style={{
                      animation: 'drift 10s linear infinite'
                    }}
                  />
                  {wishImage.decoration && wishImage.decoration.type === 'triangle' && (
                    <path 
                      d={wishImage.decoration.d}
                      stroke="var(--ink)" 
                      strokeWidth="3" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  )}
                  {wishImage.decoration && wishImage.decoration.type === 'circle' && (
                    <circle 
                      cx={wishImage.decoration.cx}
                      cy={wishImage.decoration.cy}
                      r={wishImage.decoration.r}
                      stroke="var(--ink)" 
                      strokeWidth="3" 
                      fill="none"
                    />
                  )}
                  {wishImage.decoration && wishImage.decoration.type === 'house' && (
                    <path 
                      d={wishImage.decoration.d}
                      stroke="var(--ink)" 
                      strokeWidth="3" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </div>

              <div>
                <h2 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 12px' }}>{title}</h2>
                {endScene && (
                  <p className="muted" style={{ marginBottom: 16, lineHeight: 1.8 }}>
                    {endScene}
                  </p>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
                  <span className="badge">{lang === 'en' ? 'Life-long wish' : '一生级愿望'}</span>
                  <span className="badge">{lang === 'en' ? 'Take it slow' : '允许慢慢来'}</span>
                  <span className="badge">{lang === 'en' ? 'Stay connected' : '不断线'}</span>
                </div>

                <div className="card" style={{ padding: 16, marginTop: 24, background: 'rgba(230, 225, 240, 0.2)' }}>
                  <div className="muted" style={{ fontSize: 13, lineHeight: 1.8 }}>
                    {lang === 'en' ? (
                      <>
                        <b>🌑 Minimal (2 min):</b> Look at the image<br/>
                        <b>🌒 Normal (15 min):</b> Write one sentence<br/>
                        <b>🌕 Deep (60 min):</b> Take real-world action
                      </>
                    ) : (
                      <>
                        <b>🌑 最低连接（2分钟）：</b>看一眼这张图<br/>
                        <b>🌒 正常连接（15分钟）：</b>写一句话<br/>
                        <b>🌕 深度连接（60分钟）：</b>推进现实行动
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn" onClick={handleReset}>
              {lang === 'en' ? 'Create Another' : '再生成一个'}
            </button>
            <Link className="btn dark" href="/login">
              {lang === 'en' ? 'Sign in to Save' : '登录保存'}
            </Link>
          </div>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <p className="muted" style={{ fontSize: 13 }}>
              {lang === 'en' 
                ? 'Sign in to save your wishes, track connections, and access all features.' 
                : '登录后可以保存你的愿望、记录连接，并使用所有功能。'}
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes drift {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -180; }
        }
      `}</style>
    </div>
  );
}
