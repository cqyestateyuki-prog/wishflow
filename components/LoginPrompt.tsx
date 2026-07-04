/**
 * LoginPrompt Component / 登录引导组件
 * Gentle prompt to encourage users to sign in for cloud sync
 * 温柔地引导用户登录以同步数据到云端
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { supabase } from '@/lib/supabase/client';

type LoginPromptProps = {
  variant?: 'inline' | 'modal' | 'banner';
  message?: string;
  onClose?: () => void;
};

export default function LoginPrompt({ 
  variant = 'inline', 
  message,
  onClose 
}: LoginPromptProps) {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Check auth status
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });
  }, []);

  // Don't show if logged in or dismissed
  if (isLoggedIn || isLoggedIn === null || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    onClose?.();
  };

  const defaultMessage = language === 'zh' 
    ? '登录后可以同步数据到云端，跨设备访问你的愿望。' 
    : 'Sign in to sync your wishes to the cloud and access from any device.';

  // Inline variant — one gentle sentence with an inline text link.
  // Deliberately NOT a button: the nav already has a Sign In button, so a
  // second button here reads as a redundant "sign in above sign in".
  if (variant === 'inline') {
    return (
      <div style={{
        padding: '12px 16px',
        background: 'rgba(230, 225, 240, 0.25)',
        borderRadius: 14,
        fontSize: 13,
        color: 'var(--text)',
        lineHeight: 1.7,
      }}>
        {message || defaultMessage}{' '}
        <Link
          href="/login"
          style={{ color: 'var(--wish)', fontWeight: 600, textDecoration: 'underline' }}
        >
          {language === 'zh' ? '登录 →' : 'Sign in →'}
        </Link>
      </div>
    );
  }

  // Banner variant - top banner with dismiss
  if (variant === 'banner') {
    return (
      <div style={{
        padding: '12px 20px',
        background: 'rgba(107, 92, 142, 0.08)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        fontSize: 13,
      }}>
        <span style={{ color: 'var(--text)' }}>
          {message || defaultMessage}
        </span>
        <Link 
          href="/login" 
          style={{ 
            color: 'var(--wish)', 
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          {language === 'zh' ? '登录 →' : 'Sign In →'}
        </Link>
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text)',
            opacity: 0.6,
            fontSize: 18,
            padding: '0 4px',
          }}
        >
          ×
        </button>
      </div>
    );
  }

  // Modal variant - overlay dialog
  if (variant === 'modal') {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(46, 43, 51, 0.4)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 24,
      }}>
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          padding: 32,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 32px 80px rgba(46, 43, 51, 0.15)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>☁️</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>
            {language === 'zh' ? '同步到云端？' : 'Sync to Cloud?'}
          </h3>
          <p className="muted" style={{ marginBottom: 24, lineHeight: 1.7 }}>
            {message || defaultMessage}
          </p>
          
          <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
            <Link href="/login" className="btn primary" style={{ width: '100%' }}>
              {language === 'zh' ? '登录 / 注册' : 'Sign In / Sign Up'}
            </Link>
            <button 
              className="btn" 
              onClick={handleDismiss}
              style={{ width: '100%' }}
            >
              {language === 'zh' ? '稍后再说' : 'Maybe Later'}
            </button>
          </div>

          <p className="muted" style={{ fontSize: 11, marginTop: 16 }}>
            {language === 'zh' 
              ? '你的数据已安全保存在本地' 
              : 'Your data is safely stored locally'}
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// Hook to show login prompt at appropriate moments
export function useLoginPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptCount, setPromptCount] = useState(0);

  // Show prompt after certain actions (limited frequency)
  const triggerPrompt = () => {
    // Only show every 3rd trigger, max 2 times per session
    if (promptCount < 2) {
      setShowPrompt(true);
      setPromptCount(prev => prev + 1);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  return {
    showPrompt,
    triggerPrompt,
    dismissPrompt,
  };
}
