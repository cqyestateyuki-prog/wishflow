'use client';

import { useLanguage } from './LanguageProvider';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      className="btn"
      onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
      aria-label="Toggle language"
      style={{ padding: '6px 10px', borderRadius: 999 }}
    >
      {lang === 'en' ? '中文' : 'EN'}
    </button>
  );
}
