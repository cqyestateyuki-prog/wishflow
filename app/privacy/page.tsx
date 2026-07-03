/**
 * Privacy Policy / 隐私政策
 * Static legal page — required for App Store and Play Store listings.
 */

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Wishflow handles your wishes, account, and data.',
};

const sectionStyle: React.CSSProperties = { marginBottom: 28 };
const h2Style: React.CSSProperties = { fontSize: 18, margin: '0 0 8px' };
const pStyle: React.CSSProperties = {
  margin: '0 0 10px',
  fontSize: 14,
  lineHeight: 1.85,
  color: 'var(--text)',
};

export default function PrivacyPage() {
  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <h1 className="h1" style={{ margin: '24px 0 6px' }}>Privacy Policy</h1>
      <p className="muted" style={{ marginBottom: 32 }}>Effective date: July 3, 2026 · Wishflow (愿航)</p>

      <section style={sectionStyle}>
        <h2 style={h2Style}>What Wishflow is</h2>
        <p style={pStyle}>
          Wishflow is a life-long wish navigation app. You write down wishes, connect with
          them gently over time, and see them on visual maps. Privacy is part of the product's
          promise: your wishes are personal, and we treat them that way.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Data stored on your device</h2>
        <p style={pStyle}>
          By default, everything you create — wishes, connections, fragments, and settings —
          is stored locally on your device (browser local storage). You can use Wishflow
          without an account, and in that case your data never leaves your device except for
          AI image generation described below.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Data stored in the cloud (optional)</h2>
        <p style={pStyle}>
          If you create an account and sign in, your wishes, connections, fragments, and
          settings are synced to our database (hosted on Supabase) so you can access them
          across devices. This data is keyed to your account and protected by row-level
          security — only your authenticated session can read or write it. We store your
          email address for sign-in purposes.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>AI processing</h2>
        <p style={pStyle}>
          When you create a wish, its text is sent to Anthropic's Claude API to classify the
          wish and generate a hand-drawn style image for it. The wish text is used only for
          this generation and is subject to Anthropic's API data policies. No account
          identifiers are sent with it.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>What we don't do</h2>
        <p style={pStyle}>
          We do not sell your data. We do not show ads. We do not track you across other apps
          or websites. Wishflow currently uses no third-party analytics.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Export and deletion</h2>
        <p style={pStyle}>
          You can export all of your data as a JSON file at any time from Settings. You can
          clear local data from Settings, and if you have an account you can permanently
          delete the account and all associated cloud data in Settings → Delete Account.
          Deletion is immediate and irreversible.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Children</h2>
        <p style={pStyle}>
          Wishflow is intended for users aged 13 and up. We do not knowingly collect data
          from children under 13.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Contact</h2>
        <p style={pStyle}>
          Questions about this policy: <a href="mailto:cqyestateyuki@gmail.com" style={{ color: 'var(--wish)' }}>cqyestateyuki@gmail.com</a>
        </p>
      </section>

      <div className="divider" />

      <h1 className="h1" style={{ fontSize: 28, margin: '0 0 6px' }}>隐私政策（中文）</h1>
      <p className="muted" style={{ marginBottom: 24 }}>生效日期：2026 年 7 月 3 日</p>

      <section style={sectionStyle}>
        <p style={pStyle}>
          <b>本地数据：</b>默认情况下，你创建的一切（愿望、连接、碎片、设置）都保存在你自己的设备上。
          不注册账号也可以完整使用愿航，此时你的数据不会离开设备（下述 AI 生成除外）。
        </p>
        <p style={pStyle}>
          <b>云端数据（可选）：</b>注册并登录后，你的数据会同步到我们的数据库（Supabase），
          以便跨设备访问。数据与你的账号绑定，受行级安全策略保护，只有你本人的登录会话可以读写。
          我们保存你的邮箱地址用于登录。
        </p>
        <p style={pStyle}>
          <b>AI 处理：</b>创建愿望时，愿望文本会发送到 Anthropic Claude API，用于分类和生成手绘风格的意象图。
          该文本仅用于生成，不附带任何账号标识。
        </p>
        <p style={pStyle}>
          <b>我们不会：</b>出售你的数据、投放广告、跨应用跟踪你。愿航目前不使用任何第三方分析工具。
        </p>
        <p style={pStyle}>
          <b>导出与删除：</b>你可以随时在「个人中心」导出全部数据（JSON），清除本地数据，
          或在「个人中心 → 删除账号」中永久删除账号及全部云端数据。删除立即生效且不可恢复。
        </p>
        <p style={pStyle}>
          <b>年龄：</b>愿航面向 13 岁及以上用户。
        </p>
        <p style={pStyle}>
          <b>联系：</b><a href="mailto:cqyestateyuki@gmail.com" style={{ color: 'var(--wish)' }}>cqyestateyuki@gmail.com</a>
        </p>
      </section>
    </div>
  );
}
