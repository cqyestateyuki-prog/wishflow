/**
 * Home Page / 首页
 * Landing page introducing Wishflow to visitors
 * 向访客介绍愿航系统的落地页
 */
'use client';

import Link from 'next/link';
import { useLanguage } from '../components/LanguageProvider';
import { t } from '../lib/i18n';

export default function HomePage() {
  const { lang } = useLanguage();

  return (
    <div className="container" style={{ paddingTop: 48 }}>
      <section style={{ textAlign: 'center', padding: '32px 0 12px' }}>
        <div className="badge" style={{ margin: '0 auto 18px' }}>
          Wishflow · 愿航
        </div>
        <h1 className="h1">{t('hero_title', lang)}</h1>
        <p className="muted" style={{ maxWidth: 720, margin: '16px auto 0' }}>
          {t('hero_subtitle', lang)}
        </p>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link className="btn dark" href="/try">
            {lang === 'en' ? 'Try It Now' : '立即体验'}
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
        <div className="card" style={{ padding: 20 }}>
          <div className="h2">{t('section_card_title', lang)}</div>
          <div className="grid two" style={{ marginTop: 16 }}>
            <div>
              <div className="badge">🌑 2 min</div>
              <p className="muted" style={{ marginTop: 8 }}>
                {lang === 'en'
                  ? 'Look at the wish image and say "I am still here."'
                  : '看一眼愿望图，说一句"我还在"。'}
              </p>
            </div>
            <div>
              <div className="badge">🌒 15 min</div>
              <p className="muted" style={{ marginTop: 8 }}>
                {lang === 'en'
                  ? 'Write one sentence or do a tiny action.'
                  : '写一句话，或做一个小动作。'}
              </p>
            </div>
            <div>
              <div className="badge">🌕 60 min</div>
              <p className="muted" style={{ marginTop: 8 }}>
                {lang === 'en'
                  ? 'When you have energy, move one step in reality.'
                  : '有力气时，推进一次现实行动。'}
              </p>
            </div>
            <div>
              <div className="badge">No streaks</div>
              <p className="muted" style={{ marginTop: 8 }}>
                {lang === 'en'
                  ? 'Only connection matters. No failure labels.'
                  : '只记录连接，不展示失败与中断。'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 40, marginBottom: 80 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="h2">{t('section_gallery_title', lang)}</div>
          <div className="muted" style={{ marginTop: 8 }}>
            {lang === 'en'
              ? 'Your wishes stay visible across years. The map holds them for you.'
              : '你的愿望会被长期保存。星图会替你保管它们。'}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="btn primary" href="/try">
              {lang === 'en' ? 'Try for Free' : '免费试用'}
            </Link>
            <Link className="btn dark" href="/login">
              {lang === 'en' ? 'Sign in' : '登录'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
