'use client';

import { useLanguage } from './LanguageProvider';
import { t, TranslationKey } from '../lib/i18n';

export default function PageShell({ titleKey, children }: { titleKey: TranslationKey; children?: React.ReactNode }) {
  const { lang } = useLanguage();

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      <div style={{ marginBottom: 18 }}>
        <div className="h1">{t(titleKey, lang)}</div>
        <div className="muted" style={{ marginTop: 8 }}>{t('placeholder_copy', lang)}</div>
      </div>
      {children}
    </div>
  );
}
