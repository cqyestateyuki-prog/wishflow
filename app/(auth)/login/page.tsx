/**
 * Login Page / 登录页
 * User authentication with email/password and Google OAuth
 * 用户登录 - 支持邮箱密码和 Google OAuth
 */
'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { useLanguage } from '../../../components/LanguageProvider';
import { t } from '../../../lib/i18n';

export default function LoginPage() {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithPassword() {
    setLoading(true);
    setStatus('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setStatus(error.message);
    } else {
      window.location.href = '/wishes';
    }
  }

  async function signUp() {
    setLoading(true);
    setStatus('');
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setStatus(error.message);
    } else {
      setStatus(lang === 'en' ? 'Account created. Check your email to confirm.' : '账号已创建，请查收邮件确认。');
    }
  }

  async function signInWithGoogle() {
    setLoading(true);
    setStatus('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/overview` }
    });
    setLoading(false);
    if (error) {
      setStatus(error.message);
    }
  }

  return (
    <div className="container" style={{ paddingTop: 48, maxWidth: 560 }}>
      <div className="card" style={{ padding: 24 }}>
        <div className="h1" style={{ fontSize: 32 }}>{t('auth_title', lang)}</div>
        <div className="muted" style={{ marginTop: 8 }}>{t('auth_subtitle', lang)}</div>

        <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
          <label className="muted">
            {t('auth_email', lang)}
            <input
              className="card"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 12, marginTop: 6 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
            />
          </label>

          <label className="muted">
            {t('auth_password', lang)}
            <input
              className="card"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 12, marginTop: 6 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={lang === 'en' ? 'At least 8 characters' : '至少 8 位'}
            />
          </label>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn dark" onClick={signInWithPassword} disabled={loading}>
              {t('auth_login', lang)}
            </button>
            <button className="btn" onClick={signUp} disabled={loading}>
              {t('auth_signup', lang)}
            </button>
          </div>

          <div className="muted" style={{ textAlign: 'center' }}>—</div>

          <button className="btn primary" onClick={signInWithGoogle} disabled={loading}>
            {t('auth_google', lang)}
          </button>

          {status && <div className="muted" style={{ marginTop: 6 }}>{status}</div>}
          <div className="muted" style={{ marginTop: 8 }}>{t('auth_hint', lang)}</div>
        </div>
      </div>
    </div>
  );
}
