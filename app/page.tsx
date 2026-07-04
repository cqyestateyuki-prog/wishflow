/**
 * Home Page / 首页
 * Landing page introducing Wishflow to visitors
 * 向访客介绍愿航系统的落地页
 */
'use client';

import Link from 'next/link';
import { useLanguage } from '../components/LanguageProvider';
import { MoonNew, MoonCrescent, MoonFull } from '../components/Icons';
import { t } from '../lib/i18n';

export default function HomePage() {
  const { lang } = useLanguage();

  return (
    <div className="container" style={{ paddingTop: 48 }}>
      <section style={{ textAlign: 'center', padding: '32px 0 12px' }}>
        {/* 流线图 SVG */}
        <div style={{ width: 'min(720px, 92%)', margin: '0 auto 24px', display: 'grid', placeItems: 'center' }} aria-hidden="true">
          <svg style={{ width: '100%', height: 'auto', overflow: 'visible' }} viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M40 120 C 130 40, 240 190, 330 110 S 540 80, 680 130" 
              stroke="var(--ink)" 
              strokeWidth="3" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ strokeDasharray: '40 20', animation: 'drift 10s linear infinite', opacity: 0.95 }}
            />
            <path 
              d="M55 128 C 150 55, 250 175, 340 118 S 540 95, 670 138" 
              stroke="var(--ink)" 
              strokeWidth="3" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ strokeDasharray: '30 15', animation: 'drift 12s linear infinite', opacity: 0.45 }}
            />
          </svg>
        </div>

        <h1 className="h1">{t('hero_title', lang)}</h1>
        <p className="muted" style={{ maxWidth: 720, margin: '16px auto 0', fontSize: '18px', lineHeight: '1.8' }}>
          {t('hero_subtitle', lang)}
        </p>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link 
            className="btn" 
            href="/try"
            style={{ background: 'var(--wish)', color: '#fff', border: 'none' }}
          >
            {lang === 'en' ? 'Generate my first wish map' : '生成我的第一张愿望图'}
          </Link>
          <Link className="btn" href="#how">
            {t('hero_cta_secondary', lang)}
          </Link>
        </div>
        <div className="muted" style={{ marginTop: 12 }}>{t('hero_micro', lang)}</div>
      </section>

      <section style={{ marginTop: 48 }} id="how">
        <div className="h2" style={{ textAlign: 'center' }}>{t('section_problem_title', lang)}</div>
        <div className="grid three" style={{ marginTop: 18 }}>
          <div className="card" style={{ padding: 16 }}>
            <div className="muted">{t('section_problem_1', lang)}</div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="muted">{t('section_problem_2', lang)}</div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="muted">{t('section_problem_3', lang)}</div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 className="section-title">
          {lang === 'en' ? 'Wish Card: Visualize your wishes' : '愿力卡：可视化你的愿望。'}
        </h2>
        
        <div className="demo-note">
          <span aria-hidden="true" style={{ marginRight: 6 }}>✦</span>
          {lang === 'en'
            ? 'A demo wish card — create your own to start your journey'
            : '示例愿望卡 · 创建你自己的愿望，开始旅程'}
        </div>

        <div className="wishcard-preview">
          <div className="wishcard-sketch" aria-label={lang === 'en' ? 'Wish visualization' : '愿望意象图'}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" style={{ overflow: 'visible' }}>
              <style>{`
                @keyframes wave-drift {
                  from { transform: translateX(0); }
                  to { transform: translateX(-40px); }
                }
              `}</style>
              
              {/* 海浪 (Waves) - Animated */}
              <g style={{ animation: 'wave-drift 4s linear infinite alternate' }}>
                <path 
                  d="M-40 250 Q 0 230, 40 250 T 120 250 T 200 250 T 280 250 T 360 250 T 440 250" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  strokeDasharray="60 15" 
                  opacity="0.8"
                />
              </g>
              
              <g style={{ animation: 'wave-drift 5s linear infinite alternate-reverse' }}>
                <path 
                  d="M-20 270 Q 20 250, 60 270 T 140 270 T 220 270 T 300 270 T 380 270 T 460 270" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  strokeDasharray="50 20" 
                  opacity="0.6"
                />
              </g>
              
              {/* 邮轮船体 (Ship Hull) */}
              <g style={{ transform: 'translateY(-2px)' }}>
                <path 
                  d="M80 240 L 320 240 L 300 180 L 100 180 Z" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                
                {/* 上层建筑 (Superstructure) */}
                <path 
                  d="M120 180 L 120 140 L 280 140 L 280 180" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M140 140 L 140 110 L 240 110 L 240 140" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                
                {/* 窗户 (Windows - Dots) */}
                <circle cx="140" cy="160" r="3" fill="currentColor" />
                <circle cx="170" cy="160" r="3" fill="currentColor" />
                <circle cx="200" cy="160" r="3" fill="currentColor" />
                <circle cx="230" cy="160" r="3" fill="currentColor" />
                <circle cx="260" cy="160" r="3" fill="currentColor" />
                
                {/* 烟囱 (Chimney) */}
                <path 
                  d="M180 110 L 180 80 L 210 80 L 210 110" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                
                {/* 烟雾 (Smoke - Wavy lines) */}
                <path 
                  d="M195 70 Q 200 60, 210 55 T 230 40" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  opacity="0.5"
                />
              </g>
              
              {/* 太阳/月亮 (Sun/Moon) */}
              <circle cx="320" cy="80" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            </svg>
          </div>

          <div className="wishcard-meta">
            <h3>{lang === 'en' ? 'Take the family on a cruise' : '带一家人去邮轮旅行'}</h3>
            <div className="wishcard-desc">
              {lang === 'en' 
                ? 'End scene: Family relaxing at sea, making memories together.'
                : '终局画面：一家人在海上放松，留下回忆。'}
            </div>

            <div className="wishcard-tags">
              <span className="tag">{lang === 'en' ? 'Will source: Companionship' : '愿力源：陪伴'}</span>
              <span className="tag">{lang === 'en' ? 'Life-long wish' : '一生级愿望'}</span>
            </div>

            <div className="connection-levels">
              <div className="level-item">
                <b><MoonNew size={16} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />{lang === 'en' ? 'Minimum connection (2 min)' : '最低连接（2分钟）'}</b>
                <span>{lang === 'en' ? 'Just look at this image. That counts as staying connected.' : '看一眼，也是在回应它的存在。'}</span>
              </div>
              <div className="level-item">
                <b><MoonCrescent size={16} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />{lang === 'en' ? 'Normal connection (15 min)' : '正常连接（15分钟）'}</b>
                <span>{lang === 'en' ? 'Write one sentence, or do a tiny action.' : '写一句话，或做一个小动作。'}</span>
              </div>
              <div className="level-item">
                <b><MoonFull size={16} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />{lang === 'en' ? 'Deep connection (60 min)' : '深度连接（60分钟）'}</b>
                <span>{lang === 'en' ? 'When you have energy, move one step in reality.' : '当你有力气时，推进一次现实行动。'}</span>
              </div>
            </div>

            <div className="whisper-text">
              {lang === 'en' ? 'Life-long Wish Navigation System' : 'Life-long Wish Navigation System 一生级愿望导航系统'}
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section style={{ marginTop: 40, marginBottom: 80 }}>
        <h2 className="section-title">
          {lang === 'en' ? 'Wish Gallery: Your wishes live here' : '愿望画廊：你的愿望，会住在这里'}
        </h2>
        
        <div className="demo-note">
          <span aria-hidden="true" style={{ marginRight: 6 }}>✦</span>
          {lang === 'en'
            ? 'Example wishes — sign up to create your own collection'
            : '示例愿望 · 注册后创建你自己的收藏'}
        </div>

        <div className="wish-gallery">
          <div className="gallery-tile">
            <div className="gallery-thumb">
              {/* Sailboat on calm water */}
              <svg viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 92 Q 38 86 58 92 T 98 92 T 142 92" strokeWidth="2" opacity="0.5"/>
                <path d="M24 101 Q 44 96 64 101 T 104 101 T 146 101" strokeWidth="2" opacity="0.32"/>
                <path d="M50 83 Q 80 99 110 83"/>
                <path d="M80 83 L 80 30"/>
                <path d="M80 34 C 104 46 106 70 83 80"/>
                <path d="M80 44 C 64 56 62 72 80 80" strokeWidth="2.4"/>
                <path d="M80 30 L 94 27 L 80 24" strokeWidth="2"/>
                <circle cx="132" cy="28" r="11" stroke="var(--wish)" strokeWidth="2.4"/>
                <path d="M132 11 L132 6 M147 20 L151 17 M117 20 L113 17" stroke="var(--wish)" strokeWidth="2" opacity="0.7"/>
              </svg>
            </div>
            <div className="gallery-caption">
              <b>{lang === 'en' ? 'Cruise Trip' : '邮轮旅行'}</b><br/>
              {lang === 'en' ? 'Last connection: 3 days ago (minimum)' : '最近连接：3 天前（最低连接）'}
            </div>
          </div>

          <div className="gallery-tile">
            <div className="gallery-thumb">
              {/* Winding path over the hills toward a rising sun */}
              <svg viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <circle cx="112" cy="66" r="12" stroke="var(--wish)" strokeWidth="2.4"/>
                <path d="M112 48 L112 43 M128 58 L132 55 M96 58 L92 55" stroke="var(--wish)" strokeWidth="2" opacity="0.7"/>
                <path d="M16 80 Q 52 66 86 74 Q 118 81 148 68" strokeWidth="2.5"/>
                <path d="M64 112 C 74 98 84 86 90 75"/>
                <path d="M104 112 C 100 98 96 86 94 75"/>
                <path d="M85 104 L 87 100 M89 92 L 91 88" strokeWidth="2" opacity="0.45"/>
              </svg>
            </div>
            <div className="gallery-caption">
              <b>{lang === 'en' ? 'Life Direction' : '人生方向'}</b><br/>
              {lang === 'en' ? 'Last connection: 1 week ago' : '最近连接：1 周前'}
            </div>
          </div>

          <div className="gallery-tile">
            <div className="gallery-thumb">
              {/* Small house with a curl of smoke */}
              <svg viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M26 100 Q 80 94 134 100" strokeWidth="2" opacity="0.45"/>
                <path d="M60 100 L 60 66 L 100 66 L 100 100"/>
                <path d="M52 68 L 80 46 L 108 68"/>
                <path d="M74 100 L 74 80 Q 80 75 86 80 L 86 100" strokeWidth="2.4"/>
                <circle cx="92" cy="78" r="4" strokeWidth="2"/>
                <path d="M92 54 L 92 40 L 100 40 L 100 60" strokeWidth="2.4"/>
                <path d="M96 38 Q 88 30 96 24 Q 104 18 97 10" stroke="var(--wish)" strokeWidth="2" opacity="0.85"/>
              </svg>
            </div>
            <div className="gallery-caption">
              <b>{lang === 'en' ? 'Peaceful Life' : '安稳生活'}</b><br/>
              {lang === 'en' ? 'Last connection: Today' : '最近连接：今天'}
            </div>
          </div>

          <div className="gallery-tile">
            <div className="gallery-thumb">
              {/* A gently growing sprout */}
              <svg viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M52 102 Q 80 96 108 102" strokeWidth="2" opacity="0.45"/>
                <path d="M80 102 C 78 86 82 70 80 54"/>
                <path d="M80 84 C 62 82 54 68 72 68 C 78 68 80 76 80 84"/>
                <path d="M80 72 C 98 68 106 54 88 54 C 82 54 80 62 80 72"/>
                <path d="M80 54 C 72 51 70 43 78 44 C 80 44 80 49 80 54" stroke="var(--wish)" strokeWidth="2.4"/>
                <path d="M80 54 C 88 51 90 43 82 44 C 80 44 80 49 80 54" stroke="var(--wish)" strokeWidth="2.4"/>
              </svg>
            </div>
            <div className="gallery-caption">
              <b>{lang === 'en' ? 'Passive Income' : '增加被动收入'}</b><br/>
              {lang === 'en' ? 'Last connection: 2 weeks ago' : '最近连接：2 周前'}
            </div>
          </div>
        </div>

        <div className="center-note" style={{ marginTop: 22 }}>
          {lang === 'en' 
            ? "You don't need to progress every day. You just need to stay connected with your wishes regularly."
            : '你不需要每天前进。你只需要定期和愿望保持连接。'}
        </div>

        <div style={{ marginTop: 22, textAlign: 'center' }}>
          <Link 
            className="btn" 
            href="/try"
            style={{ background: 'var(--wish)', color: '#fff', border: 'none', padding: '14px 18px', fontSize: 16, borderRadius: 16 }}
          >
            {lang === 'en' ? 'Start generating my wish map' : '开始生成我的愿望图'}
          </Link>
        </div>
      </section>

      <footer style={{ margin: '48px 0 24px', textAlign: 'center' }}>
        <div className="muted" style={{ fontSize: 12, display: 'flex', gap: 18, justifyContent: 'center' }}>
          <a href="/privacy" style={{ textDecoration: 'underline' }}>
            {lang === 'en' ? 'Privacy Policy' : '隐私政策'}
          </a>
          <a href="/terms" style={{ textDecoration: 'underline' }}>
            {lang === 'en' ? 'Terms of Service' : '服务条款'}
          </a>
          <span>© 2026 Wishflow</span>
        </div>
      </footer>
    </div>
  );
}
