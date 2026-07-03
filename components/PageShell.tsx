'use client';

import { useLanguage } from './LanguageProvider';
import { t, TranslationKey } from '../lib/i18n';

export default function PageShell({ titleKey, children }: { titleKey: TranslationKey; children?: React.ReactNode }) {
  const { lang } = useLanguage();

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      {children}
    </div>
  );
}
