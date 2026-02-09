/**
 * Me Page / 个人中心
 * User profile and account settings
 * 用户资料和账号设置
 */
'use client';

import AuthGate from '../../components/AuthGate';
import PageShell from '../../components/PageShell';

export default function MePage() {
  return (
    <AuthGate>
      <PageShell titleKey="me_title">
        <div className="card" style={{ padding: 16 }}>
          <div className="muted">Profile and settings will live here.</div>
        </div>
      </PageShell>
    </AuthGate>
  );
}
