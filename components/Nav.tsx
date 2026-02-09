'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from './LanguageProvider';
import { t } from '../lib/i18n';
import { supabase } from '../lib/supabase/client';

export default function Nav() {
  const { lang } = useLanguage();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSignedIn(!!data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="card" style={{ position: 'sticky', top: 0, zIndex: 10, borderRadius: 0 }}>
      <div
        className="container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--wish)' }} />
          <div>
            <div style={{ fontWeight: 700 }}>Wishflow · 愿航</div>
            <div className="muted">Life-long Wish Navigation System</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/overview">{t('nav_overview', lang)}</Link>
          <Link href="/daily">{t('nav_daily', lang)}</Link>
          <Link href="/wishes">{t('nav_wishes', lang)}</Link>
          <Link href="/log">{t('nav_log', lang)}</Link>
          <Link href="/fragments">{t('nav_fragments', lang)}</Link>
          <Link href="/me">{t('nav_me', lang)}</Link>
          {signedIn ? (
            <button className="btn" onClick={handleSignOut}>
              {t('nav_signout', lang)}
            </button>
          ) : (
            <Link className="btn" href="/login">
              {t('nav_signin', lang)}
            </Link>
          )}
          <LanguageToggle />
        </div>
      </div>
    </div>
  );
}
