'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase/client';
import { useLanguage } from './LanguageProvider';
import { t } from '../lib/i18n';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSignedIn(!!data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 32 }}>
        <div className="card" style={{ padding: 20 }}>{t('loading', lang)}</div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="container" style={{ paddingTop: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="h2">{t('auth_required_title', lang)}</div>
          <div className="muted" style={{ marginTop: 8 }}>{t('auth_required_body', lang)}</div>
          <div style={{ marginTop: 12 }}>
            <Link className="btn primary" href="/login">{t('auth_required_button', lang)}</Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
